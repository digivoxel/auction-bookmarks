// ============================================================
// Equip-Bid Open All Snippet
// ============================================================
// HOW TO USE:
// 1. Go to equip-bid.com (while logged in)
// 2. Open DevTools console (F12)
// 3. Run this snippet
// It will open a new tab for every saved search with results > 0
// Searches with 0 results are automatically skipped
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
    if (!isNaN(count) && count > 0) searches.push({ name: text, url, count });
  });

  console.log('Opening ' + searches.length + ' searches with results...');
  searches.forEach((s, i) => setTimeout(() => window.open(s.url, '_blank'), i * 400));
})();
