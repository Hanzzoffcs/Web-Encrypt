// script.js — Nebula HTML Encryptor (Enhanced w/ Credits)
// • Encrypt By @Hanzz
// • Unicode-safe Base64 builder + downloadable loader + clipboard + memory cleanup
// • Compatible even if other JS (like medsos.js) is loaded

(() => {
  const $ = id => document.getElementById(id);

  const inputEl = $('input') || $('inputHtml') || document.querySelector('textarea#input') || document.querySelector('textarea');
  const outputEl = $('output') || $('result') || document.querySelector('textarea[readonly]');
  const btnEncrypt = $('encrypt-btn') || $('btnEncrypt') || $('encryptBtn') || $('btn-encrypt');
  const btnCopy = $('copy-btn') || $('btnCopy') || $('copyBtn');
  const btnClear = $('btnClear') || $('clear-btn');
  let downloadLink = $('downloadLink') || $('dl');
  let currentBlobUrl = null;

  const unicodeToBase64 = str => {
    try { return btoa(unescape(encodeURIComponent(str))); }
    catch { return btoa(str); }
  };

  const base64ToUnicode = b64 => {
    try { return decodeURIComponent(escape(atob(b64))); }
    catch { return atob(b64); }
  };

  const makeSafePayload = b64 => b64.replace(/</g, '\\u003c');

  // build loader HTML + credit banner
  function buildLoaderFile(base64Payload) {
    const safePayload = makeSafePayload(base64Payload);
    return `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Protected Page</title>
<style>
body {
  background: radial-gradient(circle at center, #0b0020 0%, #000 100%);
  color: #eaf0ff;
  font-family: "Inter", system-ui;
  padding: 30px;
  text-align: center;
}
.credit {
  font-size: 14px;
  color: #777;
  margin-bottom: 12px;
  letter-spacing: 0.5px;
}
</style>
</head>
<body>
<div class="credit">🔒 Encrypt By <b>@Hanzz</b></div>
<script>
(function(){
  try {
    const payload = "${safePayload}";
    const decoded = (function(){
      try { return decodeURIComponent(escape(atob(payload))); }
      catch(e) { return atob(payload); }
    })();
    document.open();
    document.write(decoded);
    document.close();
  } catch(e) {
    document.body.innerHTML = '<div style="color:#f88;padding:20px">Error: gagal mendekripsi payload.</div>';
    console.error(e);
  }
})();
<\/script>
</body>
</html>`;
  }

  function prepareDownloadLink(htmlString, filename = 'encrypted.html') {
    if (currentBlobUrl) {
      try { URL.revokeObjectURL(currentBlobUrl); } catch {}
      currentBlobUrl = null;
    }
    const blob = new Blob([htmlString], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    currentBlobUrl = url;

    if (!downloadLink) {
      downloadLink = document.createElement('a');
      downloadLink.id = 'downloadLink';
      downloadLink.textContent = `Download ${filename}`;
      downloadLink.style.display = 'inline-block';
      downloadLink.style.marginLeft = '12px';
      downloadLink.download = filename;
      (outputEl?.parentNode || document.body).appendChild(downloadLink);
    }

    downloadLink.href = url;
    downloadLink.download = filename;
    downloadLink.style.display = 'inline-block';
    downloadLink.onclick = () => setTimeout(() => { try { URL.revokeObjectURL(url); } catch {} }, 2000);
  }

  async function encryptHandler() {
    if (!inputEl) return alert('Input element tidak ditemukan.');
    const raw = String(inputEl.value || '');
    if (!raw.trim()) return alert('⚠️ Masukkan dulu kode HTML-nya!');

    const btn = btnEncrypt;
    const prevText = btn?.textContent;
    if (btn) { btn.disabled = true; btn.textContent = '🔄 Encrypting...'; }

    try {
      const normalized = raw.trim();
      const b64 = unicodeToBase64(normalized);
      const loaderHtml = buildLoaderFile(b64);

      if (outputEl) outputEl.value = loaderHtml;
      prepareDownloadLink(loaderHtml);
      outputEl?.focus();
      outputEl?.select?.();

    } catch (err) {
      console.error(err);
      alert('Error saat enkripsi: ' + (err.message || err));
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = prevText || 'Encrypt HTML'; }
    }
  }

  async function copyHandler() {
    if (!outputEl) return alert('Textarea output tidak ditemukan.');
    const text = outputEl.value;
    if (!text) return alert('Tidak ada hasil untuk disalin.');

    try {
      await navigator.clipboard.writeText(text);
      alert('✅ Hasil terenkripsi disalin ke clipboard!');
    } catch {
      outputEl.select();
      document.execCommand('copy');
      alert('✅ Disalin (fallback)');
    }
  }

  function clearHandler() {
    inputEl && (inputEl.value = '');
    outputEl && (outputEl.value = '');
    if (downloadLink) {
      try { URL.revokeObjectURL(downloadLink.href); } catch {}
      downloadLink.style.display = 'none';
    }
  }

  function attach() {
    btnEncrypt?.addEventListener('click', encryptHandler);
    btnCopy?.addEventListener('click', copyHandler);
    btnClear?.addEventListener('click', clearHandler);
    inputEl?.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        encryptHandler();
      }
    });
    window.addEventListener('beforeunload', () => {
      if (currentBlobUrl) try { URL.revokeObjectURL(currentBlobUrl); } catch {}
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attach);
  } else attach();

  window.NebulaEncryptor = { unicodeToBase64, base64ToUnicode, buildLoaderFile, encryptHandler, copyHandler, clearHandler };
})();
