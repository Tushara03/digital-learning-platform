import React, { useState } from 'react';
import { Search, Globe, LogOut, Shield, User, Sparkles, GraduationCap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const Navbar = ({ activeTab, setActiveTab, onOpenClassSelect }) => {
  const { currentUser, logout, switchRole } = useAuth();
  const { language, setLanguage, t, availableLanguages } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isAdmin = currentUser?.role === 'admin';

  const studentNavItems = [
    { key: 'dashboard', label: t('nav.dashboard') },
    { key: 'selectClass', label: 'Select Class' },
    { key: 'subjects', label: t('nav.subjects') },
    { key: 'tutor', label: 'AI Tutor' },
    { key: 'homework', label: t('nav.homework') },
    { key: 'achievements', label: t('nav.achievements') },
    { key: 'myClasses', label: t('nav.myClasses') },
    { key: 'support', label: t('nav.support') },
  ];

  const adminNavItems = [
    { key: 'adminDashboard', label: t('nav.dashboard') },
    { key: 'adminStudents', label: t('nav.students') },
    { key: 'adminClasses', label: t('nav.classes') },
    { key: 'adminSubjects', label: t('nav.subjects') },
    { key: 'adminQuizzes', label: t('nav.quizManagement') },
    { key: 'adminHomework', label: t('nav.homeworkManagement') },
    { key: 'adminReports', label: t('nav.reports') },
  ];

  const currentNavItems = isAdmin ? adminNavItems : studentNavItems;

  return (
    <header className="glass-nav-bar">
      {/* Search Circle on far left matching screenshot */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          className="nav-circle-btn"
          title="Search lessons, quizzes..."
          onClick={() => setSearchOpen(!searchOpen)}
        >
          <Search size={17} />
        </button>
        {searchOpen && (
          <input
            type="text"
            placeholder={t('nav.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#FFFFFF',
              borderRadius: '9999px',
              padding: '6px 14px',
              fontSize: '13px',
              width: '180px',
            }}
            autoFocus
          />
        )}
      </div>

      {/* Center Nav Items with Active Glass Highlight Pill */}
      <nav className="nav-links-center">
        {currentNavItems.map((item) => {
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`nav-pill-item ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Right Controls: Class Pill, Role Switcher, Language Pill & Profile Pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Student Class Badge Pill with Quick Change Action */}
        {!isAdmin && (
          <button
            onClick={() => setActiveTab('selectClass')}
            title="Click to change your selected class"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 12px',
              background: currentUser?.className ? 'rgba(200, 245, 53, 0.14)' : 'rgba(245, 158, 11, 0.2)',
              border: `1px solid ${currentUser?.className ? 'var(--accent-lime)' : 'var(--accent-orange)'}`,
              borderRadius: '9999px',
              color: currentUser?.className ? 'var(--accent-lime)' : 'var(--accent-orange)',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <GraduationCap size={13} />
            <span>{currentUser?.className ? `${currentUser.className}` : 'Choose Class'}</span>
          </button>
        )}

        {/* Role Toggle Pill */}
        <button
          onClick={() => switchRole(isAdmin ? 'student' : 'admin')}
          title="Switch view between Student and Admin"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 10px',
            background: isAdmin ? 'rgba(43, 209, 199, 0.12)' : 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${isAdmin ? 'rgba(43, 209, 199, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
            borderRadius: '9999px',
            color: isAdmin ? '#2BD1C7' : '#9CA3AF',
            fontSize: '11.5px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {isAdmin ? <Shield size={12} /> : <User size={12} />}
          <span>{isAdmin ? 'Admin' : 'Student'}</span>
        </button>

        {/* Language Selector Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '9999px',
              color: '#9CA3AF',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            <Globe size={13} />
            <span style={{ textTransform: 'uppercase', fontWeight: 600 }}>{language}</span>
          </button>
          {showLangMenu && (
            <div
              style={{
                position: 'absolute',
                top: '42px',
                right: 0,
                background: 'rgba(15, 18, 26, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '14px',
                padding: '6px',
                minWidth: '130px',
                zIndex: 100,
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              }}
            >
              {availableLanguages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLanguage(l.code);
                    setShowLangMenu(false);
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: language === l.code ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                    color: language === l.code ? '#FFFFFF' : '#9CA3AF',
                    border: 'none',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  {l.native} ({l.code.toUpperCase()})
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Profile Pill matching screenshot ("Hammad" with round avatar) */}
        <div className="nav-user-pill">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
            alt={currentUser?.name || 'User'}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#E5E7EB' }}>
            {currentUser?.name || 'Hammad'}
          </span>
          <button
            onClick={logout}
            title={t('nav.logout')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#6B7280',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '2px',
            }}
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </header>
  );
};
