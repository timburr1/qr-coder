import { useState } from 'react'
import QRCode from 'qrcode'
import './App.css'

/** Prepend https:// if the user typed a bare domain (e.g. "example.com"). */
function normalizeUrl(raw: string): string {
  const trimmed = raw.trim()
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

function isLikelyUrl(raw: string): boolean {
  try {
    const url = new URL(normalizeUrl(raw))
    return /^https?:$/.test(url.protocol) && url.hostname.includes('.')
  } catch {
    return false
  }
}

function App() {
  const [value, setValue] = useState('')
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()

    if (!value.trim()) {
      setError('Enter a URL first.')
      setQrDataUrl(null)
      return
    }
    if (!isLikelyUrl(value)) {
      setError("That doesn't look like a valid URL.")
      setQrDataUrl(null)
      return
    }

    const target = normalizeUrl(value)

    try {
      const dataUrl = await QRCode.toDataURL(target, {
        width: 320,
        margin: 2,
        errorCorrectionLevel: 'M',
      })
      setQrDataUrl(dataUrl)
      setError(null)
    } catch {
      setError('Could not generate a QR code for that input.')
      setQrDataUrl(null)
    }
  }

  function handleDownload() {
    if (!qrDataUrl) return
    const link = document.createElement('a')
    link.href = qrDataUrl
    link.download = 'qr-code.png'
    link.click()
  }

  return (
    <main className="page">
      <div className="card">
        <h1>QR Coder</h1>
        <p className="subtitle">Paste a URL, get a QR code.</p>

        <form onSubmit={handleGenerate} className="form">
          <input
            type="text"
            inputMode="url"
            autoComplete="url"
            autoFocus
            placeholder="example.com or https://example.com/page"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            aria-label="URL to encode"
          />
          <button type="submit">Generate</button>
        </form>

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}

        {qrDataUrl && (
          <div className="result">
            <img src={qrDataUrl} alt={`QR code for ${normalizeUrl(value)}`} width={320} height={320} />
            <button type="button" className="secondary" onClick={handleDownload}>
              Download PNG
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

export default App
