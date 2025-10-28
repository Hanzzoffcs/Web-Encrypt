// script.js — Nebula HTML Encryptor (Enhanced Security v3.0 w/ XOR)
// • Encrypt By @Hanzz (Enhanced Security by AI)
// • Key Feature: Simple XOR encryption added before Base64 for better obfuscation.
// • Key: The encryption key is embedded in the loader, but requires the user to know 
//   the XOR decryption step to easily reverse the process.

(() => {
  // -------------------------------------------------------------------
  // CONFIGURATION: SET A STRONG, UNIQUE KEY FOR EACH ENCRYPTION USE
  // -------------------------------------------------------------------
  // WARNING: This key is still visible in the loader script, but it is 
  // necessary for the client-side decryption to work. 
  // It provides better obfuscation than pure Base64.
  const ENCRYPTION_KEY = "hanzz-nebula-v3-secret-key-2025"; 
  // -------------------------------------------------------------------

  // --- DOM Element Selection ---
  const $ = id => document.getElementById(id);
  
  const inputEl = $('input') || $('inputHtml') || document.querySelector('textarea#input, textarea:not([readonly])');
  const outputEl = $('output') || $('result') || document.querySelector('textarea[readonly]') || document.querySelector('textarea#output');
  const btnEncrypt = $('encrypt-btn') || $('btnEncrypt') || $('encryptBtn') || $('btn-encrypt');
  const btnCopy = $('copy-btn') || $('btnCopy') || $('copyBtn');
  const btnClear = $('btnClear') || $('clear-btn') || $('clearBtn');
  let downloadLink = $('downloadLink') || $('dl');
  let currentBlobUrl = null;


  // --- Security Layer: Simple XOR Encryption ---
  // Encrypts/Decrypts a string using a repeating-key XOR cipher.
  const xorCipher = (str, key) => {
    let output = '';
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      output += String.fromCharCode(charCode);
    }
    return output;
  };
  
  const xorEncrypt = (str) => xorCipher(str, ENCRYPTION_KEY);
  const xorDecrypt = (str) => xorCipher(str, ENCRYPTION_KEY);


  // --- Base64 Logic (Now applied to XOR-ed data) ---
  const unicodeToBase64 = str => {
    try { return btoa(unescape(encodeURIComponent(str))); }
    catch { return btoa(str); }
  };

  const escapePayloadForHtml = b64 => b64.replace(/</g, '\\u003c');


  // --- Loader/HTML Builder ---
  function buildLoaderFile(base64Payload) {
    const safePayload = escapePayloadForHtml(base64Payload);
    // The key is passed directly to the loader's script for decryption
    const safeKey = escapePayloadForHtml(ENCRYPTION_KEY);
    
    // Decryption logic inside the loader is now much more complex: Base64 -> XOR
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
<div class="credit">🔒 Encrypt By <b>@Hanzz</b> (Enhanced Security)</div>
<script>
(function(){
  try {
    const payload = "${safePayload}";
    const key = "${safeKey}";

    // 1. Base64 Decode
    const xorEncoded = (function(b64){
      try { return decodeURIComponent(escape(atob(b64))); }
      catch(e) { return atob(b64); }
    })(payload);

    // 2. XOR Decrypt
    let decoded = '';
    for (let i = 0; i < xorEncoded.length; i++) {
      const charCode = xorEncoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      decoded += String.fromCharCode(charCode);
    }

    // 3. Write to document
    document.open();
    document.write(decoded);
    document.close();
  } catch(e) {
    document.body.innerHTML = '<div style="color:#f88;padding:20px">Error: Gagal mendekripsi payload (XOR or Base64 failed).</div>';
    console.error("Decryption Error:", e);
  }
})();
<\/script>
</body>
</html>`;
  }

  // --- Download Functionality (Kept robust from v2) ---
  function getDownloadFilename() {
    const now = new Date();
    const timestamp = [
      now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0'), '_',
      String(now.getHours()).padStart(2, '0'), String(now.getMinutes()).padStart(2, '0'), String(now.getSeconds()).padStart(2, '0')
    ].join('');
    return `protected_xor_${timestamp}.html`;
  }

  function prepareDownloadLink(htmlString) {
    const filename = getDownloadFilename();
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
      (outputEl?.parentNode || document.body).appendChild(downloadLink);
    }
    
    downloadLink.textContent = `⬇️ Download: ${filename}`;
    downloadLink.href = url;
    downloadLink.download = filename;
    downloadLink.style.display = 'inline-block';
    
    downloadLink.onclick = () => setTimeout(() => { try { URL.revokeObjectURL(url); } catch {} }, 2000);
  }

  // --- Handlers ---
  async function encryptHandler() {
    if (!inputEl) return alert('Error: Input element not found.');
    const raw = String(inputEl.value || '');
    if (!raw.trim()) return alert('⚠️ Please enter the HTML code first!');

    const btn = btnEncrypt;
    const prevText = btn?.textContent || 'Encrypt HTML';
    
    if (btn) { btn.disabled = true; btn.textContent = '🛡️ Encrypting & XORing...'; }

    try {
      const normalized = raw.trim();
      
      // NEW STEP 1: Apply XOR Encryption
      const xorEncrypted = xorEncrypt(normalized);
      
      // NEW STEP 2: Apply Base64 Encoding to the XOR result
      const b64 = unicodeToBase64(xorEncrypted);
      
      const loaderHtml = buildLoaderFile(b64);

      if (outputEl) outputEl.value = loaderHtml;
      prepareDownloadLink(loaderHtml);

      outputEl?.focus();
      outputEl?.select?.();

    } catch (err) {
      console.error(err);
      alert('Error during encryption: ' + (err.message || String(err)));
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = prevText; }
    }
  }

  async function copyHandler() {
    if (!outputEl) return alert('Error: Output textarea not found.');
    const text = outputEl.value;
    if (!text) return alert('No result to copy.');

    try {
      await navigator.clipboard.writeText(text);
      alert('✅ Encrypted result copied to clipboard!');
    } catch (e) {
      console.warn("Clipboard API failed, attempting manual selection/copy:", e);
      outputEl.select();
      try {
        document.execCommand('copy');
        alert('✅ Copied (manual selection fallback).');
      } catch (e2) {
        alert('❌ Failed to copy automatically. Please copy the text manually.');
      }
    }
  }

  function clearHandler() {
    inputEl && (inputEl.value = '');
    outputEl && (outputEl.value = '');
    
    if (downloadLink) {
      if (currentBlobUrl) {
          try { URL.revokeObjectURL(currentBlobUrl); } catch {}
          currentBlobUrl = null;
      }
      downloadLink.style.display = 'none';
      downloadLink.href = '#';
    }
  }

  // --- Initialization and Event Attachment ---
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
  } else {
    attach();
  }

  // Expose public API
  window.NebulaEncryptor = { 
    xorEncrypt, xorDecrypt,
    unicodeToBase64, 
    buildLoaderFile, 
    encryptHandler, 
    copyHandler, 
    clearHandler 
  };
})();
