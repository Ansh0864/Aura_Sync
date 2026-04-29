import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Cursor from './components/Cursor';
import Home from './pages/Home';
import Scanner from './pages/Scanner';
import Dashboard from './pages/Dashboard';
import MoodHistory from './pages/MoodHistory';
import MusicPlayer from './pages/MusicPlayer';
import About from './pages/About';

export default function App() {
  return (
    <div className="grain min-h-screen transition-colors duration-500">
      <Cursor />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/scanner"   element={<Scanner />} />
          <Route path="/music"     element={<MusicPlayer />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history"   element={<MoodHistory />} />
          <Route path="/about"     element={<About />} />
        </Routes>
      </Router>
    </div>
  );
}