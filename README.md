# Form Konsultasi Maklon — Al-Waliy Sejahtera

Landing page form konsultasi maklon herbal & madu. Submit form mengarahkan calon klien langsung ke WhatsApp tim Al-Waliy Sejahtera dengan pesan yang sudah terisi otomatis (nama, kategori produk, budget).

**Live:** https://form.alwaliy-sejahtera.com

## Stack

- HTML + [Tailwind CSS](https://tailwindcss.com/) (utility-first styling)
- TypeScript (validasi form, drag-and-drop upload preview, redirect WhatsApp)
- GitHub Actions untuk CI/CD — build otomatis & deploy ke hosting via FTP setiap push ke `main`

## Struktur project

```
├── index.html          # markup, pakai class Tailwind
├── src/
│   ├── input.css        # @tailwind directives + custom CSS
│   └── script.ts         # logic TypeScript
├── dist/                 # hasil build (auto-generated, jangan diedit manual)
│   ├── style.css
│   └── script.js
├── .github/workflows/
│   └── deploy.yml         # CI/CD: build + deploy otomatis ke Hostinger
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## Development

```bash
npm install
npm run build       # build sekali (menghasilkan dist/style.css & dist/script.js)
npm run watch:css    # auto-rebuild CSS saat file src/input.css berubah
```

## Deployment

Push ke branch `main` akan otomatis men-trigger GitHub Actions untuk:

1. Install dependencies
2. Build project (compile Tailwind CSS + TypeScript)
3. Upload `index.html` + `dist/` ke server via FTP

Kredensial FTP disimpan sebagai GitHub Secrets (`FTP_HOST`, `FTP_USERNAME`, `FTP_PASSWORD`), tidak pernah ditulis langsung di kode.
