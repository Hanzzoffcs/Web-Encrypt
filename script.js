// script.js — Nebula HTML Encryptor (refactor & lebih robust)
// - Safe unicode <-> base64
// - Build downloadable encrypted HTML (loader) that does document.write(decoded)
// - Copy to clipboard with modern API + fallback
// - Graceful UI (disable button while processing), safe escaping, revoke blob urls on unload

(() => {
  // helper selector supporting multiple possible IDs
  const $ = id => document.getElementById(id);

  // Find elements (support multiple ID variants)
  const inputEl = $('input') || $('inputHtml') || document.querySelector('textarea#input') || document.querySelector('textarea');
  const outputEl = $('output') || $('result') || document.querySelector('textarea[readonly]') || null;
  const btnEncrypt = $('encrypt-btn') || $('btnEncrypt') || $('encryptBtn') || $('btn-encrypt') || null;
  const btnCopy = $('copy-btn') || $('btnCopy') || $('copyBtn') || null;
  const btnClear = $('btnClear') || $('clear-btn') || null;
  let downloadLink = $('downloadLink') || $('dl') || null;

  // keep track of created blob URL to revoke later
  let currentBlobUrl = null;

  // Convert unicode string -> base64 safely
  function unicodeToBase64(str) {
    try {
      return btoa(unescape(encodeURIComponent(str)));
    } catch (e) {
      // fallback: try simple btoa
      return btoa(str);
    }
  }

  // base64 -> unicode
  function base64ToUnicode(b64) {
    try {
      return decodeURIComponent(escape(atob(b64)));
    } catch (e) {
      return atob(b64);
    }
  }

  // Escape `<` to avoid closing tags being injected into loader template
  function makeSafePayload(b64) {
    return b64.replace(/</g, '\\u003c');
  }

  // Build the loader HTML that will decode payload and document.write it
  function buildLoaderFile(base64Payload) {
    const safePayload = makeSafePayload(base64Payload);
    return `<!doctype html>
<html lang="id"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Protected Page</title>
<style>body{background:#050014;color:#eaf0ff;font-family:Inter,system-ui;padding:28px}</style>
</head><body>
<script>
(function(){
  try{
    const payload = "${safePayload}";
    const decoded = (function(){ try { return decodeURIComponent(escape(atob(payload))); } catch(e) { return atob(payload); } })();
    document.open();
    document.write(decoded);
    document.close();
  }catch(e){
    document.body.innerHTML = '<div style="color:#f88;padding:20px">Error: gagal mendekripsi/men-parse payload.</div>';
    console.error(e);
  }
})();
<\/script>
</body></html>`;
  }

  // Create or update a download link for the loader HTML
  function prepareDownloadLink(htmlString, filename = 'encrypted.html') {
    // revoke previous
    if (currentBlobUrl) {
      try { URL.revokeObjectURL(currentBlobUrl); } catch (e) {}
      currentBlobUrl = null;
    }

    const blob = new Blob([htmlString], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    currentBlobUrl = url;

    if (!downloadLink) {
      // create anchor and append after output element if possible, otherwise to body
      downloadLink = document.createElement('a');
      downloadLink.id = 'downloadLink';
      downloadLink.style.display = 'inline-block';
      downloadLink.style.marginLeft = '12px';
      downloadLink.textContent = `Download ${filename}`;
      downloadLink.download = filename;
      if (outputEl && outputEl.parentNode) {
        outputEl.parentNode.insertBefore(downloadLink, outputEl.nextSibling);
      } else {
        document.body.appendChild(downloadLink);
      }
    }

    downloadLink.href = url;
    downloadLink.download = filename;
    downloadLink.style.display = 'inline-block';
    // revoke when clicked shortly after
    downloadLink.onclick = () => setTimeout(() => { try { URL.revokeObjectURL(url); } catch (e) {} }, 2000);
    return downloadLink;
  }

  // Encrypt handler
  async function encryptHandler() {
    if (!inputEl) return alert('Input element tidak ditemukan di halaman.');
    const raw = String(inputEl.value || '');

    if (!raw.trim()) {
      alert('⚠️ Masukkan dulu kode HTML-nya!');
      return;
    }

    // disable button UI if available
    const btn = btnEncrypt;
    const prevText = btn ? btn.textContent : null;
    if (btn) { btn.disabled = true; btn.textContent = '🔄 Encrypting...'; }

    try {
      // normalize / optional minify: trim
      const normalized = raw.trim();

      // create base64 payload
      const b64 = unicodeToBase64(normalized);

      // build loader file
      const loaderHtml = buildLoaderFile(b64);

      // output to textarea if present
      if (outputEl) outputEl.value = loaderHtml;

      // prepare download link
      prepareDownloadLink(loaderHtml);

      // focus output for convenience
      if (outputEl) { outputEl.focus(); outputEl.select && outputEl.select(); }

    } catch (err) {
      console.error(err);
      alert('Error saat enkripsi: ' + (err && err.message ? err.message : err));
    } finally {
      // restore button
      if (btn) { btn.disabled = false; btn.textContent = prevText || 'Encrypt HTML'; }
    }
  }

  // Copy handler (modern + fallback)
  async function copyHandler() {
    if (!outputEl) {
      alert('Tidak ada hasil untuk disalin (textarea output tidak ditemukan).');
      return;
    }
    const text = outputEl.value || '';
    if (!text) { alert('Tidak ada hasil untuk disalin'); return; }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        alert('✅ Hasil terenkripsi disalin ke clipboard!');
      } else {
        // fallback
        outputEl.select();
        document.execCommand('copy');
        alert('✅ Disalin (fallback)');
      }
    } catch (e) {
      try { outputEl.select(); document.execCommand('copy'); alert('✅ Disalin (fallback)'); }
      catch (err) { console.error(err); alert('Gagal menyalin ke clipboard'); }
    }
  }

  // Clear handler
  function clearHandler() {
    if (inputEl) inputEl.value = '';
    if (outputEl) outputEl.value = '';
    if (downloadLink) {
      try { URL.revokeObjectURL(downloadLink.href); } catch (e) {}
      downloadLink.style.display = 'none';
    }
  }

  // Attach listeners
  function attach() {
    if (btnEncrypt) btnEncrypt.addEventListener('click', encryptHandler);
    if (btnCopy) btnCopy.addEventListener('click', copyHandler);
    if (btnClear) btnClear.addEventListener('click', clearHandler);

    // keyboard shortcut: Ctrl+Enter to encrypt (if textarea focused)
    if (inputEl) {
      inputEl.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
          e.preventDefault();
          encryptHandler();
        }
      });
    }

    // revoke blob url on page unload to free memory
    window.addEventListener('beforeunload', () => {
      if (currentBlobUrl) {
        try { URL.revokeObjectURL(currentBlobUrl); } catch (e) {}
      }
    });
  }

  // Run attach on DOMContentLoaded (if DOM already loaded, attach immediately)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attach);
  } else {
    attach();
  }

  // expose functions for debugging if needed
  window.NebulaEncryptor = {
    unicodeToBase64,
    base64ToUnicode,
    buildLoaderFile,
    encryptHandler,
    copyHandler,
    clearHandler
  };
})();
