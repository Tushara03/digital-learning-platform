import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, Calendar, BookOpen, Clock, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const MyClassesPage = ({ onSwitchClass }) => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);

  const currentClassId = currentUser?.classId || 'c1';

  useEffect(() => {
    const fetch = async () => {
      const cls = await api.getClasses();
      setClasses(cls);
      const studs = await api.getStudents();
      setStudents(studs);
    };
    fetch();
  }, []);

  const currentClass = classes.find(c => c.id === currentClassId) || classes[0];
  const classmates = students.filter(s => s.classId === currentClass?.id);

  return (
    <div>
      {/* Banner */}
      <div className="glass-panel" style={{ padding: '24px 28px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
              <span className="badge-pill badge-lime">{currentClass?.name || 'Class 1'}</span>
              <span className="badge-pill badge-cyan">{currentClass?.std || '1st STD'}</span>
              <span className="badge-pill badge-glass">8 Subjects</span>
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#FFFFFF' }}>My Classroom & Peers</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {currentClass?.stage || currentClass?.description || 'Foundational Academic Stage'}
            </p>
          </div>

          {onSwitchClass && (
            <button
              onClick={onSwitchClass}
              className="btn-accent"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px' }}
            >
              <RefreshCw size={13} />
              <span>Change Selected Class</span>
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px' }}>
        {/* Class Details & Timetable */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', marginBottom: '14px' }}>
              {currentClass?.name} Academic Timetable
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="glass-panel-nested" style={{ padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>09:30 - 10:30 AM</span>
                  <h4 style={{ fontSize: '13.5px', color: '#FFFFFF', fontWeight: 500 }}>Mathematics - 25 Named Units</h4>
                </div>
                <span className="badge-pill badge-lime">Daily</span>
              </div>
              <div className="glass-panel-nested" style={{ padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>10:45 - 11:45 AM</span>
                  <h4 style={{ fontSize: '13.5px', color: '#FFFFFF', fontWeight: 500 }}>English Communication & Video Lessons</h4>
                </div>
                <span className="badge-pill badge-cyan">Mon, Wed, Fri</span>
              </div>
              <div className="glass-panel-nested" style={{ padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>12:00 - 01:00 PM</span>
                  <h4 style={{ fontSize: '13.5px', color: '#FFFFFF', fontWeight: 500 }}>Environmental Studies & Science Lab</h4>
                </div>
                <span className="badge-pill badge-orange">Tue, Thu, Sat</span>
              </div>
            </div>
          </div>
        </div>

        {/* Classmates List */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', marginBottom: '16px' }}>
            Classmates in {currentClass?.name} ({classmates.length})
          </h3>
          {classmates.length === 0 ? (
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No other students currently enrolled in this grade.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {classmates.map((stud) => (
                <div
                  key={stud.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '14px',
                    background: 'rgba(255, 255, 255, 0.04)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={stud.avatar}
                      alt={stud.name}
                      style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 500, color: '#FFFFFF', display: 'block' }}>
                        {stud.name} {stud.id === currentUser?.id ? '(You)' : ''}
                      </span>
                      <span style={{ fontSize: '10.5px', color: 'var(--text-dim)' }}>
                        Roll: {stud.rollNumber}
                      </span>
                    </div>
                  </div>

                  <span className="badge-pill badge-lime" style={{ fontSize: '10px' }}>Enrolled</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
