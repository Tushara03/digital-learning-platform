import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, CheckCircle2, Award, Clock, BookOpen, Video, ChevronRight } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const SubjectUnitsPage = ({ subjectCode, onBack, onOpenUnit }) => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [subject, setSubject] = useState(null);
  const [units, setUnits] = useState([]);
  const [progress, setProgress] = useState({ completedUnits: [], completedCount: 0, progressPercentage: 0 });
  const [badges, setBadges] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  const studentClassId = currentUser?.classId || 'c1';
  const studentClassName = currentUser?.className || 'Class 1';

  useEffect(() => {
    const loadUnits = async () => {
      setLoading(true);
      const subjects = await api.getSubjects();
      const currentSubj = subjects.find(s => s.code === subjectCode) || subjects[0];
      setSubject(currentSubj);

      const uList = await api.getUnits(studentClassId, currentSubj.code);
      setUnits(uList);

      const prog = await api.getStudentSubjectProgress(currentUser?.id, studentClassId, currentSubj.code);
      setProgress(prog);

      const bList = await api.getStudentBadges(currentUser?.id, studentClassId, currentSubj.code);
      setBadges(bList);

      const attList = await api.getUnitAttempts(currentUser?.id);
      setAttempts(attList);

      setLoading(false);
    };

    loadUnits();
  }, [subjectCode, studentClassId, currentUser]);

  if (loading) {
    return (
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading curriculum units...
      </div>
    );
  }

  return (
    <div>
      {/* Top Navigation Breadcrumb */}
      <button
        onClick={onBack}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '9999px',
          padding: '6px 14px',
          color: 'var(--text-secondary)',
          fontSize: '13px',
          cursor: 'pointer',
          marginBottom: '18px',
        }}
      >
        <ArrowLeft size={14} />
        <span>Back to Subjects</span>
      </button>

      {/* Subject Header Banner */}
      <div className="glass-panel" style={{ padding: '26px 30px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge-pill badge-lime">{studentClassName}</span>
              <span className="badge-pill badge-cyan">{subject?.name}</span>
              <span className="badge-pill badge-glass">25 Named Units</span>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF' }}>
              {subject?.name} Curriculum Modules
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Every unit includes lesson guides, verified educational YouTube video instruction, and an independent quiz.
            </p>
          </div>

          {/* Progress Box */}
          <div
            style={{
              padding: '14px 20px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '20px',
              minWidth: '200px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Subject Mastery</span>
              <span style={{ color: subject?.color || 'var(--accent-lime)', fontWeight: 700 }}>
                {progress.completedCount} / 25 Units ({progress.progressPercentage}%)
              </span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${progress.progressPercentage}%`,
                  background: subject?.color || 'var(--accent-lime)',
                  borderRadius: '9999px',
                }}
              />
            </div>
            {badges.length > 0 && (
              <span style={{ fontSize: '11px', color: 'var(--accent-lime)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Award size={12} /> {badges.length} Subject Badges Earned
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 25 Named Learning Units Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
        {units.map((unit) => {
          const isCompleted = progress.completedUnits.includes(unit.unitNumber);
          const unitAttempt = attempts.find(a => a.unitId === unit.unitId);

          return (
            <div
              key={unit.unitId}
              className="glass-panel"
              style={{
                padding: '22px',
                borderRadius: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: isCompleted ? '1px solid rgba(43, 209, 199, 0.35)' : '1px solid var(--border-glass)',
                background: isCompleted ? 'rgba(20, 26, 36, 0.8)' : 'var(--bg-card)',
                transition: 'all 0.2s ease',
              }}
            >
              <div>
                {/* Unit Header Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span className="badge-pill badge-glass" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    Unit {unit.unitNumberStr}
                  </span>

                  {isCompleted ? (
                    <span className="badge-pill badge-cyan" style={{ fontSize: '10.5px', gap: '4px' }}>
                      <CheckCircle2 size={12} /> Mastered {unitAttempt ? `(${unitAttempt.percentage}%)` : ''}
                    </span>
                  ) : (
                    <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Pending</span>
                  )}
                </div>

                {/* Named Unit Title */}
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF', marginBottom: '8px', lineHeight: '1.4' }}>
                  {unit.unitTitle}
                </h3>

                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '14px' }}>
                  {unit.description}
                </p>

                {/* Video Info Pill */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 10px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    borderRadius: '9999px',
                    width: 'fit-content',
                    fontSize: '11px',
                    color: '#F87171',
                    marginBottom: '16px',
                  }}
                >
                  <Video size={13} />
                  <span>Interactive Educational Video</span>
                </div>
              </div>

              {/* Bottom Card Action */}
              <div style={{ paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  5 Unit Questions
                </span>

                <button
                  onClick={() => onOpenUnit && onOpenUnit(unit.unitId)}
                  className={isCompleted ? 'btn-primary-glass' : 'btn-accent'}
                  style={{
                    padding: '7px 16px',
                    fontSize: '12px',
                    fontWeight: 600,
                    width: 'auto',
                    gap: '6px',
                  }}
                >
                  <span>{isCompleted ? 'Review Unit' : 'Open Lesson'}</span>
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
