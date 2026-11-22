import React, { useState, useEffect } from 'react';
import { Trophy, Award, Crown, Sparkles, CheckCircle2, Lock, Unlock, Filter } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const AchievementsPage = () => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [overallProgress, setOverallProgress] = useState({ totalCompleted: 0, totalUnits: 200, percentage: 0 });
  const [selectedFilter, setSelectedFilter] = useState('all');

  const studentClassId = currentUser?.classId || 'c1';
  const studentClassName = currentUser?.className || 'Class 1';

  useEffect(() => {
    const fetch = async () => {
      const bList = await api.getStudentBadges(currentUser?.id, studentClassId);
      setEarnedBadges(bList);

      const op = await api.getStudentOverallProgress(currentUser?.id, studentClassId);
      setOverallProgress(op);
    };
    fetch();
  }, [studentClassId, currentUser]);

  const filteredBadges = selectedFilter === 'all'
    ? earnedBadges
    : earnedBadges.filter(b => b.badgeType === selectedFilter || b.subjectCode === selectedFilter);

  return (
    <div>
      {/* Banner */}
      <div className="glass-panel" style={{ padding: '28px 32px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge-pill badge-lime">{studentClassName}</span>
              <span className="badge-pill badge-glass">Academic Honors</span>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF' }}>
              Achievements & Earned Badges
            </h1>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Every unit quiz passed, 90%+ excellence score, and subject mastered unlocks a verified badge.
            </p>
          </div>

          {/* Stats Widget */}
          <div style={{ display: 'flex', gap: '14px' }}>
            <div className="glass-panel-nested" style={{ padding: '12px 18px', textAlign: 'center', borderRadius: '16px' }}>
              <span style={{ fontSize: '22px', fontWeight: 700, color: 'var(--accent-lime)' }}>{earnedBadges.length}</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Badges Unlocked</span>
            </div>
            <div className="glass-panel-nested" style={{ padding: '12px 18px', textAlign: 'center', borderRadius: '16px' }}>
              <span style={{ fontSize: '22px', fontWeight: 700, color: 'var(--accent-cyan)' }}>{overallProgress.totalCompleted}</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Units Mastered</span>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '22px', overflowX: 'auto', paddingBottom: '4px' }}>
          {['all', 'unit', 'excellence', 'subject', 'class'].map((f) => {
            const labels = {
              all: 'All Badges',
              unit: 'Unit Completion',
              excellence: 'Excellence (90%+)',
              subject: 'Subject Master',
              class: 'Class Champion'
            };
            return (
              <button
                key={f}
                onClick={() => setSelectedFilter(f)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  background: selectedFilter === f ? 'rgba(255, 255, 255, 0.14)' : 'rgba(255, 255, 255, 0.04)',
                  border: `1px solid ${selectedFilter === f ? 'rgba(255, 255, 255, 0.22)' : 'rgba(255, 255, 255, 0.08)'}`,
                  color: selectedFilter === f ? '#FFFFFF' : 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: selectedFilter === f ? 600 : 400,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {labels[f]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Badges Showcase Grid */}
      {filteredBadges.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', borderRadius: '24px' }}>
          <Trophy size={40} color="var(--text-dim)" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', marginBottom: '6px' }}>
            No Badges Unlocked in this Category Yet
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto' }}>
            Explore your subjects, watch unit lessons, and score 70% or higher on unit quizzes to earn your first badges in {studentClassName}!
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '20px' }}>
          {filteredBadges.map((badge) => {
            let IconComponent = Award;
            if (badge.badgeType === 'excellence') IconComponent = Trophy;
            if (badge.badgeType === 'subject') IconComponent = Crown;
            if (badge.badgeType === 'class') IconComponent = Sparkles;

            return (
              <div
                key={badge.badgeId}
                className="glass-panel"
                style={{
                  padding: '24px',
                  borderRadius: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  background: 'linear-gradient(135deg, rgba(25, 30, 42, 0.8), rgba(15, 18, 26, 0.9))',
                  boxShadow: '0 12px 30px -10px rgba(0, 0, 0, 0.65)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '16px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: `1px solid ${badge.color || 'var(--accent-lime)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: badge.color || 'var(--accent-lime)',
                      }}
                    >
                      <IconComponent size={26} />
                    </div>

                    <span className="badge-pill badge-cyan" style={{ fontSize: '10.5px' }}>
                      <Unlock size={11} /> Unlocked
                    </span>
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', marginBottom: '6px' }}>
                    {badge.title}
                  </h3>

                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '16px' }}>
                    {badge.description}
                  </p>
                </div>

                <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span>{badge.className} • {badge.subjectName || 'General'}</span>
                  <span style={{ color: 'var(--accent-lime)' }}>{badge.earnedAt}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
