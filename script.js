// script.js — Nebula HTML Encryptor (v6.0 - Emoji Noise + Ultra Obfuscation)
// • Encrypt By @Hanzz (Ultimate Protection v6 by AI)
// • Key Feature: Multi-layer protection (XOR + Base64 + Heavy JS Obfuscation) 
//   PLUS Emoji Noise for visual disruption.
// • The resulting loader file will look like random garbage mixed with emojis, 
//   making automated analysis extremely difficult.

(() => {
  // -------------------------------------------------------------------
  // CONFIGURATION: SECRET KEY & EMOJI SET
  // -------------------------------------------------------------------
  // Kunci Rahasia
  const SECRET_KEY = "Hanzz-Nebula-Ultimate-Key-2027-v6!!!";
  
  // Set Emoji untuk Noise (diambil dari permintaan user)
  const EMOJI_NOISE_SET = ['😪', '😢', '🗿', '👍', '🤭', '😚', '🤙', '😍', '🤪', '🤓', '😵‍💫', '😭', '🥵', '😏', '🔲', '😹', '✍️', '🇮🇩', '😖', '😝', '😞', '😔', '💀', '🤮', '💀', '😟', '🥳', '🤫', '😎', '😩', '😂'];

  // Fungsi utilitas untuk menghasilkan noise acak
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
   * FUNGSI OBFUSCATION ULTIMATE (V6)
   * Menghasilkan kode dekripsi yang sangat diacak dan disisipi emoji.
   * @param {string} key Kunci enkripsi
   * @param {string} payload Payload Base64 terenkripsi
   * @returns {string} Kode JS yang sangat di-obfuscate dan berisik
   */
  function buildObfuscatedDecryptionScript(key, payload) {
    const K = `'${key}'`;
    
    // Pecah Payload menjadi potongan kecil (misalnya, 20 karakter)
    const chunkSize = 20;
    const payloadChunks = [];
    for (let i = 0; i < payload.length; i += chunkSize) {
      payloadChunks.push(payload.substring(i, i + chunkSize));
    }

    // Gabungkan potongan dengan noise emoji
    const noiseJoinedPayload = payloadChunks.map(chunk => {
      // Sisipkan 1-3 emoji acak di antara setiap potongan payload
      const noise = EMOJI_NOISE_SET[Math.floor(Math.random() * EMOJI_NOISE_SET.length)];
      return `'${chunk}' + '${noise}'`; 
    }).join(' + ');
    
    // Potongan terakhir harus dihilangkan noise-nya, jadi tambahkan + ''
    const payloadArrayJoiner = `(${noiseJoinedPayload} + '').replace(/[${EMOJI_NOISE_SET.join('')}]/g, '')`;

    // Skrip Dekripsi Inti (tetap di-obfuscate untuk menghindari deteksi)
    const rawDecryptor = `
      const K=${K};
      const P=${payloadArrayJoiner};
      
      const X = (s, c) => {
        let o = '';
        for (let i = 0; i < s.length; i++) {
          o += String.fromCharCode((s.charCodeAt(i) ^ c.charCodeAt(i % c.length)));
        }
        return o;
      };
      
      const B = (b) => {
        try { return decodeURIComponent(escape(atob(b))); }
        catch(e) { return atob(b); }
      };

      try {
        const xorEnc = B(P);
        const html = X(xorEnc, K);
        document.open();
        document.write(html);
        document.close();
      } catch(e) {
        document.body.innerHTML = '<div style="color:#f88;padding:20px">E-001: Decryption Failed.</div>';
      }
    `;
    
    // Final Obfuscation: Base64 + Eval
    const b64_obfuscated = btoa(unescape(encodeURIComponent(rawDecryptor)));
    
    // Gunakan 'eval' yang di-obfuscate
    return `
      (function(){
        try {
          const S='${b64_obfuscated}';
          window['\\x65\\x76\\x61\\x6c'](window['\\x61\\x74\\x6f\\x62'](S));
        } catch(e) {
          document.body.innerHTML = '<div style="color:#f88;padding:20px">E-002: Loader Failed.</div>';
        }
      })();
    `;
  }

  // --- Loader/HTML Builder (v6) ---
  function buildLoaderFile(base64Payload) {
    const safePayload = escapePayloadForHtml(base64Payload);
    
    const obfuscatedScript = buildObfuscatedDecryptionScript(SECRET_KEY, safePayload);

    // Tambahkan Emoji Noise sebagai komentar di luar skrip.
    const topNoise = getRandomEmojiNoise(80);
    const bottomNoise = getRandomEmojiNoise(80);

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
</style>
</head>
<body>
<div class="credit">🔒 Encrypt By <b>@Hanzz</b> (Ultimate Emoji Shield)</div>
<script>
${obfuscatedScript}
<\/script>
</body>
</html>`;
  }

  // --- Handlers dan Utilities (Tetap sama) ---

  function getDownloadFilename() {
    const now = new Date();
    const timestamp = [
      now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0'), '_',
      String(now.getHours()).padStart(2, '0'), String(now.getMinutes()).padStart(2, '0'), String(now.getSeconds()).padStart(2, '0')
    ].join('');
    return `protected_emoji_shield_${timestamp}.html`; 
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

    if (btn) { btn.disabled = true; btn.textContent = '🛡️ Applying Emoji Shield...'; }

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
