'use client';

import React, { useEffect } from 'react';
import { Check, X, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
  actionLabel?: string;
  onAction?: (() => void) | null;
}

export default function Toast({ message, type = 'info', duration = 3000, onClose, actionLabel, onAction }: ToastProps) {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const typeConfig = {
    success: { bg: 'bg-green-900/90', border: 'border-green-700', icon: Check, text: 'text-green-100' },
    error: { bg: 'bg-red-900/90', border: 'border-red-700', icon: X, text: 'text-red-100' },
    warning: { bg: 'bg-yellow-900/90', border: 'border-yellow-700', icon: AlertCircle, text: 'text-yellow-100' },
    info: { bg: 'bg-blue-900/90', border: 'border-blue-700', icon: Info, text: 'text-blue-100' },
  };

  const config = typeConfig[type];
  const IconComponent = config.icon;

  return (
    <div
      className={`fixed bottom-24 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 ${config.bg} border ${config.border} rounded-lg p-4 flex items-center gap-3 animate-slideIn shadow-lg z-50`}
      role="status"
      aria-live="polite"
    >
      <IconComponent size={20} className={config.text} />
      <span className={`text-sm font-medium ${config.text}`}>{message}</span>
      {actionLabel && onAction && (
        <button
          onClick={() => {
            onAction();
            onClose && onClose();
          }}
          className={`ml-3 px-3 py-1 rounded bg-white/10 text-sm font-semibold ${config.text} hover:opacity-90 transition`}
        >
          {actionLabel}
        </button>
      )}
      {onClose && (
        <button
          onClick={onClose}
          className={`ml-auto flex-shrink-0 ${config.text} hover:opacity-75 transition-opacity`}
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
