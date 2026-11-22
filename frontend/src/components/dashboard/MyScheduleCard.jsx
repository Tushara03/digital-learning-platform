import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const MyScheduleCard = ({ scheduleList = [] }) => {
  const { t } = useLanguage();
  const [dayOffset, setDayOffset] = useState(0);

  const getDayLabel = () => {
    if (dayOffset === 0) return t('dashboard.today');
    if (dayOffset === 1) return 'Tomorrow';
    if (dayOffset === -1) return 'Yesterday';
    return `Day ${dayOffset > 0 ? '+' : ''}${dayOffset}`;
  };

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-secondary)' }}>
          {t('dashboard.mySchedule')}
        </h3>

        {/* < Today > Control Pill matching screenshot */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '3px 10px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.09)',
            borderRadius: '9999px',
            fontSize: '11.5px',
            color: 'var(--text-secondary)',
          }}
        >
          <button
            onClick={() => setDayOffset(prev => prev - 1)}
            style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex' }}
          >
            <ChevronLeft size={13} />
          </button>
          <span>{getDayLabel()}</span>
          <button
            onClick={() => setDayOffset(prev => prev + 1)}
            style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex' }}
          >
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* 3 horizontally arranged cards */}
      <div className="schedule-cards-row">
        {scheduleList.map((item, idx) => {
          let badgeClass = 'badge-lime';
          if (item.levelColor === 'cyan' || idx === 1) badgeClass = 'badge-cyan';
          if (item.levelColor === 'amber' || idx === 2) badgeClass = 'badge-orange';

          return (
            <div
              key={item.id || idx}
              className="glass-panel-nested"
              style={{
                padding: '18px 16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '170px',
              }}
            >
              {/* Time and title */}
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                  {item.time}
                </span>
                <h4 style={{ fontSize: '13.5px', fontWeight: 500, color: '#FFFFFF', lineHeight: '1.4', marginBottom: '14px' }}>
                  {item.topic || item.subject}
                </h4>
                <div>
                  <span className={`badge-pill ${badgeClass}`} style={{ fontSize: '10.5px' }}>
                    {item.level || 'Beginners'}
                  </span>
                </div>
              </div>

              {/* Teacher/Mentor info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px' }}>
                <img
                  src={item.mentorAvatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=80'}
                  alt={item.mentorName}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: '#E2E8F0', display: 'block' }}>
                    {item.mentorName}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-dim)', display: 'block' }}>
                    {t('dashboard.mentor')}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
