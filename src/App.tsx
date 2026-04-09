import React from 'react';
import Header from './components/Header';
import LeftPanel from './components/LeftPanel';
import RiskMap from './components/RiskMap';
import RightPanel from './components/RightPanel';

const App: React.FC = () => {
  return (
    <div
      className="flex flex-col"
      style={{
        backgroundColor: '#0F1117',
        minHeight: '100vh',
        minWidth: '1024px',
      }}
    >
      {/* Header */}
      <Header />

      {/* Main content — three-column layout */}
      <main
        className="flex flex-1 overflow-hidden"
        style={{
          height: 'calc(100vh - 57px - 32px)',
        }}
      >
        {/* Left panel — Seven Clocks */}
        <aside
          className="flex-shrink-0 border-r overflow-hidden flex flex-col"
          style={{
            width: '320px',
            borderColor: '#1E3A5F',
            backgroundColor: '#0F1117',
          }}
        >
          <LeftPanel />
        </aside>

        {/* Centre panel — Global Risk Map */}
        <div
          className="flex flex-col border-r overflow-hidden"
          style={{
            flex: '1 1 0',
            borderColor: '#1E3A5F',
            backgroundColor: '#0F1117',
          }}
        >
          <RiskMap />
        </div>

        {/* Right panel — Impact Summary */}
        <aside
          className="flex-shrink-0 overflow-hidden flex flex-col"
          style={{
            width: '340px',
            backgroundColor: '#0F1117',
          }}
        >
          <RightPanel />
        </aside>
      </main>

      {/* Footer */}
      <footer
        className="flex-shrink-0 flex items-center justify-between px-6 py-2"
        style={{
          backgroundColor: '#0F1117',
          borderTop: '1px solid #1A1D2E',
          height: '32px',
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="font-bold tracking-widest"
            style={{ color: '#374151', fontSize: '0.58rem', letterSpacing: '0.14em' }}
          >
            RADAR
          </span>
          <span style={{ color: '#1E2A3A', fontSize: '0.58rem' }}>—</span>
          <span style={{ color: '#374151', fontSize: '0.58rem' }}>AIMleap</span>
          <span style={{ color: '#1E2A3A', fontSize: '0.58rem' }}>—</span>
          <span style={{ color: '#374151', fontSize: '0.58rem' }}>March 2026</span>
          <span style={{ color: '#1E2A3A', fontSize: '0.58rem' }}>—</span>
          <span
            style={{ color: '#374151', fontSize: '0.58rem', letterSpacing: '0.06em' }}
          >
            CONFIDENTIAL
          </span>
        </div>
        <div
          className="flex items-center gap-2"
          style={{ color: '#1E2A3A', fontSize: '0.55rem' }}
        >
          <span>7 active risk clocks</span>
          <span>·</span>
          <span>7 exposure nodes</span>
          <span>·</span>
          <span>Supply Chain Intelligence Platform v1.0</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
