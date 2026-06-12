import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CursorFollower() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show on desktop
    const isDesktop = window.innerWidth >= 1024;
    if (!isDesktop) return;

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Radar targeting system */}
      <motion.div
        className="fixed pointer-events-none z-50 hidden lg:block"
        style={{
          left: mousePos.x,
          top: mousePos.y,
        }}
        animate={{
          x: -40,
          y: -40,
          scale: isHovering ? 1.3 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
        }}
      >
        {/* Outer radar ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-blue-400/40"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        {/* Middle ring */}
        <motion.div
          className="absolute inset-2 rounded-full border border-blue-500/50"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.3,
          }}
        />

        {/* Crosshair lines */}
        <div className="absolute inset-0">
          {/* Horizontal line */}
          <motion.div
            className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          {/* Vertical line */}
          <motion.div
            className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-400 to-transparent"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5,
            }}
          />
        </div>

        {/* Center targeting dot */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500"
          animate={{
            scale: [1, 1.3, 1],
            boxShadow: [
              '0 0 4px rgba(59, 130, 246, 0.6)',
              '0 0 12px rgba(59, 130, 246, 0.8)',
              '0 0 4px rgba(59, 130, 246, 0.6)',
            ],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Corner brackets (targeting frame) */}
        <div className="absolute inset-0">
          {/* Top-left */}
          <motion.div
            className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-400"
            animate={{
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          {/* Top-right */}
          <motion.div
            className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-400"
            animate={{
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.2,
            }}
          />
          {/* Bottom-left */}
          <motion.div
            className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-400"
            animate={{
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.4,
            }}
          />
          {/* Bottom-right */}
          <motion.div
            className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-400"
            animate={{
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.6,
            }}
          />
        </div>
      </motion.div>

      {/* Lock-on indicator when hovering */}
      {isHovering && (
      <motion.div
        className="fixed pointer-events-none z-50 hidden lg:block"
        style={{
          left: mousePos.x,
          top: mousePos.y,
        }}
          initial={{ opacity: 0, scale: 0 }}
        animate={{
            x: -30,
            y: -30,
            opacity: 1,
            scale: 1,
        }}
          exit={{ opacity: 0, scale: 0 }}
        transition={{
          type: 'spring',
          stiffness: 300,
            damping: 20,
        }}
      >
          <div className="w-16 h-16 rounded-full border-2 border-green-400 animate-pulse">
            <div className="absolute inset-2 rounded-full border border-green-500/50" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-green-400" />
          </div>
      </motion.div>
      )}
    </>
  );
}
