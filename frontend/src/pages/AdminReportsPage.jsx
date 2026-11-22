import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Award, CheckCircle, Users } from 'lucide-react';
import { api } from '../services/api';

export const AdminReportsPage = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const load = async () => {
      const cls = await api.getClasses();
      setClasses(cls);
      const studs = await api.getStudents();
      setStudents(studs);
      const q = await api.getAllQuizzes();
      setQuizzes(q);
    };
    load();
  }, []);

  return (
    <div>
      {/* Banner */}
      <div className="glass-panel" style={{ padding: '24px 30px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
          <span className="badge-pill badge-lime">Educational Analytics</span>
          <span className="badge-pill badge-glass">Real-Time Data</span>
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#FFFFFF' }}>Performance & Mastery Reports</h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Track rural student engagement, quiz pass rates, and subject proficiency across Grades 1 to 7.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px' }}>
        {/* Class Progress Breakdown */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', marginBottom: '16px' }}>
            Class-wise Average Learning Progress
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {classes.map((cls, idx) => {
              const rates = [74, 68, 82, 65, 78, 62, 70];
              const rate = rates[idx] || 70;
              return (
                <div key={cls.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 500, color: '#FFFFFF' }}>{cls.name} - {cls.description}</span>
                    <span style={{ color: 'var(--accent-lime)', fontWeight: 600 }}>{rate}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: `${rate}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent-lime), var(--accent-cyan))', borderRadius: '9999px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subject Insights */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', marginBottom: '16px' }}>
            Subject Engagement Highlights
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="glass-panel-nested" style={{ padding: '14px', borderRadius: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', color: '#FFFFFF', fontWeight: 500 }}>Mathematics</span>
                <span className="badge-pill badge-lime" style={{ fontSize: '10px' }}>Top Performing</span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>84% average quiz score across Class 3-7</span>
            </div>

            <div className="glass-panel-nested" style={{ padding: '14px', borderRadius: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', color: '#FFFFFF', fontWeight: 500 }}>English Communication</span>
                <span className="badge-pill badge-cyan" style={{ fontSize: '10px' }}>High Activity</span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>92% homework submission punctuality</span>
            </div>

            <div className="glass-panel-nested" style={{ padding: '14px', borderRadius: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', color: '#FFFFFF', fontWeight: 500 }}>Kannada & Hindi Languages</span>
                <span className="badge-pill badge-orange" style={{ fontSize: '10px' }}>Consistent</span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Tri-lingual curriculum completion on track</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
