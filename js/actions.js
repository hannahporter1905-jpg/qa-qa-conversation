// ── ROLE ──────────────────────────────────────────────────────────

function setRole(r) {
  currentRole = r;
  save();
  document.getElementById('role-adm').className = 'role-btn' + (r === 'admin' ? ' a-adm' : '');
  document.getElementById('role-cli').className = 'role-btn' + (r === 'client' ? ' a-cli' : '');
  document.getElementById('ov-role').textContent = r === 'admin' ? 'Admin' : 'Client';
  syncWhoUI();
}

function syncWhoUI() {
  const adm = document.getElementById('tm-who-adm');
  const cli = document.getElementById('tm-who-cli');
  if (!adm || !cli) return;
  adm.className = 'who-btn' + (currentRole === 'admin' ? ' a-adm' : '');
  cli.className = 'who-btn' + (currentRole === 'client' ? ' a-cli' : '');
}

function switchWho(r) {
  currentRole = r;
  save();
  syncWhoUI();
}

// ── SEND REPLY ────────────────────────────────────────────────────

function sendReply() {
  if (!openQid) return;
  const ta = document.getElementById('tm-ta');
  const text = ta.value.trim();
  if (!text) return;
  const q = questions.find(x => x.id === openQid);
  if (!q || q.resolved) return;

  q.thread.push({ role: currentRole, text, ts: new Date().toISOString() });
  save();
  ta.value = '';

  renderThreadMessages(q);
  renderFooter(q);
  scrollThreadBottom();

  const badge = document.getElementById('tm-badge');
  badge.className = 'q-badge in-disc';
  badge.textContent = 'In Discussion';

  const card = document.getElementById('card-' + openQid);
  if (card) {
    document.getElementById('qc-' + q.stage).replaceChild(buildCard(q), card);
  }
  updateStageProg(q.stage);
  updateGlobal();
  updatePills();
  renderOverview();
  toast('Reply sent', 'ok');
}

// ── RESOLVE / REOPEN ──────────────────────────────────────────────

function resolveQ() {
  if (!openQid) return;
  const q = questions.find(x => x.id === openQid);
  if (!q) return;
  const hasAdm = q.thread.some(m => m.role === 'admin');
  const hasCli = q.thread.some(m => m.role === 'client');
  if (!hasAdm || !hasCli) { toast('Need replies from both Admin and Client first', 'i'); return; }
  q.resolved = true;
  save();

  renderThreadMessages(q);
  renderFooter(q);

  const badge = document.getElementById('tm-badge');
  badge.className = 'q-badge resolved';
  badge.textContent = 'Resolved';

  const card = document.getElementById('card-' + openQid);
  if (card) { document.getElementById('qc-' + q.stage).replaceChild(buildCard(q), card); }
  updateStageProg(q.stage);
  updateGlobal();
  updatePills();
  renderOverview();
  toast('Question resolved ✅', 'ok');
}

function reopenQ() {
  if (!openQid) return;
  const q = questions.find(x => x.id === openQid);
  if (!q) return;
  q.resolved = false;
  save();

  renderThreadMessages(q);
  renderFooter(q);

  const badge = document.getElementById('tm-badge');
  badge.className = 'q-badge in-disc';
  badge.textContent = 'In Discussion';

  const card = document.getElementById('card-' + openQid);
  if (card) { document.getElementById('qc-' + q.stage).replaceChild(buildCard(q), card); }
  updateStageProg(q.stage);
  updateGlobal();
  updatePills();
  renderOverview();
  toast('Question reopened', 'i');
}

// ── DELETE ────────────────────────────────────────────────────────

function deleteQ() {
  if (!openQid) return;
  const q = questions.find(x => x.id === openQid);
  if (!q) return;
  if (!confirm(`Delete "${q.num} — ${q.text.slice(0, 60)}${q.text.length > 60 ? '…' : ''}"?\n\nThis cannot be undone.`)) return;
  const stage = q.stage;
  questions = questions.filter(x => x.id !== openQid);
  save();
  closeThread();
  renderStage(stage);
  updateGlobal();
  updatePills();
  renderOverview();
  toast('Question deleted', 'i');
}
