import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  BrainCircuit, Music2, Zap, ScanFace,
  ArrowRight, BarChart3, ChevronDown, Waves,
} from 'lucide-react';

/* ─── Data ───────────────────────────────────────────────── */
const MOODS = [
  { label: 'Joy',        color: '#F59E0B', genre: 'Pop / Dance',      freq: '432 Hz' },
  { label: 'Melancholy', color: '#3B82F6', genre: 'Ambient / Indie',  freq: '396 Hz' },
  { label: 'Rage',       color: '#EF4444', genre: 'Metal / Punk',     freq: '528 Hz' },
  { label: 'Awe',        color: '#8B5CF6', genre: 'Classical / Epic', freq: '639 Hz' },
  { label: 'Anxiety',    color: '#EC4899', genre: 'Lo-fi / Jazz',     freq: '741 Hz' },
  { label: 'Calm',       color: '#10B981', genre: 'Nature / Acoustic',freq: '285 Hz' },
  { label: 'Disgust',    color: '#6B7280', genre: 'Noise / Drone',    freq: '174 Hz' },
];

const FEATURES = [
  {
    icon: BrainCircuit, title: 'Neural Recognition',
    desc: 'Custom 4-block CNN trained on FER-2013. Detects 7 micro-expressions at 92%+ accuracy.',
    color: 'var(--violet)', span: 'lg:col-span-2 lg:row-span-2',
    big: true,
  },
  {
    icon: Music2, title: 'Acoustic Mapping',
    desc: 'Real-time Valence · Energy · Tempo routing via Spotify & Last.fm APIs.',
    color: 'var(--rose)', span: '',
  },
  {
    icon: Zap, title: 'Zero Latency',
    desc: 'FastAPI backend. Sub-80ms round-trip.',
    color: 'var(--gold)', span: '',
  },
  {
    icon: ScanFace, title: 'Local Biometrics',
    desc: 'WebRTC capture — nothing leaves your device.',
    color: 'var(--emerald)', span: '',
  },
  {
    icon: BarChart3, title: 'Mood Analytics',
    desc: 'Personal telemetry with trend tracking & heatmaps.',
    color: 'var(--violet)', span: 'lg:col-span-2',
  },
];

const STATS = [
  { value: 7,    suffix: '',    label: 'Emotion Classes' },
  { value: 92,   suffix: '%',   label: 'CNN Accuracy'    },
  { value: 80,   suffix: 'ms',  label: 'API Latency'     },
  { value: 100,  suffix: '%',   label: 'On-Device'       },
];

const TICKER = ['Joy', 'Rage', 'Calm', 'Awe', 'Melancholy', 'Anxiety', 'Disgust'];

/* ─── Animated counter ───────────────────────────────────── */
function Counter({ target, suffix }) {
  const [count, setCount] = useState(0);
  const ref = useRef(false);
  const elRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !ref.current) {
        ref.current = true;
        let start = 0;
        const step = target / 50;
        const timer = setInterval(() => {
          start = Math.min(start + step, target);
          setCount(Math.floor(start));
          if (start >= target) clearInterval(timer);
        }, 28);
      }
    });
    if (elRef.current) observer.observe(elRef.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={elRef} className="font-black font-mono tabular-nums" style={{ color: 'var(--violet)' }}>
      {count}{suffix}
    </span>
  );
}

/* ─── Equalizer bars decorative ─────────────────────────── */
function EqBars({ color }) {
  return (
    <div className="flex items-end gap-[3px] h-10">
      {Array.from({ length: 10 }).map((_, i) => (
        <span
          key={i}
          className="eq-bar rounded-full"
          style={{
            backgroundColor: color,
            animationDelay: `${i * 0.07}s`,
            height: `${Math.random() * 28 + 8}px`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────── */
export default function Home() {
  const navigate = useNavigate();
  const [activeMood, setActiveMood] = useState(MOODS[0]);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const heroOp = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ backgroundColor: 'var(--bg)' }}>

      {/* ── Global mood atmosphere glow ──────────────────── */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        animate={{ opacity: 0.12 }}
        transition={{ duration: 0.8 }}
        style={{
          background: `radial-gradient(ellipse 60% 50% at 70% 20%, ${activeMood.color}, transparent)`,
        }}
      />
      <motion.div
        key={activeMood.label}
        className="fixed top-[-10%] left-[-5%] w-[60vw] h-[60vw] rounded-full blur-[180px] pointer-events-none z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.07, backgroundColor: activeMood.color }}
        transition={{ duration: 1.2 }}
      />

      {}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-center pt-24 pb-16 overflow-hidden"
      >
        {}
        <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none z-0" />

        <motion.div
          style={{ y: heroY, opacity: heroOp }}
          className="relative z-10 max-w-7xl mx-auto px-5 w-full"
        >
          {}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-0">

            {}
            <motion.div
              className="flex-1 z-10"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              { }
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-mono uppercase tracking-[0.2em] mb-8"
                style={{
                  borderColor: 'var(--emerald)',
                  color: 'var(--emerald)',
                  backgroundColor: 'color-mix(in srgb, var(--emerald) 8%, transparent)',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                System Online · v2.0
              </motion.div>

              {/* Giant headline */}
              <h1 className="leading-[0.88] tracking-tighter mb-8">
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.7 }}
                  className="block text-[clamp(3.5rem,9vw,7.5rem)] font-black uppercase"
                  style={{ color: 'var(--text)' }}
                >
                  Feel
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="block font-serif italic text-[clamp(3rem,8vw,6.5rem)]"
                  style={{
                    background: 'linear-gradient(135deg, var(--violet), var(--rose) 60%, var(--gold))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  the Frequency
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.7 }}
                  className="block text-[clamp(3.5rem,9vw,7.5rem)] font-black uppercase"
                  style={{ color: 'var(--text)' }}
                >
                  Of You.
                </motion.span>
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-base md:text-lg max-w-xl leading-relaxed mb-10"
                style={{ color: 'var(--muted)' }}
              >
                AuraSync reads your biometric signature and routes it to a
                matching acoustic environment — in&nbsp;
                <em className="font-serif not-italic font-medium" style={{ color: 'var(--text)' }}>real time</em>,
                &nbsp;with full on-device privacy.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85 }}
                className="flex flex-wrap gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 40px var(--violet)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/scanner')}
                  className="flex items-center gap-2.5 px-8 py-4 rounded-full font-black uppercase tracking-[0.15em] text-sm text-white shadow-xl"
                  style={{ background: 'linear-gradient(135deg, var(--violet), var(--rose))' }}
                >
                  <ScanFace size={16} />
                  Initialize Scanner
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04, borderColor: 'var(--violet)', color: 'var(--text)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/about')}
                  className="flex items-center gap-2 px-7 py-4 rounded-full font-bold uppercase tracking-[0.12em] text-sm border transition-all duration-300"
                  style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
                >
                  Learn More <ArrowRight size={14} />
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right — Mood orb system */}
            <motion.div
              className="relative flex-shrink-0 w-72 h-72 md:w-[440px] md:h-[440px]"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <OrbitSystem activeMood={activeMood} setActiveMood={setActiveMood} />
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mt-16 flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-2 cursor-pointer opacity-40"
              onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
            >
              <span className="text-[9px] font-mono uppercase tracking-[0.25em]" style={{ color: 'var(--muted)' }}>scroll</span>
              <ChevronDown size={16} style={{ color: 'var(--muted)' }} />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {}
      <section
        className="py-5 border-y overflow-hidden"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
      >
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          className="flex whitespace-nowrap"
        >
          {[...TICKER, ...TICKER, ...TICKER, ...TICKER].map((m, i) => (
            <span key={i} className="inline-flex items-center gap-3 px-6">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em]" style={{ color: 'var(--muted)' }}>
                {m}
              </span>
              <span className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--border)' }} />
            </span>
          ))}
        </motion.div>
      </section>

      {}
      <section className="py-24" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="max-w-7xl mx-auto px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-0 rounded-3xl border overflow-hidden"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
          >
            {STATS.map((s, i) => (
              <div
                key={i}
                className={`p-8 md:p-10 flex flex-col gap-3 relative ${i < STATS.length - 1 ? 'border-r border-b lg:border-b-0' : ''}`}
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="text-5xl md:text-6xl tracking-tighter leading-none">
                  <Counter target={s.value} suffix={s.suffix} />
                </div>
                <p className="text-[10px] font-mono uppercase tracking-[0.25em]" style={{ color: 'var(--muted)' }}>
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 4 — EMOTION GRID
      ═══════════════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden" style={{ backgroundColor: 'var(--surface)' }}>
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-5 relative z-10">

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] mb-3" style={{ color: 'var(--violet)' }}>
                
              </p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter" style={{ color: 'var(--text)' }}>
                Seven States<br />
                <span className="font-serif italic font-normal" style={{ color: 'var(--muted)' }}>of Being</span>
              </h2>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs font-mono" style={{ color: 'var(--muted)' }}>
              <Waves size={14} />
              Click to tune atmosphere
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {MOODS.map((m, i) => (
              <motion.button
                key={m.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -6, scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveMood(m)}
                className="relative flex flex-col items-center gap-4 p-5 rounded-2xl border text-center transition-all duration-300 cursor-pointer overflow-hidden"
                style={{
                  backgroundColor: activeMood.label === m.label ? m.color + '15' : 'var(--surface-2)',
                  borderColor: activeMood.label === m.label ? m.color : 'var(--border)',
                  boxShadow: activeMood.label === m.label ? `0 0 30px ${m.color}30` : 'none',
                }}
              >
                {activeMood.label === m.label && (
                  <motion.div
                    layoutId="moodActive"
                    className="absolute inset-0 rounded-2xl"
                    style={{ background: `radial-gradient(circle at 50% 0%, ${m.color}25, transparent 70%)` }}
                  />
                )}
                {/* Color orb */}
                <div
                  className="w-10 h-10 rounded-full relative z-10 transition-all duration-300"
                  style={{
                    backgroundColor: m.color + '30',
                    border: `2px solid ${m.color}`,
                    boxShadow: activeMood.label === m.label ? `0 0 16px ${m.color}80` : 'none',
                  }}
                />
                <div className="relative z-10">
                  <div className="text-xs font-black uppercase tracking-wider mb-1" style={{ color: m.color }}>
                    {m.label}
                  </div>
                  <div className="text-[9px] font-mono" style={{ color: 'var(--muted)' }}>
                    {m.freq}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Active mood detail */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMood.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-6 flex flex-wrap items-center gap-4 p-5 rounded-2xl border"
              style={{ borderColor: activeMood.color + '50', backgroundColor: activeMood.color + '08' }}
            >
              <div className="flex items-center gap-3">
                <EqBars color={activeMood.color} />
              </div>
              <div className="h-8 w-px hidden sm:block" style={{ backgroundColor: 'var(--border)' }} />
              <div>
                <span className="text-xs font-black uppercase tracking-widest mr-3" style={{ color: activeMood.color }}>
                  {activeMood.label}
                </span>
                <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
                  {activeMood.genre} · {activeMood.freq}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/scanner')}
                className="ml-auto flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-mono uppercase tracking-widest text-white"
                style={{ background: `linear-gradient(135deg, ${activeMood.color}, var(--violet))` }}
              >
                Scan for this mood <ArrowRight size={10} />
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 5 — FEATURES BENTO
      ═══════════════════════════════════════════════════ */}
      <section className="py-24" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="max-w-7xl mx-auto px-5">

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] mb-3" style={{ color: 'var(--muted)' }}>
              
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter" style={{ color: 'var(--text)' }}>
              Built Different.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[180px]">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -5 }}
                  onHoverStart={() => setHoveredFeature(i)}
                  onHoverEnd={() => setHoveredFeature(null)}
                  className={`rounded-2xl border p-7 flex flex-col justify-between relative overflow-hidden cursor-default group ${f.span}`}
                  style={{
                    backgroundColor: 'var(--surface)',
                    borderColor: hoveredFeature === i ? f.color + '50' : 'var(--border)',
                    transition: 'border-color 0.3s',
                  }}
                >
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(circle at 20% 20%, ${f.color}18, transparent 70%)` }}
                  />

                  {/* Icon */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center relative z-10"
                    style={{ border: `1px solid ${f.color}40`, backgroundColor: f.color + '15' }}
                  >
                    <Icon size={20} style={{ color: f.color }} />
                  </div>

                  <div className="relative z-10">
                    <h3
                      className="font-black text-sm uppercase tracking-wider mb-2"
                      style={{ color: f.big ? 'var(--text)' : 'var(--text)' }}
                    >
                      {f.title}
                    </h3>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
                      {f.desc}
                    </p>
                    {f.big && (
                      <motion.button
                        initial={false}
                        animate={{ opacity: hoveredFeature === i ? 1 : 0.5 }}
                        onClick={() => navigate('/scanner')}
                        className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest"
                        style={{ color: f.color }}
                      >
                        Try Scanner <ArrowRight size={10} />
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {}
      <section className="py-24 relative overflow-hidden" style={{ backgroundColor: 'var(--surface)' }}>
        <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-5 relative z-10">

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] mb-3" style={{ color: 'var(--violet)' }}>
              
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter" style={{ color: 'var(--text)' }}>
              Three Steps to<br />
              <span className="font-serif italic font-normal" style={{ color: 'var(--muted)' }}>Sonic Harmony</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connector lines (desktop) */}
            <div
              className="hidden md:block absolute top-[3.5rem] left-[calc(33%-1px)] w-[calc(34%+2px)] h-px"
              style={{ background: 'linear-gradient(90deg, var(--violet), var(--rose))' }}
            />
            <div
              className="hidden md:block absolute top-[3.5rem] left-[calc(66%-1px)] w-[calc(34%+2px)] h-px"
              style={{ background: 'linear-gradient(90deg, var(--rose), var(--gold))' }}
            />

            {[
              { n: '01', title: 'Capture', desc: 'WebRTC grabs a 48×48 px greyscale frame. Fully local — zero upload.', color: 'var(--violet)', icon: ScanFace },
              { n: '02', title: 'Analyse', desc: 'CNN inference classifies your micro-expression in under 60 ms.', color: 'var(--rose)', icon: BrainCircuit },
              { n: '03', title: 'Listen',  desc: 'Matched playlist streams via Spotify or Last.fm.', color: 'var(--gold)', icon: Music2 },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex flex-col items-center text-center p-8 rounded-2xl border relative"
                  style={{ backgroundColor: 'var(--surface-2)', borderColor: 'var(--border)' }}
                >
                  <div
                    className="w-14 h-14 rounded-full border-2 flex items-center justify-center mb-6 relative z-10"
                    style={{
                      borderColor: step.color,
                      backgroundColor: step.color + '15',
                      boxShadow: `0 0 24px ${step.color}40`,
                    }}
                  >
                    <Icon size={22} style={{ color: step.color }} />
                  </div>
                  <div className="text-4xl font-black font-mono mb-2 opacity-10" style={{ color: step.color }}>
                    {step.n}
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-widest mb-3" style={{ color: 'var(--text)' }}>
                    {step.title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {}
      <section className="py-32 relative overflow-hidden" style={{ backgroundColor: 'var(--bg)' }}>
        {/* Dynamic background */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, var(--violet) 0%, transparent 50%, var(--rose) 100%)' }}
        />
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto px-5 text-center relative z-10"
        >
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] mb-6" style={{ color: 'var(--violet)' }}>
           
          </p>
          <h2
            className="text-5xl md:text-7xl xl:text-8xl font-black tracking-tighter leading-[0.9] mb-6"
            style={{ color: 'var(--text)' }}
          >
            Ready to
            <br />
            <span
              className="font-serif italic font-normal"
              style={{
                background: 'linear-gradient(135deg, var(--violet), var(--rose), var(--gold))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              sync?
            </span>
          </h2>
          <p className="text-sm max-w-md mx-auto mb-10" style={{ color: 'var(--muted)' }}>
            Let the scanner read your biometrics and find the perfect acoustic match for this moment.
          </p>
          <motion.button
            whileHover={{ scale: 1.07, boxShadow: '0 0 60px var(--violet)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/scanner')}
            className="inline-flex items-center gap-3 px-10 py-5 rounded-full font-black uppercase tracking-[0.2em] text-sm text-white shadow-2xl"
            style={{ background: 'linear-gradient(135deg, var(--violet), var(--rose))' }}
          >
            <ScanFace size={18} />
            Launch Scanner
          </motion.button>
        </motion.div>
      </section>

    </div>
  );
}

/* ─── Orbit System ───────────────────────────────────────── */
function OrbitSystem({ activeMood, setActiveMood }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 40);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* Center orb */}
      <div
        className="absolute inset-0 m-auto w-24 h-24 rounded-full flex items-center justify-center z-10 float-anim"
        style={{
          background: 'linear-gradient(135deg, var(--violet), var(--rose))',
          boxShadow: `0 0 60px var(--violet), 0 0 120px color-mix(in srgb, var(--violet) 25%, transparent)`,
        }}
      >
        <BrainCircuit size={36} color="white" />
      </div>

      {/* Inner orbit ring */}
      <div
        className="absolute inset-0 m-auto w-52 h-52 rounded-full border spin-slow"
        style={{ borderColor: 'color-mix(in srgb, var(--violet) 20%, transparent)', borderStyle: 'dashed' }}
      />
      {/* Outer orbit ring */}
      <div
        className="absolute inset-0 m-auto w-[340px] h-[340px] rounded-full border"
        style={{
          borderColor: 'color-mix(in srgb, var(--rose) 12%, transparent)',
          borderStyle: 'dashed',
          animation: 'spin-slow 28s linear infinite reverse',
        }}
      />

      {/* Mood orbs */}
      {MOODS.map((m, i) => {
        const angle = ((360 / MOODS.length) * i + tick * 0.04) * (Math.PI / 180);
        const radius = 130;
        const cx = Math.cos(angle) * radius;
        const cy = Math.sin(angle) * radius;
        const isActive = activeMood.label === m.label;
        return (
          <button
            key={m.label}
            onClick={() => setActiveMood(m)}
            className="absolute flex items-center justify-center rounded-full font-black font-mono text-[10px] transition-all duration-300 cursor-pointer"
            style={{
              width: isActive ? 44 : 36,
              height: isActive ? 44 : 36,
              top: '50%',
              left: '50%',
              transform: `translate(calc(-50% + ${cx}px), calc(-50% + ${cy}px))`,
              backgroundColor: m.color + (isActive ? '40' : '20'),
              border: `2px solid ${m.color}${isActive ? '' : '80'}`,
              color: m.color,
              boxShadow: isActive ? `0 0 20px ${m.color}80` : 'none',
              zIndex: 20,
            }}
            title={m.label}
          >
            {m.label.slice(0, 2)}
          </button>
        );
      })}

      {/* Active label */}
      <AnimatePresence>
        <motion.div
          key={activeMood.label}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
          style={{ paddingTop: '110px' }}
        >
          <span
            className="text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border backdrop-blur-md"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--surface) 80%, transparent)',
              borderColor: activeMood.color + '60',
              color: activeMood.color,
            }}
          >
            {activeMood.label}
          </span>
        </motion.div>
      </AnimatePresence>
    </>
  );
}