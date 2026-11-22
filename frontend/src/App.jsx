import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/navigation/Navbar';
import { SelectClassPage } from './pages/SelectClassPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { SubjectsPage } from './pages/SubjectsPage';
import { SubjectUnitsPage } from './pages/SubjectUnitsPage';
import { UnitDetailPage } from './pages/UnitDetailPage';
import { MyClassesPage } from './pages/MyClassesPage';
import { HomeworkPage } from './pages/HomeworkPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminStudentsPage } from './pages/AdminStudentsPage';
import { AdminQuizManagementPage } from './pages/AdminQuizManagementPage';
import { AdminHomeworkPage } from './pages/AdminHomeworkPage';
import { AdminReportsPage } from './pages/AdminReportsPage';
import { LoginPage } from './pages/LoginPage';
import { AITutorPage } from './pages/AITutorPage';
import { ChatbotDrawer } from './components/chatbot/ChatbotDrawer';
import { PhoneCall, Mail } from 'lucide-react';
import './styles/index.css';

const MainApp = () => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';

  // Determine initial tab: if student has no selected class, prompt them with selectClass!
  const [activeTab, setActiveTab] = useState(() => {
    if (isAdmin) return 'adminDashboard';
    if (currentUser && !currentUser.classId) return 'selectClass';
    return 'dashboard';
  });

  const [selectedSubjectCode, setSelectedSubjectCode] = useState('mathematics');
  const [activeUnitId, setActiveUnitId] = useState(null);

  // Synchronize active tab if role changes or if student class is missing
  useEffect(() => {
    if (isAdmin) {
      if (!activeTab.startsWith('admin')) {
        setActiveTab('adminDashboard');
      }
    } else {
      if (activeTab.startsWith('admin')) {
        setActiveTab('dashboard');
      } else if (currentUser && !currentUser.classId) {
        setActiveTab('selectClass');
      }
    }
  }, [isAdmin, currentUser]);

  if (!currentUser) {
    return <LoginPage />;
  }

  const renderContent = () => {
    switch (activeTab) {
      // Step 2 & 3: Select Class Flow
      case 'selectClass':
        return (
          <SelectClassPage
            onClassSelected={() => {
              setActiveTab('subjects');
            }}
          />
        );

      // Student Dashboard
      case 'dashboard':
        return (
          <StudentDashboard
            onNavigate={(tab) => {
              if (tab === 'subjects') setActiveTab('subjects');
              else if (tab === 'selectClass') setActiveTab('selectClass');
              else setActiveTab(tab);
            }}
          />
        );

      // Step 4 & 5: Class-wise 8 Subjects
      case 'subjects':
        return (
          <SubjectsPage
            onSelectSubject={(subjCode) => {
              setSelectedSubjectCode(subjCode);
              setActiveTab('subjectUnits');
            }}
            onChangeClass={() => setActiveTab('selectClass')}
          />
        );

      // Step 6 & 7: 25 Named Learning Units for Subject
      case 'subjectUnits':
        return (
          <SubjectUnitsPage
            subjectCode={selectedSubjectCode}
            onBack={() => setActiveTab('subjects')}
            onOpenUnit={(unitId) => {
              setActiveUnitId(unitId);
              setActiveTab('unitDetail');
            }}
          />
        );

      // Step 8, 9, 10, 11: Unit Lesson, YouTube Video, Unit Quiz & Badges
      case 'unitDetail':
        return (
          <UnitDetailPage
            unitId={activeUnitId}
            onBack={() => setActiveTab('subjectUnits')}
            onOpenTutor={(unitInfo) => {
              if (unitInfo?.subjectCode) setSelectedSubjectCode(unitInfo.subjectCode);
              setActiveTab('tutor');
            }}
          />
        );

      case 'tutor':
        return <AITutorPage initialSubjectCode={selectedSubjectCode} />;

      case 'myClasses':
        return <MyClassesPage onSwitchClass={() => setActiveTab('selectClass')} />;

      case 'homework':
        return <HomeworkPage />;

      case 'achievements':
        return <AchievementsPage />;

      case 'support':
        return (
          <div className="glass-panel" style={{ padding: '32px', maxWidth: '720px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#FFFFFF', marginBottom: '8px' }}>
              Rural Student & Teacher Support Desk
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', marginBottom: '24px' }}>
              Have questions regarding class selection, 25 unit lessons, quiz scoring, or badges? We are here to support your learning journey.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="glass-panel-nested" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <PhoneCall size={20} color="var(--accent-lime)" />
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Toll-Free Helpline</span>
                  <p style={{ fontSize: '14px', color: '#FFFFFF', fontWeight: 500 }}>1800-425-RURAL (Mon-Sat 9 AM - 6 PM)</p>
                </div>
              </div>
              <div className="glass-panel-nested" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Mail size={20} color="var(--accent-cyan)" />
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Email Assistance</span>
                  <p style={{ fontSize: '14px', color: '#FFFFFF', fontWeight: 500 }}>support@rurallearn.in</p>
                </div>
              </div>
            </div>
          </div>
        );

      // Admin Routes
      case 'adminDashboard':
        return <AdminDashboard onNavigate={(tab) => setActiveTab(tab)} />;
      case 'adminStudents':
        return <AdminStudentsPage />;
      case 'adminClasses':
        return <MyClassesPage />;
      case 'adminSubjects':
      case 'adminQuizzes':
        return <AdminQuizManagementPage />;
      case 'adminHomework':
        return <AdminHomeworkPage />;
      case 'adminReports':
        return <AdminReportsPage />;

      default:
        return (
          <StudentDashboard
            onNavigate={(tab) => setActiveTab(tab)}
          />
        );
    }
  };

  return (
    <div className="ambient-lighting-wrapper">
      <div className="app-container">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenClassSelect={() => setActiveTab('selectClass')}
        />
        <main>{renderContent()}</main>
      </div>
      <ChatbotDrawer />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </LanguageProvider>
  );
}
