// ─── PDF.js setup ──────────────────────────────────
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

// ─── State ─────────────────────────────────────────
let mergeFiles = [];
let mergePdfjsCache = new Map(); // File -> pdf.js document, for thumbnails/zoom
let splitFile = null;
let splitPdfjsDoc = null; // cached pdf.js document for the loaded split file
let splitPageCount = 0;
let splitMode = "all";
let splitResults = [];
let mergeSortable = null;
let selectedPages = new Set(); // 0-indexed
let thumbsRendered = false;

let rotateFileEntries = []; // { uid, file, numPages, pdfjsDoc }
let rotatePages = []; // ordered list: { uid, fileUid, pageIndexInFile, baseRotation, delta }
let selectedRotatePages = new Set(); // holds page uid's
let rotateThumbsRendered = false;
let rotateSortable = null;
let nextRotateFileUid = 0;
let nextRotatePageUid = 0;
const ROTATE_FILE_COLORS = [
  "#14b8a6",
  "#a855f7",
  "#f59e0b",
  "#3b82f6",
  "#ec4899",
  "#84cc16",
  "#ef4444",
  "#06b6d4",
];
function rotateFileColor(fileUid) {
  return ROTATE_FILE_COLORS[fileUid % ROTATE_FILE_COLORS.length];
}
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// True on phones/tablets where fine-grained drag-handle grabbing is hard;
// used to make page reordering (Rotate tab) forgiving on touch screens.
const isTouchDevice = window.matchMedia(
  "(hover: none) and (pointer: coarse)",
).matches;

// ─── Zoom / Preview state (shared by Merge, Split, Rotate) ──
let zoomItems = []; // array of descriptors, see openZoom()
let zoomIndex = 0;
let zoomRenderToken = 0; // guards against out-of-order async renders

// ─── Tab Switching ──────────────────────────────────
function switchTab(tab) {
  const panels = {
    merge: "panel-merge",
    split: "panel-split",
    rotate: "panel-rotate",
  };
  const tabs = { merge: "tab-merge", split: "tab-split", rotate: "tab-rotate" };
  Object.keys(panels).forEach((key) => {
    const panel = document.getElementById(panels[key]);
    if (key === tab) {
      panel.classList.remove("hidden");
      // restart the entrance animation on every visit for a bit of life
      panel.classList.remove("animate-slide-up");
      void panel.offsetWidth; // force reflow so the animation replays
      panel.classList.add("animate-slide-up");
    } else {
      panel.classList.add("hidden");
    }
  });
  Object.keys(tabs).forEach((key) => {
    const btn = document.getElementById(tabs[key]);
    if (key === tab) {
      btn.classList.add("tab-active");
      btn.classList.remove("text-slate-400");
    } else {
      btn.classList.remove("tab-active");
      btn.classList.add("text-slate-400");
    }
  });
}

// ─── Zoom / Preview Modal (shared) ──────────────────
// items: array of descriptors, each one of:
//   { kind: "rotate", page }                 -> live rotate-tab page object
//   { kind: "plain", getDoc, pageIndex, label } -> static page (split/merge)
function openZoom(items, startIndex, opts) {
  if (!items.length) return;
  zoomItems = items;
  zoomIndex = Math.max(0, Math.min(startIndex, items.length - 1));

  const modal = document.getElementById("zoom-modal");
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";

  document
    .getElementById("zoom-rotate-controls")
    .classList.toggle("hidden", !(opts && opts.allowRotate));

  renderZoomCurrent();
}

function closeZoomModal() {
  const modal = document.getElementById("zoom-modal");
  modal.classList.add("hidden");
  document.body.style.overflow = "";
  zoomItems = [];
}

function handleZoomOverlayClick(e) {
  if (e.target.id === "zoom-modal") closeZoomModal();
}

function zoomNav(delta) {
  if (!zoomItems.length) return;
  const next = zoomIndex + delta;
  if (next < 0 || next >= zoomItems.length) return;
  zoomIndex = next;
  renderZoomCurrent();
}

async function zoomRotate(delta) {
  const item = zoomItems[zoomIndex];
  if (!item || item.kind !== "rotate") return;
  item.page.delta = (((item.page.delta + delta) % 360) + 360) % 360;
  // keep the underlying thumbnail grid in sync
  const thumb = document.querySelector(
    `#rotate-thumb-grid .page-thumb[data-uid="${item.page.uid}"]`,
  );
  if (thumb) await renderRotateThumbCanvas(item.page, thumb);
  await renderZoomCurrent();
}

document.addEventListener("keydown", (e) => {
  const modal = document.getElementById("zoom-modal");
  if (!modal || modal.classList.contains("hidden")) return;
  if (e.key === "Escape") closeZoomModal();
  else if (e.key === "ArrowLeft") zoomNav(-1);
  else if (e.key === "ArrowRight") zoomNav(1);
});

async function renderZoomCurrent() {
  const token = ++zoomRenderToken;
  const item = zoomItems[zoomIndex];
  if (!item) return;

  const wrap = document.getElementById("zoom-canvas-wrap");
  wrap.innerHTML = `
    <div class="zoom-spinner">
      <svg class="w-8 h-8 animate-spin text-teal-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
      </svg>
    </div>
  `;

  document.getElementById("zoom-title").textContent = item.title || "";
  document.getElementById("zoom-subtitle").textContent = item.subtitle || "";
  document.getElementById("zoom-page-indicator").textContent = t(
    "zoom_page_indicator",
    { current: zoomIndex + 1, total: zoomItems.length },
  );
  document.getElementById("zoom-prev-btn").disabled = zoomIndex === 0;
  document.getElementById("zoom-next-btn").disabled =
    zoomIndex === zoomItems.length - 1;

  try {
    let pjsPage, rotation;
    if (item.kind === "rotate") {
      const pdfjsDoc = await getRotatePdfjsDoc(item.page.fileUid);
      pjsPage = await pdfjsDoc.getPage(item.page.pageIndexInFile + 1);
      rotation = ((item.page.baseRotation || 0) + item.page.delta + 360) % 360;
    } else {
      const pdfjsDoc = await item.getDoc();
      pjsPage = await pdfjsDoc.getPage(item.pageIndex + 1);
      rotation = 0;
    }

    if (token !== zoomRenderToken) return; // a newer render superseded this one

    const viewport = pjsPage.getViewport({ scale: 1.6, rotation });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    await pjsPage.render({ canvasContext: ctx, viewport }).promise;

    if (token !== zoomRenderToken) return;
    wrap.innerHTML = "";
    wrap.appendChild(canvas);
  } catch (err) {
    if (token !== zoomRenderToken) return;
    wrap.innerHTML = `<p class="text-red-400 text-sm py-4 text-center font-body">${t("zoom_thumb_error")}</p>`;
    console.error(err);
  }
}

// ─── Drag & Drop ────────────────────────────────────
function handleDragOver(e, id) {
  e.preventDefault();
  document.getElementById(id).classList.add("drag-over");
}
function handleDragLeave(e, id) {
  document.getElementById(id).classList.remove("drag-over");
}
function handleDrop(e, type) {
  e.preventDefault();
  const id = type + "-drop";
  document.getElementById(id).classList.remove("drag-over");
  const files = Array.from(e.dataTransfer.files).filter(
    (f) => f.type === "application/pdf",
  );
  if (!files.length) return showToast(t("toast_only_pdf"), "error");
  if (type === "merge") addMergeFiles(files);
  else if (type === "split") setSplitFile(files[0]);
  else if (type === "rotate") addRotateFiles(files);
}

// ─── MERGE ──────────────────────────────────────────
function handleMergeFiles(e) {
  addMergeFiles(Array.from(e.target.files));
  e.target.value = "";
}

function addMergeFiles(files) {
  files.forEach((f) => mergeFiles.push(f));
  renderMergeList();
}

function renderMergeList() {
  const list = document.getElementById("merge-sortable");
  list.innerHTML = "";
  mergeFiles.forEach((f, i) => {
    const li = document.createElement("li");
    li.dataset.index = i;
    li.className =
      "file-card rounded-xl p-3.5 flex items-center gap-3 thumb-pop-in";
    li.style.animationDelay = `${Math.min(i, 20) * 0.03}s`;
    li.innerHTML = `
          <div class="drag-handle text-slate-600 hover:text-teal-400 transition-colors flex-shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </div>
          <div class="merge-thumb-wrap">
            <svg class="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <button type="button" class="merge-thumb-zoom-btn" title="${t("zoom_view_title")}">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"/>
              </svg>
            </button>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-white text-sm font-display font-medium truncate">${escapeHtml(f.name)}</p>
            <p class="text-slate-500 text-xs font-body">${formatSize(f.size)}</p>
          </div>
          <button onclick="removeMergeFile(${i})" class="text-slate-600 hover:text-red-400 transition-colors p-1 flex-shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        `;
    li.querySelector(".merge-thumb-zoom-btn").addEventListener(
      "click",
      (ev) => {
        ev.stopPropagation();
        openMergeZoom(f);
      },
    );
    list.appendChild(li);
    renderMergeThumb(f, li.querySelector(".merge-thumb-wrap"));
  });

  const container = document.getElementById("merge-list");
  if (mergeFiles.length > 0) {
    container.classList.remove("hidden");
    if (!mergeSortable) {
      mergeSortable = Sortable.create(list, {
        animation: 180,
        handle: ".drag-handle",
        ghostClass: "sortable-ghost",
        chosenClass: "sortable-chosen",
        onEnd: () => {
          const newOrder = Array.from(list.querySelectorAll("li")).map(
            (li) => mergeFiles[parseInt(li.dataset.index)],
          );
          mergeFiles = newOrder;
          renderMergeList();
        },
      });
    }
  } else {
    container.classList.add("hidden");
  }

  document.getElementById("merge-btn").disabled = mergeFiles.length < 2;
  document.getElementById("merge-result").classList.add("hidden");
}

async function getMergePdfjsDoc(file) {
  if (!mergePdfjsCache.has(file)) {
    try {
      const buf = await file.arrayBuffer();
      mergePdfjsCache.set(
        file,
        await pdfjsLib.getDocument({ data: buf }).promise,
      );
    } catch (err) {
      console.error(err);
      return null;
    }
  }
  return mergePdfjsCache.get(file);
}

async function renderMergeThumb(file, wrapEl) {
  if (!wrapEl) return;
  const pdfjsDoc = await getMergePdfjsDoc(file);
  if (!pdfjsDoc || !wrapEl.isConnected) return;
  try {
    const page = await pdfjsDoc.getPage(1);
    const viewport = page.getViewport({ scale: 0.15 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: canvas.getContext("2d"), viewport })
      .promise;
    const icon = wrapEl.querySelector("svg");
    if (icon) icon.replaceWith(canvas);
    else wrapEl.insertBefore(canvas, wrapEl.firstChild);
  } catch (err) {
    console.error(err);
  }
}

async function openMergeZoom(file) {
  const pdfjsDoc = await getMergePdfjsDoc(file);
  const count = pdfjsDoc ? pdfjsDoc.numPages : 1;
  const items = Array.from({ length: count }, (_, i) => ({
    kind: "plain",
    getDoc: () => getMergePdfjsDoc(file),
    pageIndex: i,
    title: file.name,
    subtitle: t("zoom_merge_subtitle", { pages: count }),
  }));
  openZoom(items, 0, { allowRotate: false });
}

function removeMergeFile(i) {
  const [removed] = mergeFiles.splice(i, 1);
  if (removed) mergePdfjsCache.delete(removed);
  renderMergeList();
}

function clearMerge() {
  mergeFiles = [];
  mergePdfjsCache = new Map();
  mergeSortable = null;
  renderMergeList();
}

async function mergePDFs() {
  if (mergeFiles.length < 2) return;
  const btn = document.getElementById("merge-btn");
  btn.disabled = true;
  showProgress("merge", true);

  try {
    const { PDFDocument } = PDFLib;
    const merged = await PDFDocument.create();
    let totalPages = 0;

    for (let i = 0; i < mergeFiles.length; i++) {
      setProgress("merge", Math.round((i / mergeFiles.length) * 80));
      const buf = await mergeFiles[i].arrayBuffer();
      const pdf = await PDFDocument.load(buf);
      const pages = await merged.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((p) => {
        merged.addPage(p);
        totalPages++;
      });
    }

    setProgress("merge", 90);
    const bytes = await merged.save();
    const blob = new Blob([bytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    setProgress("merge", 100);

    setTimeout(() => {
      showProgress("merge", false);
      const a = document.getElementById("merge-download");
      a.href = url;
      document.getElementById("merge-result-info").textContent = t(
        "merge_result_info",
        {
          files: mergeFiles.length,
          pages: totalPages,
          size: formatSize(bytes.byteLength),
        },
      );
      document.getElementById("merge-result").classList.remove("hidden");
      btn.disabled = false;
      showToast(t("toast_merge_success"), "success");
    }, 400);
  } catch (err) {
    showProgress("merge", false);
    btn.disabled = false;
    showToast(t("toast_process_fail_merge"), "error");
    console.error(err);
  }
}

// ─── SPLIT ──────────────────────────────────────────
function handleSplitFile(e) {
  const f = e.target.files[0];
  if (f) setSplitFile(f);
  e.target.value = "";
}

async function setSplitFile(f) {
  if (f.type !== "application/pdf")
    return showToast(t("toast_only_pdf"), "error");
  splitFile = f;
  splitPdfjsDoc = null;
  thumbsRendered = false;
  selectedPages = new Set();
  try {
    const buf = await f.arrayBuffer();
    const { PDFDocument } = PDFLib;
    const pdf = await PDFDocument.load(buf);
    splitPageCount = pdf.getPageCount();

    document.getElementById("split-fname").textContent = f.name;
    document.getElementById("split-finfo").textContent =
      `${splitPageCount} ${t("pages_unit")} · ${formatSize(f.size)}`;
    document.getElementById("split-file-info").classList.remove("hidden");
    document.getElementById("split-options").classList.remove("hidden");
    document.getElementById("split-btn").disabled = false;
    document.getElementById("split-results").classList.add("hidden");
    document.getElementById("split-file-list").innerHTML = "";

    // Reset thumbnails
    document.getElementById("thumb-grid").innerHTML = "";
    document.getElementById("thumb-grid").classList.add("hidden");
    document.getElementById("thumb-loading").classList.remove("hidden");
    updateSelCount("range-sel-count", 0);

    // If already in range mode, render thumbs immediately
    if (splitMode === "range") renderThumbnails();
  } catch (err) {
    showToast(t("toast_read_fail"), "error");
  }
}

function clearSplit() {
  splitFile = null;
  splitPdfjsDoc = null;
  splitPageCount = 0;
  thumbsRendered = false;
  selectedPages = new Set();
  document.getElementById("split-file-info").classList.add("hidden");
  document.getElementById("split-options").classList.add("hidden");
  document.getElementById("split-btn").disabled = true;
  document.getElementById("split-results").classList.add("hidden");
  document.getElementById("thumb-grid").innerHTML = "";
}

function setSplitMode(mode) {
  splitMode = mode;
  ["all", "range", "interval"].forEach((m) => {
    const btn = document.getElementById("mode-" + m);
    const opt = document.getElementById("opt-" + m);
    const isActive = m === mode;
    btn.className = `split-mode-btn py-3 px-2 rounded-xl text-center text-xs font-display font-semibold border transition-all ${
      isActive
        ? "border-teal-500/50 text-teal-400 bg-teal-500/10"
        : "border-dark-500 text-slate-400 hover:border-teal-500/30"
    }`;
    opt.classList.toggle("hidden", !isActive);
  });
  // Render thumbnails when switching to range mode if file is loaded
  if (mode === "range" && splitFile && !thumbsRendered) {
    renderThumbnails();
  }
}

// ─── THUMBNAIL RENDERER (Split) ─────────────────────
async function getSplitPdfjsDoc() {
  if (!splitFile) return null;
  if (!splitPdfjsDoc) {
    const buf = await splitFile.arrayBuffer();
    splitPdfjsDoc = await pdfjsLib.getDocument({ data: buf }).promise;
  }
  return splitPdfjsDoc;
}

async function renderThumbnails() {
  if (!splitFile || thumbsRendered) return;
  const grid = document.getElementById("thumb-grid");
  const loading = document.getElementById("thumb-loading");
  grid.innerHTML = "";
  loading.classList.remove("hidden");
  grid.classList.add("hidden");

  try {
    const pdfDoc = await getSplitPdfjsDoc();
    const numPages = pdfDoc.numPages;

    for (let i = 1; i <= numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const viewport = page.getViewport({ scale: 0.4 });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d");
      await page.render({ canvasContext: ctx, viewport }).promise;

      const thumb = document.createElement("div");
      thumb.className = "page-thumb thumb-pop-in";
      thumb.style.animationDelay = `${Math.min(i - 1, 24) * 0.02}s`;
      thumb.dataset.page = i - 1; // 0-indexed
      thumb.innerHTML = `
            <div class="check-icon">
              <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <div class="thumb-hover-actions">
              <button type="button" class="zoom-page-btn" title="${t("zoom_view_title")}">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"/>
                </svg>
              </button>
            </div>
            <span class="page-num">${i}</span>
          `;
      thumb.insertBefore(canvas, thumb.firstChild);
      thumb.addEventListener("click", () => togglePage(thumb, i - 1));
      thumb.querySelector(".zoom-page-btn").addEventListener("click", (ev) => {
        ev.stopPropagation();
        openSplitZoom(i - 1);
      });
      grid.appendChild(thumb);
    }

    loading.classList.add("hidden");
    grid.classList.remove("hidden");
    thumbsRendered = true;
  } catch (err) {
    loading.innerHTML = `<p class="text-red-400 text-sm py-4 text-center font-body">${t("split_thumb_error")}</p>`;
    console.error(err);
  }
}

function openSplitZoom(startPageIndex) {
  if (!splitFile || !splitPageCount) return;
  const items = Array.from({ length: splitPageCount }, (_, i) => ({
    kind: "plain",
    getDoc: getSplitPdfjsDoc,
    pageIndex: i,
    title: splitFile.name,
    subtitle: t("zoom_page_indicator", {
      current: i + 1,
      total: splitPageCount,
    }),
  }));
  openZoom(items, startPageIndex, { allowRotate: false });
}

function togglePage(thumb, pageIdx) {
  if (selectedPages.has(pageIdx)) {
    selectedPages.delete(pageIdx);
    thumb.classList.remove("selected");
  } else {
    selectedPages.add(pageIdx);
    thumb.classList.add("selected");
  }
  updateSelCount("range-sel-count", selectedPages.size);
}

function selectAllPages() {
  document.querySelectorAll("#thumb-grid .page-thumb").forEach((th) => {
    const idx = parseInt(th.dataset.page);
    selectedPages.add(idx);
    th.classList.add("selected");
  });
  updateSelCount("range-sel-count", selectedPages.size);
}

function deselectAllPages() {
  selectedPages.clear();
  document
    .querySelectorAll("#thumb-grid .page-thumb")
    .forEach((th) => th.classList.remove("selected"));
  updateSelCount("range-sel-count", 0);
}

function updateSelCount(elId, count) {
  const el = document.getElementById(elId);
  if (el) el.textContent = t("sel_count_pages", { count });
}

function parseRanges(str, maxPage) {
  const parts = str
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const pages = new Set();
  for (const p of parts) {
    if (p.includes("-")) {
      const [a, b] = p.split("-").map((n) => parseInt(n));
      if (isNaN(a) || isNaN(b) || a > b) return null;
      for (let i = a; i <= Math.min(b, maxPage); i++) pages.add(i);
    } else {
      const n = parseInt(p);
      if (isNaN(n)) return null;
      pages.add(n);
    }
  }
  return [...pages].sort((a, b) => a - b);
}

async function splitPDF() {
  if (!splitFile) return;
  const btn = document.getElementById("split-btn");
  btn.disabled = true;
  showProgress("split", true);
  splitResults = [];

  try {
    const { PDFDocument } = PDFLib;
    const buf = await splitFile.arrayBuffer();
    const srcPdf = await PDFDocument.load(buf);
    const totalPages = srcPdf.getPageCount();

    let groups = [];
    if (splitMode === "all") {
      groups = Array.from({ length: totalPages }, (_, i) => [i]);
    } else if (splitMode === "range") {
      if (selectedPages.size === 0) {
        showToast(t("toast_select_min_page"), "error");
        btn.disabled = false;
        showProgress("split", false);
        return;
      }
      const sorted = [...selectedPages].sort((a, b) => a - b);
      const mergeSelected =
        document.getElementById("merge-selected-cb").checked;
      if (mergeSelected) {
        groups = [sorted];
      } else {
        groups = sorted.map((p) => [p]);
      }
    } else if (splitMode === "interval") {
      const n = parseInt(document.getElementById("interval-input").value) || 1;
      for (let i = 0; i < totalPages; i += n) {
        const chunk = [];
        for (let j = i; j < Math.min(i + n, totalPages); j++) chunk.push(j);
        groups.push(chunk);
      }
    }

    for (let g = 0; g < groups.length; g++) {
      setProgress("split", Math.round(((g + 1) / groups.length) * 90));
      const newPdf = await PDFDocument.create();
      const copied = await newPdf.copyPages(srcPdf, groups[g]);
      copied.forEach((p) => newPdf.addPage(p));
      const bytes = await newPdf.save();
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const baseName = splitFile.name.replace(/\.pdf$/i, "");
      let fileName;
      if (
        splitMode === "range" &&
        !document.getElementById("merge-selected-cb").checked
      ) {
        fileName = `${baseName}_hal-${groups[g][0] + 1}.pdf`;
      } else if (groups.length === 1) {
        fileName = `${baseName}_halaman-${groups[0].map((i) => i + 1).join(",")}.pdf`;
      } else {
        fileName = `${baseName}_bagian-${g + 1}.pdf`;
      }
      splitResults.push({
        url,
        name: fileName,
        pages: groups[g].length,
        size: bytes.byteLength,
      });
    }

    setProgress("split", 100);
    setTimeout(() => {
      showProgress("split", false);
      renderSplitResults();
      btn.disabled = false;
      showToast(
        t("toast_split_success", { count: splitResults.length }),
        "success",
      );
    }, 400);
  } catch (err) {
    showProgress("split", false);
    btn.disabled = false;
    showToast(t("toast_process_fail_generic"), "error");
    console.error(err);
  }
}

function renderSplitResults() {
  const container = document.getElementById("split-file-list");
  container.innerHTML = "";
  splitResults.forEach((r, i) => {
    const div = document.createElement("div");
    div.className = "result-card rounded-xl p-3.5 flex items-center gap-3";
    div.innerHTML = `
          <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style="background:rgba(20,184,166,0.12)">
            <svg class="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-white text-sm font-display font-medium truncate">${r.name}</p>
            <p class="text-slate-500 text-xs font-body">${t("split_item_pages", { pages: r.pages, size: formatSize(r.size) })}</p>
          </div>
          <a href="${r.url}" download="${r.name}" class="btn-ghost py-1.5 px-3 rounded-lg text-xs font-display font-semibold flex-shrink-0">
            ${t("merge_download")}
          </a>
        `;
    container.appendChild(div);
  });
  document.getElementById("split-results").classList.remove("hidden");
}

async function downloadAllSplit() {
  if (!splitResults.length) return;
  if (splitResults.length === 1) {
    const a = document.createElement("a");
    a.href = splitResults[0].url;
    a.download = splitResults[0].name;
    a.click();
    return;
  }
  // Use JSZip from CDN
  if (!window.JSZip) {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
    document.head.appendChild(script);
    await new Promise((res) => (script.onload = res));
  }
  const zip = new JSZip();
  for (const r of splitResults) {
    const res = await fetch(r.url);
    const buf = await res.arrayBuffer();
    zip.file(r.name, buf);
  }
  const content = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(content);
  const a = document.createElement("a");
  a.href = url;
  a.download = "pdfinstantid-split-pdf.zip";
  a.click();
}

// ─── ROTATE ─────────────────────────────────────────
function handleRotateFile(e) {
  const files = Array.from(e.target.files);
  if (files.length) addRotateFiles(files);
  e.target.value = "";
}

async function getRotateFileEntry(fileUid) {
  return rotateFileEntries.find((entry) => entry.uid === fileUid);
}

async function getRotatePdfjsDoc(fileUid) {
  const entry = await getRotateFileEntry(fileUid);
  if (!entry) return null;
  if (!entry.pdfjsDoc) {
    const buf = await entry.file.arrayBuffer();
    entry.pdfjsDoc = await pdfjsLib.getDocument({ data: buf }).promise;
  }
  return entry.pdfjsDoc;
}

async function addRotateFiles(files) {
  const pdfFiles = files.filter((f) => f.type === "application/pdf");
  if (!pdfFiles.length) return showToast(t("toast_only_pdf"), "error");
  if (pdfFiles.length < files.length) showToast(t("toast_only_pdf"), "error");

  document.getElementById("rotate-thumb-grid").classList.add("hidden");
  document.getElementById("rotate-thumb-loading").classList.remove("hidden");
  document.getElementById("rotate-thumb-loading").innerHTML = `
    <svg class="w-8 h-8 animate-spin text-teal-500" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
    </svg>
    <span class="text-sm font-body">${t("rotate_thumb_loading")}</span>
  `;
  document.getElementById("rotate-thumb-loading").className =
    "flex flex-col items-center gap-3 py-8 text-slate-500";

  const { PDFDocument } = PDFLib;
  for (const f of pdfFiles) {
    try {
      const buf = await f.arrayBuffer();
      const pdf = await PDFDocument.load(buf);
      const numPages = pdf.getPageCount();
      const baseRotations = pdf
        .getPages()
        .map((p) => p.getRotation().angle || 0);
      const fileUid = nextRotateFileUid++;
      rotateFileEntries.push({
        uid: fileUid,
        file: f,
        numPages,
        pdfjsDoc: null,
      });
      for (let i = 0; i < numPages; i++) {
        rotatePages.push({
          uid: nextRotatePageUid++,
          fileUid,
          pageIndexInFile: i,
          baseRotation: baseRotations[i],
          delta: 0,
        });
      }
    } catch (err) {
      showToast(t("toast_read_fail"), "error");
      console.error(err);
    }
  }

  renderRotateFileList();
  document
    .getElementById("rotate-options")
    .classList.toggle("hidden", rotatePages.length === 0);
  document.getElementById("rotate-btn").disabled = rotatePages.length === 0;
  document.getElementById("rotate-result").classList.add("hidden");

  await renderRotateThumbnails();
}

function renderRotateFileList() {
  const wrap = document.getElementById("rotate-file-info");
  const list = document.getElementById("rotate-file-list");
  const summary = document.getElementById("rotate-file-summary");

  if (!rotateFileEntries.length) {
    wrap.classList.add("hidden");
    list.innerHTML = "";
    summary.textContent = "";
    return;
  }

  wrap.classList.remove("hidden");
  const multi = rotateFileEntries.length > 1;

  list.innerHTML = rotateFileEntries
    .map((entry) => {
      const swatch = multi
        ? `<span class="w-2 h-2 rounded-full flex-shrink-0" style="background:${rotateFileColor(entry.uid)}"></span>`
        : "";
      return `
        <div class="file-card rounded-xl p-3.5 flex items-center gap-3">
          ${swatch}
          <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style="background:rgba(20,184,166,0.12)">
            <svg class="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-white text-sm font-display font-medium truncate">${escapeHtml(entry.file.name)}</p>
            <p class="text-slate-500 text-xs font-body">${entry.numPages} ${t("pages_unit")} · ${formatSize(entry.file.size)}</p>
          </div>
          <button onclick="removeRotateFile(${entry.uid})" class="text-slate-600 hover:text-red-400 transition-colors p-1 flex-shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>`;
    })
    .join("");

  const totalSize = rotateFileEntries.reduce((s, e) => s + e.file.size, 0);
  summary.textContent = t("rotate_files_summary", {
    files: rotateFileEntries.length,
    pages: rotatePages.length,
    size: formatSize(totalSize),
  });
}

function removeRotateFile(fileUid) {
  rotateFileEntries = rotateFileEntries.filter((e) => e.uid !== fileUid);
  rotatePages = rotatePages.filter((p) => p.fileUid !== fileUid);
  selectedRotatePages.forEach((uid) => {
    if (!rotatePages.find((p) => p.uid === uid))
      selectedRotatePages.delete(uid);
  });

  if (!rotateFileEntries.length) {
    clearRotate();
    return;
  }

  renderRotateFileList();
  document.getElementById("rotate-btn").disabled = rotatePages.length === 0;
  updateSelCount("rotate-sel-count", selectedRotatePages.size);
  renderRotateThumbnails();
}

function clearRotate() {
  rotateFileEntries = [];
  rotatePages = [];
  selectedRotatePages = new Set();
  rotateThumbsRendered = false;
  rotateSortable = null;
  document.getElementById("rotate-file-info").classList.add("hidden");
  document.getElementById("rotate-file-list").innerHTML = "";
  document.getElementById("rotate-file-summary").textContent = "";
  document.getElementById("rotate-options").classList.add("hidden");
  document.getElementById("rotate-btn").disabled = true;
  document.getElementById("rotate-result").classList.add("hidden");
  document.getElementById("rotate-thumb-grid").innerHTML = "";
  updateSelCount("rotate-sel-count", 0);
}

async function renderRotateThumbnails() {
  const grid = document.getElementById("rotate-thumb-grid");
  const loading = document.getElementById("rotate-thumb-loading");
  grid.innerHTML = "";

  if (!rotatePages.length) {
    loading.classList.add("hidden");
    grid.classList.add("hidden");
    return;
  }

  loading.classList.remove("hidden");
  grid.classList.add("hidden");

  const multi = rotateFileEntries.length > 1;

  try {
    for (let i = 0; i < rotatePages.length; i++) {
      const page = rotatePages[i];
      const entry = await getRotateFileEntry(page.fileUid);
      const pdfjsDoc = await getRotatePdfjsDoc(page.fileUid);
      const pjsPage = await pdfjsDoc.getPage(page.pageIndexInFile + 1);

      const thumb = document.createElement("div");
      thumb.className = "page-thumb thumb-pop-in";
      thumb.style.animationDelay = `${Math.min(i, 24) * 0.02}s`;
      thumb.dataset.uid = page.uid;
      if (multi) {
        thumb.title = `${entry.file.name} — ${t("pages_unit")} ${page.pageIndexInFile + 1}`;
      }
      thumb.innerHTML = `
            ${multi ? `<div class="page-file-strip" style="background:${rotateFileColor(page.fileUid)}"></div>` : ""}
            <div class="thumb-canvas-wrap"></div>
            <button type="button" class="page-drag-handle" title="${t("rotate_drag_title")}" aria-label="${t("rotate_drag_title")}">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <circle cx="6" cy="5" r="1.3"/><circle cx="14" cy="5" r="1.3"/>
                <circle cx="6" cy="10" r="1.3"/><circle cx="14" cy="10" r="1.3"/>
                <circle cx="6" cy="15" r="1.3"/><circle cx="14" cy="15" r="1.3"/>
              </svg>
            </button>
            <div class="thumb-hover-actions">
              <button type="button" class="zoom-page-btn" title="${t("zoom_view_title")}">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"/>
                </svg>
              </button>
              <button type="button" class="rotate-page-btn" title="${t("rotate_page_title")}">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
              </button>
            </div>
            <button type="button" class="page-select-box" title="${t("rotate_select_title")}">
              <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
              </svg>
            </button>
            <span class="page-num">${i + 1}</span>
          `;
      grid.appendChild(thumb);

      await renderRotateThumbCanvas(page, thumb);

      thumb
        .querySelector(".rotate-page-btn")
        .addEventListener("click", async (ev) => {
          ev.stopPropagation();
          page.delta = (page.delta + 90) % 360;
          await renderRotateThumbCanvas(page, thumb);
        });
      thumb.querySelector(".zoom-page-btn").addEventListener("click", (ev) => {
        ev.stopPropagation();
        openRotateZoom(page.uid);
      });
      thumb
        .querySelector(".page-select-box")
        .addEventListener("click", (ev) => {
          ev.stopPropagation();
          toggleRotatePage(thumb, page.uid);
        });
      thumb.addEventListener("click", () => toggleRotatePage(thumb, page.uid));
    }

    if (!rotateSortable) {
      rotateSortable = Sortable.create(grid, {
        animation: 180,
        // Native HTML5 drag-and-drop is unreliable on mobile browsers, so we
        // force Sortable's own pointer-based fallback everywhere — this is
        // what actually fixes drag-to-reorder on phones/tablets.
        forceFallback: true,
        fallbackTolerance: 3,
        fallbackClass: "sortable-fallback",
        // On touch: press-and-hold anywhere on the page to start dragging it
        // (a light tap still selects). On desktop: only the handle drags,
        // since a mouse is precise enough not to need the delay.
        handle: isTouchDevice ? undefined : ".page-drag-handle",
        delay: isTouchDevice ? 140 : 0,
        delayOnTouchOnly: true,
        touchStartThreshold: 8,
        ghostClass: "sortable-ghost",
        chosenClass: "sortable-chosen",
        dragClass: "sortable-dragging",
        onStart: () => {
          if (navigator.vibrate) navigator.vibrate(12);
        },
        onEnd: () => {
          const newOrder = Array.from(grid.querySelectorAll(".page-thumb")).map(
            (el) =>
              rotatePages.find((p) => p.uid === parseInt(el.dataset.uid, 10)),
          );
          rotatePages = newOrder;
          renumberRotateThumbs();
        },
      });
    }

    loading.classList.add("hidden");
    grid.classList.remove("hidden");
    rotateThumbsRendered = true;
  } catch (err) {
    loading.innerHTML = `<p class="text-red-400 text-sm py-4 text-center font-body">${t("rotate_thumb_error")}</p>`;
    console.error(err);
  }
}

function renumberRotateThumbs() {
  const grid = document.getElementById("rotate-thumb-grid");
  Array.from(grid.querySelectorAll(".page-thumb")).forEach((el, i) => {
    const numEl = el.querySelector(".page-num");
    if (numEl) numEl.textContent = i + 1;
  });
}

async function openRotateZoom(startUid) {
  if (!rotatePages.length) return;
  const multi = rotateFileEntries.length > 1;
  const items = [];
  for (const page of rotatePages) {
    const entry = await getRotateFileEntry(page.fileUid);
    items.push({
      kind: "rotate",
      page,
      title: multi ? entry.file.name : t("rotate_heading"),
      subtitle: `${t("pages_unit")} ${page.pageIndexInFile + 1}`,
    });
  }
  const startIndex = rotatePages.findIndex((p) => p.uid === startUid);
  openZoom(items, Math.max(0, startIndex), { allowRotate: true });
}

async function renderRotateThumbCanvas(page, thumbEl) {
  const wrap = thumbEl.querySelector(".thumb-canvas-wrap");
  const pdfjsDoc = await getRotatePdfjsDoc(page.fileUid);
  const pjsPage = await pdfjsDoc.getPage(page.pageIndexInFile + 1);
  const totalRotation = ((page.baseRotation || 0) + page.delta + 360) % 360;
  const viewport = pjsPage.getViewport({ scale: 0.4, rotation: totalRotation });
  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext("2d");
  await pjsPage.render({ canvasContext: ctx, viewport }).promise;
  wrap.innerHTML = "";
  wrap.appendChild(canvas);

  thumbEl.classList.toggle("rotated", page.delta % 360 !== 0);
}

function toggleRotatePage(thumb, uid) {
  if (selectedRotatePages.has(uid)) {
    selectedRotatePages.delete(uid);
    thumb.classList.remove("selected");
  } else {
    selectedRotatePages.add(uid);
    thumb.classList.add("selected");
  }
  updateSelCount("rotate-sel-count", selectedRotatePages.size);
}

function selectAllRotatePages() {
  document.querySelectorAll("#rotate-thumb-grid .page-thumb").forEach((th) => {
    const uid = parseInt(th.dataset.uid, 10);
    selectedRotatePages.add(uid);
    th.classList.add("selected");
  });
  updateSelCount("rotate-sel-count", selectedRotatePages.size);
}

function deselectAllRotatePages() {
  selectedRotatePages.clear();
  document
    .querySelectorAll("#rotate-thumb-grid .page-thumb")
    .forEach((th) => th.classList.remove("selected"));
  updateSelCount("rotate-sel-count", 0);
}

async function rotateSelected(delta) {
  if (!rotatePages.length) return;
  const targets =
    selectedRotatePages.size > 0
      ? [...selectedRotatePages]
      : rotatePages.map((p) => p.uid);
  if (!targets.length) return;

  for (const uid of targets) {
    const page = rotatePages.find((p) => p.uid === uid);
    if (!page) continue;
    page.delta = (((page.delta + delta) % 360) + 360) % 360;
    const thumb = document.querySelector(
      `#rotate-thumb-grid .page-thumb[data-uid="${uid}"]`,
    );
    if (thumb) await renderRotateThumbCanvas(page, thumb);
  }
}

async function resetAllRotations() {
  if (!rotatePages.length) return;
  rotatePages.forEach((p) => (p.delta = 0));
  const thumbs = document.querySelectorAll("#rotate-thumb-grid .page-thumb");
  for (const thumb of thumbs) {
    const uid = parseInt(thumb.dataset.uid, 10);
    const page = rotatePages.find((p) => p.uid === uid);
    if (page) await renderRotateThumbCanvas(page, thumb);
  }
}

async function applyRotateAndDownload() {
  if (!rotatePages.length) return;
  const btn = document.getElementById("rotate-btn");
  btn.disabled = true;
  showProgress("rotate", true);

  try {
    const { PDFDocument, degrees } = PDFLib;
    const outDoc = await PDFDocument.create();
    const libDocCache = new Map();
    const getLibDoc = async (fileUid) => {
      if (!libDocCache.has(fileUid)) {
        const entry = await getRotateFileEntry(fileUid);
        const buf = await entry.file.arrayBuffer();
        libDocCache.set(fileUid, await PDFDocument.load(buf));
      }
      return libDocCache.get(fileUid);
    };

    let changedCount = 0;
    for (let i = 0; i < rotatePages.length; i++) {
      const page = rotatePages[i];
      setProgress("rotate", Math.round(((i + 1) / rotatePages.length) * 80));
      const srcDoc = await getLibDoc(page.fileUid);
      const [copied] = await outDoc.copyPages(srcDoc, [page.pageIndexInFile]);
      const total = ((page.baseRotation || 0) + page.delta + 360) % 360;
      copied.setRotation(degrees(total));
      outDoc.addPage(copied);
      if (page.delta % 360 !== 0) changedCount++;
    }

    setProgress("rotate", 90);
    const bytes = await outDoc.save();
    const blob = new Blob([bytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    setProgress("rotate", 100);

    setTimeout(() => {
      showProgress("rotate", false);
      const a = document.getElementById("rotate-download");
      a.href = url;
      const baseName =
        rotateFileEntries.length === 1
          ? rotateFileEntries[0].file.name.replace(/\.pdf$/i, "")
          : "gabungan";
      a.download = `pdfinstantid_${baseName}_diputar.pdf`;
      document.getElementById("rotate-result-info").textContent = t(
        "rotate_result_info",
        { pages: changedCount, size: formatSize(bytes.byteLength) },
      );
      document.getElementById("rotate-result").classList.remove("hidden");
      btn.disabled = false;
      showToast(t("toast_rotate_success"), "success");
    }, 400);
  } catch (err) {
    showProgress("rotate", false);
    btn.disabled = false;
    showToast(t("toast_process_fail_generic"), "error");
    console.error(err);
  }
}

// ─── Utils ──────────────────────────────────────────
function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

function showProgress(type, show) {
  document.getElementById(type + "-progress").classList.toggle("hidden", !show);
  if (!show) setProgress(type, 0);
}

function setProgress(type, pct) {
  document.getElementById(type + "-bar").style.width = pct + "%";
  document.getElementById(type + "-pct").textContent = pct + "%";
}

// ─── Toast ──────────────────────────────────────────
function showToast(msg, type = "info") {
  const existing = document.getElementById("toast");
  if (existing) existing.remove();
  const toast = document.createElement("div");
  toast.id = "toast";
  const colors =
    type === "success"
      ? "bg-teal-500/20 border-teal-500/40 text-teal-300"
      : type === "error"
        ? "bg-red-500/20 border-red-500/40 text-red-300"
        : "bg-slate-500/20 border-slate-500/40 text-slate-300";
  toast.className = `fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl border backdrop-blur-xl font-body text-sm font-medium shadow-2xl transition-all duration-300 ${colors}`;
  toast.style.animation = "slideUp 0.3s ease-out";
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ─── Init ───────────────────────────────────────────
setSplitMode("all");
applyTranslations();
