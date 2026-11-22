import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Search,
  CheckCircle,
  XCircle,
  Eye,
  Award,
  BookOpen,
  Mail,
  Calendar,
  Clock,
  Shield,
  Edit3,
  Sparkles,
  Trophy,
  Filter
} from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export const AdminStudentsPage = () => {
  const { t } = useLanguage();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [stats, setStats] = useState({
    totalRegistered: 0,
    activeCount: 0,
    disabledCount: 0,
    classCounts: { c1: 0, c2: 0, c3: 0, c4: 0, c5: 0, c6: 0, c7: 0, unassigned: 0 }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [newAssignedClass, setNewAssignedClass] = useState('c1');
  const [viewingProfile, setViewingProfile] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [enrollError, setEnrollError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    classId: 'c1',
    rollNumber: '',
  });

  const loadData = async () => {
    const list = await api.getStudents();
    setStudents(list);
    const cls = await api.getClasses();
    setClasses(cls);
    const st = await api.getRegistrationStats();
    setStats(st);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEnroll = async (e) => {
    e.preventDefault();
    setEnrollError('');
    const targetClass = classes.find(c => c.id === formData.classId);
    const res = await api.registerStudent({
      ...formData,
      className: targetClass?.name || 'Class 1',
      classStd: targetClass?.std || '1st STD',
      role: 'student',
    });

    if (res.success) {
      setShowAddModal(false);
      setFormData({ name: '', email: '', classId: 'c1', rollNumber: '' });
      await loadData();
    } else {
      setEnrollError(res.message || 'Failed to register student.');
    }
  };

  const handleToggleStatus = async (studentId) => {
    await api.toggleStudentStatus(studentId);
    await loadData();
    if (viewingProfile && viewingProfile.id === studentId) {
      const updated = await api.getStudentFullProfile(studentId);
      setProfileData(updated);
      setViewingProfile(updated?.student);
    }
  };

  const handleUpdateStudentClass = async (e) => {
    e.preventDefault();
    if (!editingStudent) return;
    const targetClass = classes.find(c => c.id === newAssignedClass);
    await api.updateStudent(editingStudent.id, {
      classId: newAssignedClass,
      selectedClass: newAssignedClass,
      className: targetClass?.name || 'Class 1',
      classStd: targetClass?.std || '1st STD',
    });
    setEditingStudent(null);
    await loadData();
  };

  const handleOpenProfile = async (stud) => {
    setViewingProfile(stud);
    setLoadingProfile(true);
    const full = await api.getStudentFullProfile(stud.id);
    setProfileData(full);
    setLoadingProfile(false);
  };

  // Filter students by search and class
  const filteredStudents = students.filter(s => {
    const matchClass = selectedClassFilter === 'all' || s.classId === selectedClassFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchSearch = !query ||
      (s.name && s.name.toLowerCase().includes(query)) ||
      (s.email && s.email.toLowerCase().includes(query)) ||
      (s.rollNumber && s.rollNumber.toLowerCase().includes(query));
    return matchClass && matchSearch;
  });

  // Recently registered students (sorted by joinedDate desc or created)
  const recentStudents = [...students].slice(-4).reverse();

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '24px 30px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
              <span className="badge-pill badge-lime">Student Directory</span>
              <span className="badge-pill badge-cyan">MongoDB Sync</span>
              <span className="badge-pill badge-glass">{stats.totalRegistered} Unique Accounts</span>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.3px' }}>
              Student Registration Management
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Real-time monitoring of registered student accounts, class distributions, academic progress, and account access.
            </p>
          </div>

          <button
            className="btn-accent"
            onClick={() => {
              setEnrollError('');
              setShowAddModal(true);
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', padding: '10px 20px' }}
          >
            <UserPlus size={16} /> Enroll New Student
          </button>
        </div>

        {/* High-Level Registration Statistics Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '14px',
            marginTop: '22px'
          }}
        >
          <div
            style={{
              padding: '16px 20px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px'
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(200, 245, 53, 0.12)',
                color: 'var(--accent-lime)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Users size={22} />
            </div>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Total Registered
              </span>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF' }}>
                {stats.totalRegistered}
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '16px 20px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px'
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.12)',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CheckCircle size={22} />
            </div>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Active Accounts
              </span>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#10B981' }}>
                {stats.activeCount}
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '16px 20px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px'
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(239, 68, 68, 0.12)',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <XCircle size={22} />
            </div>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Disabled Accounts
              </span>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#EF4444' }}>
                {stats.disabledCount}
              </div>
            </div>
          </div>
        </div>

        {/* Class-Wise Student Distribution Chips */}
        <div style={{ marginTop: '22px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={13} /> Class-Wise Registered Counts (Class 1 to Class 7):
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedClassFilter('all')}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                background: selectedClassFilter === 'all' ? 'rgba(200, 245, 53, 0.18)' : 'rgba(255, 255, 255, 0.05)',
                border: selectedClassFilter === 'all' ? '1px solid var(--accent-lime)' : '1px solid rgba(255, 255, 255, 0.1)',
                color: selectedClassFilter === 'all' ? 'var(--accent-lime)' : 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>All Classes</span>
              <span
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '1px 7px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                }}
              >
                {stats.totalRegistered}
              </span>
            </button>

            {classes.map((cls) => {
              const count = stats.classCounts[cls.id] || 0;
              const isSelected = selectedClassFilter === cls.id;
              return (
                <button
                  key={cls.id}
                  onClick={() => setSelectedClassFilter(cls.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    background: isSelected ? 'rgba(56, 189, 248, 0.18)' : 'rgba(255, 255, 255, 0.05)',
                    border: isSelected ? '1px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: isSelected ? '#38BDF8' : 'var(--text-secondary)',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>{cls.name}</span>
                  <span
                    style={{
                      background: isSelected ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.1)',
                      padding: '1px 7px',
                      borderRadius: '9999px',
                      fontSize: '11px',
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recently Registered Students Spotlight */}
      {recentStudents.length > 0 && (
        <div className="glass-panel" style={{ padding: '20px 24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Sparkles size={16} color="var(--accent-lime)" />
            <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Recently Registered Students
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            {recentStudents.map((rs) => (
              <div
                key={rs.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <img
                  src={rs.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'}
                  alt={rs.name}
                  style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {rs.name}
                    </span>
                    <span className="badge-pill badge-cyan" style={{ fontSize: '10px', padding: '2px 6px' }}>
                      {rs.className || 'Class 1'}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {rs.email}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={10} /> Joined {rs.joinedDate || 'Recently'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Student Directory Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        {/* Controls: Search and Counter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
          <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
            <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', top: '11px', left: '12px' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, email, or roll..."
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                fontSize: '12.5px',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Showing <strong style={{ color: '#FFFFFF' }}>{filteredStudents.length}</strong> of {students.length} students
          </div>
        </div>

        {/* Students Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '780px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: 'var(--text-muted)', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '12px 14px' }}>STUDENT</th>
                <th style={{ padding: '12px 14px' }}>ASSIGNED CLASS</th>
                <th style={{ padding: '12px 14px' }}>ROLL NO</th>
                <th style={{ padding: '12px 14px' }}>REGISTERED DATE</th>
                <th style={{ padding: '12px 14px' }}>ACCOUNT STATUS</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)' }}>
                    No students found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((stud) => {
                  const isActive = (stud.status || 'active') === 'active';
                  return (
                    <tr
                      key={stud.id}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        fontSize: '13px',
                        transition: 'background 0.2s',
                        background: !isActive ? 'rgba(239, 68, 68, 0.03)' : 'transparent'
                      }}
                    >
                      <td style={{ padding: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img
                            src={stud.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'}
                            alt={stud.name}
                            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <span style={{ fontWeight: 600, color: '#FFFFFF', display: 'block' }}>{stud.name}</span>
                            <span style={{ fontSize: '11px', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Mail size={10} /> {stud.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <span className="badge-pill badge-cyan" style={{ fontSize: '11px' }}>
                          {stud.className ? `${stud.className}` : 'Not Selected'}
                        </span>
                      </td>
                      <td style={{ padding: '14px', color: 'var(--text-secondary)' }}>
                        {stud.rollNumber || '—'}
                      </td>
                      <td style={{ padding: '14px', color: 'var(--text-dim)', fontSize: '12px' }}>
                        {stud.joinedDate || '2026-03-01'}
                      </td>
                      <td style={{ padding: '14px' }}>
                        {isActive ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '3px 10px',
                              borderRadius: '9999px',
                              background: 'rgba(16, 185, 129, 0.15)',
                              color: '#10B981',
                              fontSize: '11px',
                              fontWeight: 600,
                            }}
                          >
                            <CheckCircle size={11} /> Active
                          </span>
                        ) : (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '3px 10px',
                              borderRadius: '9999px',
                              background: 'rgba(239, 68, 68, 0.15)',
                              color: '#EF4444',
                              fontSize: '11px',
                              fontWeight: 600,
                            }}
                          >
                            <XCircle size={11} /> Disabled
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '14px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          {/* View Profile Button */}
                          <button
                            onClick={() => handleOpenProfile(stud)}
                            title="View Student Profile, Quizzes & Progress"
                            style={{
                              padding: '6px 10px',
                              background: 'rgba(255, 255, 255, 0.08)',
                              border: '1px solid rgba(255, 255, 255, 0.12)',
                              borderRadius: '9999px',
                              color: '#FFFFFF',
                              fontSize: '11px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <Eye size={12} color="var(--accent-lime)" />
                            <span>Profile</span>
                          </button>

                          {/* Toggle Active / Disabled Account Status */}
                          <button
                            onClick={() => handleToggleStatus(stud.id)}
                            title={isActive ? 'Disable student account (blocks login)' : 'Enable student account'}
                            style={{
                              padding: '6px 10px',
                              background: isActive ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                              border: isActive ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid rgba(16, 185, 129, 0.25)',
                              borderRadius: '9999px',
                              color: isActive ? '#EF4444' : '#10B981',
                              fontSize: '11px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            {isActive ? <XCircle size={12} /> : <CheckCircle size={12} />}
                            <span>{isActive ? 'Disable' : 'Enable'}</span>
                          </button>

                          {/* Reassign Class */}
                          <button
                            onClick={() => {
                              setEditingStudent(stud);
                              setNewAssignedClass(stud.classId || 'c1');
                            }}
                            title="Reassign Class"
                            style={{
                              padding: '6px 10px',
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              borderRadius: '9999px',
                              color: 'var(--text-secondary)',
                              fontSize: '11px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <Edit3 size={11} />
                            <span>Class</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Student Profile Modal */}
      {viewingProfile && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', padding: '30px', borderRadius: '28px', border: '1px solid rgba(255, 255, 255, 0.14)' }}>
            {/* Header with Avatar and Basic Info */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '18px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img
                  src={viewingProfile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt={viewingProfile.name}
                  style={{ width: '54px', height: '54px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(200, 245, 53, 0.4)' }}
                />
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                    {viewingProfile.name}
                  </h2>
                  <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '2px' }}>
                    {viewingProfile.email} • Roll: {viewingProfile.rollNumber || '01-01'}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                    <span className="badge-pill badge-cyan" style={{ fontSize: '10.5px' }}>
                      {viewingProfile.className || 'Class 1'}
                    </span>
                    <span
                      style={{
                        fontSize: '10.5px',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        background: (viewingProfile.status || 'active') === 'active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: (viewingProfile.status || 'active') === 'active' ? '#10B981' : '#EF4444',
                        fontWeight: 600,
                      }}
                    >
                      {(viewingProfile.status || 'active') === 'active' ? 'Active Account' : 'Account Disabled'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setViewingProfile(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '20px', cursor: 'pointer', padding: '4px 8px' }}
              >
                ✕
              </button>
            </div>

            {loadingProfile ? (
              <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                Loading student academic metrics...
              </div>
            ) : profileData ? (
              <div>
                {/* Stats Summary Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '22px' }}>
                  <div style={{ padding: '12px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.03)', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--accent-lime)' }}>
                      {profileData.overallProgress?.percentage || 0}%
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Curriculum Progress</div>
                  </div>

                  <div style={{ padding: '12px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.03)', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#38BDF8' }}>
                      {profileData.attempts?.length || 0}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Quizzes Attempted</div>
                  </div>

                  <div style={{ padding: '12px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.03)', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#F59E0B' }}>
                      {profileData.badges?.length || 0}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Badges Earned</div>
                  </div>
                </div>

                {/* Subject-Wise Progress Section */}
                <div style={{ marginBottom: '22px' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
                    Subject Learning Breakdown (25 Units Each)
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
                    {(profileData.overallProgress?.subjectProgress || []).map((sp) => (
                      <div
                        key={sp.subjectCode}
                        style={{
                          padding: '10px 14px',
                          borderRadius: '12px',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.06)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                          <span style={{ color: '#FFFFFF', fontWeight: 500 }}>{sp.subjectName}</span>
                          <span style={{ color: 'var(--text-secondary)' }}>{sp.completedCount} / 25 Units</span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${sp.percentage}%`,
                              height: '100%',
                              background: sp.percentage > 0 ? 'linear-gradient(90deg, var(--accent-lime), #38BDF8)' : 'transparent',
                              borderRadius: '9999px'
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Earned Badges Showcase */}
                <div style={{ marginBottom: '22px' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Trophy size={14} color="#F59E0B" /> Badges Earned
                  </h3>
                  {(!profileData.badges || profileData.badges.length === 0) ? (
                    <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.02)', color: 'var(--text-dim)', fontSize: '12px', textAlign: 'center' }}>
                      No badges earned yet. Passing unit quizzes (70%+) awards badges automatically.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {profileData.badges.map((b) => (
                        <div
                          key={b.badgeId}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '9999px',
                            background: 'rgba(245, 158, 11, 0.12)',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                            color: '#F59E0B',
                            fontSize: '11.5px',
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <Award size={13} />
                          <span>{b.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Quiz Scores */}
                <div>
                  <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
                    Recent Quiz Attempts
                  </h3>
                  {(!profileData.attempts || profileData.attempts.length === 0) ? (
                    <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.02)', color: 'var(--text-dim)', fontSize: '12px', textAlign: 'center' }}>
                      No quiz attempts recorded yet.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {profileData.attempts.slice(0, 5).map((att) => (
                        <div
                          key={att.attemptId}
                          style={{
                            padding: '10px 14px',
                            borderRadius: '12px',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontSize: '12px'
                          }}
                        >
                          <div>
                            <div style={{ color: '#FFFFFF', fontWeight: 500 }}>
                              {att.subjectName} — Unit {att.unitNumber}: {att.unitTitle}
                            </div>
                            <div style={{ color: 'var(--text-dim)', fontSize: '11px', marginTop: '2px' }}>
                              Attempted: {att.attemptedAt}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span
                              style={{
                                padding: '3px 9px',
                                borderRadius: '9999px',
                                background: att.passed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                color: att.passed ? '#10B981' : '#EF4444',
                                fontWeight: 700,
                                fontSize: '11.5px'
                              }}
                            >
                              {att.score}/{att.total} ({att.percentage}%)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setViewingProfile(null)}
                className="btn-glass"
                style={{ padding: '8px 20px', fontSize: '13px' }}
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reassign Student Class Modal */}
      {editingStudent && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '28px', borderRadius: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#FFFFFF', marginBottom: '8px' }}>
              Reassign Class for {editingStudent.name}
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '18px' }}>
              Select the correct academic grade for this student. Their learning content, subjects, and quizzes will immediately update.
            </p>
            <form onSubmit={handleUpdateStudentClass}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Select Academic Class
                </label>
                <select
                  value={newAssignedClass}
                  onChange={(e) => setNewAssignedClass(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', background: 'rgba(15, 18, 26, 0.95)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF' }}
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.std})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  style={{ padding: '8px 18px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '9999px', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-accent"
                  style={{ padding: '8px 24px' }}
                >
                  Save Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enroll New Student Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '30px', borderRadius: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#FFFFFF', marginBottom: '6px' }}>
              Enroll New Student
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '18px' }}>
              Create a unique student account and link it to an academic grade (Class 1 to 7).
            </p>

            {enrollError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', color: '#FFFFFF', padding: '10px 14px', borderRadius: '12px', fontSize: '12px', marginBottom: '16px' }}>
                {enrollError}
              </div>
            )}

            <form onSubmit={handleEnroll}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Gowda"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Email Address <span style={{ color: 'var(--accent-lime)' }}>*Unique identifier</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. ramesh@rurallearn.in"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Assigned Class</label>
                  <select
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', background: 'rgba(15, 18, 26, 0.95)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF' }}
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.std})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Roll Number</label>
                  <input
                    type="text"
                    required
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    placeholder="e.g. 03-18"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '8px 18px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '9999px', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-accent"
                  style={{ padding: '8px 22px' }}
                >
                  Save & Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
