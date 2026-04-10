import React from 'react';
import Header from './components/Header';
import LeftPanel from './components/LeftPanel';
import LensFramework from './components/LensFramework';
import RiskMap from './components/RiskMap';
import RightPanel from './components/RightPanel';
import PurposeStrip from './components/PurposeStrip';

const App: React.FC = () => {
  return (
    <div
      className="flex flex-col"
      style={{
        backgroundColor: '#0F1117',
        minHeight: '100vh',
        minWidth: '1280px',
      }}
    >
      {/* ── Header ── */}
      <Header />

      {/* ── Purpose strip ── */}
      <PurposeStrip />

      {/* ── Main 3-column layout ── */}
      <main
        className="flex overflow-hidden"
        style={{
          flex: '1 1 0',
          height: 'calc(100vh - 57px - 56px - 32px)',
        }}
      >
        {/* Left — Seven Clocks */}
        <aside
          className="flex-shrink-0 flex flex-col overflow-hidden border-r"
          style={{ width: '295px', borderColor: '#1E3A5F' }}
        >
          <LeftPanel />
        </aside>

        {/* Centre — Lens Framework (top) + Risk Map (bottom) */}
        <div
          className="flex flex-col flex-1 overflow-hidden border-r"
          style={{ borderColor: '#1E3A5F' }}
        >
          {/* Top half: Lens Framework */}
          <div
            className="overflow-hidden border-b flex-shrink-0"
            style={{
              height: '50%',
              borderColor: '#1E3A5F',
            }}
          >
            <LensFramework />
          </div>

          {/* Bottom half: Risk Map */}
          <div className="flex-1 overflow-hidden">
            <RiskMap />
          </div>
        </div>

        {/* Right — Impact Summary */}
        <aside
          className="flex-shrink-0 flex flex-col overflow-hidden"
          style={{ width: '375px' }}
        >
          <RightPanel />
        </aside>
      </main>

      {/* ── Footer ── */}
      <footer
        className="flex-shrink-0 flex items-center justify-between px-6"
        style={{
          backgroundColor: '#0F1117',
          borderTop: '1px solid #151820',
          height: '32px',
        }}
      >
        <div className="flex items-center gap-2">
          {['RADAR', 'AIMleap', 'March 2026', 'CONFIDENTIAL'].map((item, i) => (
            <React.Fragment key={item}>
              {i > 0 && (
                <span style={{ color: '#1A2030', fontSize: '0.58rem' }}>—</span>
              )}
              <span
                style={{
                  color: '#374151',
                  fontSize: '0.58rem',
                  letterSpacing: i === 0 || i === 3 ? '0.14em' : '0',
                  fontWeight: i === 0 || i === 3 ? 700 : 400,
                }}
              >
                {item}
              </span>
            </React.Fragment>
          ))}
        </div>
        <div
          className="flex items-center gap-2"
          style={{ color: '#1E2A3A', fontSize: '0.55rem' }}
        >
          <span>7 active risk clocks</span>
          <span>·</span>
          <span>9 analytical lenses</span>
          <span>·</span>
          <span>Supply Chain Intelligence Platform v2.0</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
