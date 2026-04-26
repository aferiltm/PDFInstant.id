// ─── PDF.js setup ──────────────────────────────────
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

// ─── State ─────────────────────────────────────────
let mergeFiles = [];
let splitFile = null;
let splitPageCount = 0;
let splitMode = "all";
let splitResults = [];
let mergeSortable = null;
let selectedPages = new Set(); // 0-indexed
let thumbsRendered = false;

// ─── Tab Switching ──────────────────────────────────
function switchTab(tab) {
  const isM = tab === "merge";
  document.getElementById("panel-merge").classList.toggle("hidden", !isM);
  document.getElementById("panel-split").classList.toggle("hidden", isM);
  const activeClass = "tab-active";
  const inactiveClass = "text-slate-400";
  const mBtn = document.getElementById("tab-merge");
  const sBtn = document.getElementById("tab-split");
  if (isM) {
    mBtn.classList.add(activeClass);
    mBtn.classList.remove(inactiveClass);
    sBtn.classList.remove(activeClass);
    sBtn.classList.add(inactiveClass);
  } else {
    sBtn.classList.add(activeClass);
    sBtn.classList.remove(inactiveClass);
    mBtn.classList.remove(activeClass);
    mBtn.classList.add(inactiveClass);
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
  if (!files.length) return showToast("Hanya file PDF yang diterima!", "error");
  if (type === "merge") addMergeFiles(files);
  else setSplitFile(files[0]);
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
    li.className = "file-card rounded-xl p-3.5 flex items-center gap-3";
    li.innerHTML = `
          <div class="drag-handle text-slate-600 hover:text-teal-400 transition-colors flex-shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </div>
          <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style="background:rgba(20,184,166,0.12)">
            <svg class="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-white text-sm font-display font-medium truncate">${f.name}</p>
            <p class="text-slate-500 text-xs font-body">${formatSize(f.size)}</p>
          </div>
          <button onclick="removeMergeFile(${i})" class="text-slate-600 hover:text-red-400 transition-colors p-1 flex-shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        `;
    list.appendChild(li);
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

function removeMergeFile(i) {
  mergeFiles.splice(i, 1);
  renderMergeList();
}

function clearMerge() {
  mergeFiles = [];
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
      document.getElementById("merge-result-info").textContent =
        `${mergeFiles.length} file · ${totalPages} halaman · ${formatSize(bytes.byteLength)}`;
      document.getElementById("merge-result").classList.remove("hidden");
      btn.disabled = false;
      showToast("PDF berhasil digabungkan!", "success");
    }, 400);
  } catch (err) {
    showProgress("merge", false);
    btn.disabled = false;
    showToast("Gagal memproses PDF. Pastikan file tidak terenkripsi.", "error");
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
    return showToast("Hanya file PDF yang diterima!", "error");
  splitFile = f;
  thumbsRendered = false;
  selectedPages = new Set();
  try {
    const buf = await f.arrayBuffer();
    const { PDFDocument } = PDFLib;
    const pdf = await PDFDocument.load(buf);
    splitPageCount = pdf.getPageCount();

    document.getElementById("split-fname").textContent = f.name;
    document.getElementById("split-finfo").textContent =
      `${splitPageCount} halaman · ${formatSize(f.size)}`;
    document.getElementById("split-file-info").classList.remove("hidden");
    document.getElementById("split-options").classList.remove("hidden");
    document.getElementById("split-btn").disabled = false;
    document.getElementById("split-results").classList.add("hidden");
    document.getElementById("split-file-list").innerHTML = "";

    // Reset thumbnails
    document.getElementById("thumb-grid").innerHTML = "";
    document.getElementById("thumb-grid").classList.add("hidden");
    document.getElementById("thumb-loading").classList.remove("hidden");
    updateSelCount();

    // If already in range mode, render thumbs immediately
    if (splitMode === "range") renderThumbnails();
  } catch (err) {
    showToast("Gagal membaca PDF. Coba file lain.", "error");
  }
}

function clearSplit() {
  splitFile = null;
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

// ─── THUMBNAIL RENDERER ─────────────────────────────
async function renderThumbnails() {
  if (!splitFile || thumbsRendered) return;
  const grid = document.getElementById("thumb-grid");
  const loading = document.getElementById("thumb-loading");
  grid.innerHTML = "";
  loading.classList.remove("hidden");
  grid.classList.add("hidden");

  try {
    const buf = await splitFile.arrayBuffer();
    const pdfDoc = await pdfjsLib.getDocument({ data: buf }).promise;
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
      thumb.className = "page-thumb";
      thumb.dataset.page = i - 1; // 0-indexed
      thumb.innerHTML = `
            <div class="check-icon">
              <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <span class="page-num">${i}</span>
          `;
      thumb.insertBefore(canvas, thumb.firstChild);
      thumb.addEventListener("click", () => togglePage(thumb, i - 1));
      grid.appendChild(thumb);
    }

    loading.classList.add("hidden");
    grid.classList.remove("hidden");
    thumbsRendered = true;
  } catch (err) {
    loading.innerHTML =
      '<p class="text-red-400 text-sm py-4 text-center font-body">Gagal memuat pratinjau.</p>';
    console.error(err);
  }
}

function togglePage(thumb, pageIdx) {
  if (selectedPages.has(pageIdx)) {
    selectedPages.delete(pageIdx);
    thumb.classList.remove("selected");
  } else {
    selectedPages.add(pageIdx);
    thumb.classList.add("selected");
  }
  updateSelCount();
}

function selectAllPages() {
  document.querySelectorAll(".page-thumb").forEach((t) => {
    const idx = parseInt(t.dataset.page);
    selectedPages.add(idx);
    t.classList.add("selected");
  });
  updateSelCount();
}

function deselectAllPages() {
  selectedPages.clear();
  document
    .querySelectorAll(".page-thumb")
    .forEach((t) => t.classList.remove("selected"));
  updateSelCount();
}

function updateSelCount() {
  const el = document.getElementById("range-sel-count");
  if (el) el.textContent = `${selectedPages.size} halaman dipilih`;
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
        showToast("Pilih minimal satu halaman!", "error");
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
        `PDF berhasil dipecah menjadi ${splitResults.length} file!`,
        "success",
      );
    }, 400);
  } catch (err) {
    showProgress("split", false);
    btn.disabled = false;
    showToast("Gagal memproses PDF.", "error");
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
            <p class="text-slate-500 text-xs font-body">${r.pages} hal · ${formatSize(r.size)}</p>
          </div>
          <a href="${r.url}" download="${r.name}" class="btn-ghost py-1.5 px-3 rounded-lg text-xs font-display font-semibold flex-shrink-0">
            Unduh
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
  a.download = "split-pdf.zip";
  a.click();
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
