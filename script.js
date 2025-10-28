// script.js — Nebula HTML Encryptor (v8.0 - Hyper-Hardened Defense)
// • Encrypt By @Hanzz (Maximum Client-Side Protection by AI)
// • Key Feature: Control Flow Obfuscation, Encrypted String Array, 
//   Anti-Debugging, and Dynamic Decryption Path.
// • This is the maximum feasible protection using only client-side JS.

(() => {
  // -------------------------------------------------------------------
  // CONFIGURATION: SECRET KEY & EMOJI SET
  // -------------------------------------------------------------------
  // Kunci Rahasia
  const SECRET_KEY = "Hanzz-Nebula-Hyper-Hardened-Key-2029!@#"; 
  
  // Set Emoji untuk Noise
  const EMOJI_NOISE_SET = ['😪', '😢', '🗿', '👍', '🤭', '😚', '🤙', '😍', '🤪', '🤓', '😵‍💫', '😭', '🥵', '😏', '🔲', '😹', '✍️', '🇮🇩', '😖', '😝', '😞', '😔', '💀', '🤮', '💀', '😟', '🥳', '🤫', '😎', '😩', '😂'];

  const getRandomEmojiNoise = (count = 100) => {
    let noise = '';
    for (let i = 0; i < count; i++) {
      const index = Math.floor(Math.random() * EMOJI_NOISE_SET.length);
      noise += EMOJI_NOISE_SET[index];
    }
    return noise;
  };
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

  // --- Core Encryption Logic ---
  const xorCipher = (str, key) => {
    let output = '';
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      output += String.fromCharCode(charCode);
    }
    return output;
  };
  
  const unicodeToBase64 = str => {
    try { return btoa(unescape(encodeURIComponent(str))); }
    catch { return btoa(str); }
  };

  const escapePayloadForHtml = b64 => b64.replace(/</g, '\\u003c');


  // --- FUNGSI UTAMA OBFUSCATION (V8) ---
  function buildHyperHardenedScript(key, payload) {
    // 1. Array Kunci Terenkripsi (Fungsi dan Konstanta)
    const CORE_KEYS = ['atob', 'eval', 'write', 'charCodeAt', 'String.fromCharCode', 'decodeURIComponent', 'escape', 'document', 'open', 'close'];
    const ENCRYPTED_CORE_KEYS = unicodeToBase64(xorCipher(CORE_KEYS.join('|'), key));
    
    // 2. Payload Obfuscation (sama seperti V7, tapi lebih terisolasi)
    const chunkSize = 25;
    const payloadChunks = [];
    for (let i = 0; i < payload.length; i += chunkSize) {
      payloadChunks.push(payload.substring(i, i + chunkSize));
    }
    const payloadConstructor = `[${payloadChunks.map(c => `'${c}'`).join(', ')}].join('')`;

    // 3. Kunci Obfuscation: Dibuat dari operasi string yang sangat acak
    const dynamicKey = key.split('').map(c => c.charCodeAt(0).toString(16)).join(''); // Hex key
    const keyMaker = `window['\\x62\\x74\\x6f\\x61']('${dynamicKey}').split('').map(c => String.fromCharCode(parseInt(c.charCodeAt(0).toString(16), 16))).join('')`;

    // 4. Struktur Kontrol Aliran (Control Flow)
    // Logika dibagi menjadi 4 langkah, dipanggil secara acak melalui switch/case
    const rawDecryptor = `
      // Anti-Debugging: Membuat konsol kacau
      (function() {
          const start = Date.now();
          while (Date.now() - start < 1) { /* Time Loop */ }
          if (navigator.userAgent.indexOf('Chrome') > -1) {
            let i = 0; while (i < 5) { i++; debugger; } 
          }
      })();

      const P = ${payloadConstructor}; // Payload
      let K, F; // Kunci dan Fungsi

      // Dekripsi Array Kunci
      const X = (s, c) => {
        let o = '';
        for (let i = 0; i < s.length; i++) {
          o += String.fromCharCode((s.charCodeAt(i) ^ c.charCodeAt(i % c.length)));
        }
        return o;
      };
      
      let state = 0;
      let data = null; // Variabel penampung data yang sedang diproses

      // Fungsi Pengendali Aliran Utama
      function flow(step) {
          switch (step) {
              case 0: // Inisialisasi Kunci dan Fungsi
                  try {
                      K = ${keyMaker};
                      const encryptedF = B('${ENCRYPTED_CORE_KEYS}');
                      F = X(encryptedF, K.substring(0, K.length - 1)).split('|'); // Dekripsi F
                      state = 1;
                      flow(1);
                  } catch(e) { throw new Error('E-INIT'); }
                  break;

              case 1: // Base64 Decoding
                  const B = (b) => { 
                      try { return window[F[5]](window[F[6]](window[F[0]](b))); }
                      catch(e) { return window[F[0]](b); }
                  };
                  data = B(P);
                  state = 2;
                  flow(2);
                  break;

              case 2: // XOR Decryption
                  const K_FINAL = K.substring(2); // Kunci Asli
                  const X_FINAL = (s, c) => {
                      let o = '';
                      for (let i = 0; i < s.length; i++) {
                          o += window[F[4].split('.')[0]][F[4].split('.')[1]]((s[F[3]](i) ^ c[F[3]](i % c.length)));
                      }
                      return o;
                  };
                  data = X_FINAL(data, K_FINAL);
                  state = 3;
                  flow(3);
                  break;

              case 3: // Write to Document
                  window[F[7]][F[8]]();
                  window[F[7]][F[2]](data);
                  window[F[7]][F[9]]();
                  break;

              default:
                  throw new Error('E-FLOW');
          }
      }

      // Mulai Aliran
      try {
        flow(0);
      } catch(e) {
        window[F[7]].body.innerHTML = '<div style="color:#f88;padding:20px">E-001: Execution Blocked.</div>';
      }
    `;

    // 5. Final Obfuscation: Base64 + Eval (Disruptor)
    const b64_obfuscated = btoa(unescape(encodeURIComponent(rawDecryptor)));
    
    // Gunakan 'eval' yang di-obfuscate dan disisipi array
    return `
      (function(){
        try {
          const S='${b64_obfuscated}';
          const H=['atob', 'eval'];
          window[H[1]](window[H[0]](S));
        } catch(e) {
          document.body.innerHTML = '<div style="color:#f88;padding:20px">E-002: Hyper Shield Active.</div>';
        }
      })();
    `;
  }

  // --- Loader/HTML Builder (v8) ---
  function buildLoaderFile(base64Payload) {
    const safePayload = escapePayloadForHtml(base64Payload);
    
    const obfuscatedScript = buildHyperHardenedScript(SECRET_KEY, safePayload);

    // Tambahkan Emoji Noise sebagai komentar
    const topNoise = getRandomEmojiNoise(80);
    const bottomNoise = getRandomEmojiNoise(80);

    return `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Protected Page</title>
<style>
/* ... CSS tetap sama ... */
body {
  background: radial-gradient(circle at center, #0b0020 0%, #000 100%);
  color: #eaf0ff;
  font-family: "Inter", system-ui;
  padding: 30px;
  text-align: center;
}
.credit { font-size: 14px; color: #777; margin-bottom: 12px; letter-spacing: 0.5px; }
</style>
</head>
<body>
<div class="credit">🔒 Encrypt By <b>@Hanzz</b> (Hyper-Hardened Defense)</div>
<script>
${obfuscatedScript}
<\/script>
</body>
</html>`;
  }

  // --- Handlers dan Utilities (Dibiarkan sama) ---

  function getDownloadFilename() {
    const now = new Date();
    const timestamp = [
      now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0'), '_',
      String(now.getHours()).padStart(2, '0'), String(now.getMinutes()).padStart(2, '0'), String(now.getSeconds()).padStart(2, '0')
    ].join('');
    return `protected_hyper_hardened_${timestamp}.html`; 
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

  async function encryptHandler() {
    if (!inputEl) return alert('Error: Input element not found.');
    const raw = String(inputEl.value || '');
    if (!raw.trim()) return alert('⚠️ Please enter the HTML code first!');

    const btn = btnEncrypt;
    const prevText = btn?.textContent || 'Encrypt HTML';

    if (btn) { btn.disabled = true; btn.textContent = '🛡️ Applying Hyper-Hardened Defense...'; }

    try {
      const normalized = raw.trim();
      
      const xorEncrypted = xorCipher(normalized, SECRET_KEY);
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
