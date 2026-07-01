// ============================================================
// JustBid Saved Search Sync Script
// ============================================================
// HOW TO USE:
// 1. Go to justbid.com and log in
// 2. Open DevTools console (F12)
// 3. Paste and run this script
// 4. Copy the JSON output that appears in the console
// 5. Go to your bookmark manager (digivoxel.github.io/auction-bookmarks)
// 6. Open console (F12) and run:
//    localStorage.setItem('abm_jb', `PASTE_YOUR_JSON_HERE`);
//    location.reload();
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
      const href = link.getAttribute('href');
      const match = href.match(/sav_id=(\d+)/);
      const nameMatch = href.match(/search=([^&]+)/);
      const name = nameMatch ? decodeURIComponent(nameMatch[1]).replace(/\+/g, ' ') : 'Search';
      if (match && !found.has(match[1])) {
        found.set(match[1], { name, url: 'https://justbid.com' + href, count: null });
        newFound++;
      }
    });
    if (!newFound) break;
    page++;
    if (page > 20) break;
  }

  localStorage.setItem('abm_jb', JSON.stringify([...found.values()]));
  console.log('✅ Saved ' + found.size + ' searches! Copy the JSON below and paste into the bookmark manager console.');
  console.log(localStorage.getItem('abm_jb'));
})();
