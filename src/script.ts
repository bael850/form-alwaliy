type Intent = "produk" | "pesanan" | "maklon" | "lainnya";

// Ganti nomor di sini bila perlu.
const WA_NUMBER = "6282110689827";

const $ = <T extends HTMLElement = HTMLElement>(id: string): T =>
  document.getElementById(id) as T;

document.addEventListener("DOMContentLoaded", () => {
  const form = $<HTMLFormElement>("leadForm");
  const intent = $<HTMLSelectElement>("intent");
  const nama = $<HTMLInputElement>("nama");
  const wa = $<HTMLInputElement>("wa");
  const produk = $<HTMLSelectElement>("produk");
  const kategori = $<HTMLSelectElement>("kategori");
  const budget = $<HTMLSelectElement>("budget");
  const pesan = $<HTMLTextAreaElement>("pesan");
  const label = (s: HTMLSelectElement) =>
    s.selectedOptions[0]?.textContent ?? "";

  intent.addEventListener("change", () => {
    $("field-intent").classList.remove("invalid");
    document.querySelectorAll<HTMLElement>(".panel").forEach((p) => {
      p.classList.toggle(
        "show",
        (p.dataset.for ?? "").split(" ").includes(intent.value),
      );
    });
    $("pesanLabel").textContent =
      intent.value === "maklon" ? "Pesan (opsional)" : "Pesan";
  });

  wa.addEventListener("input", () => {
    wa.value = wa.value.replace(/\D/g, "");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const cur = intent.value as Intent | "";
    const n = nama.value.trim();
    const num = wa.value;
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
    const lines = [`Nama: ${n}`, `WhatsApp: +62${num}`];
    if ((cur === "produk" || cur === "pesanan") && produk.value) {
      lines.push(`Produk: ${produk.value}`);
    }
    if (cur === "maklon") {
      lines.push(
        `Kategori Produk: ${label(kategori)}`,
        `Budget Produksi: ${label(budget)}`,
      );
    }
    if (msg) lines.push(`Pesan: ${msg}`);
    const text = `Assalamualaikum, ${opening[cur as Intent]}:\n\n${lines.join("\n")}`;

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    form.classList.add("hide");
    $("successBox").classList.add("show");
  });
});
