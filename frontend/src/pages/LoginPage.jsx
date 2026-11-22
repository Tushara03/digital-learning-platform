import React, { useState } from 'react';
import { Shield, User, Lock, Mail, ArrowRight, Sparkles, UserPlus, BookOpen, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const LoginPage = () => {
  const { login, register, loading } = useAuth();
  const { t } = useLanguage();

  // Mode: 'signin' or 'register'
  const [mode, setMode] = useState('signin');
  const [role, setRole] = useState('student'); // 'student' or 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Register Form State
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    classId: 'c5',
    rollNumber: '',
    password: '',
    confirmPassword: '',
  });

  const handleRoleSelect = (newRole) => {
    setRole(newRole);
    setError('');
    setSuccessMsg('');
    if (newRole === 'admin') {
      setEmail('admin@rurallearn.in');
      setPassword('admin123');
    } else {
      setEmail('hammad@rurallearn.in');
      setPassword('password123');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    const res = await login(email.trim(), password, role);
    if (!res.success) {
      setError(res.message || 'Login failed. Please verify your credentials.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!regData.name.trim()) {
      setError('Full name is required.');
      return;
    }

    if (!regData.email.trim() || !regData.email.includes('@')) {
      setError('A valid email address is required.');
      return;
    }

    if (!regData.password) {
      setError('Password is required.');
      return;
    }

    if (regData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (!regData.confirmPassword) {
      setError('Please confirm your password.');
      return;
    }

    if (regData.password !== regData.confirmPassword) {
      setError('Password and Confirm Password do not match.');
      return;
    }

    const classNames = {
      'c1': { name: 'Class 1', std: '1st STD' },
      'c2': { name: 'Class 2', std: '2nd STD' },
      'c3': { name: 'Class 3', std: '3rd STD' },
      'c4': { name: 'Class 4', std: '4th STD' },
      'c5': { name: 'Class 5', std: '5th STD' },
      'c6': { name: 'Class 6', std: '6th STD' },
      'c7': { name: 'Class 7', std: '7th STD' },
    };

    const res = await register({
      name: regData.name.trim(),
      email: regData.email.trim().toLowerCase(),
      classId: regData.classId,
      className: classNames[regData.classId]?.name || 'Class 5',
      classStd: classNames[regData.classId]?.std || '5th STD',
      rollNumber: regData.rollNumber.trim() || undefined,
      password: regData.password,
      confirmPassword: regData.confirmPassword,
    });

    if (res.success) {
      setSuccessMsg('Registration successful! Your student profile is saved in MongoDB. Switching to sign-in...');
      setEmail(regData.email.trim().toLowerCase());
      setPassword(regData.password);
      setTimeout(() => {
        setMode('signin');
        setRole('student');
      }, 1500);
    } else {
      setError(res.message || 'Registration failed. A student account with this email may already exist.');
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '470px', padding: '36px', borderRadius: '28px' }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              color: 'var(--accent-lime)',
            }}
          >
            <Sparkles size={24} />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
            Rural Digital Learning Hub
          </h1>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
            Classes 1 to 7 • High-Performance Glassmorphic Portal
          </p>
        </div>

        {/* Mode Selector: Sign In vs Register */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: '9999px',
            padding: '4px',
            marginBottom: '20px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError('');
              setSuccessMsg('');
            }}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '9999px',
              background: mode === 'signin' ? 'rgba(255, 255, 255, 0.14)' : 'transparent',
              color: mode === 'signin' ? '#FFFFFF' : 'var(--text-secondary)',
              border: 'none',
              fontSize: '12.5px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setRole('student');
              setError('');
              setSuccessMsg('');
            }}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '9999px',
              background: mode === 'register' ? 'rgba(200, 245, 53, 0.15)' : 'transparent',
              color: mode === 'register' ? 'var(--accent-lime)' : 'var(--text-secondary)',
              border: 'none',
              fontSize: '12.5px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            <UserPlus size={13} /> New Student Registration
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', color: '#FFFFFF', padding: '10px 14px', borderRadius: '12px', fontSize: '12px', marginBottom: '16px' }}>
            <AlertCircle size={15} color="#EF4444" style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', color: '#10B981', padding: '10px 14px', borderRadius: '12px', fontSize: '12px', marginBottom: '16px' }}>
            <CheckCircle size={15} color="#10B981" style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {mode === 'signin' ? (
          <div>
            {/* Role Selector Tabs */}
            <div
              style={{
                display: 'flex',
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '9999px',
                padding: '3px',
                marginBottom: '20px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <button
                type="button"
                onClick={() => handleRoleSelect('student')}
                style={{
                  flex: 1,
                  padding: '7px 10px',
                  borderRadius: '9999px',
                  background: role === 'student' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                  color: role === 'student' ? '#FFFFFF' : 'var(--text-secondary)',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                }}
              >
                <User size={13} /> Student
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('admin')}
                style={{
                  flex: 1,
                  padding: '7px 10px',
                  borderRadius: '9999px',
                  background: role === 'admin' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                  color: role === 'admin' ? '#FFFFFF' : 'var(--text-secondary)',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                }}
              >
                <Shield size={13} /> Administrator
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} color="var(--text-muted)" style={{ position: 'absolute', top: '12px', left: '12px' }} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={role === 'admin' ? 'admin@rurallearn.in' : 'student@rurallearn.in'}
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 36px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      fontSize: '13px',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} color="var(--text-muted)" style={{ position: 'absolute', top: '12px', left: '12px' }} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter account password"
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 36px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      fontSize: '13px',
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-accent"
                style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13.5px' }}
              >
                <span>{loading ? 'Verifying with MongoDB...' : `Sign in as ${role === 'admin' ? 'Headmaster' : 'Student'}`}</span>
                <ArrowRight size={15} />
              </button>
            </form>

            {/* Quick Demo Pre-fill helper */}
            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
              Quick Fill: {' '}
              <button
                type="button"
                onClick={() => { setEmail('hammad@rurallearn.in'); setPassword('password123'); setRole('student'); }}
                style={{ background: 'none', border: 'none', color: 'var(--accent-lime)', cursor: 'pointer', textDecoration: 'underline', padding: '0 4px', fontSize: '11px' }}
              >
                Hammad (Student Class 5)
              </button>
              {' • '}
              <button
                type="button"
                onClick={() => { setEmail('admin@rurallearn.in'); setPassword('admin123'); setRole('admin'); }}
                style={{ background: 'none', border: 'none', color: '#60A5FA', cursor: 'pointer', textDecoration: 'underline', padding: '0 4px', fontSize: '11px' }}
              >
                Headmaster (Admin)
              </button>
            </div>
          </div>
        ) : (
          /* Student Registration Form */
          <div>
            <div style={{ marginBottom: '16px', padding: '10px 14px', borderRadius: '12px', background: 'rgba(200, 245, 53, 0.06)', border: '1px solid rgba(200, 245, 53, 0.15)' }}>
              <div style={{ fontSize: '12px', color: 'var(--accent-lime)', fontWeight: 500 }}>
                Unique Student Account Registration
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Registered in MongoDB Community Server with secure bcrypt password hashing.
              </div>
            </div>

            <form onSubmit={handleRegisterSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                  Full Name <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={15} color="var(--text-muted)" style={{ position: 'absolute', top: '11px', left: '12px' }} />
                  <input
                    type="text"
                    required
                    value={regData.name}
                    onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                    placeholder="e.g. Ananya Patil"
                    style={{
                      width: '100%',
                      padding: '9px 14px 9px 36px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      fontSize: '13px',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                  Email Address <span style={{ color: '#EF4444' }}>*</span> <span style={{ color: 'var(--accent-lime)', fontSize: '10.5px' }}>(MongoDB Unique Index)</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} color="var(--text-muted)" style={{ position: 'absolute', top: '11px', left: '12px' }} />
                  <input
                    type="email"
                    required
                    value={regData.email}
                    onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                    placeholder="e.g. ananya@rurallearn.in"
                    style={{
                      width: '100%',
                      padding: '9px 14px 9px 36px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      fontSize: '13px',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    Select Class <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <select
                    value={regData.classId}
                    onChange={(e) => setRegData({ ...regData, classId: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 10px',
                      borderRadius: '12px',
                      background: 'rgba(15, 18, 26, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      fontSize: '12.5px',
                    }}
                  >
                    <option value="c1">Class 1 (1st STD)</option>
                    <option value="c2">Class 2 (2nd STD)</option>
                    <option value="c3">Class 3 (3rd STD)</option>
                    <option value="c4">Class 4 (4th STD)</option>
                    <option value="c5">Class 5 (5th STD)</option>
                    <option value="c6">Class 6 (6th STD)</option>
                    <option value="c7">Class 7 (7th STD)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    Roll Number
                  </label>
                  <input
                    type="text"
                    value={regData.rollNumber}
                    onChange={(e) => setRegData({ ...regData, rollNumber: e.target.value })}
                    placeholder="e.g. 05-22"
                    style={{
                      width: '100%',
                      padding: '9px 10px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      fontSize: '12.5px',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                  Password <span style={{ color: '#EF4444' }}>*</span> <span style={{ color: 'var(--text-muted)', fontSize: '10.5px' }}>(Min 6 characters)</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} color="var(--text-muted)" style={{ position: 'absolute', top: '11px', left: '12px' }} />
                  <input
                    type="password"
                    required
                    value={regData.password}
                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                    placeholder="Create a secure password"
                    style={{
                      width: '100%',
                      padding: '9px 14px 9px 36px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      fontSize: '13px',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                  Confirm Password <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} color="var(--text-muted)" style={{ position: 'absolute', top: '11px', left: '12px' }} />
                  <input
                    type="password"
                    required
                    value={regData.confirmPassword}
                    onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                    placeholder="Confirm your password"
                    style={{
                      width: '100%',
                      padding: '9px 14px 9px 36px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      fontSize: '13px',
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-accent"
                style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13.5px' }}
              >
                <span>{loading ? 'Saving to MongoDB...' : 'Register Student & Save Record'}</span>
                <ArrowRight size={15} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
