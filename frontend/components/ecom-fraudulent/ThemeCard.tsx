'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ThemeCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
}

/**
 * ThemeCard - A unified card component that automatically adapts to theme changes
 * Uses semantic color tokens (bg-card, text-card-foreground, border-border)
 * that switch between light and dark themes based on the 'dark' class on <html>
 */
export default function ThemeCard({ 
  children, 
  className,
  variant = 'default'
}: ThemeCardProps) {
  const baseClasses = 'bg-card text-card-foreground border-border rounded-2xl';
  
  const variantClasses = {
    default: 'border shadow-md',
    elevated: 'border shadow-lg',
    outlined: 'border-2 shadow-sm',
  };

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)}>
      {children}
    </div>
  );
}

