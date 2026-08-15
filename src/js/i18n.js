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
    merge_desc:
      "Seret & lepas untuk menyusun urutan halaman, lalu unduh hasilnya.",
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
    rotate_desc:
      "Upload satu atau beberapa PDF, susun ulang urutan halamannya, lalu putar sebelum diunduh.",
    rotate_drop_title: "Klik atau seret file PDF di sini",
    rotate_drop_sub: "Pilih beberapa file sekaligus · PDF saja",
    rotate_files_label: "Daftar File",
    rotate_select_all: "Pilih Semua",
    rotate_deselect_all: "Hapus Pilihan",
    rotate_left_title: "Putar kiri",
    rotate_right_title: "Putar kanan",
    rotate_reset_title: "Atur ulang semua rotasi",
    rotate_hint:
      "Klik halaman untuk memilih. Seret ikon di pojok kanan atas thumbnail untuk mengubah urutan halaman. Klik ikon putar di tengah untuk memutar halaman itu secara langsung.",
    rotate_hint_touch:
      "Tap halaman untuk memilih. Tekan & tahan sebentar lalu geser untuk mengubah urutan halaman. Tap ikon putar di tengah untuk memutar halaman itu.",
    rotate_thumb_loading: "Memuat pratinjau halaman...",
    rotate_thumb_error: "Gagal memuat pratinjau.",
    rotate_progress_label: "Memutar halaman...",
    rotate_btn: "Putar & Unduh PDF",
    rotate_success_title: "PDF berhasil diputar!",
    rotate_download: "Unduh",
    rotate_page_title: "Putar halaman ini",
    rotate_select_title: "Pilih halaman ini",
    rotate_drag_title: "Seret untuk mengubah urutan",
    rotate_files_summary: "{files} file · {pages} halaman · {size}",
    zoom_view_title: "Lihat halaman",
    zoom_close_title: "Tutup",
    zoom_prev_title: "Halaman sebelumnya",
    zoom_next_title: "Halaman berikutnya",
    zoom_page_indicator: "Halaman {current} dari {total}",
    zoom_merge_subtitle: "{pages} halaman",
    zoom_thumb_error: "Gagal memuat halaman.",
    footer_text:
      "File tidak dikirim ke server — semua diproses langsung di browser kamu 🔒",
    toast_only_pdf: "Hanya file PDF yang diterima!",
    toast_read_fail: "Gagal membaca PDF. Coba file lain.",
    toast_process_fail_merge:
      "Gagal memproses PDF. Pastikan file tidak terenkripsi.",
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
    merge_desc:
      "Drag & drop to arrange the page order, then download the result.",
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
    rotate_desc:
      "Upload one or more PDFs, reorder the pages however you like, then rotate before downloading.",
    rotate_drop_title: "Click or drag PDF files here",
    rotate_drop_sub: "Select multiple files at once · PDF only",
    rotate_files_label: "File List",
    rotate_select_all: "Select All",
    rotate_deselect_all: "Clear Selection",
    rotate_left_title: "Rotate left",
    rotate_right_title: "Rotate right",
    rotate_reset_title: "Reset all rotations",
    rotate_hint:
      "Click a page to select it. Drag the handle in the top-right corner of a thumbnail to reorder pages. Click the rotate icon in the middle to rotate that page directly.",
    rotate_hint_touch:
      "Tap a page to select it. Press and hold, then drag to reorder pages. Tap the rotate icon in the middle to rotate that page.",
    rotate_thumb_loading: "Loading page previews...",
    rotate_thumb_error: "Failed to load previews.",
    rotate_progress_label: "Rotating pages...",
    rotate_btn: "Rotate & Download PDF",
    rotate_success_title: "PDF rotated successfully!",
    rotate_download: "Download",
    rotate_page_title: "Rotate this page",
    rotate_select_title: "Select this page",
    rotate_drag_title: "Drag to reorder",
    rotate_files_summary: "{files} files · {pages} pages · {size}",
    zoom_view_title: "View page",
    zoom_close_title: "Close",
    zoom_prev_title: "Previous page",
    zoom_next_title: "Next page",
    zoom_page_indicator: "Page {current} of {total}",
    zoom_merge_subtitle: "{pages} pages",
    zoom_thumb_error: "Failed to load the page.",
    footer_text:
      "Files are never sent to a server — everything is processed right in your browser 🔒",
    toast_only_pdf: "Only PDF files are accepted!",
    toast_read_fail: "Failed to read the PDF. Try another file.",
    toast_process_fail_merge:
      "Failed to process the PDF. Make sure the file isn't encrypted.",
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
    merge_desc:
      "I-drag at i-drop para ayusin ang pagkakasunod-sunod ng pahina, pagkatapos i-download ang resulta.",
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
    split_desc:
      "Mag-upload ng isang file PDF, pagkatapos ay piliin kung paano ito hahatiin.",
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
    rotate_desc:
      "Mag-upload ng isa o maraming PDF, ayusin ang pagkakasunod-sunod ng pahina, pagkatapos paikutin bago i-download.",
    rotate_drop_title: "I-click o i-drag ang mga file PDF dito",
    rotate_drop_sub: "Pumili ng maraming file nang sabay · PDF lang",
    rotate_files_label: "Listahan ng File",
    rotate_select_all: "Piliin Lahat",
    rotate_deselect_all: "Alisin ang Pinili",
    rotate_left_title: "Paikutin pakaliwa",
    rotate_right_title: "Paikutin pakanan",
    rotate_reset_title: "I-reset lahat ng rotation",
    rotate_hint:
      "I-click ang pahina para piliin ito. I-drag ang hawakan sa kanang-itaas ng thumbnail para ayusin ang pagkakasunod-sunod ng mga pahina. I-click ang icon ng pag-ikot sa gitna para paikutin agad ang pahinang iyon.",
    rotate_hint_touch:
      "I-tap ang pahina para piliin ito. Pindutin nang matagal, pagkatapos i-drag para ayusin ang pagkakasunod-sunod ng mga pahina. I-tap ang icon ng pag-ikot sa gitna para paikutin ang pahinang iyon.",
    rotate_thumb_loading: "Nilo-load ang preview ng pahina...",
    rotate_thumb_error: "Hindi na-load ang preview.",
    rotate_progress_label: "Pinapaikot ang mga pahina...",
    rotate_btn: "Paikutin at I-download ang PDF",
    rotate_success_title: "Matagumpay na napaikot ang PDF!",
    rotate_download: "I-download",
    rotate_page_title: "Paikutin ang pahinang ito",
    rotate_select_title: "Piliin ang pahinang ito",
    rotate_drag_title: "I-drag para ayusin ang pagkakasunod-sunod",
    rotate_files_summary: "{files} file · {pages} pahina · {size}",
    zoom_view_title: "Tingnan ang pahina",
    zoom_close_title: "Isara",
    zoom_prev_title: "Nakaraang pahina",
    zoom_next_title: "Susunod na pahina",
    zoom_page_indicator: "Pahina {current} ng {total}",
    zoom_merge_subtitle: "{pages} pahina",
    zoom_thumb_error: "Hindi na-load ang pahina.",
    footer_text:
      "Hindi ipinapadala ang mga file sa server — lahat ay pinoproseso mismo sa browser mo 🔒",
    toast_only_pdf: "PDF file lang ang tinatanggap!",
    toast_read_fail: "Hindi nabasa ang PDF. Subukan ang ibang file.",
    toast_process_fail_merge:
      "Hindi naproseso ang PDF. Siguraduhing hindi naka-encrypt ang file.",
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
  if (typeof rotateFileEntries !== "undefined" && rotateFileEntries.length) {
    renderRotateFileList();
  }
  updateRotateHint();
}

function updateRotateHint() {
  const el = document.querySelector('[data-i18n="rotate_hint"]');
  if (el)
    el.textContent = isTouchDevice ? t("rotate_hint_touch") : t("rotate_hint");
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
