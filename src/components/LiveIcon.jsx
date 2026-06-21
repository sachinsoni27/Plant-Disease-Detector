import React from 'react';
import { motion } from 'framer-motion';

const animations = {
  pulse: {
    animate: { scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] },
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
  },
  float: {
    animate: { y: [0, -5, 0] },
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
  },
  spin: {
    animate: { rotate: [0, 360] },
    transition: { duration: 4, repeat: Infinity, ease: "linear" }
  },
  bounce: {
    animate: { y: [0, -8, 0] },
    transition: { duration: 1.5, repeat: Infinity, ease: "easeOut" }
  },
  wiggle: {
    animate: { rotate: [-5, 5, -5] },
    transition: { duration: 0.5, repeat: Infinity, ease: "easeInOut" }
  },
  none: {}
};

export default function LiveIcon({ icon: Icon, type = "pulse", size = 24, className = "", delay = 0, ...props }) {
  if (!Icon) return null;
  
  const selectedAnimation = animations[type] || animations.pulse;
  
  return (
    <motion.div
      className={`inline-flex items-center justify-center ${className}`}
      animate={selectedAnimation.animate}
      transition={{ 
        ...selectedAnimation.transition, 
        delay 
      }}
      {...props}
    >
      <Icon size={size} />
    </motion.div>
  );
}
