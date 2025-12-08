'use client';

import React from 'react';

/**
 * Providers wrapper for the application
 * Currently using Zustand which doesn't require a provider
 * This file is included for future extensibility (e.g., React Query, Auth Context, etc.)
 */

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <>{children}</>;
}