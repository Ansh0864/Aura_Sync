import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function Cursor() {
  const [visible, setVisible]   = useState(false);
  const [clicked, setClicked]   = useState(false);
  const [onLink, setOnLink]     = useState(false);
  const [ripples, setRipples]   = useState([]);
  const rippleId = useRef(0);

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  const x = useSpring(rawX, { damping: 28, stiffness: 280, mass: 0.4 });
  const y = useSpring(rawY, { damping: 28, stiffness: 280, mass: 0.4 });

  // Trailing dot (slower spring)
  const tx = useSpring(rawX, { damping: 40, stiffness: 120, mass: 0.8 });
  const ty = useSpring(rawY, { damping: 40, stiffness: 120, mass: 0.8 });

  useEffect(() => {
    const onMove = (e) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const onDown = (e) => {
      setClicked(true);
      const id = rippleId.current++;
      setRipples(r => [...r, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 600);
    };

    const onUp = () => setClicked(false);

    const checkLink = (e) => {
      const el = e.target;
      const isInteractive = el.closest('a, button, [role="button"], input, textarea, select, label');
      setOnLink(!!isInteractive);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousemove', checkLink);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mouseleave', () => setVisible(false));
    window.addEventListener('mouseenter', () => setVisible(true));

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousemove', checkLink);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
    };
  }, [visible]);

  if (typeof window === 'undefined') return null;

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block"
        style={{
          x: tx,
          y: ty,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            width:  onLink ? 44 : clicked ? 20 : 32,
            height: onLink ? 44 : clicked ? 20 : 32,
            opacity: visible ? 1 : 0,
            borderColor: onLink ? 'var(--rose)' : 'var(--violet)',
          }}
          transition={{ duration: 0.2 }}
          className="rounded-full border"
          style={{ borderWidth: 1.5 }}
        />
      </motion.div>

      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block"
        style={{
          x,
          y,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            width:  onLink ? 6 : 5,
            height: onLink ? 6 : 5,
            opacity: visible ? 1 : 0,
            backgroundColor: onLink ? 'var(--rose)' : 'var(--violet)',
          }}
          transition={{ duration: 0.15 }}
          className="rounded-full"
        />
      </motion.div>

      {/* Click ripples */}
      {ripples.map(r => (
        <div
          key={r.id}
          className="fixed pointer-events-none z-[9998] hidden md:block"
          style={{
            left: r.x,
            top: r.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            className="rounded-full border"
            style={{
              width: 40,
              height: 40,
              borderColor: 'var(--violet)',
              borderWidth: 1,
              animation: 'ping-slow 0.6s ease-out forwards',
            }}
          />
        </div>
      ))}
    </>
  );
}