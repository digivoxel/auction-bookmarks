// ============================================================
// Equip-Bid Saved Search Sync Script
// ============================================================
// HOW TO USE:
// 1. Go to equip-bid.com and log in
// 2. Open DevTools console (F12)
// 3. Paste and run this script
// 4. Copy the JSON output that appears in the console
// 5. Go to your bookmark manager (digivoxel.github.io/auction-bookmarks)
// 6. Open console (F12) and run:
//    localStorage.setItem('abm_eb', `PASTE_YOUR_JSON_HERE`);
//    location.reload();
// ============================================================

(async () => {
  const EB_ZIP = '64114';
  const EB_RADIUS = '25';

  const res = await fetch('/dashboard/saved-searches');
  const html = await res.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const searches = [];

  doc.querySelectorAll('tr').forEach(row => {
    const link = row.querySelector('a[href*="search_phrase"]');
    if (!link) return;
    const href = link.getAttribute('href');
    const text = link.textContent.trim();
    const phraseMatch = href.match(/search_phrase=([^&]+)/);
    const phrase = phraseMatch ? phraseMatch[1] : encodeURIComponent(text);
    const url = 'https://www.equip-bid.com/auction/search?search_phrase=' + phrase +
      '&distance_radius=' + EB_RADIUS +
      '&distance_zip=' + EB_ZIP +
      '&status_field=open&lot_sort_field=relevancy&page=1';
    const cells = row.querySelectorAll('td');
    const countText = cells[cells.length - 1] ? cells[cells.length - 1].textContent.trim() : '';
    const count = parseInt(countText, 10);
    searches.push({ name: text, url, count: isNaN(count) ? null : count });
  });

  localStorage.setItem('abm_eb', JSON.stringify(searches));
  console.log('✅ Saved ' + searches.length + ' searches! Copy the JSON below and paste into the bookmark manager console.');
  console.log(localStorage.getItem('abm_eb'));
})();
