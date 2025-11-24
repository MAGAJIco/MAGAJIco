
'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';

interface ThemeAwareCardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function ThemeAwareCard({ children, className = '', hoverable = true }: ThemeAwareCardProps) {
  return (
    <div 
      className={`card ${hoverable ? 'hover-lift' : ''} ${className}`}
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        color: 'var(--text-primary)',
      }}
    >
      {children}
    </div>
  );
}

interface ThemeAwareButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export function ThemeAwareButton({ 
  children, 
  variant = 'primary', 
  onClick, 
  className = '',
  disabled = false 
}: ThemeAwareButtonProps) {
  const baseStyles = {
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'all 0.3s ease',
  };

  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, var(--gradient-from), var(--gradient-to))',
      color: 'white',
      border: 'none',
    },
    secondary: {
      background: 'var(--bg-secondary)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-color)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-primary)',
      border: 'none',
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{ ...baseStyles, ...variantStyles[variant] }}
    >
      {children}
    </button>
  );
}

interface ThemeAwareInputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export function ThemeAwareInput({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  className = '' 
}: ThemeAwareInputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={className}
      style={{
        background: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '8px 12px',
        width: '100%',
      }}
    />
  );
}

export function ThemeAwareBadge({ 
  children, 
  variant = 'default',
  className = '' 
}: { 
  children: React.ReactNode; 
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'live';
  className?: string;
}) {
  const variantColors = {
    default: { bg: 'var(--bg-tertiary)', color: 'var(--text-primary)' },
    success: { bg: 'var(--success)', color: 'white' },
    warning: { bg: 'var(--warning)', color: 'white' },
    error: { bg: 'var(--error)', color: 'white' },
    info: { bg: 'var(--info)', color: 'white' },
    live: { bg: 'var(--live)', color: 'white' },
  };

  return (
    <span
      className={`badge badge-${variant} ${className}`}
      style={{
        background: variantColors[variant].bg,
        color: variantColors[variant].color,
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '0.875rem',
        fontWeight: 600,
      }}
    >
      {children}
    </span>
  );
}
