'use client'

import {useEffect } from 'react'
const ScrollProg = () => {
    useEffect(() => {
      const updateProgress = () => {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const maxScroll = documentHeight - windowHeight;
        const scrollPercentage = (scrollPosition / maxScroll) * 100;
  
        document.documentElement.style.setProperty('--scroll-progress', `${scrollPercentage}%`);
      };
  
      window.addEventListener('scroll', updateProgress);
  
      return () => {
        window.removeEventListener('scroll', updateProgress);
      };
    }, []);
  
    return (
      <div className='transition-none fixed top-0 left-0 z-30 h-[2px] bg-slate-600' style={{ width: 'var(--scroll-progress, 0%)' }} />
    );
  };
  
  export default ScrollProg;