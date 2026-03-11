// ── EVENT LISTENERS ───────────────────────────────────────────────

document.getElementById('add-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('add-overlay')) closeAddModal();
});

document.getElementById('stage-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('stage-overlay')) closeStageModal();
});

// ── BOOT ──────────────────────────────────────────────────────────

loadState();
renderAll();
