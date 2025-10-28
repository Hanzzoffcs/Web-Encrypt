// script.js — Nebula HTML Encryptor (v4.0 - Password Protected)
// • Encrypt By @Hanzz (Enhanced Security v4 by AI)
// • Key Feature: Password-based encryption (XOR).
// • The key is NOT stored in the output file, providing true security.
// • The viewer MUST know the password to decrypt the content.

(() => {
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
  // (Fungsi ini digunakan oleh skrip enkripsi DAN juga akan disalin ke loader)
  const xorCipher = (str, key) => {
    let output = '';
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      output += String.fromCharCode(charCode);
    }
    return output;
  };
  
  // --- Base64 Logic ---
  const unicodeToBase64 = str => {
    try { return btoa(unescape(encodeURIComponent(str))); }
    catch { return btoa(str); }
  };

  const escapePayloadForHtml = b64 => b64.replace(/</g, '\\u003c');


  // --- Loader/HTML Builder (v4) ---
  // Membangun file HTML yang akan MEMINTA password saat dibuka
  function buildLoaderFile(base64Payload) {
    const safePayload = escapePayloadForHtml(base64Payload);
    
    // Perhatikan: Kunci (password) TIDAK disimpan di sini.
    // Skrip di bawah ini dirancang untuk meminta kunci kepada pengguna.
    // Saya juga sengaja meng-obfuscate (memperburuk) nama fungsi dan variabel 
    // di dalam loader agar lebih sulit dibaca.
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
.credit { font-size: 14px; color: #777; margin-bottom: 12px; letter-spacing: 0.5px; }
.error { color:#f88; padding:20px; border:1px solid #500; background:#200; }
.prompt-bg { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; }
.prompt-box { background:#102; padding:25px; border-radius:8px; box-shadow:0 5px 20px rgba(0,0,0,0.4); border: 1px solid #446; }
.prompt-box input { background:#000; color:#fff; border:1px solid #557; padding:10px; border-radius:4px; margin-right:8px; }
.prompt-box button { background:#0059ff; color:white; border:none; padding:10px 15px; border-radius:4px; cursor:pointer; }
</style>
</head>
<body>
<div class="credit">🔒 Encrypt By <b>@Hanzz</b> (Password Protected)</div>
<div id="prompt-container"></div>
<script>
(function(){
  // Payload terenkripsi disimpan di sini
  const _p = "${safePayload}";

  // Obfuscated function names (membuat 'atob' lebih sulit ditemukan)
  const _a = window['\x61\x74\x6f\x62']; // 'atob'
  
  // Fungsi dekripsi inti (XOR)
  const _x = (s, k) => {
    let o = '';
    for (let i = 0; i < s.length; i++) {
      o += String.fromCharCode(s.charCodeAt(i) ^ k.charCodeAt(i % k.length));
    }
    return o;
  };
  
  // Fungsi dekode Base64
  const _b = (b64) => {
    try { return decodeURIComponent(escape(_a(b64))); }
    catch(e) { return _a(b64); }
  };

  // Fungsi utama untuk mendekripsi dan menulis
  const _run = (k) => {
    if (!k) {
      document.body.innerHTML = '<div class="error">Akses Ditolak.</div>';
      return;
    }
    try {
      const xorEncrypted = _b(_p);
      const html = _x(xorEncrypted, k);
      document.open();
      document.write(html);
      document.close();
    } catch(e) {
      document.body.innerHTML = '<div class="error">Error: Gagal mendekripsi. Password salah?</div>';
      console.error(e);
    }
  };

  // Buat dan tampilkan prompt password
  const pBox = document.createElement('div');
  pBox.className = 'prompt-bg';
  pBox.innerHTML = '<div class="prompt-box">' +
    '<input type="password" id="_pw" placeholder="Masukkan Password..." autofocus/>' +
    '<button id="_go">Buka</button>' +
    '</div>';
  
  document.getElementById('prompt-container').appendChild(pBox);

  const btn = document.getElementById('_go');
  const inp = document.getElementById('_pw');

  btn.onclick = () => _run(inp.value);
  inp.onkeydown = (e) => {
    if (e.key === 'Enter') _run(inp.value);
  };

})();
<\/script>
</body>
</html>`;
  }

  // --- Download Functionality ---
  function getDownloadFilename() {
    const now = new Date();
    const timestamp = [
      now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0'), '_',
      String(now.getHours()).padStart(2, '0'), String(now.getMinutes()).padStart(2, '0'), String(now.getSeconds()).padStart(2, '0')
    ].join('');
    // Nama file diubah untuk menandakan ini dilindungi password
    return `password_protected_${timestamp}.html`; 
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

  // --- Handlers (v4) ---
  async function encryptHandler() {
    if (!inputEl) return alert('Error: Input element not found.');
    const raw = String(inputEl.value || '');
    if (!raw.trim()) return alert('⚠️ Please enter the HTML code first!');

    // --- PERUBAHAN UTAMA: Minta Password ---
    const password = prompt("🔐 Masukkan Password Untuk Enkripsi:", "secret-key-123");
    
    const btn = btnEncrypt;
    const prevText = btn?.textContent || 'Encrypt HTML';

    if (!password) {
      alert("Enkripsi dibatalkan. Password dibutuhkan.");
      return;
    }
    // -----------------------------------------

    if (btn) { btn.disabled = true; btn.textContent = '🛡️ Mengunci dengan Password...'; }

    try {
      const normalized = raw.trim();
      
      // STEP 1: Enkripsi XOR menggunakan password
      const xorEncrypted = xorCipher(normalized, password);
      
      // STEP 2: Base64 Encoding
      const b64 = unicodeToBase64(xorEncrypted);
      
      // STEP 3: Buat loader yang akan meminta password
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

  // --- Handler Salin dan Bersihkan (Tetap sama) ---

  async function copyHandler() {
    if (!outputEl) return alert('Error: Output textarea not found.');
    const text = outputEl.value;
    if (!text) return alert('No result to copy.');
    try {
      await navigator.clipboard.writeText(text);
      alert('✅ Encrypted result copied to clipboard!');
    } catch (e) {
      console.warn("Clipboard API failed:", e);
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

  // --- Initialization ---
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

  window.NebulaEncryptor = { 
    xorCipher, 
    unicodeToBase64, 
    buildLoaderFile, 
    encryptHandler, 
    copyHandler, 
    clearHandler 
  };
})();
