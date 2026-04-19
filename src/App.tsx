import React, { useState } from 'react';
import Header from './components/Header';
import LeftPanel from './components/LeftPanel';
import LensFramework from './components/LensFramework';
import RiskMap from './components/RiskMap';
import RightPanel from './components/RightPanel';
import PurposeStrip from './components/PurposeStrip';
import SupplierRiskMonitor from './components/SupplierRiskMonitor';

type View = 'dashboard' | 'supplier-monitor';

const NAV_TABS: { id: View; label: string; badge?: string }[] = [
  { id: 'dashboard', label: 'RADAR Dashboard' },
  { id: 'supplier-monitor', label: 'Supplier Risk Monitor', badge: 'NEW' },
];

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#0F1117',
        minHeight: '100vh',
        minWidth: '1280px',
      }}
    >
      {/* ── Header ── */}
      <Header />

      {/* ── View nav tabs ── */}
      <div
        style={{
          flexShrink: 0,
          backgroundColor: '#0A0C16',
          borderBottom: '1px solid #1E3A5F',
          display: 'flex',
          alignItems: 'flex-end',
          padding: '0 24px',
          gap: 2,
        }}
      >
        {NAV_TABS.map((tab) => {
          const active = view === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                padding: '10px 16px',
                background: 'none',
                border: 'none',
                borderBottom: active
                  ? '2px solid #3B82F6'
                  : '2px solid transparent',
                color: active ? '#60A5FA' : '#4B5563',
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                cursor: 'pointer',
                transition: 'color 0.15s, border-color 0.15s',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label.toUpperCase()}
              {tab.badge && (
                <span
                  style={{
                    backgroundColor: 'rgba(59,130,246,0.2)',
                    color: '#60A5FA',
                    border: '1px solid rgba(59,130,246,0.35)',
                    borderRadius: 4,
                    padding: '1px 5px',
                    fontSize: '0.48rem',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Dashboard view ── */}
      {view === 'dashboard' && (
        <>
          {/* Purpose strip */}
          <PurposeStrip />

          {/* Three-column main */}
          <main
            style={{
              display: 'flex',
              flex: '1 1 0',
              overflow: 'hidden',
              height: 'calc(100vh - 57px - 42px - 56px - 32px)',
            }}
          >
            {/* Left — Seven Clocks */}
            <aside
              style={{
                width: 295,
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                borderRight: '1px solid #1E3A5F',
              }}
            >
              <LeftPanel />
            </aside>

            {/* Centre — Lens Framework (top) + Risk Map (bottom) */}
            <div
              style={{
                flex: '1 1 0',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                borderRight: '1px solid #1E3A5F',
              }}
            >
              <div
                style={{
                  height: '50%',
                  flexShrink: 0,
                  overflow: 'hidden',
                  borderBottom: '1px solid #1E3A5F',
                }}
              >
                <LensFramework />
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <RiskMap />
              </div>
            </div>

            {/* Right — Impact Summary */}
            <aside
              style={{
                width: 375,
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <RightPanel />
            </aside>
          </main>
        </>
      )}

      {/* ── Supplier Monitor view ── */}
      {view === 'supplier-monitor' && (
        <div
          style={{
            flex: '1 1 0',
            overflow: 'hidden',
            height: 'calc(100vh - 57px - 42px - 32px)',
          }}
        >
          <SupplierRiskMonitor />
        </div>
      )}

      {/* ── Footer ── */}
      <footer
        style={{
          flexShrink: 0,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          backgroundColor: '#0F1117',
          borderTop: '1px solid #151820',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {['RADAR', 'AIMleap', 'March 2026', 'CONFIDENTIAL'].map(
            (item, i) => (
              <React.Fragment key={item}>
                {i > 0 && (
                  <span style={{ color: '#1A2030', fontSize: '0.58rem' }}>
                    —
                  </span>
                )}
                <span
                  style={{
                    color: '#374151',
                    fontSize: '0.58rem',
                    letterSpacing: i === 0 || i === 3 ? '0.14em' : 0,
                    fontWeight: i === 0 || i === 3 ? 700 : 400,
                  }}
                >
                  {item}
                </span>
              </React.Fragment>
            ),
          )}
        </div>
        <div style={{ color: '#1E2A3A', fontSize: '0.55rem' }}>
          7 risk clocks · 9 lenses · 4 supplier profiles · v2.1
        </div>
      </footer>
    </div>
  );
};

export default App;
