// ── STATE ─────────────────────────────────────────────────────────

let questions = [], stages = [], currentRole = 'admin', openQid = null;
const SK = 'qa-dash-v5';

function loadState() {
  try {
    const s = localStorage.getItem(SK);
    if (s) {
      const d = JSON.parse(s);
      questions = d.questions;
      stages = d.stages || JSON.parse(JSON.stringify(DEFAULT_STAGES));
      currentRole = d.role || 'admin';
    } else {
      initDefault();
    }
  } catch (e) {
    initDefault();
  }
}

function initDefault() {
  stages = JSON.parse(JSON.stringify(DEFAULT_STAGES));
  questions = SEED.map(s => ({
    ...s,
    thread: SEED_THREADS[s.id] ? [...SEED_THREADS[s.id]] : [],
    resolved: PRE_RESOLVED.includes(s.id),
  }));
}

function save() {
  localStorage.setItem(SK, JSON.stringify({ questions, stages, role: currentRole }));
}
