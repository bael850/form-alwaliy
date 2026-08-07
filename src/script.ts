// Form konsultasi maklon Al-Waliy Sejahtera
// Compile: npm run build:js  (menghasilkan dist/script.js)

type UploadKey = "logo" | "foto";

interface UploadState {
  logo: File | null;
  foto: File | null;
}

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const WA_NUMBER = "6281515264972";

function qs<T extends HTMLElement>(
  selector: string,
  root: ParentNode = document,
): T {
  const el = root.querySelector<T>(selector);
  if (!el) throw new Error(`Element not found: ${selector}`);
  return el;
}

function byId<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id) as T | null;
  if (!el) throw new Error(`Element not found: #${id}`);
  return el;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = byId<HTMLFormElement>("leadForm");
  const submitBtn = byId<HTMLButtonElement>("submitBtn");
  const submitBtnLabel = byId<HTMLSpanElement>("submitBtnLabel");
  const successBox = byId<HTMLDivElement>("successBox");
  const uploadErr = byId<HTMLDivElement>("upload-err");

  const namaInput = byId<HTMLInputElement>("nama");
  const waInput = byId<HTMLInputElement>("wa");
  const kategoriSelect = byId<HTMLSelectElement>("kategori");
  const budgetSelect = byId<HTMLSelectElement>("budget");

  const uploads: UploadState = { logo: null, foto: null };

  function setInvalid(fieldId: string, invalid: boolean): void {
    byId(fieldId).classList.toggle("invalid", invalid);
  }

  function wireDropzone(key: UploadKey): void {
    const dz = byId<HTMLDivElement>(`dz-${key}`);
    const input = byId<HTMLInputElement>(`file-${key}`);
    const preview = byId<HTMLDivElement>(`preview-${key}`);
    const img = byId<HTMLImageElement>(`img-${key}`);
    const filenameEl = byId<HTMLDivElement>(`filename-${key}`);
    const removeBtn = qs<HTMLButtonElement>(".remove", preview);

    function openPicker(e: MouseEvent): void {
      const target = e.target as HTMLElement;
      if (target.closest(".remove")) return;
      input.click();
    }

    dz.addEventListener("click", openPicker);
    dz.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        input.click();
      }
    });

    dz.addEventListener("dragover", (e: DragEvent) => {
      e.preventDefault();
      dz.classList.add("dragover");
    });
    dz.addEventListener("dragleave", () => dz.classList.remove("dragover"));
    dz.addEventListener("drop", (e: DragEvent) => {
      e.preventDefault();
      dz.classList.remove("dragover");
      const file = e.dataTransfer?.files?.[0];
      if (file) handleFile(file);
    });

    input.addEventListener("change", () => {
      const file = input.files?.[0];
      if (file) handleFile(file);
    });

    function handleFile(file: File): void {
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
        img.src = ev.target?.result as string;
        filenameEl.textContent = file.name;
        preview.classList.add("show");
        dz.classList.add("filled");
      };
      reader.readAsDataURL(file);
    }

    removeBtn.addEventListener("click", (e: MouseEvent) => {
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

  form.addEventListener("submit", (e: SubmitEvent) => {
    e.preventDefault();

    const nama = namaInput.value.trim();
    const wa = waInput.value.trim().replace(/\D/g, "");
    const kategori = kategoriSelect.value;
    const budget = budgetSelect.value;

    let valid = true;
    let firstInvalidField: string | null = null;

    if (!nama) {
      setInvalid("field-nama", true);
      valid = false;
      firstInvalidField ??= "field-nama";
    } else {
      setInvalid("field-nama", false);
    }
    if (wa.length < 8) {
      setInvalid("field-wa", true);
      valid = false;
      firstInvalidField ??= "field-wa";
    } else {
      setInvalid("field-wa", false);
    }
    if (!kategori) {
      setInvalid("field-kategori", true);
      valid = false;
      firstInvalidField ??= "field-kategori";
    } else {
      setInvalid("field-kategori", false);
    }
    if (!budget) {
      setInvalid("field-budget", true);
      valid = false;
      firstInvalidField ??= "field-budget";
    } else {
      setInvalid("field-budget", false);
    }

    if (!valid) {
      if (firstInvalidField) {
        byId(firstInvalidField).scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        byId(firstInvalidField)
          .querySelector("input, select")
          ?.dispatchEvent(new Event("focus"));
        (
          byId(firstInvalidField).querySelector(
            "input, select",
          ) as HTMLElement | null
        )?.focus();
      }
      return;
    }

    submitBtn.disabled = true;
    submitBtnLabel.innerHTML =
      '<span class="btn-spinner"></span>Mengalihkan ke WhatsApp...';

    const kategoriLabel =
      kategoriSelect.selectedOptions[0]?.textContent ?? kategori;
    const budgetLabel = budgetSelect.selectedOptions[0]?.textContent ?? budget;

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
