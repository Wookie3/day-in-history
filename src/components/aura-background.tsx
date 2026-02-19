'use client';

import { motion } from 'framer-motion';

export function AuraBackground() {
  return (
    <div className="aura-bg">
      <motion.div 
        className="aura-blob aura-blob-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.05, 0.12, 0.08] }}
        transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
      />
      <motion.div 
        className="aura-blob aura-blob-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.03, 0.1, 0.05] }}
        transition={{ duration: 7, delay: 1, repeat: Infinity, repeatType: "reverse" }}
      />
      <motion.div 
        className="aura-blob aura-blob-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.02, 0.08, 0.04] }}
        transition={{ duration: 9, delay: 2, repeat: Infinity, repeatType: "reverse" }}
      />
    </div>
  );
}
