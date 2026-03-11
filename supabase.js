// ─────────────────────────────────────────────────────────────
//  Supabase Client
//  Requires:
//    1. Supabase CDN loaded in index.html
//    2. config.js loaded before this script (window.SUPABASE_URL etc.)
// ─────────────────────────────────────────────────────────────

(function () {
  const url = window.SUPABASE_URL;
  const key = window.SUPABASE_ANON_KEY;

  if (!url || url === 'your_supabase_project_url_here') {
    console.warn('[Supabase] No credentials found. Edit config.js with your project URL and anon key.');
    window.db = null;
    return;
  }

  const { createClient } = window.supabase;
  window.db = createClient(url, key);
  console.info('[Supabase] Client initialised:', url);
})();

// ─────────────────────────────────────────────────────────────
//  Usage (call these from index.html inline scripts or modules):
//
//  Save a question thread:
//    await window.db.from('threads').upsert({ id, stage, question, messages });
//
//  Load all threads:
//    const { data } = await window.db.from('threads').select('*');
//
//  Realtime subscription (live updates):
//    window.db
//      .channel('threads')
//      .on('postgres_changes', { event: '*', schema: 'public', table: 'threads' }, payload => {
//        console.log('Change received:', payload);
//      })
//      .subscribe();
// ─────────────────────────────────────────────────────────────
