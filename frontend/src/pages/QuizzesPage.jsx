import React, { useState, useEffect } from 'react';
import { Play, CheckCircle2, Clock, BookOpen } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { QuizPlayerPage } from './QuizPlayerPage';

export const QuizzesPage = () => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('english');
  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [activeQuizId, setActiveQuizId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const subjs = await api.getSubjects();
      setSubjects(subjs);

      const classId = currentUser?.classId || 'c5';
      const qList = await api.getQuizzes(classId, selectedSubject);
      setQuizzes(qList);

      const attList = await api.getStudentBadges ? (await api.submitQuiz ? (JSON.parse(localStorage.getItem('dlp_quiz_attempts_v1') || '[]')) : []) : [];
      setAttempts(attList.filter(a => a.studentId === currentUser?.id));

      setLoading(false);
    };

    fetchData();
  }, [selectedSubject, currentUser]);

  if (activeQuizId) {
    return <QuizPlayerPage quizId={activeQuizId} onBack={() => setActiveQuizId(null)} />;
  }

  return (
    <div>
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '24px 28px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
              <span className="badge-pill badge-lime">{currentUser?.className || 'Class 5'}</span>
              <span className="badge-pill badge-glass">25 Quizzes Per Subject</span>
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#FFFFFF' }}>Interactive Quiz Hub</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Master your grade concepts through progressive quiz challenges with instant feedback.
            </p>
          </div>
        </div>

        {/* Subject Pills Filter */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '20px', overflowX: 'auto', paddingBottom: '6px' }}>
          {subjects.map((subj) => {
            const isSelected = selectedSubject === subj.code;
            return (
              <button
                key={subj.code}
                onClick={() => setSelectedSubject(subj.code)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '9999px',
                  background: isSelected ? 'rgba(255, 255, 255, 0.14)' : 'rgba(255, 255, 255, 0.04)',
                  border: `1px solid ${isSelected ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.08)'}`,
                  color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                  fontSize: '12.5px',
                  fontWeight: isSelected ? 600 : 400,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                }}
              >
                {t(`subjects.${subj.code}`) || subj.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 25 Quizzes Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Loading quizzes...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {quizzes.map((quiz) => {
            const userAttempt = attempts.find(a => a.quizId === quiz.id);
            const isCompleted = !!userAttempt;

            return (
              <div
                key={quiz.id}
                className="glass-panel"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: '20px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span className="badge-pill badge-glass" style={{ fontSize: '10.5px' }}>
                      Quiz #{quiz.quizNumber}
                    </span>
                    {isCompleted ? (
                      <span className="badge-pill badge-cyan" style={{ fontSize: '10.5px' }}>
                        <CheckCircle2 size={11} /> {userAttempt.percentage}%
                      </span>
                    ) : (
                      <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Not attempted</span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '14.5px', fontWeight: 600, color: '#FFFFFF', marginBottom: '6px' }}>
                    {quiz.title}
                  </h3>
                  <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '16px' }}>
                    {quiz.description}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <Clock size={12} />
                    <span>{quiz.durationMinutes || 10} mins</span>
                  </div>

                  <button
                    onClick={() => setActiveQuizId(quiz.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '6px 14px',
                      background: isCompleted ? 'rgba(255, 255, 255, 0.08)' : 'var(--accent-lime)',
                      border: 'none',
                      borderRadius: '9999px',
                      color: isCompleted ? '#FFFFFF' : '#0F141C',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <Play size={11} fill={isCompleted ? '#FFFFFF' : '#0F141C'} />
                    <span>{isCompleted ? 'Retake' : 'Start Quiz'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
