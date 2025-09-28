const files = ["index.html", "style.css", "script.js"];
const cache = {};

async function checkFiles() {
  for (const file of files) {
    try {
      const res = await fetch(file, { cache: "no-store" });
      const text = await res.text();
      if (cache[file] && cache[file] !== text) {
        console.log(`[AutoReload] Change detected in ${file}, reloading...`);
        location.reload();
        return;
      }
      cache[file] = text;
    } catch (e) {
      console.error(`[AutoReload] Failed to fetch ${file}:`, e);
    }
  }
}

setInterval(checkFiles, 2000); // check every 2s
