import React, { useState, useEffect } from 'react';

const Header: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  return (
    <header
      className="flex items-center justify-between px-6 py-3 border-b"
      style={{
        backgroundColor: '#0F1117',
        borderColor: '#1E3A5F',
        borderBottomWidth: '2px',
      }}
    >
      {/* Left: Logo + Subtitle */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3">
          {/* RADAR logo mark */}
          <div
            className="flex items-center justify-center w-9 h-9 rounded"
            style={{ backgroundColor: '#1E3A5F' }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="9" stroke="#3B82F6" strokeWidth="1.5" strokeOpacity="0.4" />
              <circle cx="11" cy="11" r="6" stroke="#3B82F6" strokeWidth="1.5" strokeOpacity="0.6" />
              <circle cx="11" cy="11" r="3" stroke="#3B82F6" strokeWidth="1.5" />
              <line x1="11" y1="2" x2="11" y2="11" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" />
              <circle cx="11" cy="11" r="1.5" fill="#60A5FA" />
            </svg>
          </div>
          <div>
            <div
              className="text-xl font-black tracking-[0.2em] leading-none"
              style={{ color: '#E2E8F0', letterSpacing: '0.22em' }}
            >
              RADAR
            </div>
            <div
              className="text-xs font-medium tracking-widest leading-tight mt-0.5"
              style={{ color: '#64748B', fontSize: '0.6rem', letterSpacing: '0.18em' }}
            >
              SUPPLY CHAIN RISK INTELLIGENCE
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-8" style={{ backgroundColor: '#2A2D3E' }} />

        {/* Sector tag */}
        <div
          className="px-3 py-1 rounded text-xs font-semibold tracking-wider"
          style={{
            backgroundColor: 'rgba(30, 58, 95, 0.6)',
            border: '1px solid #1E3A5F',
            color: '#93C5FD',
            fontSize: '0.65rem',
            letterSpacing: '0.12em',
          }}
        >
          AEROSPACE &amp; DEFENSE
        </div>
      </div>

      {/* Right: Signal Brief badge + timestamp */}
      <div className="flex items-center gap-5">
        {/* Signal Brief badge */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded"
          style={{
            backgroundColor: 'rgba(220, 38, 38, 0.15)',
            border: '1px solid rgba(220, 38, 38, 0.4)',
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: '#DC2626' }}
          />
          <span
            className="text-xs font-bold tracking-wider"
            style={{ color: '#FCA5A5', fontSize: '0.7rem', letterSpacing: '0.1em' }}
          >
            SIGNAL BRIEF — MARCH 2026
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-8" style={{ backgroundColor: '#2A2D3E' }} />

        {/* Timestamp */}
        <div className="text-right">
          <div
            className="font-mono text-sm font-medium"
            style={{ color: '#94A3B8', fontSize: '0.8rem' }}
          >
            {formatTime(currentTime)}
          </div>
          <div
            className="text-xs"
            style={{ color: '#4B5563', fontSize: '0.65rem' }}
          >
            {formatDate(currentTime)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
