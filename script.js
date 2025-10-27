document.getElementById("encrypt-btn").addEventListener("click", encryptHTML);
document.getElementById("copy-btn").addEventListener("click", copyOutput);

function encryptHTML() {
  const input = document.getElementById("input").value.trim();
  if (!input) {
    alert("⚠️ Masukkan dulu kode HTML-nya!");
    return;
  }

  const encoded = btoa(unescape(encodeURIComponent(input)));
  const randomVar = Math.random().toString(36).substring(2, 10);

  const result = `<script>
  (function(){
    const ${randomVar}="${encoded}";
    const decoded=decodeURIComponent(escape(atob(${randomVar})));
    document.open();document.write(decoded);document.close();
  })();
<\/script>`;

  document.getElementById("output").value = result;
}

function copyOutput() {
  const output = document.getElementById("output");
  output.select();
  document.execCommand("copy");
  alert("✅ Hasil terenkripsi disalin ke clipboard!");
}
