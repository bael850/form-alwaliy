type Intent = "produk" | "pesanan" | "maklon" | "lainnya";

// Ganti nomor di sini bila perlu.
const WA_UMUM = "6282110689827";
const WA_MAKLON = "6281515264972";
const MAX_SIZE = 5 * 1024 * 1024;

const $ = <T extends HTMLElement = HTMLElement>(id: string): T =>
  document.getElementById(id) as T;

document.addEventListener("DOMContentLoaded", () => {
  const form = $<HTMLFormElement>("leadForm");
  const nama = $<HTMLInputElement>("nama");
  const wa = $<HTMLInputElement>("wa");
  const produk = $<HTMLSelectElement>("produk");
  const kategori = $<HTMLSelectElement>("kategori");
  const budget = $<HTMLSelectElement>("budget");
  const pesan = $<HTMLTextAreaElement>("pesan");
  const pesanLabel = $("pesanLabel");
  const upErr = $("upload-err");
  const uploads: Record<string, File | null> = { logo: null, foto: null };

  const intent = (): Intent | "" =>
    (form.querySelector<HTMLInputElement>('input[name="intent"]:checked')
      ?.value as Intent) ?? "";
  const label = (s: HTMLSelectElement) =>
    s.selectedOptions[0]?.textContent ?? "";

  function syncPanels(): void {
    const cur = intent();
    document.querySelectorAll<HTMLElement>(".panel").forEach((p) => {
      p.classList.toggle(
        "show",
        (p.dataset.for ?? "").split(" ").includes(cur),
      );
    });
    pesanLabel.textContent =
      cur === "maklon" ? "Catatan tambahan (opsional)" : "Pesan Anda";
  }
  form.querySelectorAll('input[name="intent"]').forEach((r) =>
    r.addEventListener("change", () => {
      $("field-intent").classList.remove("invalid");
      syncPanels();
    }),
  );

  wa.addEventListener("input", () => {
    wa.value = wa.value.replace(/\D/g, "");
  });

  function wireDropzone(key: string): void {
    const dz = $(`dz-${key}`);
    const input = $<HTMLInputElement>(`file-${key}`);
    const img = $<HTMLImageElement>(`img-${key}`);
    const prev = $(`preview-${key}`);
    const name = $(`filename-${key}`);
    const remove = dz.querySelector<HTMLButtonElement>(".remove")!;

    const take = (f?: File | null): void => {
      if (!f) return;
      if (!f.type.startsWith("image/") || f.size > MAX_SIZE) {
        upErr.classList.add("show");
        return;
      }
      upErr.classList.remove("show");
      uploads[key] = f;
      const reader = new FileReader();
      reader.onload = () => {
        img.src = reader.result as string;
        name.textContent = f.name;
        prev.classList.add("show");
        dz.classList.add("filled");
      };
      reader.readAsDataURL(f);
    };

    dz.addEventListener("click", () => input.click());
    dz.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        input.click();
      }
    });
    input.addEventListener("click", (e) => e.stopPropagation());
    input.addEventListener("change", () => take(input.files?.[0]));
    ["dragenter", "dragover"].forEach((t) =>
      dz.addEventListener(t, (e) => {
        e.preventDefault();
        dz.classList.add("dragover");
      }),
    );
    ["dragleave", "drop"].forEach((t) =>
      dz.addEventListener(t, (e) => {
        e.preventDefault();
        dz.classList.remove("dragover");
      }),
    );
    dz.addEventListener("drop", (e) =>
      take((e as DragEvent).dataTransfer?.files[0]),
    );
    remove.addEventListener("click", (e) => {
      e.stopPropagation();
      uploads[key] = null;
      input.value = "";
      img.src = "";
      prev.classList.remove("show");
      dz.classList.remove("filled");
    });
  }
  wireDropzone("logo");
  wireDropzone("foto");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const cur = intent();
    const n = nama.value.trim();
    const num = wa.value.replace(/\D/g, "");
    const msg = pesan.value.trim();

    const checks: [string, boolean][] = [
      ["field-intent", !cur],
      ["field-nama", !n],
      ["field-wa", num.length < 8],
    ];
    if (cur === "maklon") {
      checks.push(
        ["field-kategori", !kategori.value],
        ["field-budget", !budget.value],
      );
    } else if (cur) {
      checks.push(["field-pesan", !msg]);
    }
    form
      .querySelectorAll(".invalid")
      .forEach((el) => el.classList.remove("invalid"));
    checks.forEach(([id, bad]) => $(id).classList.toggle("invalid", bad));
    const first = checks.find(([, bad]) => bad);
    if (first) {
      const el = $(first[0]);
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.querySelector<HTMLElement>("input, select, textarea")?.focus();
      return;
    }

    const opening: Record<Intent, string> = {
      produk: "saya mau bertanya soal produk",
      pesanan: "saya mau bertanya soal pesanan/pembelian",
      maklon: "saya mau konsultasi maklon",
      lainnya: "saya ada pertanyaan",
    };
    const lines = [`Nama: ${n}`];
    if ((cur === "produk" || cur === "pesanan") && produk.value) {
      lines.push(`Produk: ${produk.value}`);
    }
    if (cur === "maklon") {
      lines.push(
        `Kategori Produk: ${label(kategori)}`,
        `Budget Produksi: ${label(budget)}`,
      );
      const jalur = form.querySelector<HTMLInputElement>(
        'input[name="jalur"]:checked',
      )?.value;
      if (jalur) lines.push(`Posisi: ${jalur}`);
    }
    if (msg) lines.push(`${cur === "maklon" ? "Catatan" : "Pesan"}: ${msg}`);
    let text = `Assalamualaikum, ${opening[cur as Intent]}:\n\n${lines.join("\n")}`;
    if (cur === "maklon" && (uploads.logo || uploads.foto)) {
      text += "\n\n(Logo/referensi produk akan saya kirim di chat ini)";
    }

    const url = `https://wa.me/${cur === "maklon" ? WA_MAKLON : WA_UMUM}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    form.classList.add("hide");
    $("successBox").classList.add("show");
  });
});
