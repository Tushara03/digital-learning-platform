import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Languages, Calculator, Leaf, Dna, Laptop, Globe, ArrowRight, Award, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const SubjectsPage = ({ onSelectSubject, onChangeClass }) => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [subjects, setSubjects] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [badgesMap, setBadgesMap] = useState({});

  const studentClassId = currentUser?.classId || 'c1';
  const studentClassName = currentUser?.className || 'Class 1';

  useEffect(() => {
    const fetch = async () => {
      const data = await api.getSubjects();
      setSubjects(data);

      // Load progress and badges for each subject in this specific class
      const pMap = {};
      const bMap = {};
      for (const subj of data) {
        const prog = await api.getStudentSubjectProgress(currentUser?.id, studentClassId, subj.code);
        pMap[subj.code] = prog;

        const badges = await api.getStudentBadges(currentUser?.id, studentClassId, subj.code);
        bMap[subj.code] = badges.length;
      }
      setProgressMap(pMap);
      setBadgesMap(bMap);
    };
    fetch();
  }, [studentClassId, currentUser]);

  const getSubjectIcon = (code, color) => {
    const props = { size: 24, color: color || '#FFFFFF' };
    switch (code) {
      case 'hindi': return <BookOpen {...props} />;
      case 'english': return <FileText {...props} />;
      case 'kannada': return <Languages {...props} />;
      case 'mathematics': return <Calculator {...props} />;
      case 'environmentalStudies': return <Leaf {...props} />;
      case 'biology': return <Dna {...props} />;
      case 'computerScience': return <Laptop {...props} />;
      case 'generalKnowledge': return <Globe {...props} />;
      default: return <BookOpen {...props} />;
    }
  };

  return (
    <div>
      {/* Banner */}
      <div className="glass-panel" style={{ padding: '26px 30px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge-pill badge-lime">{studentClassName}</span>
              <span className="badge-pill badge-glass">8 Core Academic Subjects</span>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#FFFFFF' }}>{studentClassName} Subjects</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Select a subject to explore its 25 structured learning units, educational videos, and quizzes.
            </p>
          </div>

          {/* Change Class Button */}
          {onChangeClass && (
            <button
              onClick={onChangeClass}
              className="btn-primary-glass"
              style={{ padding: '8px 18px', fontSize: '12.5px', width: 'auto', gap: '6px' }}
            >
              <RefreshCw size={13} />
              <span>Change Class</span>
            </button>
          )}
        </div>
      </div>

      {/* 8 Class-Wise Subjects Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '18px' }}>
        {subjects.map((subj) => {
          const prog = progressMap[subj.code] || { completedCount: 0, totalUnits: 25, progressPercentage: 0 };
          const badgeCount = badgesMap[subj.code] || 0;

          return (
            <div
              key={subj.code}
              className="glass-panel"
              style={{
                padding: '24px',
                borderRadius: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
              }}
              onClick={() => onSelectSubject && onSelectSubject(subj.code)}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${subj.color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {getSubjectIcon(subj.code, subj.color)}
                  </div>

                  {badgeCount > 0 && (
                    <span className="badge-pill badge-lime" style={{ fontSize: '10.5px', gap: '4px' }}>
                      <Award size={11} /> {badgeCount} Badges
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#FFFFFF', marginBottom: '4px' }}>
                  {t(`subjects.${subj.code}`) || subj.name}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  25 Named Units • Video Lessons • Quizzes
                </p>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  <span>{prog.completedCount} of 25 Units Completed</span>
                  <span style={{ color: subj.color, fontWeight: 700 }}>{prog.progressPercentage}%</span>
                </div>
                <div style={{ height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '9999px', overflow: 'hidden', marginBottom: '16px' }}>
                  <div style={{ height: '100%', width: `${prog.progressPercentage}%`, background: subj.color, borderRadius: '9999px', transition: 'width 0.3s ease' }} />
                </div>

                <button
                  className="btn-primary-glass"
                  style={{ padding: '9px 16px', fontSize: '12.5px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectSubject) onSelectSubject(subj.code);
                  }}
                >
                  <span>Explore 25 Units</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
