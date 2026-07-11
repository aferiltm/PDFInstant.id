// ─── PDF.js setup ──────────────────────────────────
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

// ─── i18n ───────────────────────────────────────────
const translations = {
  id: {
    badge_free: "100% Gratis & Privat",
    hero_title_line1: "Kelola PDF kamu",
    hero_title_line2: "dengan mudah.",
    hero_subtitle:
      "Gabungkan beberapa PDF menjadi satu, pisahkan halaman, atau putar orientasi halaman sesuai kebutuhanmu. Gratis, cepat, dan aman — semua diproses di browser.",
    tab_merge: "Gabungkan",
    tab_split: "Pisahkan",
    tab_rotate: "Putar",
    merge_heading: "Gabungkan PDF",
    merge_desc: "Seret & lepas untuk menyusun urutan halaman, lalu unduh hasilnya.",
    merge_drop_title: "Klik atau seret file PDF di sini",
    merge_drop_sub: "Pilih beberapa file sekaligus · PDF saja",
    merge_order_label: "Urutan File",
    merge_clear_all: "Hapus Semua",
    merge_add_more: "Tambah File Lagi",
    merge_progress_label: "Menggabungkan...",
    merge_btn: "Gabungkan & Unduh PDF",
    merge_success_title: "PDF berhasil digabungkan!",
    merge_download: "Unduh",
    split_heading: "Pisahkan PDF",
    split_desc: "Upload satu file PDF, lalu tentukan cara memisahkannya.",
    split_drop_title: "Klik atau seret satu file PDF",
    split_drop_sub: "Satu file PDF · Ukuran maks ~100MB",
    split_mode_label: "Mode Pisah",
    split_mode_all: "Semua Halaman",
    split_mode_range: "Rentang",
    split_mode_interval: "Per N Halaman",
    split_opt_all_desc: "Setiap halaman akan dijadikan file PDF terpisah.",
    split_select_all: "Pilih Semua",
    split_deselect_all: "Hapus Pilihan",
    split_merge_selected: "Gabung jadi 1 file",
    split_thumb_loading: "Memuat pratinjau halaman...",
    split_thumb_error: "Gagal memuat pratinjau.",
    split_interval_label: "Pisah setiap berapa halaman?",
    split_interval_suffix: "halaman per file",
    split_progress_label: "Memisahkan...",
    split_btn: "Pisahkan & Unduh ZIP",
    split_results_label: "Hasil Pemisahan",
    split_download_all: "Unduh Semua (ZIP)",
    rotate_heading: "Putar Halaman PDF",
    rotate_desc: "Upload PDF, lalu putar halaman satu per satu atau sekaligus sebelum diunduh.",
    rotate_drop_title: "Klik atau seret satu file PDF",
    rotate_drop_sub: "Satu file PDF · Ukuran maks ~100MB",
    rotate_select_all: "Pilih Semua",
    rotate_deselect_all: "Hapus Pilihan",
    rotate_left_title: "Putar kiri",
    rotate_right_title: "Putar kanan",
    rotate_reset_title: "Atur ulang semua rotasi",
    rotate_hint:
      "Klik halaman untuk memilih. Klik ikon putar di tengah thumbnail untuk memutar halaman tersebut secara langsung.",
    rotate_thumb_loading: "Memuat pratinjau halaman...",
    rotate_thumb_error: "Gagal memuat pratinjau.",
    rotate_progress_label: "Memutar halaman...",
    rotate_btn: "Putar & Unduh PDF",
    rotate_success_title: "PDF berhasil diputar!",
    rotate_download: "Unduh",
    rotate_page_title: "Putar halaman ini",
    rotate_select_title: "Pilih halaman ini",
    footer_text:
      "File tidak dikirim ke server — semua diproses langsung di browser kamu 🔒",
    toast_only_pdf: "Hanya file PDF yang diterima!",
    toast_read_fail: "Gagal membaca PDF. Coba file lain.",
    toast_process_fail_merge: "Gagal memproses PDF. Pastikan file tidak terenkripsi.",
    toast_process_fail_generic: "Gagal memproses PDF.",
    toast_select_min_page: "Pilih minimal satu halaman!",
    toast_merge_success: "PDF berhasil digabungkan!",
    toast_split_success: "PDF berhasil dipecah menjadi {count} file!",
    toast_rotate_success: "PDF berhasil diputar!",
    sel_count_pages: "{count} halaman dipilih",
    merge_result_info: "{files} file · {pages} halaman · {size}",
    split_item_pages: "{pages} hal · {size}",
    rotate_result_info: "{pages} halaman diputar · {size}",
    pages_unit: "halaman",
  },
  en: {
    badge_free: "100% Free & Private",
    hero_title_line1: "Manage your PDFs",
    hero_title_line2: "with ease.",
    hero_subtitle:
      "Merge multiple PDFs into one, split pages apart, or rotate page orientation however you need. Free, fast, and secure — everything is processed right in your browser.",
    tab_merge: "Merge",
    tab_split: "Split",
    tab_rotate: "Rotate",
    merge_heading: "Merge PDFs",
    merge_desc: "Drag & drop to arrange the page order, then download the result.",
    merge_drop_title: "Click or drag PDF files here",
    merge_drop_sub: "Select multiple files at once · PDF only",
    merge_order_label: "File Order",
    merge_clear_all: "Clear All",
    merge_add_more: "Add More Files",
    merge_progress_label: "Merging...",
    merge_btn: "Merge & Download PDF",
    merge_success_title: "PDF merged successfully!",
    merge_download: "Download",
    split_heading: "Split PDF",
    split_desc: "Upload a single PDF file, then choose how to split it.",
    split_drop_title: "Click or drag a single PDF file",
    split_drop_sub: "One PDF file · Max size ~100MB",
    split_mode_label: "Split Mode",
    split_mode_all: "All Pages",
    split_mode_range: "Range",
    split_mode_interval: "Every N Pages",
    split_opt_all_desc: "Every page will become a separate PDF file.",
    split_select_all: "Select All",
    split_deselect_all: "Clear Selection",
    split_merge_selected: "Merge into 1 file",
    split_thumb_loading: "Loading page previews...",
    split_thumb_error: "Failed to load previews.",
    split_interval_label: "Split every how many pages?",
    split_interval_suffix: "pages per file",
    split_progress_label: "Splitting...",
    split_btn: "Split & Download ZIP",
    split_results_label: "Split Results",
    split_download_all: "Download All (ZIP)",
    rotate_heading: "Rotate PDF Pages",
    rotate_desc: "Upload a PDF, then rotate pages individually or all at once before downloading.",
    rotate_drop_title: "Click or drag a single PDF file",
    rotate_drop_sub: "One PDF file · Max size ~100MB",
    rotate_select_all: "Select All",
    rotate_deselect_all: "Clear Selection",
    rotate_left_title: "Rotate left",
    rotate_right_title: "Rotate right",
    rotate_reset_title: "Reset all rotations",
    rotate_hint:
      "Click a page to select it. Click the rotate icon in the middle of a thumbnail to rotate that page directly.",
    rotate_thumb_loading: "Loading page previews...",
    rotate_thumb_error: "Failed to load previews.",
    rotate_progress_label: "Rotating pages...",
    rotate_btn: "Rotate & Download PDF",
    rotate_success_title: "PDF rotated successfully!",
    rotate_download: "Download",
    rotate_page_title: "Rotate this page",
    rotate_select_title: "Select this page",
    footer_text:
      "Files are never sent to a server — everything is processed right in your browser 🔒",
    toast_only_pdf: "Only PDF files are accepted!",
    toast_read_fail: "Failed to read the PDF. Try another file.",
    toast_process_fail_merge: "Failed to process the PDF. Make sure the file isn't encrypted.",
    toast_process_fail_generic: "Failed to process the PDF.",
    toast_select_min_page: "Select at least one page!",
    toast_merge_success: "PDF merged successfully!",
    toast_split_success: "PDF successfully split into {count} files!",
    toast_rotate_success: "PDF rotated successfully!",
    sel_count_pages: "{count} pages selected",
    merge_result_info: "{files} files · {pages} pages · {size}",
    split_item_pages: "{pages} pg · {size}",
    rotate_result_info: "{pages} pages rotated · {size}",
    pages_unit: "pages",
  },
  tl: {
    badge_free: "100% Libre at Pribado",
    hero_title_line1: "Pamahalaan ang PDF mo",
    hero_title_line2: "nang madali.",
    hero_subtitle:
      "Pagsamahin ang maraming PDF sa isa, hatiin ang mga pahina, o paikutin ang oryentasyon ng pahina ayon sa kailangan mo. Libre, mabilis, at secure — lahat ay pinoproseso mismo sa browser mo.",
    tab_merge: "Pagsamahin",
    tab_split: "Hatiin",
    tab_rotate: "Paikutin",
    merge_heading: "Pagsamahin ang PDF",
    merge_desc: "I-drag at i-drop para ayusin ang pagkakasunod-sunod ng pahina, pagkatapos i-download ang resulta.",
    merge_drop_title: "I-click o i-drag ang mga file PDF dito",
    merge_drop_sub: "Pumili ng maraming file nang sabay · PDF lang",
    merge_order_label: "Pagkakasunod ng File",
    merge_clear_all: "Alisin Lahat",
    merge_add_more: "Magdagdag Pa ng File",
    merge_progress_label: "Pinagsasama...",
    merge_btn: "Pagsamahin at I-download ang PDF",
    merge_success_title: "Matagumpay na napagsama ang PDF!",
    merge_download: "I-download",
    split_heading: "Hatiin ang PDF",
    split_desc: "Mag-upload ng isang file PDF, pagkatapos ay piliin kung paano ito hahatiin.",
    split_drop_title: "I-click o i-drag ang isang file PDF",
    split_drop_sub: "Isang file PDF · Max na sukat ~100MB",
    split_mode_label: "Mode ng Paghati",
    split_mode_all: "Lahat ng Pahina",
    split_mode_range: "Saklaw",
    split_mode_interval: "Bawat N Pahina",
    split_opt_all_desc: "Ang bawat pahina ay gagawing hiwalay na file PDF.",
    split_select_all: "Piliin Lahat",
    split_deselect_all: "Alisin ang Pinili",
    split_merge_selected: "Isama sa 1 file",
    split_thumb_loading: "Nilo-load ang preview ng pahina...",
    split_thumb_error: "Hindi na-load ang preview.",
    split_interval_label: "Hatiin bawat ilang pahina?",
    split_interval_suffix: "pahina bawat file",
    split_progress_label: "Hinahati...",
    split_btn: "Hatiin at I-download ang ZIP",
    split_results_label: "Resulta ng Paghati",
    split_download_all: "I-download Lahat (ZIP)",
    rotate_heading: "Paikutin ang mga Pahina ng PDF",
    rotate_desc: "Mag-upload ng PDF, pagkatapos ay paikutin ang mga pahina nang isa-isa o sabay-sabay bago i-download.",
    rotate_drop_title: "I-click o i-drag ang isang file PDF",
    rotate_drop_sub: "Isang file PDF · Max na sukat ~100MB",
    rotate_select_all: "Piliin Lahat",
    rotate_deselect_all: "Alisin ang Pinili",
    rotate_left_title: "Paikutin pakaliwa",
    rotate_right_title: "Paikutin pakanan",
    rotate_reset_title: "I-reset lahat ng rotation",
    rotate_hint:
      "I-click ang pahina para piliin ito. I-click ang icon ng pag-ikot sa gitna ng thumbnail para paikutin agad ang pahinang iyon.",
    rotate_thumb_loading: "Nilo-load ang preview ng pahina...",
    rotate_thumb_error: "Hindi na-load ang preview.",
    rotate_progress_label: "Pinapaikot ang mga pahina...",
    rotate_btn: "Paikutin at I-download ang PDF",
    rotate_success_title: "Matagumpay na napaikot ang PDF!",
    rotate_download: "I-download",
    rotate_page_title: "Paikutin ang pahinang ito",
    rotate_select_title: "Piliin ang pahinang ito",
    footer_text:
      "Hindi ipinapadala ang mga file sa server — lahat ay pinoproseso mismo sa browser mo 🔒",
    toast_only_pdf: "PDF file lang ang tinatanggap!",
    toast_read_fail: "Hindi nabasa ang PDF. Subukan ang ibang file.",
    toast_process_fail_merge: "Hindi naproseso ang PDF. Siguraduhing hindi naka-encrypt ang file.",
    toast_process_fail_generic: "Hindi naproseso ang PDF.",
    toast_select_min_page: "Pumili ng kahit isang pahina!",
    toast_merge_success: "Matagumpay na na-merge ang PDF!",
    toast_split_success: "Matagumpay na na-split ang PDF sa {count} file!",
    toast_rotate_success: "Matagumpay na na-rotate ang PDF!",
    sel_count_pages: "{count} pahina ang napili",
    merge_result_info: "{files} file · {pages} pahina · {size}",
    split_item_pages: "{pages} pah · {size}",
    rotate_result_info: "{pages} pahina ang pinaikot · {size}",
    pages_unit: "pahina",
  },
};

let currentLang = "id";

function t(key, vars) {
  let str =
    (translations[currentLang] && translations[currentLang][key]) ||
    translations.id[key] ||
    key;
  if (vars) {
    Object.keys(vars).forEach((k) => {
      str = str.replace(new RegExp(`{${k}}`, "g"), vars[k]);
    });
  }
  return str;
}

const langLabels = { id: "Indonesia", en: "English", tl: "Filipino" };

function applyTranslations() {
  document.documentElement.lang = currentLang === "tl" ? "fil" : currentLang;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    el.textContent = t(key);
  });
  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const key = el.getAttribute("data-i18n-title");
    el.setAttribute("title", t(key));
  });

  const btnLabel = document.getElementById("lang-btn-label");
  if (btnLabel) btnLabel.textContent = langLabels[currentLang];

  document.querySelectorAll(".lang-option").forEach((btn) => {
    const isActive = btn.dataset.langOption === currentLang;
    btn.classList.toggle("text-teal-400", isActive);
    btn.classList.toggle("text-slate-300", !isActive);
    const check = btn.querySelector(".lang-check");
    if (check) check.classList.toggle("hidden", !isActive);
  });

  // Refresh dynamic, count-dependent labels
  updateSelCount("range-sel-count", selectedPages.size);
  updateSelCount("rotate-sel-count", selectedRotatePages.size);
}

function toggleLangMenu() {
  document.getElementById("lang-menu").classList.toggle("hidden");
}

function setLanguage(lang) {
  currentLang = lang;
  applyTranslations();
  document.getElementById("lang-menu").classList.add("hidden");
}

document.addEventListener("click", (e) => {
  const menu = document.getElementById("lang-menu");
  const btn = document.getElementById("lang-btn");
  if (!menu || !btn) return;
  if (!menu.contains(e.target) && !btn.contains(e.target)) {
    menu.classList.add("hidden");
  }
});

// ─── State ─────────────────────────────────────────
let mergeFiles = [];
let splitFile = null;
let splitPageCount = 0;
let splitMode = "all";
let splitResults = [];
let mergeSortable = null;
let selectedPages = new Set(); // 0-indexed
let thumbsRendered = false;

let rotateFile = null;
let rotatePageCount = 0;
let rotateBaseRotations = []; // original /Rotate angle read from the PDF, per page
let rotateDeltas = []; // extra rotation applied by the user (multiples of 90)
let selectedRotatePages = new Set();
let rotateThumbsRendered = false;

// ─── Tab Switching ──────────────────────────────────
function switchTab(tab) {
  const panels = { merge: "panel-merge", split: "panel-split", rotate: "panel-rotate" };
  const tabs = { merge: "tab-merge", split: "tab-split", rotate: "tab-rotate" };
  Object.keys(panels).forEach((key) => {
    document.getElementById(panels[key]).classList.toggle("hidden", key !== tab);
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
  else if (type === "rotate") setRotateFile(files[0]);
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
    loading.innerHTML = `<p class="text-red-400 text-sm py-4 text-center font-body">${t("split_thumb_error")}</p>`;
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
      showToast(t("toast_split_success", { count: splitResults.length }), "success");
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
  a.download = "split-pdf.zip";
  a.click();
}

// ─── ROTATE ─────────────────────────────────────────
function handleRotateFile(e) {
  const f = e.target.files[0];
  if (f) setRotateFile(f);
  e.target.value = "";
}

async function setRotateFile(f) {
  if (f.type !== "application/pdf")
    return showToast(t("toast_only_pdf"), "error");
  rotateFile = f;
  rotateThumbsRendered = false;
  selectedRotatePages = new Set();

  try {
    const buf = await f.arrayBuffer();
    const { PDFDocument } = PDFLib;
    const pdf = await PDFDocument.load(buf);
    rotatePageCount = pdf.getPageCount();
    rotateBaseRotations = pdf.getPages().map((p) => p.getRotation().angle || 0);
    rotateDeltas = new Array(rotatePageCount).fill(0);

    document.getElementById("rotate-fname").textContent = f.name;
    document.getElementById("rotate-finfo").textContent =
      `${rotatePageCount} ${t("pages_unit")} · ${formatSize(f.size)}`;
    document.getElementById("rotate-file-info").classList.remove("hidden");
    document.getElementById("rotate-options").classList.remove("hidden");
    document.getElementById("rotate-btn").disabled = false;
    document.getElementById("rotate-result").classList.add("hidden");

    document.getElementById("rotate-thumb-grid").innerHTML = "";
    document.getElementById("rotate-thumb-grid").classList.add("hidden");
    document.getElementById("rotate-thumb-loading").classList.remove("hidden");
    updateSelCount("rotate-sel-count", 0);

    await renderRotateThumbnails();
  } catch (err) {
    showToast(t("toast_read_fail"), "error");
    console.error(err);
  }
}

function clearRotate() {
  rotateFile = null;
  rotatePageCount = 0;
  rotateBaseRotations = [];
  rotateDeltas = [];
  selectedRotatePages = new Set();
  rotateThumbsRendered = false;
  document.getElementById("rotate-file-info").classList.add("hidden");
  document.getElementById("rotate-options").classList.add("hidden");
  document.getElementById("rotate-btn").disabled = true;
  document.getElementById("rotate-result").classList.add("hidden");
  document.getElementById("rotate-thumb-grid").innerHTML = "";
}

async function renderRotateThumbnails() {
  if (!rotateFile) return;
  const grid = document.getElementById("rotate-thumb-grid");
  const loading = document.getElementById("rotate-thumb-loading");
  grid.innerHTML = "";
  loading.classList.remove("hidden");
  grid.classList.add("hidden");

  try {
    const buf = await rotateFile.arrayBuffer();
    const pdfDoc = await pdfjsLib.getDocument({ data: buf }).promise;
    const numPages = pdfDoc.numPages;

    for (let i = 1; i <= numPages; i++) {
      const idx = i - 1;
      const page = await pdfDoc.getPage(i);

      const thumb = document.createElement("div");
      thumb.className = "page-thumb";
      thumb.dataset.page = idx;
      thumb.innerHTML = `
            <div class="thumb-canvas-wrap"></div>
            <button type="button" class="rotate-page-btn" title="${t("rotate_page_title")}">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </button>
            <button type="button" class="page-select-box" title="${t("rotate_select_title")}">
              <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
              </svg>
            </button>
            <span class="page-num">${i}</span>
          `;
      grid.appendChild(thumb);

      await renderRotateThumbCanvas(page, thumb, idx);

      thumb.querySelector(".rotate-page-btn").addEventListener("click", async (ev) => {
        ev.stopPropagation();
        rotateDeltas[idx] = (rotateDeltas[idx] + 90) % 360;
        await renderRotateThumbCanvas(page, thumb, idx);
      });
      thumb.querySelector(".page-select-box").addEventListener("click", (ev) => {
        ev.stopPropagation();
        toggleRotatePage(thumb, idx);
      });
      thumb.addEventListener("click", () => toggleRotatePage(thumb, idx));
    }

    loading.classList.add("hidden");
    grid.classList.remove("hidden");
    rotateThumbsRendered = true;
  } catch (err) {
    loading.innerHTML = `<p class="text-red-400 text-sm py-4 text-center font-body">${t("rotate_thumb_error")}</p>`;
    console.error(err);
  }
}

async function renderRotateThumbCanvas(page, thumbEl, idx) {
  const wrap = thumbEl.querySelector(".thumb-canvas-wrap");
  const totalRotation =
    ((rotateBaseRotations[idx] || 0) + rotateDeltas[idx] + 360) % 360;
  const viewport = page.getViewport({ scale: 0.4, rotation: totalRotation });
  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext("2d");
  await page.render({ canvasContext: ctx, viewport }).promise;
  wrap.innerHTML = "";
  wrap.appendChild(canvas);

  thumbEl.classList.toggle("rotated", rotateDeltas[idx] % 360 !== 0);
}

function toggleRotatePage(thumb, idx) {
  if (selectedRotatePages.has(idx)) {
    selectedRotatePages.delete(idx);
    thumb.classList.remove("selected");
  } else {
    selectedRotatePages.add(idx);
    thumb.classList.add("selected");
  }
  updateSelCount("rotate-sel-count", selectedRotatePages.size);
}

function selectAllRotatePages() {
  document.querySelectorAll("#rotate-thumb-grid .page-thumb").forEach((th) => {
    const idx = parseInt(th.dataset.page);
    selectedRotatePages.add(idx);
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
  if (!rotateFile || !rotatePageCount) return;
  const targets =
    selectedRotatePages.size > 0
      ? [...selectedRotatePages]
      : rotateDeltas.map((_, i) => i);
  if (!targets.length) return;

  const buf = await rotateFile.arrayBuffer();
  const pdfDoc = await pdfjsLib.getDocument({ data: buf }).promise;
  for (const idx of targets) {
    rotateDeltas[idx] = ((rotateDeltas[idx] + delta) % 360 + 360) % 360;
    const thumb = document.querySelector(
      `#rotate-thumb-grid .page-thumb[data-page="${idx}"]`,
    );
    if (thumb) {
      const page = await pdfDoc.getPage(idx + 1);
      await renderRotateThumbCanvas(page, thumb, idx);
    }
  }
}

async function resetAllRotations() {
  if (!rotateFile || !rotatePageCount) return;
  rotateDeltas = rotateDeltas.map(() => 0);
  const buf = await rotateFile.arrayBuffer();
  const pdfDoc = await pdfjsLib.getDocument({ data: buf }).promise;
  const thumbs = document.querySelectorAll("#rotate-thumb-grid .page-thumb");
  for (const thumb of thumbs) {
    const idx = parseInt(thumb.dataset.page);
    const page = await pdfDoc.getPage(idx + 1);
    await renderRotateThumbCanvas(page, thumb, idx);
  }
}

async function applyRotateAndDownload() {
  if (!rotateFile) return;
  const btn = document.getElementById("rotate-btn");
  btn.disabled = true;
  showProgress("rotate", true);

  try {
    const { PDFDocument, degrees } = PDFLib;
    const buf = await rotateFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(buf);
    const pages = pdfDoc.getPages();

    pages.forEach((p, idx) => {
      setProgress("rotate", Math.round(((idx + 1) / pages.length) * 80));
      const base = p.getRotation().angle || 0;
      const total = (base + (rotateDeltas[idx] || 0) + 360) % 360;
      p.setRotation(degrees(total));
    });

    setProgress("rotate", 90);
    const bytes = await pdfDoc.save();
    const blob = new Blob([bytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    setProgress("rotate", 100);

    const changedCount = rotateDeltas.filter((d) => d % 360 !== 0).length;

    setTimeout(() => {
      showProgress("rotate", false);
      const a = document.getElementById("rotate-download");
      a.href = url;
      const baseName = rotateFile.name.replace(/\.pdf$/i, "");
      a.download = `${baseName}_diputar.pdf`;
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
