"use strict";
const MAX_SIZE = 5 * 1024 * 1024;
const WA_NUMBER = "6281515264972";
function qs(selector, root = document) {
  const el = root.querySelector(selector);
  if (!el) throw new Error(`Element not found: ${selector}`);
  return el;
}
function byId(id) {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Element not found: #${id}`);
  return el;
}
document.addEventListener("DOMContentLoaded", () => {
  const form = byId("leadForm");
  const submitBtn = byId("submitBtn");
  const submitBtnLabel = byId("submitBtnLabel");
  const successBox = byId("successBox");
  const uploadErr = byId("upload-err");
  const namaInput = byId("nama");
  const waInput = byId("wa");
  const kategoriSelect = byId("kategori");
  const budgetSelect = byId("budget");
  const uploads = { logo: null, foto: null };
  function setInvalid(fieldId, invalid) {
    byId(fieldId).classList.toggle("invalid", invalid);
  }
  function wireDropzone(key) {
    const dz = byId(`dz-${key}`);
    const input = byId(`file-${key}`);
    const preview = byId(`preview-${key}`);
    const img = byId(`img-${key}`);
    const filenameEl = byId(`filename-${key}`);
    const removeBtn = qs(".remove", preview);
    function openPicker(e) {
      const target = e.target;
      if (target.closest(".remove")) return;
      input.click();
    }
    dz.addEventListener("click", openPicker);
    dz.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        input.click();
      }
    });
    dz.addEventListener("dragover", (e) => {
      e.preventDefault();
      dz.classList.add("dragover");
    });
    dz.addEventListener("dragleave", () => dz.classList.remove("dragover"));
    dz.addEventListener("drop", (e) => {
      var _a, _b;
      e.preventDefault();
      dz.classList.remove("dragover");
      const file =
        (_b =
          (_a = e.dataTransfer) === null || _a === void 0
            ? void 0
            : _a.files) === null || _b === void 0
          ? void 0
          : _b[0];
      if (file) handleFile(file);
    });
    input.addEventListener("change", () => {
      var _a;
      const file =
        (_a = input.files) === null || _a === void 0 ? void 0 : _a[0];
      if (file) handleFile(file);
    });
    function handleFile(file) {
      uploadErr.classList.remove("show");
      if (!file.type.startsWith("image/")) {
        uploadErr.classList.add("show");
        return;
      }
      if (file.size > MAX_SIZE) {
        uploadErr.classList.add("show");
        return;
      }
      uploads[key] = file;
      const reader = new FileReader();
      reader.onload = (ev) => {
        var _a;
        img.src =
          (_a = ev.target) === null || _a === void 0 ? void 0 : _a.result;
        filenameEl.textContent = file.name;
        preview.classList.add("show");
        dz.classList.add("filled");
      };
      reader.readAsDataURL(file);
    }
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      uploads[key] = null;
      input.value = "";
      preview.classList.remove("show");
      dz.classList.remove("filled");
      img.src = "";
    });
  }
  wireDropzone("logo");
  wireDropzone("foto");
  waInput.addEventListener("input", () => {
    waInput.value = waInput.value.replace(/\D/g, "");
  });
  form.addEventListener("submit", (e) => {
    var _a, _b, _c, _d, _e, _f;
    e.preventDefault();
    const nama = namaInput.value.trim();
    const wa = waInput.value.trim().replace(/\D/g, "");
    const kategori = kategoriSelect.value;
    const budget = budgetSelect.value;
    let valid = true;
    let firstInvalidField = null;
    if (!nama) {
      setInvalid("field-nama", true);
      valid = false;
      firstInvalidField !== null && firstInvalidField !== void 0
        ? firstInvalidField
        : (firstInvalidField = "field-nama");
    } else {
      setInvalid("field-nama", false);
    }
    if (wa.length < 8) {
      setInvalid("field-wa", true);
      valid = false;
      firstInvalidField !== null && firstInvalidField !== void 0
        ? firstInvalidField
        : (firstInvalidField = "field-wa");
    } else {
      setInvalid("field-wa", false);
    }
    if (!kategori) {
      setInvalid("field-kategori", true);
      valid = false;
      firstInvalidField !== null && firstInvalidField !== void 0
        ? firstInvalidField
        : (firstInvalidField = "field-kategori");
    } else {
      setInvalid("field-kategori", false);
    }
    if (!budget) {
      setInvalid("field-budget", true);
      valid = false;
      firstInvalidField !== null && firstInvalidField !== void 0
        ? firstInvalidField
        : (firstInvalidField = "field-budget");
    } else {
      setInvalid("field-budget", false);
    }
    if (!valid) {
      if (firstInvalidField) {
        byId(firstInvalidField).scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        (_a = byId(firstInvalidField).querySelector("input, select")) ===
          null || _a === void 0
          ? void 0
          : _a.dispatchEvent(new Event("focus"));
        (_b = byId(firstInvalidField).querySelector("input, select")) ===
          null || _b === void 0
          ? void 0
          : _b.focus();
      }
      return;
    }
    submitBtn.disabled = true;
    submitBtnLabel.innerHTML =
      '<span class="btn-spinner"></span>Mengalihkan ke WhatsApp...';
    const kategoriLabel =
      (_d =
        (_c = kategoriSelect.selectedOptions[0]) === null || _c === void 0
          ? void 0
          : _c.textContent) !== null && _d !== void 0
        ? _d
        : kategori;
    const budgetLabel =
      (_f =
        (_e = budgetSelect.selectedOptions[0]) === null || _e === void 0
          ? void 0
          : _e.textContent) !== null && _f !== void 0
        ? _f
        : budget;
    const pesan =
      "Assalamualaikum, saya mau konsultasi maklon:\n\n" +
      `Nama: ${nama}\n` +
      `Kategori Produk: ${kategoriLabel}\n` +
      `Budget Produksi: ${budgetLabel}` +
      (uploads.logo || uploads.foto
        ? "\n\n(Saya juga sudah menyiapkan logo/referensi produk, akan saya kirim di chat ini)"
        : "");
    const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(pesan)}`;
    window.setTimeout(() => {
      form.classList.add("hide");
      successBox.classList.add("show");
      window.open(waUrl, "_blank");
    }, 500);
  });
});
