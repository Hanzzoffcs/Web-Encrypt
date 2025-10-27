// Nebula HTML Encryptor - logic (keamanan: client-side Base64 + safer write)
// NOTE: tool itself must NOT be encrypted when hosting.

const $ = id => document.getElementById(id);

function unicodeToBase64(str){
  // safe base64 for unicode strings
  return btoa(unescape(encodeURIComponent(str)));
}
function base64ToUnicode(b64){
  return decodeURIComponent(escape(atob(b64)));
}

// Build printable HTML file content (loader) that will ask password? (we keep simple no-password)
// This loader will decode base64 and write the decoded HTML into document when opened.
function buildLoaderFile(base64Payload){
  // We escape the payload so there is no tag-closing injection
  const safePayload = base64Payload.replace(/</g, '\\u003c');
  // Loader uses document.open/write/close to render page when loaded.
  return `<!doctype html>
<html lang="id"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Protected Page</title>
<style>body{background:#050014;color:#eaf0ff;font-family:Inter,system-ui;padding:28px}</style>
</head><body>
<script>
(function(){
  try{
    const payload = "${safePayload}";
    const decoded = decodeURIComponent(escape(atob(payload)));
    // replace document with decrypted HTML
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

// Encrypt button handler
$('btnEncrypt').addEventListener('click', () => {
  const input = $('input').value;
  if(!input || !input.trim()){
    alert('⚠️ Masukkan dulu kode HTML-nya!');
    return;
  }

  try{
    // 1) Minify small: trim leading/trailing spaces (optional)
    const normalized = input.trim();

    // 2) create base64 payload
    const b64 = unicodeToBase64(normalized);

    // 3) build loader file (result)
    const loaderHtml = buildLoaderFile(b64);

    // 4) show result in output (escape < to avoid confusion)
    $('output').value = loaderHtml;

    // 5) prepare download link
    const blob = new Blob([loaderHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = $('downloadLink');
    a.href = url;
    a.style.display = 'inline-block';
    a.textContent = 'Download encrypted.html';
    // revoke later when clicked
    a.onclick = () => setTimeout(()=>URL.revokeObjectURL(url), 2000);
  }catch(err){
    console.error(err);
    alert('Error saat enkripsi: '+ (err.message || err));
  }
});

// Clear
$('btnClear').addEventListener('click', () => {
  $('input').value = '';
  $('output').value = '';
  $('downloadLink').style.display = 'none';
});

// Copy output
$('btnCopy').addEventListener('click', async () => {
  const text = $('output').value;
  if(!text) { alert('Tidak ada hasil untuk disalin'); return; }
  try{
    await navigator.clipboard.writeText(text);
    alert('✅ Hasil terenkripsi disalin ke clipboard!');
  }catch(e){
    // fallback
    $('output').select();
    document.execCommand('copy');
    alert('✅ Disalin (fallback)');
  }
});
