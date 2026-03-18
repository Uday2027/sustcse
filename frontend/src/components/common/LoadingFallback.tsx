import React from 'react';

export default function LoadingFallback() {
  return (
    <div className="loading-fallback">
      <div className="loading-fallback__content">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
        </div>
        <p className="loading-text">Loading Excellence...</p>
      </div>
      <style>{`
        .loading-fallback {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          width: 100%;
          background: transparent;
        }
        .loading-fallback__content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }
        .loading-text {
          font-family: var(--font-mono);
          font-size: 0.85rem;
          color: var(--color-accent);
          text-transform: uppercase;
          letter-spacing: 0.2em;
          animation: pulse 2s infinite ease-in-out;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
