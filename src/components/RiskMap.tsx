import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MAP_MARKERS } from '../data/clocks';
import type { Urgency } from '../types';

const URGENCY_COLORS: Record<Urgency, string> = {
  CRITICAL: '#DC2626',
  ELEVATED: '#D97706',
  MONITOR: '#16A34A',
};

const URGENCY_GLOW: Record<Urgency, string> = {
  CRITICAL: 'rgba(220, 38, 38, 0.5)',
  ELEVATED: 'rgba(217, 119, 6, 0.5)',
  MONITOR: 'rgba(22, 163, 74, 0.5)',
};

function createMarkerIcon(urgency: Urgency): L.DivIcon {
  const color = URGENCY_COLORS[urgency];
  const glow = URGENCY_GLOW[urgency];
  const isPulsing = urgency === 'CRITICAL';

  return L.divIcon({
    className: '',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -12],
    html: `
      <div style="
        position: relative;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        ${
          isPulsing
            ? `<div style="
            position: absolute;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: ${glow};
            animation: radarPulse 2s infinite;
            top: -2px;
            left: -2px;
          "></div>`
            : ''
        }
        <div style="
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: ${color};
          border: 2px solid rgba(255,255,255,0.3);
          box-shadow: 0 0 8px ${glow}, 0 0 16px ${glow}40;
          position: relative;
          z-index: 2;
        "></div>
      </div>
    `,
  });
}

const URGENCY_LABEL_MAP: Record<Urgency, { text: string; color: string }> = {
  CRITICAL: { text: 'CRITICAL', color: '#F87171' },
  ELEVATED: { text: 'ELEVATED', color: '#FBBF24' },
  MONITOR: { text: 'MONITOR', color: '#4ADE80' },
};

const RiskMap: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Style injection for pulse animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes radarPulse {
        0% { transform: scale(0.8); opacity: 0.8; }
        50% { transform: scale(1.6); opacity: 0.2; }
        100% { transform: scale(0.8); opacity: 0.8; }
      }
    `;
    document.head.appendChild(style);

    const map = L.map(containerRef.current, {
      center: [25, 80],
      zoom: 3,
      zoomControl: true,
      attributionControl: true,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    MAP_MARKERS.forEach((marker) => {
      const icon = createMarkerIcon(marker.urgency);
      const urgencyInfo = URGENCY_LABEL_MAP[marker.urgency];

      const popupContent = `
        <div style="min-width: 200px;">
          <div style="
            font-size: 0.65rem;
            font-weight: 700;
            letter-spacing: 0.1em;
            color: ${urgencyInfo.color};
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            gap: 6px;
          ">
            <div style="width: 6px; height: 6px; border-radius: 50%; background: ${urgencyInfo.color}; flex-shrink: 0;"></div>
            ${urgencyInfo.text}
          </div>
          <div style="
            font-size: 0.8rem;
            font-weight: 600;
            color: #E2E8F0;
            margin-bottom: 4px;
            line-height: 1.3;
          ">${marker.label}</div>
          <div style="
            font-size: 0.65rem;
            font-weight: 600;
            color: #3B82F6;
            margin-bottom: 6px;
            letter-spacing: 0.05em;
          ">Clock ${marker.clockId} — ${marker.clockName}</div>
          <div style="
            font-size: 0.68rem;
            color: #94A3B8;
            line-height: 1.5;
          ">${marker.summary}</div>
        </div>
      `;

      L.marker([marker.lat, marker.lng], { icon })
        .addTo(map)
        .bindPopup(popupContent, {
          maxWidth: 260,
          className: 'radar-popup',
        });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      document.head.removeChild(style);
    };
  }, []);

  // Impact bucket counts
  const deliveryCount = 2;
  const complianceCount = 2;
  const costCount = 3;

  return (
    <div className="flex flex-col h-full">
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
            GLOBAL RISK MAP
          </div>
          <div
            className="text-xs mt-0.5"
            style={{ color: '#4B5563', fontSize: '0.6rem' }}
          >
            Active exposure nodes
          </div>
        </div>
        <div className="flex items-center gap-2">
          {(['CRITICAL', 'ELEVATED', 'MONITOR'] as const).map((u) => (
            <div key={u} className="flex items-center gap-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: URGENCY_COLORS[u] }}
              />
              <span
                className="text-xs"
                style={{ color: '#4B5563', fontSize: '0.58rem' }}
              >
                {u[0] + u.slice(1).toLowerCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative" style={{ minHeight: '300px' }}>
        <div ref={containerRef} className="absolute inset-0" />
      </div>

      {/* Impact buckets */}
      <div
        className="flex-shrink-0 px-4 py-3 border-t"
        style={{ borderColor: '#1E3A5F', backgroundColor: '#0F1117' }}
      >
        <div
          className="text-xxs font-bold tracking-widest mb-2"
          style={{ color: '#3B82F6', fontSize: '0.58rem', letterSpacing: '0.14em' }}
        >
          IMPACT EXPOSURE BY CATEGORY
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Delivery', count: deliveryCount, color: '#6366F1', bg: 'rgba(99, 102, 241, 0.12)', border: 'rgba(99, 102, 241, 0.3)' },
            { label: 'Compliance', count: complianceCount, color: '#EC4899', bg: 'rgba(236, 72, 153, 0.12)', border: 'rgba(236, 72, 153, 0.3)' },
            { label: 'Cost', count: costCount, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.3)' },
          ].map(({ label, count, color, bg, border }) => (
            <div
              key={label}
              className="flex flex-col items-center py-2 px-3 rounded"
              style={{ backgroundColor: bg, border: `1px solid ${border}` }}
            >
              <div
                className="text-2xl font-black leading-none"
                style={{ color, fontVariantNumeric: 'tabular-nums' }}
              >
                {count}
              </div>
              <div
                className="text-xxs font-semibold mt-1 tracking-wider"
                style={{ color, fontSize: '0.6rem', letterSpacing: '0.08em', opacity: 0.8 }}
              >
                {label.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiskMap;
