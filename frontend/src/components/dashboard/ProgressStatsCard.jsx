import React from 'react';
import { BookOpen, Check, Calendar } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const ProgressStatsCard = ({ student }) => {
  const { t } = useLanguage();

  const completionRate = student?.completionRate || 64;
  const inProgressCount = student?.quizzesInProgress || 8;
  const completedCount = student?.quizzesCompleted || 12;
  const upcomingCount = student?.homeworkPending || 14;

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      {/* Header */}
      <div>
        <h3 style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '14px' }}>
          {t('dashboard.progressStatistics')}
        </h3>

        {/* Big percentage & Total Activity */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '20px' }}>
          <span style={{ fontSize: '38px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.5px' }}>
            {completionRate}%
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.2' }}>
            {t('dashboard.totalActivity')}
          </span>
        </div>

        {/* Segmented multicolor horizontal progress bar */}
        <div style={{ marginBottom: '6px' }}>
          <div style={{ display: 'flex', height: '6px', borderRadius: '9999px', overflow: 'hidden', gap: '3px' }}>
            <div style={{ flex: '2', background: 'var(--accent-lime)', borderRadius: '9999px' }} />
            <div style={{ flex: '3', background: 'var(--accent-cyan)', borderRadius: '9999px' }} />
            <div style={{ flex: '5', background: 'var(--accent-orange)', borderRadius: '9999px' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '10px', color: 'var(--text-dim)' }}>
            <span>20%</span>
            <span>31%</span>
            <span>49%</span>
          </div>
        </div>
      </div>

      {/* 3 Compact stat boxes with circular icons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '20px' }}>
        {/* In Progress */}
        <div
          className="glass-panel-nested"
          style={{
            padding: '12px 10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            borderRadius: '16px',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--accent-lime)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '8px',
              color: '#0F141C',
            }}
          >
            <BookOpen size={15} strokeWidth={2.4} />
          </div>
          <span style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF' }}>{inProgressCount}</span>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {t('dashboard.inProgress')}
          </span>
        </div>

        {/* Completed */}
        <div
          className="glass-panel-nested"
          style={{
            padding: '12px 10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            borderRadius: '16px',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--accent-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '8px',
              color: '#072422',
            }}
          >
            <Check size={16} strokeWidth={2.8} />
          </div>
          <span style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF' }}>{completedCount}</span>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {t('dashboard.completed')}
          </span>
        </div>

        {/* Upcoming */}
        <div
          className="glass-panel-nested"
          style={{
            padding: '12px 10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            borderRadius: '16px',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--accent-orange)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '8px',
              color: '#1A1206',
            }}
          >
            <Calendar size={15} strokeWidth={2.4} />
          </div>
          <span style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF' }}>{upcomingCount}</span>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {t('dashboard.upcoming')}
          </span>
        </div>
      </div>
    </div>
  );
};
