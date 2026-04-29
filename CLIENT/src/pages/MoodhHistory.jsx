import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Filter, Download, Trash2, ScanFace, TrendingUp, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOOD_COLORS = {
  Happy:   '#F59E0B',
  Sad:     '#3B82F6',
  Angry:   '#EF4444',
  Fear:    '#A855F7',
  Surprise:'#F97316',
  Disgust: '#22C55E',
  Neutral: '#94A3B8',
};

// Seed demo history if localStorage is empty
function seedHistory() {
  const moods  = ['Happy', 'Sad', 'Neutral', 'Angry', 'Surprise', 'Fear', 'Disgust'];
  const tracks = ['Blinding Lights', 'Breathe (2 AM)', 'Interstellar', 'HUMBLE.', 'Electric Feel', 'Someone Like You', 'Redbone'];
  const now    = Date.now();
  return Array.from({ length: 24 }, (_, i) => ({
    id:    `demo-${i}`,
    mood:  moods[Math.floor(Math.random() * moods.length)],
    track: tracks[Math.floor(Math.random() * tracks.length)],
    ts:    now - i * 3 * 60 * 60 * 1000, // every 3h back
  }));
}

function loadHistory() {
  try {
    const raw = localStorage.getItem('aurasync_history');
    if (raw) return JSON.parse(raw);
    const demo = seedHistory();
    localStorage.setItem('aurasync_history', JSON.stringify(demo));
    return demo;
  } catch { return seedHistory(); }
}

function saveHistory(h) {
  try { localStorage.setItem('aurasync_history', JSON.stringify(h)); } catch {}
}

function fmtDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function fmtTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}
function groupByDate(items) {
  const groups = {};
  items.forEach(item => {
    const key = fmtDate(item.ts);
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });
  return groups;
}

export default function MoodHistory() {
  const navigate = useNavigate();
  const [history, setHistory]   = useState([]);
  const [filter, setFilter]     = useState('All');
  const [search, setSearch]     = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => { setHistory(loadHistory()); }, []);

  const filtered = history.filter(h => {
    const matchFilter = filter === 'All' || h.mood === filter;
    const matchSearch = h.mood.toLowerCase().includes(search.toLowerCase()) ||
                        h.track.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const grouped = groupByDate(filtered);

  const deleteEntry = useCallback((id) => {
    setHistory(prev => {
      const updated = prev.filter(h => h.id !== id);
      saveHistory(updated);
      return updated;
    });
  }, []);

  const clearAll = () => {
    setHistory([]);
    saveHistory([]);
    setShowConfirm(false);
  };

  const exportCSV = () => {
    const rows = ['Mood,Track,Date,Time', ...history.map(h =>
      `${h.mood},${h.track},${fmtDate(h.ts)},${fmtTime(h.ts)}`
    )];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'aurasync_history.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  // Mood distribution for mini chart
  const distrib = Object.entries(
    history.reduce((acc, h) => { acc[h.mood] = (acc[h.mood] || 0) + 1; return acc; }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const allMoods = ['All', ...Object.keys(MOOD_COLORS)];

  return (
    <div className="min-h-screen pt-24 pb-24" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-5xl mx-auto px-5">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.3em] mb-2" style={{ color: 'var(--rose)' }}>
            
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-1" style={{ color: 'var(--text)' }}>
            HISTORY
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {history.length} scans recorded
          </p>
        </motion.div>

        {/* ── Top stats + mini chart ────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

          {/* Mood frequency */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border p-6"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] mb-5" style={{ color: 'var(--muted)' }}>
              <TrendingUp size={10} className="inline mr-1" />
              Top Emotions
            </p>
            <div className="space-y-3">
              {distrib.map(([mood, cnt], i) => {
                const pct = Math.round((cnt / history.length) * 100);
                const col = MOOD_COLORS[mood] || '#94A3B8';
                return (
                  <div key={mood}>
                    <div className="flex justify-between text-[10px] font-mono mb-1">
                      <span style={{ color: 'var(--text)' }}>{mood}</span>
                      <span style={{ color: col }}>{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--surface-2)' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: i * 0.08 + 0.3, duration: 0.7 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: col }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Actions + search */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border p-6 flex flex-col gap-4"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            {/* Search */}
            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl border"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-2)' }}
            >
              <Search size={13} style={{ color: 'var(--muted)' }} />
              <input
                type="text"
                placeholder="Search by mood or track..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-xs font-mono outline-none placeholder-opacity-50"
                style={{ color: 'var(--text)', caretColor: 'var(--violet)' }}
              />
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                onClick={exportCSV}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all"
                style={{ borderColor: 'var(--border)', color: 'var(--muted)', backgroundColor: 'var(--surface-2)' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--emerald)'; e.currentTarget.style.borderColor = 'var(--emerald)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <Download size={13} /> Export CSV
              </button>
              <button
                onClick={() => setShowConfirm(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all"
                style={{ borderColor: 'var(--border)', color: 'var(--muted)', backgroundColor: 'var(--surface-2)' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--rose)'; e.currentTarget.style.borderColor = 'var(--rose)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <Trash2 size={13} /> Clear All
              </button>
            </div>

            <button
              onClick={() => navigate('/scanner')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-white"
              style={{ background: 'linear-gradient(135deg, var(--violet), var(--rose))' }}
            >
              <ScanFace size={13} />
              New Scan
            </button>

            {/* Clear confirm */}
            <AnimatePresence>
              {showConfirm && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-3 rounded-xl border text-center"
                  style={{ borderColor: 'var(--rose)', backgroundColor: 'color-mix(in srgb, var(--rose) 10%, transparent)' }}
                >
                  <p className="text-xs font-bold mb-3" style={{ color: 'var(--text)' }}>
                    Delete all {history.length} records?
                  </p>
                  <div className="flex gap-2">
                    <button onClick={clearAll}
                      className="flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white"
                      style={{ backgroundColor: 'var(--rose)' }}>
                      Confirm
                    </button>
                    <button onClick={() => setShowConfirm(false)}
                      className="flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest"
                      style={{ backgroundColor: 'var(--surface-2)', color: 'var(--muted)' }}>
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* ── Filter pills ──────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-6">
          {allMoods.map(m => {
            const active = filter === m;
            const col    = m === 'All' ? 'var(--violet)' : MOOD_COLORS[m];
            return (
              <button
                key={m}
                onClick={() => setFilter(m)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all"
                style={{
                  backgroundColor: active ? col + '25' : 'var(--surface)',
                  borderColor:     active ? col : 'var(--border)',
                  color:           active ? col : 'var(--muted)',
                }}
              >
                {m !== 'All' && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: col }} />}
                {m}
              </button>
            );
          })}
        </div>

        {/* ── Timeline ──────────────────────────────────────── */}
        <div className="space-y-8">
          {Object.entries(grouped).length === 0 ? (
            <div className="text-center py-20">
              <Clock size={40} className="mx-auto mb-4 opacity-20" style={{ color: 'var(--muted)' }} />
              <p className="text-sm font-mono" style={{ color: 'var(--muted)' }}>No records match your filter.</p>
            </div>
          ) : (
            Object.entries(grouped).map(([date, items], gi) => (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: gi * 0.05 }}
              >
                {/* Date header */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em]" style={{ color: 'var(--muted)' }}>
                    {date}
                  </span>
                  <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }} />
                  <span className="text-[10px] font-mono" style={{ color: 'var(--muted)' }}>{items.length} scan{items.length > 1 ? 's' : ''}</span>
                </div>

                {/* Day entries */}
                <div className="space-y-2 pl-3 border-l" style={{ borderColor: 'var(--border)' }}>
                  {items.map((item, ii) => {
                    const col = MOOD_COLORS[item.mood] || '#94A3B8';
                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8, height: 0 }}
                        transition={{ delay: ii * 0.03 }}
                        className="flex items-center justify-between p-4 rounded-xl border ml-3 group relative transition-all"
                        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = col + '60'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                      >
                        {/* Timeline dot */}
                        <div
                          className="absolute -left-[19px] w-3 h-3 rounded-full border-2"
                          style={{ backgroundColor: col + '30', borderColor: col }}
                        />

                        <div className="flex items-center gap-3">
                          <div>
                            <span className="text-xs font-black uppercase tracking-wider" style={{ color: col }}>
                              {item.mood}
                            </span>
                            <p className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--muted)' }}>
                              ♪ {item.track}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-mono" style={{ color: 'var(--muted)' }}>
                            {fmtTime(item.ts)}
                          </span>
                          <button
                            onClick={() => deleteEntry(item.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={12} style={{ color: 'var(--muted)' }}
                              onMouseEnter={e => e.currentTarget.style.color = 'var(--rose)'}
                              onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
                            />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}