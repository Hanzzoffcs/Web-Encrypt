// script.js — Nebula HTML Encryptor (v7.0 - Anti-AI Disruptor)
// • Encrypt By @Hanzz (Ultimate Protection v7 by AI)
// • Key Feature: Anti-Debugging loop and complex String Array Hiding 
//   to severely disrupt automated AI analysis and human debugging.

(() => {
  // -------------------------------------------------------------------
  // CONFIGURATION: SECRET KEY & EMOJI SET
  // -------------------------------------------------------------------
  // Kunci Rahasia
  const SECRET_KEY = "Hanzz-Nebula-Anti-AI-Key-2028-v7!@#"; 
  
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


  /**
   * FUNGSI OBFUSCATION DISRUPTIF (V7)
   */
  function buildDisruptiveDecryptionScript(key, payload) {
    // 1. Array String Hiding: Sembunyikan semua fungsi penting
    const MAGIC_FUNCTIONS = [
      'atob', // 0
      'eval', // 1
      'write', // 2
      'charCodeAt', // 3
      'String.fromCharCode', // 4
      'decodeURIComponent', // 5
      'escape', // 6
    ];
    
    // 2. Kunci Obfuscation: Buat kunci dari operasi string acak
    const dynamicKey = key.split('').reverse().join(''); // Reverse key
    const keyMaker = `window['\\x62\\x74\\x6f\\x61']('${dynamicKey}').split('').reverse().join('').substring(1, ${key.length+1})`;

    // 3. Payload Array Hiding
    const chunkSize = 20;
    const payloadChunks = [];
    for (let i = 0; i < payload.length; i += chunkSize) {
      payloadChunks.push(payload.substring(i, i + chunkSize));
    }

    const payloadConstructor = `[${payloadChunks.map(c => `'${c}'`).join(', ')}].join('')`;

    // 4. Skrip Dekripsi Inti (sangat di-obfuscate)
    const rawDecryptor = `
      const F = ['${MAGIC_FUNCTIONS.join("','")}']; // Array fungsi tersembunyi
      const P = ${payloadConstructor};
      const K = ${keyMaker}; // Kunci dibangun di sini
      
      // Anti-Debugging Loop (Mengganggu Konsol Debugger)
      (function() {
          let i = 0; while (i < 10) { i++; debugger; } 
          i = 0; while (i < 5) { i++; console.log(new Date()); }
      })();

      // XOR Cipher (Menggunakan Array Hiding)
      const X = (s, c) => {
        let o = '';
        for (let i = 0; i < s.length; i++) {
          o += window[F[4].split('.')[0]][F[4].split('.')[1]]((s[F[3]](i) ^ c[F[3]](i % c.length)));
        }
        return o;
      };
      
      // Base64 Decoder
      const B = (b) => {
        try { 
          return window[F[5]](window[F[6]](window[F[0]](b))); 
        }
        catch(e) { return window[F[0]](b); }
      };

      try {
        const xorEnc = B(P);
        const html = X(xorEnc, K.substring(1)); // Potong 1 karakter dari awal untuk menghilangkan base64 artifak
        document.open();
        document[F[2]](html);
        document.close();
      } catch(e) {
        document.body.innerHTML = '<div style="color:#f88;padding:20px">E-001: Protection Active.</div>';
      }
    `;
    
    // 5. Final Obfuscation: Base64 + Eval (Menggunakan Array Hiding)
    const b64_obfuscated = btoa(unescape(encodeURIComponent(rawDecryptor)));
    
    // Gunakan 'eval' yang di-obfuscate
    return `
      (function(){
        try {
          const S='${b64_obfuscated}';
          const F=['atob', 'eval'];
          window[F[1]](window[F[0]](S));
        } catch(e) {
          document.body.innerHTML = '<div style="color:#f88;padding:20px">E-002: Shield Active.</div>';
        }
      })();
    `;
  }

  // --- Loader/HTML Builder (v7) ---
  function buildLoaderFile(base64Payload) {
    const safePayload = escapePayloadForHtml(base64Payload);
    
    const obfuscatedScript = buildDisruptiveDecryptionScript(SECRET_KEY, safePayload);

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
<div class="credit">🔒 Encrypt By <b>@Hanzz</b> (Anti-AI Disruptor)</div>
<script>
${obfuscatedScript}
<\/script>
</body>
</html>`;
  }

  // --- Handler dan Utilities (Dibiarkan sama) ---

  function getDownloadFilename() {
    const now = new Date();
    const timestamp = [
      now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0'), '_',
      String(now.getHours()).padStart(2, '0'), String(now.getMinutes()).padStart(2, '0'), String(now.getSeconds()).padStart(2, '0')
    ].join('');
    return `protected_anti_ai_${timestamp}.html`; 
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

    if (btn) { btn.disabled = true; btn.textContent = '🛡️ Applying Anti-AI Shield...'; }

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
