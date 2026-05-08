import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function AmbientBackground() {
  const canvasRef = useRef(null);

  // Star field
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let stars = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    }

    function initStars() {
      const area = canvas.width * canvas.height;
      const count = Math.floor(area / 8000);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 0.5 + Math.random() * 1.5,
        baseOpacity: 0.2 + Math.random() * 0.4,
        twinkleSpeed: 0.5 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
      }));
    }

    function draw(time) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const star of stars) {
        const opacity = star.baseOpacity + Math.sin(time * 0.001 * star.twinkleSpeed + star.phase) * 0.2;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, opacity)})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    }

    resize();
    animId = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
      {/* Layer 1: Star field */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Layer 2: Aurora blobs */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 500, height: 500, top: '10%', left: '20%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          filter: 'blur(120px)',
        }}
        animate={{ x: [0, 80, -40, 0], y: [0, -60, 40, 0] }}
        transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 400, height: 400, top: '50%', right: '10%',
          background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)',
          filter: 'blur(120px)',
        }}
        animate={{ x: [0, -60, 30, 0], y: [0, 50, -30, 0] }}
        transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 450, height: 450, bottom: '20%', left: '40%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)',
          filter: 'blur(120px)',
        }}
        animate={{ x: [0, 50, -70, 0], y: [0, -40, 60, 0] }}
        transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
      />

      {/* Layer 3: Grid overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
        <defs>
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}
