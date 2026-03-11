// ── THREAD POPUP ──────────────────────────────────────────────────

function openThread(qid) {
  const q = questions.find(x => x.id === qid);
  if (!q) return;
  openQid = qid;

  // Header
  document.getElementById('tm-num').textContent = q.num;
  document.getElementById('tm-q').textContent = q.text;
  const stObj = stages.find(s => s.id === q.stage);
  document.getElementById('tm-stage').textContent = stObj ? `${stObj.emoji} ${stObj.label}` : q.stage;

  // Badge
  const sc = q.resolved ? 'resolved' : q.thread.length > 0 ? 'in-disc' : 'pending';
  const sl = q.resolved ? 'Resolved' : q.thread.length > 0 ? 'In Discussion' : 'Pending';
  const badge = document.getElementById('tm-badge');
  badge.className = 'q-badge ' + sc;
  badge.textContent = sl;

  renderThreadMessages(q);
  renderFooter(q);
  syncWhoUI();

  document.getElementById('thread-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => scrollThreadBottom(), 80);
  if (!q.resolved) setTimeout(() => document.getElementById('tm-ta')?.focus(), 120);
}

function closeThread() {
  document.getElementById('thread-overlay').classList.remove('open');
  document.body.style.overflow = '';
  openQid = null;
}

function handleOverlayClick(e) {
  if (e.target === document.getElementById('thread-overlay')) closeThread();
}

function renderThreadMessages(q) {
  const area = document.getElementById('tm-thread');
  if (q.thread.length === 0) {
    area.innerHTML = `<div class="thread-empty">No messages yet — start the conversation below.</div>`;
    return;
  }
  let html = '';
  q.thread.forEach(m => {
    const init = m.role === 'admin' ? 'ADM' : 'CLI';
    const name = m.role === 'admin' ? 'Admin' : 'Client';
    const t = m.ts ? fmtTime(m.ts) : '';
    html += `<div class="msg ${m.role}">
      <div class="msg-av">${init}</div>
      <div class="msg-wrap">
        <div class="msg-meta"><span class="msg-who">${name}</span><span>${t}</span></div>
        <div class="msg-bub">${esc(m.text)}</div>
      </div>
    </div>`;
  });
  if (q.resolved) {
    html += `<div class="res-mark">✅ Both parties reached agreement — marked as <strong>Resolved</strong></div>`;
  }
  area.innerHTML = html;
}

function renderFooter(q) {
  const replyBar   = document.getElementById('tm-reply');
  const resolveRow = document.getElementById('tm-resolve-row');
  const hint       = document.getElementById('tm-hint');
  const resBtn     = document.getElementById('tm-res-btn');

  if (q.resolved) {
    replyBar.classList.add('disabled');
    resolveRow.className = 'resolve-row resolved-state';
    hint.innerHTML = '✅ This question is <strong>Resolved</strong>';
    resBtn.style.display = 'none';
    let ropBtn = document.getElementById('tm-reopen-btn');
    if (!ropBtn) {
      ropBtn = document.createElement('button');
      ropBtn.id = 'tm-reopen-btn';
      ropBtn.className = 'btn-rop';
      ropBtn.textContent = '↩ Reopen';
      ropBtn.onclick = reopenQ;
      resolveRow.appendChild(ropBtn);
    } else {
      ropBtn.style.display = '';
    }
  } else {
    replyBar.classList.remove('disabled');
    resolveRow.className = 'resolve-row';
    const hasAdm = q.thread.some(m => m.role === 'admin');
    const hasCli = q.thread.some(m => m.role === 'client');
    const canResolve = hasAdm && hasCli;
    hint.innerHTML = canResolve
      ? 'Both sides have replied — ready to mark as <strong>Resolved</strong>'
      : 'Once both sides have replied, mark as <strong>Resolved</strong>';
    resBtn.style.display = '';
    resBtn.disabled = !canResolve;
    resBtn.title = canResolve ? '' : 'Need at least one reply from both Admin and Client';
    const ropBtn = document.getElementById('tm-reopen-btn');
    if (ropBtn) ropBtn.style.display = 'none';
  }
}

function scrollThreadBottom() {
  const area = document.getElementById('tm-thread');
  if (area) area.scrollTop = area.scrollHeight;
}
