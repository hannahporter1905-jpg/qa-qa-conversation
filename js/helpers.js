// ── HELPERS ───────────────────────────────────────────────────────

function fmtTime(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
    });
  } catch (e) { return ''; }
}

function esc(s) {
  if (!s) return '';
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function toast(msg, type = 'i') {
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<span class="${type === 'ok' ? 'ti-ok' : 'ti-i'}">${type === 'ok' ? '✓' : 'ℹ'}</span> ${msg}`;
  document.getElementById('toasts').appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

function handleKey(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    sendReply();
  }
}
