// src/index.tsx
import React from 'react';

export const GlassifyUI = () => {
  return (
    <div style={{
      backdropFilter: 'blur(12px)',
      background: 'rgba(255,255,255,0.3)',
      borderRadius: '16px',
      padding: '1rem',
      border: '1px solid rgba(255,255,255,0.2)',
    }}>
      Glassify UI Component
    </div>
  );
};

export default GlassifyUI;