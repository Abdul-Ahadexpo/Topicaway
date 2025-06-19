import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Enhanced Gradient Background with Dark Mode Support */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900" />
      
      {/* Persistent Slow-Moving 3D Particles */}
      <div className="absolute inset-0">
        {/* Slow Moving Vertical Particles */}
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400/40 to-purple-400/40 dark:from-blue-300/60 dark:to-purple-300/60 rounded-full shadow-lg"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -window.innerHeight - 100],
              x: [0, Math.sin(i) * 50],
              opacity: [0, 0.8, 0.8, 0],
              scale: [0.5, 1, 1, 0.5],
            }}
            transition={{
              duration: 25 + Math.random() * 15, // Very slow movement
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 20
            }}
          />
        ))}
        
        {/* Large 3D Cubes - Slow Movement */}
        <motion.div
          className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 dark:from-blue-300/30 dark:to-cyan-300/30 rounded-lg shadow-lg"
          style={{
            transform: 'perspective(1000px) rotateX(45deg) rotateY(45deg)',
          }}
          animate={{
            y: [0, -window.innerHeight - 100],
            x: [0, 30],
            rotateX: [45, 405],
            rotateY: [45, 405],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <motion.div
          className="absolute top-40 right-20 w-12 h-12 bg-gradient-to-br from-purple-400/25 to-pink-400/25 dark:from-purple-300/35 dark:to-pink-300/35 rounded-lg shadow-lg"
          style={{
            transform: 'perspective(1000px) rotateX(-30deg) rotateY(60deg)',
          }}
          animate={{
            y: [0, -window.innerHeight - 100],
            x: [0, -40],
            rotateX: [-30, -390],
            rotateY: [60, 420],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear",
            delay: 5
          }}
        />
        
        <motion.div
          className="absolute bottom-32 left-1/4 w-20 h-20 bg-gradient-to-br from-yellow-400/15 to-orange-400/15 dark:from-yellow-300/25 dark:to-orange-300/25 rounded-xl shadow-xl"
          style={{
            transform: 'perspective(1000px) rotateX(30deg) rotateY(-45deg)',
          }}
          animate={{
            y: [0, -window.innerHeight - 100],
            x: [0, 50],
            rotateX: [30, 390],
            rotateY: [-45, -405],
          }}
          transition={{
            duration: 45,
            repeat: Infinity,
            ease: "linear",
            delay: 10
          }}
        />
        
        {/* 3D Spheres - Slow Floating */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`sphere-${i}`}
            className="absolute w-8 h-8 bg-gradient-to-br from-indigo-400/30 to-blue-400/30 dark:from-indigo-300/40 dark:to-blue-300/40 rounded-full shadow-lg"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: 'perspective(1000px)',
            }}
            animate={{
              y: [0, -window.innerHeight - 100],
              x: [0, Math.sin(i * 2) * 60],
              scale: [0.8, 1.2, 0.8],
              rotateY: [0, 360],
            }}
            transition={{
              duration: 30 + i * 3,
              repeat: Infinity,
              ease: "linear",
              delay: i * 2
            }}
          />
        ))}
        
        {/* 3D Triangular Prisms - Slow Rotation */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={`triangle-${i}`}
            className="absolute w-0 h-0 border-l-6 border-r-6 border-b-10 border-l-transparent border-r-transparent border-b-violet-400/20 dark:border-b-violet-300/30 shadow-lg"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: 'perspective(1000px) rotateX(45deg) rotateZ(30deg)',
            }}
            animate={{
              y: [0, -window.innerHeight - 100],
              x: [0, Math.cos(i) * 40],
              rotateX: [45, 405],
              rotateZ: [30, 390],
            }}
            transition={{
              duration: 38 + i * 2,
              repeat: Infinity,
              ease: "linear",
              delay: i * 3
            }}
          />
        ))}
        
        {/* Floating 3D Rings - Continuous Slow Movement */}
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={`ring-${i}`}
            className="absolute border-3 border-cyan-400/20 dark:border-cyan-300/30 rounded-full shadow-lg"
            style={{
              width: `${12 + i * 4}px`,
              height: `${12 + i * 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: 'perspective(1000px) rotateX(75deg)',
            }}
            animate={{
              y: [0, -window.innerHeight - 100],
              x: [0, Math.sin(i * 1.5) * 30],
              rotateY: [0, 360],
              rotateX: [75, 435],
            }}
            transition={{
              duration: 42 + i * 4,
              repeat: Infinity,
              ease: "linear",
              delay: i * 4
            }}
          />
        ))}
        
        {/* 3D Hexagons - Slow Drift */}
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={`hexagon-${i}`}
            className="absolute w-8 h-8 bg-gradient-to-br from-amber-400/20 to-yellow-400/20 dark:from-amber-300/30 dark:to-yellow-300/30 shadow-lg"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              transform: 'perspective(1000px) rotateX(30deg) rotateY(45deg)',
            }}
            animate={{
              y: [0, -window.innerHeight - 100],
              x: [0, Math.sin(i * 3) * 45],
              rotateY: [45, 405],
              rotateX: [30, 390],
            }}
            transition={{
              duration: 36 + i * 5,
              repeat: Infinity,
              ease: "linear",
              delay: i * 6
            }}
          />
        ))}
        
        {/* Floating 3D Diamonds - Gentle Movement */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={`diamond-${i}`}
            className="absolute w-6 h-6 bg-gradient-to-br from-fuchsia-400/25 to-purple-400/25 dark:from-fuchsia-300/35 dark:to-purple-300/35 shadow-lg"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              transform: 'perspective(1000px) rotateX(45deg) rotateZ(45deg)',
            }}
            animate={{
              y: [0, -window.innerHeight - 100],
              x: [0, Math.cos(i * 2) * 35],
              rotateZ: [45, 405],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 33 + i * 3,
              repeat: Infinity,
              ease: "linear",
              delay: i * 2.5
            }}
          />
        ))}
      </div>
      
      {/* Enhanced Mesh Gradient Overlays with Dark Mode */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 dark:via-gray-800/10 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/10 dark:via-blue-900/20 to-transparent" />
      
      {/* Subtle Light Rays with Dark Mode */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-300/20 dark:via-blue-400/30 to-transparent"
          animate={{
            opacity: [0.2, 0.6, 0.2],
            scaleY: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-purple-300/20 dark:via-purple-400/30 to-transparent"
          animate={{
            opacity: [0.3, 0.7, 0.3],
            scaleY: [1.1, 0.9, 1.1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
        />
      </div>
    </div>
  );
};

export default AnimatedBackground;