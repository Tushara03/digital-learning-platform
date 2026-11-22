import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, BookOpen, CheckSquare, Clock, TrendingUp, Award, Plus } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const AdminDashboard = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    studentsCount: 0,
    classesCount: 7,
    subjectsCount: 8,
    quizzesCount: 0,
    homeworkCount: 0,
    submissionsCount: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      const students = await api.getStudents();
      const quizzes = await api.getAllQuizzes();
      const hw = await api.getHomework();
      const subs = await api.getSubmissions();

      setStats({
        studentsCount: students.length,
        classesCount: 7,
        subjectsCount: 8,
        quizzesCount: quizzes.length,
        homeworkCount: hw.length,
        submissionsCount: subs.length,
      });
    };
    loadStats();
  }, []);

  return (
    <div>
      {/* Admin Top Banner */}
      <div className="glass-panel" style={{ padding: '26px 30px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
              <span className="badge-pill badge-lime">Karnataka Rural Digital Learning Initiative</span>
              <span className="badge-pill badge-glass">Admin Control Hub</span>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#FFFFFF' }}>
              School Administration & Academic Governance
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Monitoring 7 Classes (Grade 1-7), 8 Subjects, 1,400 Quiz capacity, and Homework evaluations.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="btn-accent"
              onClick={() => onNavigate('adminQuizzes')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px' }}
            >
              <Plus size={14} /> Create Quiz
            </button>
            <button
              className="btn-primary-glass"
              onClick={() => onNavigate('adminHomework')}
              style={{ padding: '10px 16px', fontSize: '12.5px' }}
            >
              Assign Homework
            </button>
          </div>
        </div>
      </div>

      {/* 6 Key Performance Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Registered Students</span>
            <Users size={16} color="var(--accent-lime)" />
          </div>
          <span style={{ fontSize: '28px', fontWeight: 700, color: '#FFFFFF' }}>{stats.studentsCount}</span>
          <span style={{ fontSize: '11px', color: 'var(--accent-lime)', display: 'block', marginTop: '4px' }}>Across 7 grades</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Academic Classes</span>
            <GraduationCap size={16} color="var(--accent-cyan)" />
          </div>
          <span style={{ fontSize: '28px', fontWeight: 700, color: '#FFFFFF' }}>{stats.classesCount}</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>Class 1 to 7</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Core Subjects</span>
            <BookOpen size={16} color="var(--accent-orange)" />
          </div>
          <span style={{ fontSize: '28px', fontWeight: 700, color: '#FFFFFF' }}>{stats.subjectsCount}</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>Tri-lingual curriculum</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Active Quizzes</span>
            <CheckSquare size={16} color="#A855F7" />
          </div>
          <span style={{ fontSize: '28px', fontWeight: 700, color: '#FFFFFF' }}>{stats.quizzesCount}</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>25 / Subject</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Homework Tasks</span>
            <Clock size={16} color="#EC4899" />
          </div>
          <span style={{ fontSize: '28px', fontWeight: 700, color: '#FFFFFF' }}>{stats.homeworkCount}</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>Whole-class assigned</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Submissions</span>
            <TrendingUp size={16} color="#38BDF8" />
          </div>
          <span style={{ fontSize: '28px', fontWeight: 700, color: '#FFFFFF' }}>{stats.submissionsCount}</span>
          <span style={{ fontSize: '11px', color: 'var(--accent-cyan)', display: 'block', marginTop: '4px' }}>Ready for review</span>
        </div>
      </div>

      {/* Two Column Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
        {/* Quick Management Shortcuts */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', marginBottom: '16px' }}>
            Administrative Operations
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
            <div
              className="glass-panel-nested"
              onClick={() => onNavigate('adminStudents')}
              style={{ padding: '16px', cursor: 'pointer', borderRadius: '18px' }}
            >
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF', marginBottom: '4px' }}>
                Manage Students
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Enroll rural learners, assign classes, and inspect progress.
              </p>
            </div>

            <div
              className="glass-panel-nested"
              onClick={() => onNavigate('adminQuizzes')}
              style={{ padding: '16px', cursor: 'pointer', borderRadius: '18px' }}
            >
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF', marginBottom: '4px' }}>
                Quiz Management
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Add questions, correct answers, explanations, and publish.
              </p>
            </div>

            <div
              className="glass-panel-nested"
              onClick={() => onNavigate('adminHomework')}
              style={{ padding: '16px', cursor: 'pointer', borderRadius: '18px' }}
            >
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF', marginBottom: '4px' }}>
                Homework Evaluation
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Assign class tasks, review submissions, and provide marks & feedback.
              </p>
            </div>

            <div
              className="glass-panel-nested"
              onClick={() => onNavigate('adminReports')}
              style={{ padding: '16px', cursor: 'pointer', borderRadius: '18px' }}
            >
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF', marginBottom: '4px' }}>
                Performance Reports
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Class performance distribution, mastery rates, and milestones.
              </p>
            </div>
          </div>
        </div>

        {/* Classes Overview */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', marginBottom: '14px' }}>
            Classes Hierarchy (Classes 1 - 7)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <div
                key={num}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  borderRadius: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge-pill badge-lime" style={{ fontSize: '10px' }}>Grade {num}</span>
                  <span style={{ fontSize: '13px', fontWeight: 500, color: '#FFFFFF' }}>Class {num}</span>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>8 Subjects • 25 Quizzes</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
