// ============================================================
// JustBid Search Panel Snippet
// ============================================================
// HOW TO USE:
// 1. Go to justbid.com (while logged in)
// 2. Open DevTools console (F12)
// 3. Run this snippet
// A sidebar will appear with all your saved searches as clickable links
// ============================================================

(async () => {
  const found = new Map();
  let page = 1, hasMore = true;

  while (hasMore) {
    const res = await fetch('/saved_searches?page=' + page);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const links = doc.querySelectorAll('a[href*="sav_id"]');
    if (!links.length) break;
    let newFound = 0;
    links.forEach(link => {
      const match = link.getAttribute('href').match(/sav_id=(\d+)/);
      if (match && !found.has(match[1])) {
        found.set(match[1], { name: link.textContent.trim(), href: link.getAttribute('href') });
        newFound++;
      }
    });
    if (!newFound) break;
    page++; if (page > 20) break;
  }

  const div = document.createElement('div');
  div.style = 'position:fixed;top:0;right:0;bottom:0;width:280px;background:#fff;z-index:99999;overflow-y:auto;border-left:2px solid #e07b2a;padding:10px;box-shadow:-4px 0 12px rgba(0,0,0,0.15)';
  div.innerHTML = '<h3 style="margin:0 0 10px;font-size:14px;color:#e07b2a">All Saved Searches (' + found.size + ')</h3>' +
    [...found.values()].map(s =>
      `<a href="${s.href}" style="display:block;padding:6px 8px;margin-bottom:4px;background:#f7f6f3;border-radius:4px;text-decoration:none;color:#1a1917;font-size:13px">${s.name}</a>`
    ).join('');
  document.body.appendChild(div);
})();
