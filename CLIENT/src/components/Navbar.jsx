import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Camera, LayoutDashboard, Home, Sun, Moon, Music2, Clock, Users, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark]         = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const navLinks = [
    { path: '/',          label: 'Home',      icon: Home },
    { path: '/scanner',   label: 'Scanner',   icon: Camera },
    { path: '/music',     label: 'Music',     icon: Music2 },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/history',   label: 'History',   icon: Clock },
    { path: '/about',     label: 'About',     icon: Users },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? 'py-2 backdrop-blur-2xl border-b'
            : 'py-5 bg-transparent'
        }`}
        style={scrolled ? {
          backgroundColor: 'color-mix(in srgb, var(--bg) 80%, transparent)',
          borderColor: 'var(--border)',
        } : {}}
      >
        <div className="max-w-7xl mx-auto px-5 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group z-10">
            <div className="relative w-7 h-7 flex items-center justify-center">
              <Activity
                size={22}
                style={{ color: 'var(--violet)' }}
                className="group-hover:opacity-0 transition-opacity duration-200"
              />
              <Activity
                size={22}
                style={{ color: 'var(--rose)' }}
                className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              />
            </div>
            <span className="font-black tracking-[0.18em] text-base" style={{ color: 'var(--text)' }}>
              AURA<span style={{ color: 'var(--violet)' }}>SYNC</span>
            </span>
            <span
              className="text-[9px] font-mono px-1.5 py-0.5 rounded border tracking-widest"
              style={{ color: 'var(--emerald)', borderColor: 'var(--emerald)', opacity: 0.7 }}
            >
              v2.0
            </span>
          </Link>

          {/* Desktop nav pill */}
          <div className="hidden lg:flex items-center gap-3">
            <div
              className="flex items-center gap-0.5 px-2 py-1.5 rounded-full border backdrop-blur-xl"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              {navLinks.map(({ path, label, icon: Icon }) => {
                const active = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.12em] font-bold transition-all duration-300"
                    style={{
                      backgroundColor: active ? 'var(--violet)' : 'transparent',
                      color: active ? '#fff' : 'var(--muted)',
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--text)'; }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--muted)'; }}
                  >
                    <Icon size={11} />
                    {label}
                  </Link>
                );
              })}
            </div>

            {/* Theme toggle */}
            <button
              onClick={() => setIsDark(d => !d)}
              className="p-2.5 rounded-full border transition-all duration-300"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
                color: 'var(--muted)',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--violet)'; e.currentTarget.style.color = 'var(--violet)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)'; }}
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>

          {/* Mobile controls */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setIsDark(d => !d)}
              className="p-2 rounded-full border"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--muted)' }}
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="p-2 rounded-full border"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
            className="fixed top-0 left-0 right-0 z-40 pt-20 pb-6 px-4 border-b backdrop-blur-2xl lg:hidden"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--surface) 96%, transparent)',
              borderColor: 'var(--border)',
            }}
          >
            <div className="grid grid-cols-2 gap-2 mt-2">
              {navLinks.map(({ path, label, icon: Icon }) => {
                const active = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all"
                    style={{
                      backgroundColor: active ? 'var(--violet)' : 'var(--surface-2)',
                      borderColor: active ? 'var(--violet)' : 'var(--border)',
                      color: active ? '#fff' : 'var(--muted)',
                    }}
                  >
                    <Icon size={14} />
                    {label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}