import React from 'react';
import { RADAR_CLOCKS } from '../data/clocks';
import ClockCard from './ClockCard';

const LeftPanel: React.FC = () => {
  const critical = RADAR_CLOCKS.filter((c) => c.urgency === 'CRITICAL').length;
  const elevated = RADAR_CLOCKS.filter((c) => c.urgency === 'ELEVATED').length;
  const monitor = RADAR_CLOCKS.filter((c) => c.urgency === 'MONITOR').length;

  return (
    <div
      className="flex flex-col h-full"
      style={{ backgroundColor: '#0F1117' }}
    >
      {/* Panel header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
        style={{ borderColor: '#1E3A5F', backgroundColor: '#0F1117' }}
      >
        <div>
          <div
            className="text-xs font-bold tracking-widest"
            style={{ color: '#3B82F6', fontSize: '0.65rem', letterSpacing: '0.16em' }}
          >
            SEVEN CLOCKS
          </div>
          <div
            className="text-xs mt-0.5"
            style={{ color: '#4B5563', fontSize: '0.6rem' }}
          >
            Active risk timers
          </div>
        </div>
        {/* Urgency summary pills */}
        <div className="flex items-center gap-1.5">
          <span
            className="px-2 py-0.5 rounded-full text-xxs font-bold"
            style={{
              backgroundColor: 'rgba(220, 38, 38, 0.15)',
              color: '#FCA5A5',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              fontSize: '0.6rem',
            }}
          >
            {critical} CRIT
          </span>
          <span
            className="px-2 py-0.5 rounded-full text-xxs font-bold"
            style={{
              backgroundColor: 'rgba(217, 119, 6, 0.15)',
              color: '#FCD34D',
              border: '1px solid rgba(217, 119, 6, 0.3)',
              fontSize: '0.6rem',
            }}
          >
            {elevated} ELEV
          </span>
          <span
            className="px-2 py-0.5 rounded-full text-xxs font-bold"
            style={{
              backgroundColor: 'rgba(22, 163, 74, 0.15)',
              color: '#86EFAC',
              border: '1px solid rgba(22, 163, 74, 0.3)',
              fontSize: '0.6rem',
            }}
          >
            {monitor} MON
          </span>
        </div>
      </div>

      {/* Clocks list */}
      <div
        className="flex-1 overflow-y-auto p-3 space-y-2.5"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#2A2D3E #0F1117' }}
      >
        {RADAR_CLOCKS.map((clock, index) => (
          <ClockCard key={clock.id} clock={clock} index={index} />
        ))}
      </div>
    </div>
  );
};

export default LeftPanel;
