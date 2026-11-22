import React, { useState, useEffect } from 'react';
import { ProgressStatsCard } from '../components/dashboard/ProgressStatsCard';
import { FeaturedLearningCard } from '../components/dashboard/FeaturedLearningCard';
import { ActivityAnalyticsCard } from '../components/dashboard/ActivityAnalyticsCard';
import { MyScheduleCard } from '../components/dashboard/MyScheduleCard';
import { LearningBreakdownCard } from '../components/dashboard/LearningBreakdownCard';
import { api } from '../services/api';

export const StudentDashboard = ({ onNavigate }) => {
  const [student, setStudent] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [breakdown, setBreakdown] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      const user = api.getCurrentUser();
      setStudent(user);

      const sch = await api.getSchedule(user?.classId);
      setSchedule(sch);

      const bd = await api.getBreakdown();
      setBreakdown(bd);
    };

    loadDashboardData();
  }, []);

  return (
    <div>
      {/* Grade info indicator if selected */}
      {student?.className && (
        <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge-pill badge-lime">{student.className} ({student.classStd || student.className})</span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Welcome to your personalized grade dashboard</span>
          </div>
          <button
            onClick={() => onNavigate('selectClass')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--accent-cyan)',
              fontSize: '12px',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Change Grade
          </button>
        </div>
      )}

      {/* TOP ROW: 3 Columns matching reference screenshot */}
      <div className="dashboard-grid-top">
        <ProgressStatsCard student={student} />
        <FeaturedLearningCard onContinue={() => onNavigate && onNavigate('subjects')} />
        <ActivityAnalyticsCard activeHours={student?.activeHours || 24.9} />
      </div>

      {/* BOTTOM ROW: 2 Columns matching reference screenshot */}
      <div className="dashboard-grid-bottom">
        <MyScheduleCard scheduleList={schedule} />
        <LearningBreakdownCard breakdownList={breakdown} />
      </div>
    </div>
  );
};
