# Architecture & Technical Design Document (Updated)
## Premium Rural Digital Learning Platform

### 1. Updated Core Architecture

The platform now implements the strict educational learning journey:
```
STUDENT LOGIN
    ↓
SELECT CLASS (Classes 1 to 7) [Prompted if not chosen or changed]
    ↓
VIEW 8 CLASS-SPECIFIC SUBJECTS (56 class-subject sections total)
    ↓
SELECT SUBJECT
    ↓
VIEW 25 NAMED LEARNING UNITS
    ↓
OPEN INDIVIDUAL UNIT MODULE
    ↓
LESSON GUIDE + EMBEDDED YOUTUBE VIDEO
    ↓
UNIT-SPECIFIC 5-QUESTION QUIZ
    ↓
RESULT + ISOLATED BADGE + INDEPENDENT PROGRESS
```

---

### 2. Class Selection System (Part 1)
- **7 Selectable Classes**:
  1. Class 1 (1st STD) - Foundational Stage
  2. Class 2 (2nd STD) - Foundational Stage
  3. Class 3 (3rd STD) - Preparatory Stage
  4. Class 4 (4th STD) - Preparatory Stage
  5. Class 5 (5th STD) - Preparatory Stage
  6. Class 6 (6th STD) - Middle School Stage
  7. Class 7 (7th STD) - Middle School Stage
- Clean, dark glassmorphism selection cards with stage tags, learning icons, active selection state, and "Continue" button.
- Persistence: Stored per-student. Once selected, student is never asked on subsequent logins unless they click "Change Class" in the navigation bar or grade dashboard.
- No class is hardcoded by default.

---

### 3. Class-Wise 8 Subjects & 1,400 Named Units (Parts 2, 3, 4, 5)
- **8 Core Subjects per Class**: Hindi, English, Kannada, Mathematics, Environmental Studies, Biology, Computer Science, General Knowledge.
- **56 Class-Subject Sections**.
- **1,400 Individually Named Units**: 25 progressive units for every subject across all 7 grades.
- Difficulty increases progressively from Class 1 to Class 7.
- **Each Unit Features**:
  1. Meaningful Unit Title (e.g. `Unit 09 — Introduction to Fractions: Halves & Quarters`)
  2. Structured Lesson Overview & Real-World Rural Application Notes
  3. Verified Educational YouTube Video embed with title, watch controls, and external YouTube link
  4. Unit-Specific 5-Question Quiz Challenge with instant evaluation, correct answer highlight, and explanations.

---

### 4. Separate Badges & Progress Tracking (Part 6)
- **Isolated Progression**:
  - Mathematics badges are isolated from English badges.
  - Class 3 badges are isolated from Class 4 badges.
- **4 Badge Levels**:
  1. *Unit Completion Badge*: Earned on scoring >= 70% on that unit's quiz.
  2. *Excellence Badge*: Earned on achieving >= 90% score on a unit quiz.
  3. *Subject Master Badge*: Earned on completing all 25 units in that subject.
  4. *Class Champion Badge*: Earned on completing all 8 subjects in that class.

---

### 5. Admin Governance (Part 8)
- View students enrolled across all 7 grades.
- Reassign and correct student grade levels.
- Edit any unit's title, description, lesson guide, YouTube embed URL, and quiz questions.
- Publish and monitor class and subject mastery.
