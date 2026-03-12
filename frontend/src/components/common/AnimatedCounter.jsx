import React, { useState, useEffect, useRef } from 'react';
import { Typography, Box } from '@mui/material';

const AnimatedCounter = ({ 
  end, 
  duration = 2000, 
  suffix = '', 
  prefix = '',
  variant = 'h4',
  color = 'primary.main',
  ...props 
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * end);
      
      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isVisible, end, duration]);

  return (
    <Box ref={counterRef} {...props}>
      <Typography 
        variant={variant} 
        sx={{ 
          fontWeight: 800, 
          color: color,
          background: color === 'primary.main' 
            ? 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)'
            : 'inherit',
          WebkitBackgroundClip: color === 'primary.main' ? 'text' : 'inherit',
          WebkitTextFillColor: color === 'primary.main' ? 'transparent' : 'inherit',
          backgroundClip: color === 'primary.main' ? 'text' : 'inherit',
        }}
      >
        {prefix}{count.toLocaleString()}{suffix}
      </Typography>
    </Box>
  );
};

export default AnimatedCounter;
