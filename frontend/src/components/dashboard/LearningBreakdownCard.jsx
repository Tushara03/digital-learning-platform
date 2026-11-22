import React from 'react';
import { Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const LearningBreakdownCard = ({ breakdownList = [] }) => {
  const { t } = useLanguage();

  return (
    <div
      className="glass-panel"
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background warm ambient bloom matching bottom right screenshot */}
      <div
        style={{
          position: 'absolute',
          bottom: '-30px',
          right: '-20px',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(220, 80, 80, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header */}
      <div>
        <h3 style={{ fontSize: '14.5px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '18px' }}>
          {t('dashboard.learningBreakdown')}
        </h3>

        {/* List items matching screenshot */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {breakdownList.map((item, idx) => (
            <div
              key={item.id || idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: idx !== breakdownList.length - 1 ? '12px' : '0',
                borderBottom: idx !== breakdownList.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                {/* Tiny checkmark icon */}
                <div
                  style={{
                    color: item.iconColor || 'var(--accent-lime)',
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: '2px',
                  }}
                >
                  <Check size={14} strokeWidth={3} />
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>
                    {item.lessonsCount}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 500, color: '#E2E8F0', display: 'block', marginTop: '1px' }}>
                    {item.name}
                  </span>
                </div>
              </div>

              {/* Right-aligned hours */}
              <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>
                {item.hours}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
