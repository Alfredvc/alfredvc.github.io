// Deep-dive boxes: expand/collapse-all control and auto-open on anchor navigation.
document.addEventListener('DOMContentLoaded', () => {
  const dives = Array.from(document.querySelectorAll('details.deep-dive'));
  if (!dives.length) return;

  // If a link targets an element inside a closed deep dive, open it first.
  const openForHash = () => {
    if (!location.hash) return;
    let el;
    try {
      el = document.querySelector(location.hash);
    } catch {
      return;
    }
    const dive = el && el.closest('details.deep-dive');
    if (dive && !dive.open) {
      dive.open = true;
      el.scrollIntoView();
    }
  };
  window.addEventListener('hashchange', openForHash);
  openForHash();
});
