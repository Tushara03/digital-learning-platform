import {
  INITIAL_CLASSES,
  SUBJECT_DEFINITIONS,
  INITIAL_ADMIN,
  INITIAL_SCHEDULE,
  INITIAL_BREAKDOWN,
  INITIAL_HOMEWORK,
  INITIAL_HOMEWORK_SUBMISSIONS,
} from './mockData';
import { generateFullCurriculum, CLASSES_LIST, SUBJECT_LIST } from './curriculumData';

const KEYS = {
  CLASSES: 'dlp_classes_v2',
  STUDENTS: 'dlp_students_v2',
  ADMIN: 'dlp_admin_v2',
  UNITS: 'dlp_units_v2',
  PROGRESS: 'dlp_progress_v2',
  BADGES: 'dlp_badges_v2',
  ATTEMPTS: 'dlp_unit_attempts_v2',
  HOMEWORK: 'dlp_homework_v2',
  SUBMISSIONS: 'dlp_submissions_v2',
  SCHEDULE: 'dlp_schedule_v2',
  BREAKDOWN: 'dlp_breakdown_v2',
  CURRENT_USER: 'dlp_current_user_v2',
  TOKEN: 'dlp_token_v2',
};

// Registered students initial seed
const DEFAULT_STUDENTS = [
  {
    id: 's1',
    studentId: 's1',
    name: 'Hammad',
    email: 'hammad@rurallearn.in',
    role: 'student',
    classId: null, // Dynamic class selection
    className: null,
    rollNumber: '05-14',
    status: 'active', // active or disabled
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    joinedDate: '2026-06-15',
    activeHours: 24.9,
  },
  {
    id: 's2',
    studentId: 's2',
    name: 'Ananya Rao',
    email: 'ananya@rurallearn.in',
    role: 'student',
    classId: 'c3',
    className: 'Class 3',
    classStd: '3rd STD',
    rollNumber: '03-02',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    joinedDate: '2026-07-10',
    activeHours: 31.4,
  },
  {
    id: 's3',
    studentId: 's3',
    name: 'Chetan Kumar',
    email: 'chetan@rurallearn.in',
    role: 'student',
    classId: 'c4',
    className: 'Class 4',
    classStd: '4th STD',
    rollNumber: '04-09',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
    joinedDate: '2026-08-20',
    activeHours: 19.2,
  },
  {
    id: 's4',
    studentId: 's4',
    name: 'Pooja Naik',
    email: 'pooja@rurallearn.in',
    role: 'student',
    classId: 'c1',
    className: 'Class 1',
    classStd: '1st STD',
    rollNumber: '01-05',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    joinedDate: '2026-09-01',
    activeHours: 14.5,
  },
  {
    id: 's5',
    studentId: 's5',
    name: 'Manoj Patel',
    email: 'manoj@rurallearn.in',
    role: 'student',
    classId: 'c2',
    className: 'Class 2',
    classStd: '2nd STD',
    rollNumber: '02-11',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    joinedDate: '2026-09-15',
    activeHours: 21.0,
  },
  {
    id: 's6',
    studentId: 's6',
    name: 'Deepa Shetty',
    email: 'deepa@rurallearn.in',
    role: 'student',
    classId: 'c6',
    className: 'Class 6',
    classStd: '6th STD',
    rollNumber: '06-18',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    joinedDate: '2026-10-02',
    activeHours: 28.3,
  },
  {
    id: 's7',
    studentId: 's7',
    name: 'Kiran Gowda',
    email: 'kiran@rurallearn.in',
    role: 'student',
    classId: 'c7',
    className: 'Class 7',
    classStd: '7th STD',
    rollNumber: '07-04',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    joinedDate: '2026-10-18',
    activeHours: 35.1,
  }
];

export const initStorage = () => {
  if (!localStorage.getItem(KEYS.CLASSES)) {
    localStorage.setItem(KEYS.CLASSES, JSON.stringify(CLASSES_LIST));
  }
  if (!localStorage.getItem(KEYS.STUDENTS)) {
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(DEFAULT_STUDENTS));
  }
  if (!localStorage.getItem(KEYS.ADMIN)) {
    localStorage.setItem(KEYS.ADMIN, JSON.stringify(INITIAL_ADMIN));
  }
  if (!localStorage.getItem(KEYS.HOMEWORK)) {
    localStorage.setItem(KEYS.HOMEWORK, JSON.stringify(INITIAL_HOMEWORK));
  }
  if (!localStorage.getItem(KEYS.SUBMISSIONS)) {
    localStorage.setItem(KEYS.SUBMISSIONS, JSON.stringify(INITIAL_HOMEWORK_SUBMISSIONS));
  }
  if (!localStorage.getItem(KEYS.SCHEDULE)) {
    localStorage.setItem(KEYS.SCHEDULE, JSON.stringify(INITIAL_SCHEDULE));
  }
  if (!localStorage.getItem(KEYS.BREAKDOWN)) {
    localStorage.setItem(KEYS.BREAKDOWN, JSON.stringify(INITIAL_BREAKDOWN));
  }
  if (!localStorage.getItem(KEYS.PROGRESS)) {
    localStorage.setItem(KEYS.PROGRESS, JSON.stringify({}));
  }
  if (!localStorage.getItem(KEYS.BADGES)) {
    localStorage.setItem(KEYS.BADGES, JSON.stringify([]));
  }
  if (!localStorage.getItem(KEYS.ATTEMPTS)) {
    localStorage.setItem(KEYS.ATTEMPTS, JSON.stringify([]));
  }
  if (!localStorage.getItem(KEYS.UNITS)) {
    const fullCurriculum = generateFullCurriculum();
    try {
      localStorage.setItem(KEYS.UNITS, JSON.stringify(fullCurriculum));
    } catch (e) {
      console.warn('LocalStorage limit for full units, saving active grades:', e);
    }
  }

  // Set default logged in user if not present
  if (!localStorage.getItem(KEYS.CURRENT_USER)) {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(DEFAULT_STUDENTS[0]));
    localStorage.setItem(KEYS.TOKEN, 'token_student_s1');
  }
};

export const storage = {
  getClasses: () => {
    return JSON.parse(localStorage.getItem(KEYS.CLASSES) || JSON.stringify(CLASSES_LIST));
  },

  getSubjects: () => {
    return SUBJECT_LIST;
  },

  getStudents: () => {
    return JSON.parse(localStorage.getItem(KEYS.STUDENTS) || JSON.stringify(DEFAULT_STUDENTS));
  },

  saveStudents: (students) => {
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(students));
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem(KEYS.CURRENT_USER) || 'null');
  },

  setCurrentUser: (user) => {
    if (user) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
      localStorage.setItem(KEYS.TOKEN, `token_${user.role}_${user.id}`);
    } else {
      localStorage.removeItem(KEYS.CURRENT_USER);
      localStorage.removeItem(KEYS.TOKEN);
    }
  },

  // Student Registration with duplicate email prevention
  registerStudent: (studentData) => {
    const students = storage.getStudents();
    const cleanEmail = studentData.email.toLowerCase().trim();

    // Prevent duplicate accounts with the same email address
    const duplicate = students.find(s => s.email.toLowerCase().trim() === cleanEmail);
    if (duplicate) {
      throw new Error(`An account with email "${cleanEmail}" is already registered. Please sign in or use a different email.`);
    }

    const classes = storage.getClasses();
    const targetClass = classes.find(c => c.id === studentData.classId);

    const newStudent = {
      id: `s_${Date.now()}`,
      studentId: `s_${Date.now()}`,
      name: studentData.name.trim(),
      email: cleanEmail,
      role: 'student',
      classId: studentData.classId || null,
      selectedClass: studentData.classId || null,
      className: targetClass?.name || null,
      classStd: targetClass?.std || null,
      rollNumber: studentData.rollNumber || `${(students.length + 1).toString().padStart(2, '0')}-01`,
      status: 'active', // active
      joinedDate: new Date().toISOString().split('T')[0],
      activeHours: 0,
      avatar: studentData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
    };

    students.push(newStudent);
    storage.saveStudents(students);
    return newStudent;
  },

  // Enable or Disable student account
  toggleStudentStatus: (studentId) => {
    const students = storage.getStudents();
    const idx = students.findIndex(s => s.id === studentId || s.studentId === studentId);
    if (idx !== -1) {
      const current = students[idx].status || 'active';
      students[idx].status = current === 'active' ? 'disabled' : 'active';
      storage.saveStudents(students);

      // If toggled current logged in student, update current session
      const cur = storage.getCurrentUser();
      if (cur && (cur.id === studentId || cur.studentId === studentId)) {
        cur.status = students[idx].status;
        storage.setCurrentUser(cur);
      }
      return students[idx];
    }
    return null;
  },

  // Registration Stats Calculation
  getRegistrationStats: () => {
    const students = storage.getStudents();
    const totalRegistered = students.length;

    const classCounts = {
      c1: 0, c2: 0, c3: 0, c4: 0,
      c5: 0, c6: 0, c7: 0, unassigned: 0
    };

    let activeCount = 0;
    let disabledCount = 0;

    students.forEach((s) => {
      const cId = s.classId;
      if (cId && classCounts[cId] !== undefined) {
        classCounts[cId]++;
      } else {
        classCounts.unassigned++;
      }

      if (s.status === 'disabled') {
        disabledCount++;
      } else {
        activeCount++;
      }
    });

    return {
      totalRegistered,
      activeCount,
      disabledCount,
      classCounts
    };
  },

  // Student selects or changes class
  updateStudentClass: (studentId, classId) => {
    const students = storage.getStudents();
    const classes = storage.getClasses();
    const targetClass = classes.find(c => c.id === classId);
    const idx = students.findIndex(s => s.id === studentId || s.studentId === studentId);

    if (idx !== -1 && targetClass) {
      students[idx].classId = classId;
      students[idx].selectedClass = classId;
      students[idx].className = targetClass.name;
      students[idx].classStd = targetClass.std;
      storage.saveStudents(students);

      const currentUser = storage.getCurrentUser();
      if (currentUser && (currentUser.id === studentId || currentUser.studentId === studentId)) {
        currentUser.classId = classId;
        currentUser.selectedClass = classId;
        currentUser.className = targetClass.name;
        currentUser.classStd = targetClass.std;
        storage.setCurrentUser(currentUser);
      }
      return currentUser;
    }
    return null;
  },

  // Units Management
  getAllUnitsByClassAndSubject: (classId, subjectCode) => {
    let unitsTree = JSON.parse(localStorage.getItem(KEYS.UNITS) || 'null');
    
    // Check if we need to generate or update language-specific curriculum (Kannada / Hindi)
    const needsRegen = !unitsTree ||
      !unitsTree[classId] ||
      !unitsTree[classId][subjectCode] ||
      (subjectCode === 'kannada' && unitsTree[classId][subjectCode][0] && !/[\u0C80-\u0CFF]/.test(unitsTree[classId][subjectCode][0].questions?.[0]?.question || '')) ||
      (subjectCode === 'hindi' && unitsTree[classId][subjectCode][0] && !/[\u0900-\u097F]/.test(unitsTree[classId][subjectCode][0].questions?.[0]?.question || ''));

    if (needsRegen) {
      const generated = generateFullCurriculum();
      unitsTree = { ...unitsTree, ...generated };
      try { localStorage.setItem(KEYS.UNITS, JSON.stringify(unitsTree)); } catch (e) {}
    }
    return unitsTree[classId]?.[subjectCode] || [];
  },

  getUnitById: (unitId) => {
    // unitId format: u_c5_mathematics_3
    const parts = unitId.split('_');
    if (parts.length >= 4) {
      const classId = parts[1];
      const subjectCode = parts[2];
      const units = storage.getAllUnitsByClassAndSubject(classId, subjectCode);
      return units.find(u => u.unitId === unitId) || null;
    }
    return null;
  },

  saveUnit: (updatedUnit) => {
    const { classId, subjectCode, unitId } = updatedUnit;
    let unitsTree = JSON.parse(localStorage.getItem(KEYS.UNITS) || 'null');
    if (!unitsTree) unitsTree = generateFullCurriculum();

    if (unitsTree[classId] && unitsTree[classId][subjectCode]) {
      const idx = unitsTree[classId][subjectCode].findIndex(u => u.unitId === unitId);
      if (idx !== -1) {
        unitsTree[classId][subjectCode][idx] = { ...unitsTree[classId][subjectCode][idx], ...updatedUnit };
      } else {
        unitsTree[classId][subjectCode].push(updatedUnit);
      }
      localStorage.setItem(KEYS.UNITS, JSON.stringify(unitsTree));
      return true;
    }
    return false;
  },

  // Progress Tracking (Units Completed per Student, Class, Subject)
  getStudentSubjectProgress: (studentId, classId, subjectCode) => {
    const progressStore = JSON.parse(localStorage.getItem(KEYS.PROGRESS) || '{}');
    const key = `${studentId}_${classId}_${subjectCode}`;
    const completedUnits = progressStore[key] || [];
    return {
      completedUnits,
      completedCount: completedUnits.length,
      totalUnits: 25,
      progressPercentage: Math.round((completedUnits.length / 25) * 100)
    };
  },

  getStudentOverallProgress: (studentId, classId) => {
    const subjects = SUBJECT_LIST;
    let totalCompleted = 0;
    subjects.forEach((subj) => {
      const p = storage.getStudentSubjectProgress(studentId, classId, subj.code);
      totalCompleted += p.completedCount;
    });
    const totalUnits = 8 * 25; // 200 units per class
    return {
      totalCompleted,
      totalUnits,
      percentage: Math.round((totalCompleted / totalUnits) * 100)
    };
  },

  // Unit Quiz Attempt & Automatic Badge Awarding
  saveUnitAttempt: (attempt) => {
    const attempts = JSON.parse(localStorage.getItem(KEYS.ATTEMPTS) || '[]');
    attempts.unshift(attempt);
    localStorage.setItem(KEYS.ATTEMPTS, JSON.stringify(attempts));

    const { studentId, classId, subjectCode, unitNumber, passed, percentage } = attempt;

    // If passed (score >= 70%), record unit completion and evaluate badges
    if (passed) {
      // 1. Update Progress Store
      const progressStore = JSON.parse(localStorage.getItem(KEYS.PROGRESS) || '{}');
      const key = `${studentId}_${classId}_${subjectCode}`;
      const completedUnits = progressStore[key] || [];
      if (!completedUnits.includes(unitNumber)) {
        completedUnits.push(unitNumber);
        progressStore[key] = completedUnits.sort((a, b) => a - b);
        localStorage.setItem(KEYS.PROGRESS, JSON.stringify(progressStore));
      }

      // 2. Award Badges
      storage.awardBadgesForMilestone(studentId, classId, subjectCode, unitNumber, percentage);
    }

    return attempt;
  },

  awardBadgesForMilestone: (studentId, classId, subjectCode, unitNumber, percentage) => {
    const badges = JSON.parse(localStorage.getItem(KEYS.BADGES) || '[]');
    const subjObj = SUBJECT_LIST.find(s => s.code === subjectCode);
    const classes = storage.getClasses();
    const classObj = classes.find(c => c.id === classId);
    const className = classObj?.name || classId;
    const subjectName = subjObj?.name || subjectCode;

    const hasBadge = (badgeId) => badges.some(b => b.badgeId === badgeId && b.studentId === studentId);

    // 1. Unit Completion Badge
    const unitBadgeId = `badge_${classId}_${subjectCode}_u${unitNumber}`;
    if (!hasBadge(unitBadgeId)) {
      badges.push({
        badgeId: unitBadgeId,
        studentId,
        classId,
        className,
        subjectCode,
        subjectName,
        unitNumber,
        badgeType: 'unit',
        title: `${subjectName}: Unit ${unitNumber} Pioneer`,
        description: `Successfully mastered Unit ${unitNumber} in ${subjectName} (${className}) with passing score.`,
        icon: 'Award',
        color: subjObj?.color || '#C8F535',
        earnedAt: new Date().toISOString().split('T')[0]
      });
    }

    // 2. Excellence Badge (Score >= 90%)
    if (percentage >= 90) {
      const excellenceBadgeId = `badge_excellence_${classId}_${subjectCode}_u${unitNumber}`;
      if (!hasBadge(excellenceBadgeId)) {
        badges.push({
          badgeId: excellenceBadgeId,
          studentId,
          classId,
          className,
          subjectCode,
          subjectName,
          unitNumber,
          badgeType: 'excellence',
          title: `Perfectionist: ${subjectName} Unit ${unitNumber}`,
          description: `Achieved outstanding ${percentage}% accuracy on ${subjectName} Unit ${unitNumber}.`,
          icon: 'Trophy',
          color: '#F59E0B',
          earnedAt: new Date().toISOString().split('T')[0]
        });
      }
    }

    // 3. Subject Master Badge (All 25 units completed in this subject)
    const progress = storage.getStudentSubjectProgress(studentId, classId, subjectCode);
    if (progress.completedCount >= 25) {
      const subjectMasterBadgeId = `badge_${classId}_${subjectCode}_master`;
      if (!hasBadge(subjectMasterBadgeId)) {
        badges.push({
          badgeId: subjectMasterBadgeId,
          studentId,
          classId,
          className,
          subjectCode,
          subjectName,
          badgeType: 'subject',
          title: `${subjectName} Grand Master`,
          description: `Completed all 25 learning units and quizzes in ${subjectName} for ${className}!`,
          icon: 'Crown',
          color: '#10B981',
          earnedAt: new Date().toISOString().split('T')[0]
        });
      }
    }

    // 4. Class Champion Badge (All 8 subjects completed in this class)
    const overall = storage.getStudentOverallProgress(studentId, classId);
    if (overall.totalCompleted >= (8 * 25)) {
      const classChampBadgeId = `badge_${classId}_champion`;
      if (!hasBadge(classChampBadgeId)) {
        badges.push({
          badgeId: classChampBadgeId,
          studentId,
          classId,
          className,
          badgeType: 'class',
          title: `${className} Valedictorian Champion`,
          description: `Accomplished all 200 units across all 8 subjects in ${className}!`,
          icon: 'Sparkles',
          color: '#EC4899',
          earnedAt: new Date().toISOString().split('T')[0]
        });
      }
    }

    localStorage.setItem(KEYS.BADGES, JSON.stringify(badges));
  },

  getStudentBadges: (studentId, classId, subjectCode) => {
    let badges = JSON.parse(localStorage.getItem(KEYS.BADGES) || '[]');
    if (studentId) badges = badges.filter(b => b.studentId === studentId);
    if (classId) badges = badges.filter(b => b.classId === classId);
    if (subjectCode) badges = badges.filter(b => b.subjectCode === subjectCode);
    return badges;
  },

  getUnitAttempts: (studentId, unitId) => {
    const attempts = JSON.parse(localStorage.getItem(KEYS.ATTEMPTS) || '[]');
    return attempts.filter(a => a.studentId === studentId && (!unitId || a.unitId === unitId));
  },

  // Homework
  getHomework: (classId) => {
    const hw = JSON.parse(localStorage.getItem(KEYS.HOMEWORK) || '[]');
    return classId ? hw.filter(h => h.classId === classId) : hw;
  },
  saveHomework: (hw) => localStorage.setItem(KEYS.HOMEWORK, JSON.stringify(hw)),
  getSubmissions: (homeworkId, studentId) => {
    let subs = JSON.parse(localStorage.getItem(KEYS.SUBMISSIONS) || '[]');
    if (homeworkId) subs = subs.filter(s => s.homeworkId === homeworkId);
    if (studentId) subs = subs.filter(s => s.studentId === studentId);
    return subs;
  },
  saveSubmissions: (subs) => localStorage.setItem(KEYS.SUBMISSIONS, JSON.stringify(subs)),
  getSchedule: (classId) => {
    const sched = JSON.parse(localStorage.getItem(KEYS.SCHEDULE) || '[]');
    return classId ? sched.filter(s => !s.classId || s.classId === classId) : sched;
  },
  getBreakdown: () => JSON.parse(localStorage.getItem(KEYS.BREAKDOWN) || '[]'),
};
