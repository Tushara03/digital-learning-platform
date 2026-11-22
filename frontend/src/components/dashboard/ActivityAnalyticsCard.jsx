import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const ActivityAnalyticsCard = ({ activeHours = 24.9 }) => {
  const { t } = useLanguage();
  const [selectedDay, setSelectedDay] = useState('Fri');

  const days = [
    { name: 'Mon', height: 42, hours: 2.1 },
    { name: 'Tue', height: 35, hours: 1.8 },
    { name: 'Wed', height: 60, hours: 3.2 },
    { name: 'Thu', height: 50, hours: 2.6 },
    { name: 'Fri', height: 95, hours: 4.2 }, // Friday is active highlighted in screenshot
    { name: 'Sat', height: 48, hours: 2.4 },
    { name: 'Sun', height: 65, hours: 3.5 },
  ];

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>
            {t('dashboard.activity')}
          </h3>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.09)',
              borderRadius: '9999px',
              fontSize: '11px',
              color: 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            <Calendar size={12} />
            <span>{t('dashboard.last7Days')}</span>
            <ChevronDown size={12} />
          </div>
        </div>

        {/* Big hours spent stat */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ fontSize: '38px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.5px' }}>
            {activeHours.toString().replace('.', ',')}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.2' }}>
            {t('dashboard.hoursSpent')}
          </span>
        </div>
      </div>

      {/* 7 Vertical rounded bar capsules with Friday active & cyan tooltip */}
      <div className="activity-bars-container">
        {days.map((d) => {
          const isActive = selectedDay === d.name;
          return (
            <div
              key={d.name}
              className="activity-bar-column"
              onClick={() => setSelectedDay(d.name)}
              style={{ cursor: 'pointer' }}
            >
              {/* Cyan Floating Tooltip above active day */}
              {isActive && (
                <div className="chart-tooltip-cyan">
                  {d.hours} hours
                </div>
              )}

              {/* Capsule bar */}
              <div
                className={`activity-bar-capsule ${isActive ? 'active' : ''}`}
                style={{
                  height: `${d.height}px`,
                  background: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.09)',
                }}
              />

              {/* Day label */}
              <span
                className="activity-bar-label"
                style={{
                  color: isActive ? '#FFFFFF' : 'var(--text-dim)',
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {d.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
