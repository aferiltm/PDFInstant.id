const langSelector = document.getElementById("languageSwitcher");

langSelector.addEventListener("change", function () {
  changeLanguage(this.value);
});

function changeLanguage(lang) {
  localStorage.setItem("language", lang);

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;

    if (translations[lang][key]) {
      el.innerHTML = translations[lang][key];
    }
  });
}
const savedLanguage = localStorage.getItem("language") || "id";

document.getElementById("languageSwitcher").value = savedLanguage;

changeLanguage(savedLanguage);
