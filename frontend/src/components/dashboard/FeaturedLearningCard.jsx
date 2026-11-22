import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const FeaturedLearningCard = ({ onContinue }) => {
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
      {/* Top category badges */}
      <div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
          <span className="badge-pill badge-glass" style={{ fontSize: '11px', color: '#9CA3AF' }}>
            {t('dashboard.groupCourse')}
          </span>
          <span className="badge-pill badge-glass" style={{ fontSize: '11px', color: '#9CA3AF' }}>
            {t('dashboard.advanced')}
          </span>
        </div>

        {/* Title */}
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#FFFFFF', marginBottom: '10px' }}>
          English Punctuation Made Easy
        </h2>

        {/* Short description */}
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '20px' }}>
          Punctuation is often the basics in school. Few people will never forget your punctuation again, you do not require any material or software.
        </p>
      </div>

      {/* Participants & Progress Bar Row */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          {/* Left: Participants */}
          <div>
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              {t('dashboard.participants')}
            </span>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                alt="Student 1"
                style={{ width: '26px', height: '26px', borderRadius: '50%', border: '2px solid #161A22', zIndex: 3 }}
              />
              <img
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=80"
                alt="Student 2"
                style={{ width: '26px', height: '26px', borderRadius: '50%', border: '2px solid #161A22', marginLeft: '-8px', zIndex: 2 }}
              />
              <img
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&auto=format&fit=crop&q=80"
                alt="Student 3"
                style={{ width: '26px', height: '26px', borderRadius: '50%', border: '2px solid #161A22', marginLeft: '-8px', zIndex: 1 }}
              />
            </div>
          </div>

          {/* Right: Progress Pill & bar */}
          <div style={{ minWidth: '130px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                {t('dashboard.classProgress')}
              </span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  color: '#F59E0B',
                  background: 'rgba(245, 158, 11, 0.15)',
                  padding: '2px 6px',
                  borderRadius: '9999px',
                }}
              >
                72%
              </span>
            </div>
            <div style={{ width: '100%', height: '5px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ width: '72%', height: '100%', background: 'linear-gradient(90deg, #F59E0B, #FBBF24)', borderRadius: '9999px' }} />
            </div>
          </div>
        </div>

        {/* Continue Learning Pill Button matching screenshot */}
        <button
          className="btn-primary-glass"
          onClick={onContinue}
        >
          <span>{t('dashboard.continueLearning')}</span>
        </button>
      </div>
    </div>
  );
};
