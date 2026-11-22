import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { storage } from '../services/storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => storage.getCurrentUser());
  const [loading, setLoading] = useState(false);

  const login = async (email, password, role) => {
    setLoading(true);
    try {
      const res = await api.login(email, password, role);
      if (res.success) {
        setCurrentUser(res.user);
        return { success: true };
      }
      return { success: false, message: res.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (studentData) => {
    setLoading(true);
    try {
      const res = await api.registerStudent(studentData);
      if (res.success) {
        storage.setCurrentUser(res.student);
        setCurrentUser(res.student);
        return { success: true, student: res.student };
      }
      return { success: false, message: res.message };
    } catch (err) {
      return { success: false, message: err.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    api.logout();
    setCurrentUser(null);
  };

  const switchRole = (newRole) => {
    if (newRole === 'admin') {
      const admin = JSON.parse(localStorage.getItem('dlp_admin_v1'));
      storage.setCurrentUser(admin);
      setCurrentUser(admin);
    } else {
      const students = storage.getStudents();
      const student = students[0];
      storage.setCurrentUser(student);
      setCurrentUser(student);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, switchRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
