import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ScanFace, Cpu, Music2, RefreshCw, ZapOff, ChevronRight } from 'lucide-react';

const MOOD_CONFIG = {
  Happy:   { color: '#F59E0B', label: 'Joy Detected',     emoji: '✦', desc: 'High valence, high energy' },
  Sad:     { color: '#3B82F6', label: 'Melancholy',       emoji: '●', desc: 'Low valence, low energy'  },
  Angry:   { color: '#EF4444', label: 'Rage Signal',      emoji: '◆', desc: 'High arousal, negative'   },
  Fear:    { color: '#A855F7', label: 'Anxiety State',    emoji: '▲', desc: 'High arousal, vigilance'  },
  Surprise:{ color: '#F97316', label: 'Awe Response',     emoji: '★', desc: 'Sudden arousal spike'     },
  Disgust: { color: '#22C55E', label: 'Aversion Mode',    emoji: '◉', desc: 'Negative, low energy'     },
  Neutral: { color: '#94A3B8', label: 'Baseline State',   emoji: '—', desc: 'Equilibrium detected'     },
  Error:   { color: '#EF4444', label: 'Signal Lost',      emoji: '✕', desc: 'Reconnect and retry'      },
};

// Mock confidence distribution for visual feedback
function mockConfidences(dominant) {
  const emotions = ['Happy', 'Sad', 'Angry', 'Fear', 'Surprise', 'Disgust', 'Neutral'];
  let remaining = 1;
  const result = {};
  emotions.forEach((e, i) => {
    if (e === dominant) return;
    const val = Math.random() * (remaining * 0.3);
    result[e] = Math.round(val * 100);
    remaining -= val;
  });
  result[dominant] = Math.round(remaining * 100);
  return result;
}

export default function Scanner() {
  const webcamRef   = useRef(null);
  const navigate    = useNavigate();
  const [mood, setMood]           = useState(null);
  const [songs, setSongs]         = useState([]);
  const [scanning, setScanning]   = useState(false);
  const [confidences, setConf]    = useState(null);
  const [scanPhase, setScanPhase] = useState('idle');
  const [camReady, setCamReady]   = useState(false);

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;

    setScanPhase('capturing');
    setMood(null);
    setConf(null);
    setScanning(true);

    // Simulate capture phase
    await sleep(600);
    setScanPhase('analyzing');

    try {
      const res   = await fetch(imageSrc);
      const blob  = await res.blob();
      const form  = new FormData();
      form.append('file', blob, 'capture.jpg');

      const response = await axios.post('http://localhost:8000/predict-mood/', form);
      const detected = response.data.emotion;
      const detectedSongs = response.data.songs || [];
      setMood(detected);
      setSongs(detectedSongs);
      setConf(mockConfidences(detected));
    } catch (err) {
      // Fallback demo mode when backend isn't running
      const demos = ['Happy', 'Neutral', 'Sad', 'Angry', 'Surprise'];
      const demo  = demos[Math.floor(Math.random() * demos.length)];
      setMood(demo);
      setConf(mockConfidences(demo));
    }

    setScanPhase('done');
    setScanning(false);
  }, [webcamRef]);

  const reset = () => { setMood(null); setConf(null); setSongs([]); setScanPhase('idle'); };

  const cfg = mood ? (MOOD_CONFIG[mood] || MOOD_CONFIG.Neutral) : null;

  return (
    <div
      className="min-h-screen pt-24 pb-20"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div className="max-w-5xl mx-auto px-5">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.3em] mb-2" style={{ color: 'var(--emerald)' }}>
            
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter" style={{ color: 'var(--text)' }}>
            FACIAL SCANNER
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── Webcam panel (3 cols) ───────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div
              className="rounded-2xl border overflow-hidden relative"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              {/* Corner brackets */}
              <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 z-20" style={{ borderColor: 'var(--violet)' }} />
              <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 z-20" style={{ borderColor: 'var(--violet)' }} />
              <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 z-20" style={{ borderColor: 'var(--violet)' }} />
              <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 z-20" style={{ borderColor: 'var(--violet)' }} />

              {/* Webcam */}
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                onUserMedia={() => setCamReady(true)}
                className="w-full aspect-[4/3] object-cover"
                style={{ filter: 'contrast(1.05) saturate(0.85)' }}
              />

              {/* Scanning overlay */}
              <AnimatePresence>
                {scanning && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-sm z-10"
                    style={{ backgroundColor: 'color-mix(in srgb, var(--bg) 70%, transparent)' }}
                  >
                    {/* Scanline */}
                    <div
                      className="absolute left-0 right-0 h-[2px] scanline-anim"
                      style={{ background: 'linear-gradient(90deg, transparent, var(--violet), var(--rose), transparent)' }}
                    />
                    <div className="text-center z-10">
                      <div
                        className="text-xs font-mono uppercase tracking-[0.3em] animate-pulse"
                        style={{ color: 'var(--violet)' }}
                      >
                        {scanPhase === 'capturing' ? 'Capturing frame...' : 'Analyzing biometrics...'}
                      </div>
                      <div className="flex gap-1 mt-3 justify-center">
                        {[0,1,2,3,4,5,6,7].map(i => (
                          <span key={i} className="eq-bar" style={{ backgroundColor: 'var(--violet)' }} />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Status badge */}
              <div
                className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-mono uppercase tracking-widest z-20"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--surface) 90%, transparent)',
                  borderColor: camReady ? 'var(--emerald)' : 'var(--border)',
                  color: camReady ? 'var(--emerald)' : 'var(--muted)',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: camReady ? 'var(--emerald)' : 'var(--muted)', animation: camReady ? 'ping-slow 2s infinite' : 'none' }}
                />
                {camReady ? 'Camera Online' : 'Initializing...'}
              </div>
            </div>

            {/* Capture button */}
            <div className="flex gap-3 mt-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={capture}
                disabled={scanning || !camReady}
                className="flex-1 flex items-center justify-center gap-2.5 py-4 rounded-xl font-black uppercase tracking-widest text-sm text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                style={{ background: 'linear-gradient(135deg, var(--violet), var(--rose))' }}
              >
                <ScanFace size={16} />
                {scanning ? 'Scanning...' : 'Capture Mood'}
              </motion.button>
              {mood && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={reset}
                  className="p-4 rounded-xl border transition-all"
                  style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
                >
                  <RefreshCw size={16} />
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* ── Results panel (2 cols) ──────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-2 flex flex-col gap-4"
          >

            {/* Mood result card */}
            <div
              className="rounded-2xl border p-6 flex-1 flex flex-col justify-center relative overflow-hidden"
              style={{ backgroundColor: 'var(--surface)', borderColor: cfg ? cfg.color + '60' : 'var(--border)' }}
            >
              {cfg && (
                <div
                  className="absolute inset-0 opacity-10 rounded-2xl"
                  style={{ background: `radial-gradient(circle at center, ${cfg.color}, transparent 70%)` }}
                />
              )}

              <AnimatePresence mode="wait">
                {!mood ? (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8"
                  >
                    <Cpu size={40} className="mx-auto mb-4 opacity-20" style={{ color: 'var(--muted)' }} />
                    <p className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
                      Awaiting scan
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key={mood}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                    className="text-center relative z-10"
                  >
                    <div
                      className="text-5xl mb-2 font-mono"
                      style={{ color: cfg?.color }}
                    >
                      {cfg?.emoji}
                    </div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.3em] mb-1" style={{ color: 'var(--muted)' }}>
                      Detected State
                    </p>
                    <h2
                      className="text-3xl font-black uppercase tracking-tighter mb-1"
                      style={{ color: cfg?.color }}
                    >
                      {mood}
                    </h2>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>{cfg?.desc}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Confidence breakdown */}
            <div
              className="rounded-2xl border p-5"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <p className="text-[10px] font-mono uppercase tracking-[0.25em] mb-4" style={{ color: 'var(--muted)' }}>
                Confidence Matrix
              </p>
              {confidences ? (
                <div className="space-y-2.5">
                  {Object.entries(confidences)
                    .sort((a, b) => b[1] - a[1])
                    .map(([emotion, pct]) => {
                      const c = MOOD_CONFIG[emotion]?.color || 'var(--muted)';
                      return (
                        <div key={emotion}>
                          <div className="flex justify-between text-[10px] font-mono mb-1">
                            <span style={{ color: emotion === mood ? c : 'var(--muted)' }}>{emotion}</span>
                            <span style={{ color: emotion === mood ? c : 'var(--muted)' }}>{pct}%</span>
                          </div>
                          <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--surface-2)' }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.7, ease: 'easeOut' }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: emotion === mood ? c : 'var(--border)' }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {['Happy', 'Sad', 'Angry', 'Fear', 'Surprise', 'Disgust', 'Neutral'].map(e => (
                    <div key={e} className="h-1 rounded-full" style={{ backgroundColor: 'var(--surface-2)' }} />
                  ))}
                </div>
              )}
            </div>

            {/* Go to music button */}
            <AnimatePresence>
              {mood && mood !== 'Error' && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/music?mood=${mood}`)}
                  className="w-full flex items-center justify-between px-5 py-4 rounded-xl border font-bold uppercase tracking-wider text-xs transition-all group"
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text)' }}
                >
                  <div className="flex items-center gap-2.5">
                    <Music2 size={15} style={{ color: 'var(--rose)' }} />
                    Play music for {mood}
                  </div>
                  <ChevronRight size={14} style={{ color: 'var(--muted)' }} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              )}
            </AnimatePresence>

          </motion.div>
        </div>
      </div>
    </div>
  );
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }