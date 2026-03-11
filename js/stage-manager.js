// ── STAGE MANAGEMENT ──────────────────────────────────────────────

function openStageModal() {
  document.getElementById('stage-overlay').classList.add('open');
  document.getElementById('sm-label').focus();
}

function closeStageModal() {
  document.getElementById('stage-overlay').classList.remove('open');
  document.getElementById('sm-label').value = '';
  document.getElementById('sm-emoji').value = '';
}

function addStage() {
  const label = document.getElementById('sm-label').value.trim();
  const emoji = document.getElementById('sm-emoji').value.trim() || '📁';
  if (!label) { toast('Please enter a stage name', 'i'); return; }

  const id = 'stage-' + Date.now();
  stages.push({ id, label, emoji });
  save();
  renderSidebar();
  renderStageBlocks();
  updateGlobal();
  renderOverview();
  closeStageModal();
  showStage(id, null);
  toast('Stage added', 'ok');
}

function deleteStage(stageId) {
  const st = stages.find(s => s.id === stageId);
  if (!st) return;
  const qCount = questions.filter(q => q.stage === stageId).length;
  const msg = qCount > 0
    ? `Delete stage "${st.label}"?\n\nThis will also delete ${qCount} question${qCount > 1 ? 's' : ''} inside it.\n\nThis cannot be undone.`
    : `Delete stage "${st.label}"?\n\nThis cannot be undone.`;
  if (!confirm(msg)) return;

  questions = questions.filter(q => q.stage !== stageId);
  stages    = stages.filter(s => s.id !== stageId);
  save();
  renderSidebar();
  renderStageBlocks();
  stages.forEach(s => renderStage(s.id));
  updateGlobal();
  renderOverview();
  showStage('overview', null);
  toast(`Stage "${st.label}" deleted`, 'i');
}
