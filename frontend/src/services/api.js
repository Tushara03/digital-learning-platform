import { storage, initStorage } from './storage';
import { generateFreeTutorResponse } from './tutorEngine';

// Initialize storage defaults
initStorage();

// Connect React Frontend to PHP REST API (served via Apache / PHP backend proxy)
const BACKEND_BASE_URL = '/api/index.php';

const getAuthHeaders = () => {
  const token = localStorage.getItem('dlp_session_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Auth - Verifies credentials through PHP REST API and MongoDB Community Server
  login: async (email, password, role = 'student') => {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
        signal: AbortSignal.timeout(6000)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const user = data.data.user || data.user;
        const token = data.data.token || data.token;
        if (token) {
          localStorage.setItem('dlp_session_token', token);
        }
        storage.setCurrentUser(user);
        return { success: true, user, token, restoredClass: data.data?.restoredClass };
      } else {
        return { success: false, message: data.message || 'Login failed. Please verify your credentials.' };
      }
    } catch (e) {
      console.warn('Backend login connection error, checking local store:', e);
      // Offline fallback
      if (role === 'admin') {
        const admin = storage.getCurrentUser();
        if (admin && admin.role === 'admin' && email.toLowerCase() === admin.email.toLowerCase()) {
          return { success: true, user: admin };
        }
      } else {
        const students = storage.getStudents();
        const student = students.find(s => s.email.toLowerCase() === email.toLowerCase());
        if (student) {
          if (student.status === 'disabled') {
            return { success: false, message: 'Your student account has been disabled.' };
          }
          storage.setCurrentUser(student);
          return { success: true, user: student };
        }
      }
      return { success: false, message: 'Could not connect to authentication server. Please ensure backend is running.' };
    }
  },

  logout: async () => {
    try {
      await fetch(`${BACKEND_BASE_URL}?action=logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
        signal: AbortSignal.timeout(2000)
      });
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('dlp_session_token');
    storage.setCurrentUser(null);
    return { success: true };
  },

  getCurrentUser: () => {
    return storage.getCurrentUser();
  },

  // Class selection for student (persists in MongoDB and localStorage)
  selectStudentClass: async (studentId, classId) => {
    try {
      const classMap = {
        'c1': { name: 'Class 1', std: '1st STD' },
        'c2': { name: 'Class 2', std: '2nd STD' },
        'c3': { name: 'Class 3', std: '3rd STD' },
        'c4': { name: 'Class 4', std: '4th STD' },
        'c5': { name: 'Class 5', std: '5th STD' },
        'c6': { name: 'Class 6', std: '6th STD' },
        'c7': { name: 'Class 7', std: '7th STD' },
      };
      const classInfo = classMap[classId] || { name: `Class ${classId.replace('c','')}`, std: `${classId.replace('c','')}th STD` };

      await fetch(`${BACKEND_BASE_URL}?action=students&sub=update_class&id=${encodeURIComponent(studentId)}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          classId,
          className: classInfo.name,
          classStd: classInfo.std
        }),
        signal: AbortSignal.timeout(3000)
      });
    } catch (e) {
      console.warn('Backend updateClass fallback to storage:', e);
    }

    const updated = storage.updateStudentClass(studentId, classId);
    return { success: true, user: updated };
  },

  getClasses: async () => {
    return storage.getClasses();
  },

  getSubjects: async () => {
    return storage.getSubjects();
  },

  // Units & Curriculum
  getUnits: async (classId, subjectCode) => {
    return storage.getAllUnitsByClassAndSubject(classId, subjectCode);
  },

  getUnitById: async (unitId) => {
    return storage.getUnitById(unitId);
  },

  saveUnit: async (unitData) => {
    storage.saveUnit(unitData);
    return { success: true };
  },

  // Unit Quiz Submission
  submitUnitQuiz: async (unitId, studentId, answers) => {
    const unit = storage.getUnitById(unitId);
    if (!unit) throw new Error('Unit not found');

    const questions = unit.questions || [];
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / (questions.length || 1)) * 100);
    const passed = score >= 60;

    const result = {
      unitId,
      studentId,
      score,
      correctCount,
      totalQuestions: questions.length,
      passed,
      completedAt: new Date().toISOString()
    };

    storage.saveQuizAttempt(result);
    return { success: true, result };
  },

  // Homework
  getHomeworkList: async (classId) => {
    return storage.getHomeworkByClass(classId);
  },

  getHomeworkSubmissions: async (homeworkId) => {
    return storage.getSubmissionsByHomework(homeworkId);
  },

  submitHomework: async (submissionData) => {
    const sub = storage.submitHomework(submissionData);
    return { success: true, submission: sub };
  },

  gradeHomework: async (submissionId, gradeData) => {
    const updated = storage.gradeSubmission(submissionId, gradeData);
    return { success: true, submission: updated };
  },

  createHomework: async (hwData) => {
    const created = storage.createHomework(hwData);
    return { success: true, homework: created };
  },

  // AI Tutor Integration
  sendTutorMessage: async (message, studentContext = {}, conversationHistory = []) => {
    try {
      const messagesPayload = [
        {
          role: 'system',
          content: `You are the friendly, encouraging AI Tutor of the Karnataka Rural Digital Learning Platform, helping school children from Class 1 to Class 7.
Context:
- Student Class: ${studentContext.className || studentContext.classId || 'Class 5'}
- Current Subject: ${studentContext.subjectName || studentContext.subject || 'General'}
- Current Unit: ${studentContext.unitTitle || 'Lesson'}
- Student Preferred Language: ${studentContext.preferredLanguage || 'English'}

Instructions:
1. Explain concepts in simple, step-by-step, age-appropriate language matching the child's class.
2. If the subject is Kannada, respond in pure Kannada script (ಕನ್ನಡ).
3. If the subject is Hindi, respond in pure Devanagari Hindi script (हिन्दी).
4. If asked math questions, show step-by-step calculations clearly.
5. Provide helpful hints for homework and quizzes rather than direct answers.
6. Use relatable rural Indian examples (fields, trees, village schools, animals, festivals).
7. Keep responses concise, warm, educational, and easy to read.`
        },
        ...conversationHistory.slice(-8).map(h => ({
          role: (h.role || (h.sender === 'user' ? 'user' : 'assistant')),
          content: h.content || h.text || ''
        })).filter(h => h.content),
        { role: 'user', content: message }
      ];

      const res = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messagesPayload,
          model: 'openai',
          temperature: 0.5
        }),
        signal: AbortSignal.timeout(18000)
      });

      if (res.ok) {
        const text = await res.text();
        if (text && text.trim().length > 0 && !text.includes('<!DOCTYPE html>')) {
          return {
            success: true,
            reply: text.trim(),
            model: 'GPT OSS (Open-Source Free Model)'
          };
        }
      }
    } catch (err) {
      console.warn('Open-Source GPT endpoint busy, switching to internal tutor engine:', err);
    }

    return api.generateLocalTutorResponse(message, studentContext);
  },

  generateLocalTutorResponse: (message, context = {}) => {
    return generateFreeTutorResponse(message, context);
  },

  // Progress & Badges
  getStudentSubjectProgress: async (studentId, classId, subjectCode) => {
    return storage.getStudentSubjectProgress(studentId, classId, subjectCode);
  },

  getStudentOverallProgress: async (studentId, classId) => {
    return storage.getStudentOverallProgress(studentId, classId);
  },

  getStudentBadges: async (studentId, classId, subjectCode) => {
    return storage.getStudentBadges(studentId, classId, subjectCode);
  },

  // Students Management & Registration (Connected to PHP REST API + MongoDB)
  getStudents: async (classId = null) => {
    try {
      const url = classId && classId !== 'all' 
        ? `${BACKEND_BASE_URL}?action=students&classId=${encodeURIComponent(classId)}` 
        : `${BACKEND_BASE_URL}?action=students`;
      const res = await fetch(url, {
        headers: getAuthHeaders(),
        signal: AbortSignal.timeout(4000)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          return data.data;
        }
      }
    } catch (e) {
      console.warn('Backend getStudents fallback:', e);
    }
    return storage.getStudents();
  },

  getRegistrationStats: async () => {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}?action=students&sub=stats`, {
        headers: getAuthHeaders(),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          return data.data;
        }
      }
    } catch (e) {
      console.warn('Backend getRegistrationStats fallback:', e);
    }
    return storage.getRegistrationStats();
  },

  // Register Student via PHP REST API + MongoDB
  registerStudent: async (studentData) => {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}?action=students&sub=register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: studentData.name,
          email: studentData.email,
          password: studentData.password,
          confirmPassword: studentData.confirmPassword || studentData.confirm_password,
          classId: studentData.classId,
          className: studentData.className,
          classStd: studentData.classStd,
          rollNumber: studentData.rollNumber
        }),
        signal: AbortSignal.timeout(6000)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const newStudent = data.data || data.student;
        // Sync with local storage
        storage.registerStudent(newStudent);
        return { success: true, student: newStudent, message: data.message };
      } else {
        return {
          success: false,
          status: res.status,
          message: data.message || (res.status === 409 ? 'A student account with this email address already exists.' : 'Registration failed.')
        };
      }
    } catch (e) {
      console.error('Backend registration error:', e);
      return { success: false, message: 'Could not connect to the registration server. Please ensure the PHP and MongoDB backend is running.' };
    }
  },

  toggleStudentStatus: async (studentId) => {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}?action=students&sub=toggle_status&id=${encodeURIComponent(studentId)}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        signal: AbortSignal.timeout(4000)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          storage.toggleStudentStatus(studentId);
          return { success: true, status: data.data?.status };
        }
      }
    } catch (e) {
      console.warn('Backend toggleStudentStatus fallback:', e);
    }
    const updated = storage.toggleStudentStatus(studentId);
    return { success: true, status: updated?.status };
  }
};
