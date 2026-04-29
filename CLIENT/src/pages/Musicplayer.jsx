import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Play, Pause, SkipForward, SkipBack, Volume2, Shuffle, Repeat, Music2, ScanFace } from 'lucide-react';

// Sample audio link used for testing the audible player
const SAMPLE_AUDIO = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

const PLAYLISTS = {
  Happy: {
    color: '#F59E0B',
    desc: 'High valence · High energy · Upbeat tempo',
    params: { valence: 92, energy: 84, tempo: 128 },
    tracks: [
      { title: 'Brown Munde',       artist: 'AP Dhillon',       dur: '3:27', bpm: 104, src: SAMPLE_AUDIO },
      { title: 'Blinding Lights',   artist: 'The Weeknd',       dur: '3:20', bpm: 171, src: SAMPLE_AUDIO },
      { title: '52 Gaj Ka Daman',   artist: 'Renuka Panwar',    dur: '2:55', bpm: 110, src: SAMPLE_AUDIO },
      { title: 'Desi Girl',         artist: 'Sunidhi Chauhan',  dur: '5:06', bpm: 120, src: SAMPLE_AUDIO },
      { title: 'Levitating',        artist: 'Dua Lipa',         dur: '3:24', bpm: 103, src: SAMPLE_AUDIO },
      { title: 'Bijlee Bijlee',     artist: 'Harrdy Sandhu',    dur: '2:48', bpm: 100, src: SAMPLE_AUDIO },
      { title: 'Sauda Khara Khara', artist: 'Diljit Dosanjh',   dur: '3:15', bpm: 125, src: SAMPLE_AUDIO },
      { title: 'Dance Monkey',      artist: 'Tones and I',      dur: '3:29', bpm: 98,  src: SAMPLE_AUDIO },
      { title: 'Shape of You',      artist: 'Ed Sheeran',       dur: '3:53', bpm: 96,  src: SAMPLE_AUDIO },
      { title: 'High Rated Gabru',  artist: 'Guru Randhawa',    dur: '3:35', bpm: 105, src: SAMPLE_AUDIO },
      { title: 'Coka',              artist: 'Sukhe',            dur: '3:05', bpm: 110, src: SAMPLE_AUDIO },
      { title: 'Lamberghini',       artist: 'The Doorbeen',     dur: '3:00', bpm: 115, src: SAMPLE_AUDIO },
      { title: 'Don\'t Start Now',  artist: 'Dua Lipa',         dur: '3:03', bpm: 124, src: SAMPLE_AUDIO },
      { title: 'Watermelon Sugar',  artist: 'Harry Styles',     dur: '2:54', bpm: 95,  src: SAMPLE_AUDIO },
      { title: 'London Thumakda',   artist: 'Labh Janjua',      dur: '3:50', bpm: 130, src: SAMPLE_AUDIO },
    ],
  },
  Sad: {
    color: '#3B82F6',
    desc: 'Low valence · Low energy · Slow tempo',
    params: { valence: 22, energy: 28, tempo: 72 },
    tracks: [
      { title: 'Channa Mereya',    artist: 'Arijit Singh',      dur: '4:49', bpm: 86,  src: SAMPLE_AUDIO },
      { title: 'Someone Like You',  artist: 'Adele',             dur: '4:47', bpm: 67,  src: SAMPLE_AUDIO },
      { title: 'Qismat',            artist: 'Ammy Virk',         dur: '3:22', bpm: 80,  src: SAMPLE_AUDIO },
      { title: 'The Night We Met',  artist: 'Lord Huron',        dur: '3:28', bpm: 91,  src: SAMPLE_AUDIO },
      { title: 'Luka Chuppi',       artist: 'A.R. Rahman',       dur: '6:36', bpm: 85,  src: SAMPLE_AUDIO },
      { title: 'Agar Tum Saath Ho', artist: 'Alka Yagnik',       dur: '5:41', bpm: 115, src: SAMPLE_AUDIO },
      { title: 'Kabira',            artist: 'Tochi Raina',       dur: '3:43', bpm: 85,  src: SAMPLE_AUDIO },
      { title: 'Let Her Go',        artist: 'Passenger',         dur: '4:12', bpm: 75,  src: SAMPLE_AUDIO },
      { title: 'Fix You',           artist: 'Coldplay',          dur: '4:55', bpm: 69,  src: SAMPLE_AUDIO },
      { title: 'Shayad',            artist: 'Arijit Singh',      dur: '4:07', bpm: 90,  src: SAMPLE_AUDIO },
      { title: 'Mann Bharryaa',     artist: 'B Praak',           dur: '4:25', bpm: 78,  src: SAMPLE_AUDIO },
      { title: 'Tune Jo Na Kaha',   artist: 'Mohit Chauhan',     dur: '5:10', bpm: 82,  src: SAMPLE_AUDIO },
      { title: 'All of Me',         artist: 'John Legend',       dur: '4:29', bpm: 120, src: SAMPLE_AUDIO },
      { title: 'Yeh Dooriyaan',     artist: 'Mohit Chauhan',     dur: '4:25', bpm: 92,  src: SAMPLE_AUDIO },
      { title: 'Taaron Ke Shehar',  artist: 'Neha Kakkar',       dur: '3:50', bpm: 88,  src: SAMPLE_AUDIO },
    ],
  },
  Angry: {
    color: '#EF4444',
    desc: 'Low valence · Very high energy · Aggressive',
    params: { valence: 18, energy: 96, tempo: 156 },
    tracks: [
      { title: '295',               artist: 'Sidhu Moose Wala',  dur: '4:30', bpm: 96,  src: SAMPLE_AUDIO },
      { title: 'Killing in the Name',artist:'Rage Against…',     dur: '5:13', bpm: 108, src: SAMPLE_AUDIO },
      { title: 'System Pe System',  artist: 'Raju Punjabi',      dur: '3:10', bpm: 130, src: SAMPLE_AUDIO },
      { title: 'Aarambh Hai Prachand',artist:'Piyush Mishra',    dur: '5:24', bpm: 140, src: SAMPLE_AUDIO },
      { title: 'Break Stuff',       artist: 'Limp Bizkit',       dur: '2:47', bpm: 118, src: SAMPLE_AUDIO },
      { title: 'Jee Karda',         artist: 'Divya Kumar',       dur: '3:50', bpm: 145, src: SAMPLE_AUDIO },
      { title: 'Sadda Haq',         artist: 'Mohit Chauhan',     dur: '6:04', bpm: 130, src: SAMPLE_AUDIO },
      { title: 'Apna Time Aayega',  artist: 'Ranveer Singh',     dur: '2:20', bpm: 102, src: SAMPLE_AUDIO },
      { title: 'Rap God',           artist: 'Eminem',            dur: '6:03', bpm: 148, src: SAMPLE_AUDIO },
      { title: 'Numb',              artist: 'Linkin Park',       dur: '3:05', bpm: 105, src: SAMPLE_AUDIO },
      { title: 'Moosedrilla',       artist: 'Sidhu Moose Wala',  dur: '3:50', bpm: 140, src: SAMPLE_AUDIO },
      { title: 'Believer',          artist: 'Imagine Dragons',   dur: '3:24', bpm: 125, src: SAMPLE_AUDIO },
      { title: 'Lose Yourself',     artist: 'Eminem',            dur: '5:20', bpm: 171, src: SAMPLE_AUDIO },
      { title: 'Zinda',             artist: 'Siddharth M.',      dur: '3:30', bpm: 120, src: SAMPLE_AUDIO },
      { title: 'Blood In The Water',artist: 'grandson',          dur: '2:56', bpm: 154, src: SAMPLE_AUDIO },
    ],
  },
  Fear: {
    color: '#A855F7',
    desc: 'Low valence · High arousal · Tense atmosphere',
    params: { valence: 30, energy: 70, tempo: 110 },
    tracks: [
      { title: 'Bhool Bhulaiyaa',   artist: 'Neeraj Shridhar',   dur: '5:12', bpm: 124, src: SAMPLE_AUDIO },
      { title: 'In the Air Tonight',artist: 'Phil Collins',      dur: '5:33', bpm: 109, src: SAMPLE_AUDIO },
      { title: 'Warning Shots',     artist: 'Sidhu Moose Wala',  dur: '3:20', bpm: 95,  src: SAMPLE_AUDIO },
      { title: 'Creep',             artist: 'Radiohead',         dur: '3:56', bpm: 92,  src: SAMPLE_AUDIO },
      { title: 'Gumnaam Hai Koi',   artist: 'Lata Mangeshkar',   dur: '5:10', bpm: 85,  src: SAMPLE_AUDIO },
      { title: 'Sound of Silence',  artist: 'Disturbed',         dur: '4:08', bpm: 76,  src: SAMPLE_AUDIO },
      { title: 'Mad World',         artist: 'Tears for Fears',   dur: '3:31', bpm: 88,  src: SAMPLE_AUDIO },
      { title: 'Hurt',              artist: 'Nine Inch Nails',   dur: '3:38', bpm: 90,  src: SAMPLE_AUDIO },
      { title: 'Aami Je Tomar',     artist: 'Shreya Ghoshal',    dur: '4:50', bpm: 98,  src: SAMPLE_AUDIO },
      { title: 'Jashn-E-Bahaara',   artist: 'A.R. Rahman',       dur: '5:15', bpm: 90,  src: SAMPLE_AUDIO },
      { title: 'Bury A Friend',     artist: 'Billie Eilish',     dur: '3:13', bpm: 120, src: SAMPLE_AUDIO },
      { title: 'Thriller',          artist: 'Michael Jackson',   dur: '5:57', bpm: 118, src: SAMPLE_AUDIO },
      { title: 'Stranger Things',   artist: 'Kyle Dixon',        dur: '1:07', bpm: 84,  src: SAMPLE_AUDIO },
      { title: 'The Phantom',       artist: 'Andrew Lloyd',      dur: '4:10', bpm: 105, src: SAMPLE_AUDIO },
      { title: 'Aahatein',          artist: 'Agnee',             dur: '4:20', bpm: 85,  src: SAMPLE_AUDIO },
    ],
  },
  Surprise: {
    color: '#F97316',
    desc: 'Variable valence · High energy · Dynamic',
    params: { valence: 65, energy: 88, tempo: 135 },
    tracks: [
      { title: 'Naatu Naatu',       artist: 'Rahul Sipligunj',   dur: '3:34', bpm: 115, src: SAMPLE_AUDIO },
      { title: 'Mr. Brightside',    artist: 'The Killers',       dur: '3:42', bpm: 148, src: SAMPLE_AUDIO },
      { title: 'Mundian To Bach Ke',artist: 'Panjabi MC',        dur: '3:20', bpm: 98,  src: SAMPLE_AUDIO },
      { title: 'Gypsy',             artist: 'G.D. Kaur',         dur: '3:15', bpm: 110, src: SAMPLE_AUDIO },
      { title: 'Can\'t Stop',       artist: 'Red Hot…',          dur: '4:29', bpm: 92,  src: SAMPLE_AUDIO },
      { title: 'Jumper',            artist: 'Third Eye Blind',   dur: '4:11', bpm: 106, src: SAMPLE_AUDIO },
      { title: 'Rocketman',         artist: 'Elton John',        dur: '4:41', bpm: 126, src: SAMPLE_AUDIO },
      { title: 'Born to Run',       artist: 'Bruce Springsteen', dur: '4:30', bpm: 168, src: SAMPLE_AUDIO },
      { title: 'Chogada',           artist: 'Darshan Raval',     dur: '4:09', bpm: 130, src: SAMPLE_AUDIO },
      { title: 'Zingaat',           artist: 'Ajay-Atul',         dur: '3:46', bpm: 118, src: SAMPLE_AUDIO },
      { title: 'Kala Chashma',      artist: 'Badshah',           dur: '3:07', bpm: 105, src: SAMPLE_AUDIO },
      { title: 'Uptown Funk',       artist: 'Bruno Mars',        dur: '4:30', bpm: 115, src: SAMPLE_AUDIO },
      { title: 'Tunak Tunak Tun',   artist: 'Daler Mehndi',      dur: '5:03', bpm: 150, src: SAMPLE_AUDIO },
      { title: 'Jai Ho',            artist: 'A.R. Rahman',       dur: '5:42', bpm: 110, src: SAMPLE_AUDIO },
      { title: 'Boom Boom Pow',     artist: 'Black Eyed Peas',   dur: '4:11', bpm: 130, src: SAMPLE_AUDIO },
    ],
  },
  Disgust: {
    color: '#22C55E',
    desc: 'Low valence · Moderate energy · Introspective',
    params: { valence: 28, energy: 45, tempo: 94 },
    tracks: [
      { title: 'Asli Hip Hop',      artist: 'Ranveer Singh',     dur: '1:38', bpm: 90,  src: SAMPLE_AUDIO },
      { title: 'Loser',             artist: 'Beck',              dur: '3:55', bpm: 83,  src: SAMPLE_AUDIO },
      { title: 'Moosedrilla',       artist: 'Sidhu Moose Wala',  dur: '3:50', bpm: 140, src: SAMPLE_AUDIO },
      { title: 'Numb',              artist: 'Linkin Park',       dur: '3:05', bpm: 89,  src: SAMPLE_AUDIO },
      { title: 'Gully Boy Rap',     artist: 'Naezy',             dur: '2:50', bpm: 95,  src: SAMPLE_AUDIO },
      { title: 'Black Hole Sun',    artist: 'Soundgarden',       dur: '5:18', bpm: 78,  src: SAMPLE_AUDIO },
      { title: 'Lithium',           artist: 'Nirvana',           dur: '4:17', bpm: 120, src: SAMPLE_AUDIO },
      { title: 'Fake Plastic Trees',artist: 'Radiohead',         dur: '4:50', bpm: 74,  src: SAMPLE_AUDIO },
      { title: 'Machayenge',        artist: 'Emiway Bantai',     dur: '2:50', bpm: 100, src: SAMPLE_AUDIO },
      { title: 'Bhaag D.K. Bose',   artist: 'Ram Sampath',       dur: '4:05', bpm: 135, src: SAMPLE_AUDIO },
      { title: 'Smells Like Teen',  artist: 'Nirvana',           dur: '5:01', bpm: 116, src: SAMPLE_AUDIO },
      { title: 'Paint It, Black',   artist: 'The Rolling Stones',dur: '3:45', bpm: 160, src: SAMPLE_AUDIO },
      { title: 'Chop Suey!',        artist: 'System Of A Down',  dur: '3:30', bpm: 126, src: SAMPLE_AUDIO },
      { title: 'People = Shit',     artist: 'Slipknot',          dur: '3:35', bpm: 138, src: SAMPLE_AUDIO },
      { title: 'Vibe Hai',          artist: 'Divine',            dur: '3:10', bpm: 96,  src: SAMPLE_AUDIO },
    ],
  },
  Neutral: {
    color: '#94A3B8',
    desc: 'Moderate valence · Moderate energy · Steady',
    params: { valence: 55, energy: 52, tempo: 105 },
    tracks: [
      { title: 'Iktara',            artist: 'Kavita Seth',       dur: '4:13', bpm: 110, src: SAMPLE_AUDIO },
      { title: 'Redbone',           artist: 'Childish Gambino',  dur: '5:26', bpm: 82,  src: SAMPLE_AUDIO },
      { title: 'Lover',             artist: 'Diljit Dosanjh',    dur: '3:14', bpm: 100, src: SAMPLE_AUDIO },
      { title: 'Electric Feel',     artist: 'MGMT',              dur: '3:49', bpm: 108, src: SAMPLE_AUDIO },
      { title: 'Kho Gaye Hum Kahan',artist: 'Jasleen Royal',     dur: '3:33', bpm: 95,  src: SAMPLE_AUDIO },
      { title: 'Do I Wanna Know?',  artist: 'Arctic Monkeys',    dur: '4:32', bpm: 85,  src: SAMPLE_AUDIO },
      { title: 'Midnight City',     artist: 'M83',               dur: '4:04', bpm: 106, src: SAMPLE_AUDIO },
      { title: 'Sweater Weather',   artist: 'The Neighbourhood', dur: '4:00', bpm: 127, src: SAMPLE_AUDIO },
      { title: 'Sham',              artist: 'Amit Trivedi',      dur: '4:25', bpm: 80,  src: SAMPLE_AUDIO },
      { title: 'Safarnama',         artist: 'Lucky Ali',         dur: '4:12', bpm: 102, src: SAMPLE_AUDIO },
      { title: 'Ilahi',             artist: 'Arijit Singh',      dur: '3:48', bpm: 132, src: SAMPLE_AUDIO },
      { title: 'Kabira (Encore)',   artist: 'Arijit Singh',      dur: '4:29', bpm: 85,  src: SAMPLE_AUDIO },
      { title: 'Sunflower',         artist: 'Post Malone',       dur: '2:38', bpm: 90,  src: SAMPLE_AUDIO },
      { title: 'Circles',           artist: 'Post Malone',       dur: '3:35', bpm: 120, src: SAMPLE_AUDIO },
      { title: 'Dreams',            artist: 'Fleetwood Mac',     dur: '4:17', bpm: 120, src: SAMPLE_AUDIO },
    ],
  },
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function MusicPlayer() {
  const query      = useQuery();
  const navigate   = useNavigate();
  const urlMood    = query.get('mood');

  const [selectedMood, setMood] = useState(
    urlMood && PLAYLISTS[urlMood] ? urlMood : 'Happy'
  );
  const [trackIdx, setTrackIdx] = useState(0);
  const [playing, setPlaying]   = useState(false);
  const [progress, setProgress] = useState(0);
  const [shuffle, setShuffle]   = useState(false);
  const [repeat, setRepeat]     = useState(false);
  const [volume, setVolume]     = useState(80);
  
  // Create a reference to our HTML5 Audio element
  const audioRef = useRef(null);

  const playlist = PLAYLISTS[selectedMood];
  const track    = playlist.tracks[trackIdx];

  // 1. Sync React playing state with the actual audio element
  useEffect(() => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.play().catch(err => console.log("Audio play error:", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [playing, trackIdx, selectedMood]);

  // 2. Sync volume to the audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // 3. Reset when mood changes
  useEffect(() => {
    setTrackIdx(0);
    setProgress(0);
    setPlaying(false);
  }, [selectedMood]);

  function handleNext() {
    if (shuffle) {
      setTrackIdx(Math.floor(Math.random() * playlist.tracks.length));
    } else {
      setTrackIdx(i => (i + 1) % playlist.tracks.length);
    }
    setProgress(0);
  }

  function handlePrev() {
    setTrackIdx(i => (i - 1 + playlist.tracks.length) % playlist.tracks.length);
    setProgress(0);
  }

  // Handle live progress updates from the audio tag
  function handleTimeUpdate() {
    if (audioRef.current && audioRef.current.duration) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setProgress((current / total) * 100);
    }
  }

  // Scrubbing the progress bar
  function handleSeek(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = pct * audioRef.current.duration;
      setProgress(pct * 100);
    }
  }

  const col = playlist.color;
  const { valence, energy, tempo } = playlist.params;

  return (
    <div className="min-h-screen pt-24 pb-24" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Hidden Audible Player */}
      <audio 
        ref={audioRef}
        src={track.src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={repeat ? () => audioRef.current.play() : handleNext}
      />

      <div className="max-w-5xl mx-auto px-5">
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.3em] mb-2" style={{ color: col }}>
          
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter" style={{ color: 'var(--text)' }}>
            MOOD PLAYER
          </h1>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {Object.entries(PLAYLISTS).map(([mood, data]) => (
            <button
              key={mood}
              onClick={() => setMood(mood)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all duration-300"
              style={{
                backgroundColor: selectedMood === mood ? data.color + '25' : 'var(--surface)',
                borderColor:     selectedMood === mood ? data.color : 'var(--border)',
                color:           selectedMood === mood ? data.color : 'var(--muted)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: data.color }} />
              {mood}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Player Card */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <motion.div
              key={selectedMood}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl border p-8 relative overflow-hidden"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ backgroundColor: col }} />

              <div className="relative w-full aspect-square max-w-[220px] mx-auto rounded-2xl mb-8 flex items-center justify-center overflow-hidden" style={{ backgroundColor: col + '18', border: `1px solid ${col}40` }}>
                <motion.div animate={{ rotate: playing ? 360 : 0 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} className="w-32 h-32 rounded-full border-4 flex items-center justify-center" style={{ borderColor: col, backgroundColor: col + '15' }}>
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: col }} />
                </motion.div>
                {playing && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 items-end">
                    {[...Array(8)].map((_, i) => <span key={i} className="eq-bar" style={{ backgroundColor: col }} />)}
                  </div>
                )}
              </div>

              <div className="text-center mb-6 relative z-10">
                <motion.h2 key={track.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-black tracking-tight mb-1" style={{ color: 'var(--text)' }}>
                  {track.title}
                </motion.h2>
                <p className="text-sm font-mono" style={{ color: 'var(--muted)' }}>{track.artist}</p>
                <p className="text-[10px] font-mono mt-1" style={{ color: col }}>{track.bpm} BPM</p>
              </div>

              {/* Interactive Progress Bar */}
              <div className="mb-6 relative z-10">
                <div
                  className="h-1.5 rounded-full overflow-hidden cursor-pointer"
                  style={{ backgroundColor: 'var(--surface-2)' }}
                  onClick={handleSeek}
                >
                  <motion.div className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: col }} transition={{ duration: 0 }} />
                </div>
                <div className="flex justify-between text-[9px] font-mono mt-1" style={{ color: 'var(--muted)' }}>
                  <span>{formatProgress(progress, track.dur)}</span>
                  <span>{track.dur}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 relative z-10">
                <button onClick={() => setShuffle(s => !s)} style={{ color: shuffle ? col : 'var(--muted)' }} className="transition-colors"><Shuffle size={16} /></button>
                <button onClick={handlePrev} style={{ color: 'var(--text)' }}><SkipBack size={20} /></button>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setPlaying(p => !p)}
                  className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl"
                  style={{ backgroundColor: col, boxShadow: `0 0 30px ${col}50` }}
                >
                  {playing ? <Pause size={22} color="white" /> : <Play size={22} color="white" />}
                </motion.button>
                <button onClick={handleNext} style={{ color: 'var(--text)' }}><SkipForward size={20} /></button>
                <button onClick={() => setRepeat(r => !r)} style={{ color: repeat ? col : 'var(--muted)' }} className="transition-colors"><Repeat size={16} /></button>
              </div>

              <div className="flex items-center gap-2 mt-5 relative z-10">
                <Volume2 size={13} style={{ color: 'var(--muted)' }} />
                <input type="range" min="0" max="100" value={volume} onChange={e => setVolume(Number(e.target.value))} className="flex-1 accent-[var(--violet)] h-1 cursor-pointer" />
                <span className="text-[10px] font-mono w-6 text-right" style={{ color: 'var(--muted)' }}>{volume}</span>
              </div>
            </motion.div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <motion.div key={selectedMood + '-params'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
              <p className="text-[10px] font-mono uppercase tracking-[0.25em] mb-4" style={{ color: 'var(--muted)' }}>Acoustic Parameters</p>
              <p className="text-[10px] italic font-serif mb-4" style={{ color: col }}>{playlist.desc}</p>
              {[{ label: 'Valence', value: valence }, { label: 'Energy', value: energy }, { label: 'Tempo', value: Math.round((tempo / 200) * 100) }].map(p => (
                <div key={p.label} className="mb-3">
                  <div className="flex justify-between text-[10px] font-mono mb-1">
                    <span style={{ color: 'var(--text)' }}>{p.label}</span>
                    <span style={{ color: col }}>{p.value}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--surface-2)' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${p.value}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} className="h-full rounded-full" style={{ backgroundColor: col }} />
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Scrollable Playlist Queue */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="rounded-2xl border p-5 flex-1 max-h-[350px] overflow-y-auto" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
              <p className="text-[10px] font-mono uppercase tracking-[0.25em] mb-4 sticky top-0 bg-[var(--surface)] z-10 py-1" style={{ color: 'var(--muted)' }}>
                Queue · {playlist.tracks.length} tracks
              </p>
              <div className="space-y-1.5">
                {playlist.tracks.map((t, i) => {
                  const isActive = i === trackIdx;
                  return (
                    <button
                      key={i}
                      onClick={() => { setTrackIdx(i); setProgress(0); setPlaying(true); }}
                      className="w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-200 group"
                      style={{ backgroundColor: isActive ? col + '18' : 'transparent', borderColor: isActive ? col + '50' : 'transparent' }}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'var(--surface-2)'; }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <div className="flex items-center gap-2.5">
                        {isActive && playing ? (
                          <div className="flex gap-[2px] items-end h-4">
                            {[...Array(4)].map((_, j) => <span key={j} className="eq-bar" style={{ backgroundColor: col, height: `${8 + j * 4}px` }} />)}
                          </div>
                        ) : (
                          <span className="text-[10px] font-mono w-4" style={{ color: isActive ? col : 'var(--muted)' }}>{String(i + 1).padStart(2, '0')}</span>
                        )}
                        <div>
                          <p className="text-xs font-bold" style={{ color: isActive ? col : 'var(--text)' }}>{t.title}</p>
                          <p className="text-[10px] font-mono truncate max-w-[120px]" style={{ color: 'var(--muted)' }}>{t.artist}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono" style={{ color: 'var(--muted)' }}>{t.dur}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            <button onClick={() => navigate('/scanner')} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all" style={{ borderColor: 'var(--border)', color: 'var(--muted)', backgroundColor: 'var(--surface)' }}>
              <ScanFace size={13} /> Rescan for a new mood
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatProgress(pct, dur) {
  const parts = dur.split(':').map(Number);
  const total = parts[0] * 60 + parts[1];
  const current = Math.floor((pct / 100) * total);
  const m = Math.floor(current / 60);
  const s = current % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}