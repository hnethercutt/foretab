'use client';
import { useLoading } from '@/hooks/use-loading';
import { CircularProgress, Backdrop } from '@mui/material';
import React from 'react';

export function LoadingSpinner() {
  const { loading } = useLoading();

  // Stop displaying the spinner once loading completes
  if (!loading) {
    return null;
  }

  function GradientCircularProgress() {
    return (
        <React.Fragment>
            <svg width={0} height={0}>
                <defs>
                    <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#64B5F6" />
                        <stop offset="100%" stopColor="#87EEBA" />
                    </linearGradient>
                </defs>
            </svg>
            <CircularProgress
                enableTrackSlot
                size="3rem"
                aria-label="Loading..."
                sx={{
                    'svg circle': {
                        stroke: 'url(#my_gradient)'
                    }
                }}
            />
        </React.Fragment>
    );
  }

  return (
    <Backdrop
      open={loading}
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.modal + 1,
      }}
    >
      <GradientCircularProgress />
    </Backdrop>
  );
}
