'use client';

import { useState, useEffect } from 'react';

export function useTheme() {
  // Default to dark mode (will be updated immediately by useEffect)
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Check if dark class exists on html element
    const checkTheme = () => {
      const htmlElement = document.documentElement;
      const hasDarkClass = htmlElement.classList.contains('dark');
      setIsDarkMode(hasDarkClass);
    };

    // Initial check
    checkTheme();

    // Watch for changes using MutationObserver
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return isDarkMode;
}

