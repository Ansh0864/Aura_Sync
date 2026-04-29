import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Flame, ScanFace, Music2, Calendar, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOOD_DATA = [
  { mood: 'Happy',   pct: 34, color: '#F59E0B', scans: 17 },
  { mood: 'Neutral', pct: 28, color: '#94A3B8', scans: 14 },
  { mood: 'Focused', pct: 20, color: '#3B82F6', scans: 10 },
  { mood: 'Sad',     pct: 10, color: '#6366F1', scans: 5  },
  { mood: 'Angry',   pct: 8,  color: '#EF4444', scans: 4  },
];

const WEEKLY = [
  { day: 'Mon', scans: 4,  dominant: '#F59E0B' },
  { day: 'Tue', scans: 7,  dominant: '#3B82F6' },
  { day: 'Wed', scans: 3,  dominant: '#94A3B8' },
  { day: 'Thu', scans: 9,  dominant: '#F59E0B' },
  { day: 'Fri', scans: 6,  dominant: '#EF4444' },
  { day: 'Sat', scans: 5,  dominant: '#6366F1' },
  { day: 'Sun', scans: 8,  dominant: '#F59E0B' },
];
const MAX_SCANS = Math.max(...WEEKLY.map(d => d.scans));

const RECENT = [
  { mood: 'Happy',   time: '2 mins ago',  color: '#F59E0B', track: 'Blinding Lights' },
  { mood: 'Neutral', time: '1 hour ago',  color: '#94A3B8', track: 'Breathe (2 AM)'  },
  { mood: 'Focused', time: '3 hours ago', color: '#3B82F6', track: 'Interstellar OST' },
  { mood: 'Angry',   time: 'Yesterday',   color: '#EF4444', track: 'Rage Against...' },
];

const STATS = [
  { icon: ScanFace, label: 'Total Scans',    value: '50',    sub: 'This month',   color: 'var(--violet)' },
  { icon: Flame,    label: 'Streak',          value: '7 days', sub: 'Personal best', color: 'var(--rose)'   },
  { icon: TrendingUp,label:'Dominant Mood',  value: 'Happy', sub: '34% of scans', color: 'var(--gold)'   },
  { icon: Music2,   label: 'Tracks Played',  value: '128',   sub: 'Last 30 days', color: 'var(--emerald)' },
];

// Build SVG donut path
function buildDonut(data, r = 70, stroke = 18) {
  let cumPct = 0;
  const cx = 90, cy = 90;
  const paths = [];
  const gap = 2; 

  data.forEach((d, i) => {
    const pct = d.pct / 100;
    const startAngle = cumPct * 360 - 90;
    const endAngle   = (cumPct + pct) * 360 - 90 - gap;
    const sa = (startAngle * Math.PI) / 180;
    const ea = (endAngle * Math.PI) / 180;
    const x1 = cx + r * Math.cos(sa);
    const y1 = cy + r * Math.sin(sa);
    const x2 = cx + r * Math.cos(ea);
    const y2 = cy + r * Math.sin(ea);
    const large = endAngle - startAngle > 180 ? 1 : 0;
    paths.push(
      <path
        key={i}
        d={`M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`}
        fill="none"
        stroke={d.color}
        strokeWidth={stroke}
        strokeLinecap="round"
      />
    );
    cumPct += pct;
  });
  return paths;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [hoveredBar, setHoveredBar] = useState(null);
  const [animDone, setAnimDone]     = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimDone(true), 1000);
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-20" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto px-5">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-10 flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] mb-2" style={{ color: 'var(--violet)' }}>
              
            </p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter" style={{ color: 'var(--text)' }}>
              YOUR AURA
            </h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/scanner')}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold uppercase tracking-widest text-xs text-white"
            style={{ background: 'linear-gradient(135deg, var(--violet), var(--rose))' }}
          >
            <ScanFace size={14} />
            New Scan
          </motion.button>
        </motion.div>

        {/* ── Stats row ────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="rounded-2xl border p-5 relative overflow-hidden group"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                <div
                  className="absolute top-0 right-0 w-20 h-20 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"
                  style={{ backgroundColor: s.color }}
                />
                <div
                  className="w-9 h-9 rounded-xl border flex items-center justify-center mb-4"
                  style={{ borderColor: s.color + '40', backgroundColor: s.color + '15' }}
                >
                  <Icon size={16} style={{ color: s.color }} />
                </div>
                <div className="font-black text-2xl font-mono mb-0.5" style={{ color: 'var(--text)' }}>
                  {s.value}
                </div>
                <div className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--muted)' }}>
                  {s.label}
                </div>
                <div className="text-[10px] font-mono mt-1" style={{ color: s.color }}>
                  {s.sub}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Main grid ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          {/* Donut chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border p-6 flex flex-col"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] mb-6" style={{ color: 'var(--muted)' }}>
              Emotion Distribution
            </p>
            <div className="flex items-center gap-6 flex-1">
              <div className="relative flex-shrink-0">
                <svg width="180" height="180" viewBox="0 0 180 180">
                  {/* Background ring */}
                  <circle cx="90" cy="90" r="70" fill="none" stroke="var(--surface-2)" strokeWidth="18" />
                  {/* Data segments */}
                  {buildDonut(MOOD_DATA)}
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black" style={{ color: 'var(--text)' }}>50</span>
                  <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: 'var(--muted)' }}>scans</span>
                </div>
              </div>
              <div className="flex flex-col gap-2.5 flex-1">
                {MOOD_DATA.map((d, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                        {d.mood}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono" style={{ color: 'var(--muted)' }}>{d.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Weekly bar chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            className="lg:col-span-2 rounded-2xl border p-6"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <p className="text-[10px] font-mono uppercase tracking-[0.25em]" style={{ color: 'var(--muted)' }}>
                Weekly Scan Volume
              </p>
              <div className="flex items-center gap-1.5 text-[10px] font-mono" style={{ color: 'var(--emerald)' }}>
                <TrendingUp size={11} />
                +18% vs last week
              </div>
            </div>

            <div className="flex items-end gap-3 h-40 relative">
              {/* Y-axis guide lines */}
              {[0.25, 0.5, 0.75, 1].map(f => (
                <div
                  key={f}
                  className="absolute left-0 right-0 border-t border-dashed"
                  style={{ bottom: `${f * 100}%`, borderColor: 'var(--border)' }}
                />
              ))}
              {WEEKLY.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 relative">
                  {hoveredBar === i && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg text-[10px] font-mono whitespace-nowrap z-10"
                      style={{ backgroundColor: 'var(--surface-2)', color: 'var(--text)' }}
                    >
                      {d.scans} scans
                    </motion.div>
                  )}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.scans / MAX_SCANS) * 100}%` }}
                    transition={{ delay: i * 0.06 + 0.3, duration: 0.6, ease: 'easeOut' }}
                    className="w-full rounded-t-lg cursor-pointer transition-opacity"
                    style={{
                      backgroundColor: d.dominant,
                      opacity: hoveredBar === null || hoveredBar === i ? 1 : 0.3,
                    }}
                    onMouseEnter={() => setHoveredBar(i)}
                    onMouseLeave={() => setHoveredBar(null)}
                  />
                  <span className="text-[9px] font-mono uppercase" style={{ color: 'var(--muted)' }}>{d.day}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent scans list */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="lg:col-span-2 rounded-2xl border p-6"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center justify-between mb-5">
              <p className="text-[10px] font-mono uppercase tracking-[0.25em]" style={{ color: 'var(--muted)' }}>
                Recent Activity
              </p>
              <button
                onClick={() => navigate('/history')}
                className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest transition-colors"
                style={{ color: 'var(--violet)' }}
              >
                View all <ChevronRight size={11} />
              </button>
            </div>
            <div className="space-y-2.5">
              {RECENT.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 + 0.4 }}
                  className="flex items-center justify-between p-4 rounded-xl border group cursor-pointer transition-all"
                  style={{ backgroundColor: 'var(--surface-2)', borderColor: 'var(--border)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = r.color + '60'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: r.color }}>
                        {r.mood}
                      </span>
                      <p className="text-[10px] font-mono" style={{ color: 'var(--muted)' }}>
                        ♪ {r.track}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono" style={{ color: 'var(--muted)' }}>{r.time}</span>
                    <Music2 size={12} style={{ color: 'var(--muted)' }} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Streak card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border p-6 flex flex-col"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] mb-6" style={{ color: 'var(--muted)' }}>
              Scan Streak
            </p>

            {/* Flame + number */}
            <div className="flex-1 flex flex-col items-center justify-center gap-2">
              <div
                className="text-7xl font-black font-mono"
                style={{ color: 'var(--gold)' }}
              >
                7
              </div>
              <div className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
                days in a row
              </div>
            </div>

            {/* Week dots */}
            <div className="flex justify-between mt-6">
              {['M','T','W','T','F','S','S'].map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-7 h-7 rounded-full border flex items-center justify-center"
                    style={{
                      backgroundColor: i < 7 ? 'var(--gold)' + '25' : 'var(--surface-2)',
                      borderColor: i < 7 ? 'var(--gold)' : 'var(--border)',
                    }}
                  >
                    {i < 7 && <Flame size={12} style={{ color: 'var(--gold)' }} />}
                  </div>
                  <span className="text-[9px] font-mono" style={{ color: 'var(--muted)' }}>{d}</span>
                </div>
              ))}
            </div>

            <div
              className="mt-4 p-3 rounded-xl text-center text-[10px] font-mono uppercase tracking-widest"
              style={{ backgroundColor: 'var(--surface-2)', color: 'var(--gold)' }}
            >
              Personal Best 🔥
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}