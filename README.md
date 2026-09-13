# QR Coder

A small React + Vite app: paste a URL, get a QR code. The QR code is generated
entirely in the browser (via the [`qrcode`](https://www.npmjs.com/package/qrcode)
package), so there's no backend/API needed — it deploys as a pure static site.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output goes to `dist/`.
