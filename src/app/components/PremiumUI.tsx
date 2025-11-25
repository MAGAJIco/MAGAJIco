'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Share2, Star, TrendingUp } from 'lucide-react';

// Apple-level premium micro-interactions
export const PremiumCard = ({ children, className = '', onClick, isFavorite = false, onFavorite }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const [particlePos, setParticlePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setParticlePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`relative group cursor-pointer rounded-xl overflow-hidden ${className}`}
    >
      {/* Glass-morphism background */}
      <motion.div
        animate={{ opacity: isHovered ? 0.8 : 0.6 }}
        className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 dark:from-white/10 dark:to-transparent backdrop-blur-md"
      />

      {/* Shimmer effect on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute w-40 h-40 bg-white/30 rounded-full blur-3xl"
            style={{
              left: particlePos.x - 80,
              top: particlePos.y - 80,
            }}
          />
        )}
      </AnimatePresence>

      {/* Content */}
      <motion.div className="relative z-10" animate={{ y: isHovered ? -2 : 0 }} transition={{ duration: 0.3 }}>
        {children}
      </motion.div>

      {/* Favorite button */}
      {onFavorite && (
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onFavorite();
          }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-300'}`} />
        </motion.button>
      )}
    </motion.div>
  );
};

// Premium stats display
export const PremiumStats = ({ stats }: { stats: Array<{ label: string; value: string | number; icon: React.ReactNode; color: string }> }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-3"
    >
      {stats.map((stat, idx) => (
        <motion.div
          key={idx}
          whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }}
          className={`p-4 rounded-lg bg-gradient-to-br ${stat.color} backdrop-blur-sm border border-white/20`}
        >
          <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
            {stat.icon}
          </motion.div>
          <p className="text-xs font-medium opacity-75 mt-2">{stat.label}</p>
          <p className="text-xl font-bold mt-1">{stat.value}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};

// Premium toast notification
export const PremiumToast = ({ message, type = 'info', onClose }: { message: string; type?: string; onClose?: () => void }) => {
  React.useEffect(() => {
    if (onClose) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [onClose]);

  const bgColor = {
    success: 'from-green-500 to-green-600',
    error: 'from-red-500 to-red-600',
    info: 'from-blue-500 to-blue-600',
  }[type] || 'from-gray-500 to-gray-600';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, x: 100 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: -20, x: 100 }}
      className={`fixed top-4 right-4 px-4 py-3 rounded-lg bg-gradient-to-r ${bgColor} text-white shadow-lg flex items-center gap-3 z-50`}
    >
      <div className="w-2 h-2 rounded-full bg-white/70 animate-pulse" />
      <span>{message}</span>
    </motion.div>
  );
};

// Premium expansion animation component
export const ExpandableSection = ({ title, children, defaultOpen = false }: any) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <motion.div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center justify-between"
      >
        <span className="font-semibold">{title}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          ↓
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="px-4 py-3 bg-white dark:bg-gray-900"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
