import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const chars = "-_~`!@#$%^&*()+=[]{}|;:,.<>?/";

export default function DecryptText({ text, speed = 50, delay = 0, className = "" }) {
  const [displayText, setDisplayText] = useState('');
  const [isScrambling, setIsScrambling] = useState(true);

  useEffect(() => {
    let interval;
    let counter = 0;
    
    const startScramble = () => {
      interval = setInterval(() => {
        setDisplayText(
          text.split('').map((char, index) => {
            if (index < counter) return char;
            return chars[Math.floor(Math.random() * chars.length)];
          }).join('')
        );

        if (counter >= text.length) {
          clearInterval(interval);
          setIsScrambling(false);
        }
        
        counter += 1 / 3; // Controls how fast it resolves
      }, speed);
    };

    const timer = setTimeout(startScramble, delay);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [text, speed, delay]);

  return (
    <motion.span className={className}>
      {displayText}
    </motion.span>
  );
}