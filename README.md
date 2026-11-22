# Premium Rural Digital Learning Platform (Classes 1 - 7)

A functional, responsive, modern digital learning platform crafted specifically for rural school students studying in **Classes 1 through 7**. The visual language strictly reproduces the dark obsidian frosted-glass interface, ambient colored lighting, pill navigation, and two-row card hierarchy from the primary design reference.

---

## 🌟 Key Platform Capabilities

1. **Strict UI/UX Fidelity (Reference Screenshot as Source of Truth)**:
   - Deep obsidian dark background (`#08090E`).
   - Frosted translucent glass cards (`backdrop-filter: blur(28px) saturate(150%)`).
   - Atmospheric ambient lighting bleeding behind panels: chartreuse/lime (top-left), cyan (center), plum/amber (bottom-right).
   - Horizontal pill navigation with circular search button on the left, centered pill links with glass highlights, and student avatar pill on the right.
   - **Two-Row Dashboard Layout**:
     - **Top Row (3 Columns)**:
       - **Progress Statistics Card**: 64% Total Activity, 3 segmented progress bars (lime/cyan/orange), 3 compact stat boxes with circular icons (*8 In Progress*, *12 Completed*, *14 Upcoming*).
       - **Featured Learning Card**: Pill category badges, "English Punctuation Made Easy" title, description, classmate avatars, progress bar (72%), and wide frosted pill "Continue Learning" button.
       - **Activity Analytics Card**: "24,9 Hours spent", 7-day capsule bar chart (Mon-Sun), with active highlighted day and floating cyan tooltip (`4.2 hours`).
     - **Bottom Row (2 Columns)**:
       - **My Learning Schedule Card**: Wide container, `< Today >` day switcher, 3 horizontal schedule cards with time pills, level badges (Beginners/Advanced in lime/cyan/amber), and mentor avatars & titles.
       - **Learning Breakdown Card**: Aligned with the right column, subject activity list with lessons count, time spent, and subtle background warm bloom.

2. **User Roles**:
   - **Student**: Access to grade-specific curriculum, interactive quiz challenges, automatic badges, homework submissions, and personal progress analytics.
   - **Admin**: Student enrollments, class oversight (Classes 1-7), subject curriculum, 1,400 quiz management, class-wide homework assignment, and submission grading with feedback.
   - Convenient one-click role switcher in the navigation bar for instant review between Student and Admin views.

3. **Classes & Subjects (Curriculum Scope)**:
   - **7 Classes**: Class 1 to Class 7.
   - **8 Core Subjects**: Hindi, English, Kannada, Mathematics, Environmental Studies, Biology, Computer Science, General Knowledge.
   - **1,400 Quiz Scalable Engine**: Capable of storing and managing 25 quizzes per class/subject combination (7 × 8 × 25).

4. **Interactive Quiz System**:
   - Multiple choice questions with 4 options.
   - Instant automated scoring & percentage calculation.
   - Immediate answer review with detailed educational explanations.
   - Progress tracking with unlimited attempts allowed.
   - Full Admin CRUD: create quizzes, edit questions, designate correct answers, add explanations, and publish/unpublish.

5. **Badge & Achievement System**:
   - Badges earned automatically based on actual milestones: First quiz completed, 5 quizzes mastered, 100% score champion, subject mastery, and homework punctuality.
   - Dedicated glassmorphism Achievements page with unlocked/locked states and dates.

6. **Class-Wide Homework System**:
   - Assigned by Admin to an entire class (with instructions, attachments, and deadlines).
   - Students submit text answers and upload solution files.
   - Admin reviews student submissions, awards marks, and provides personalized feedback.

7. **Multilingual Support**:
   - Instant language switching across **English**, **Hindi (हिन्दी)**, and **Kannada (ಕನ್ನಡ)**.
   - Dynamic i18n dictionary structure updating all navigation, dashboard cards, quiz challenges, and badges without page reload.

8. **Chatbot Placeholder (Phase 2 Ready)**:
   - Floating glassmorphic AI Tutor entry point with modal drawer explaining future LLM integration.

---

## 🚀 How to Run the Application

### 1. Running the React Frontend
```bash
cd frontend
npm install
npm run dev
```
Open your browser at `http://localhost:5173`.

### 2. Running with XAMPP & MongoDB (Production Stack)
1. Ensure MongoDB Community Server is running on `mongodb://127.0.0.1:27017`.
2. Enable `extension=mongodb` in your `php.ini` file in XAMPP.
3. Deploy the `backend/` folder to `C:\xampp\htdocs\digital-learning-platform\backend`.
4. Run the database seeder:
   ```bash
   cd backend
   php seed.php
   ```
5. Full instructions are available in [documentation/XAMPP_MONGODB_SETUP.md](documentation/XAMPP_MONGODB_SETUP.md).

> **Dual-Mode API Layer**: The frontend features an intelligent hybrid service layer. When Apache and MongoDB are running, it syncs with the live PHP REST API. If Apache is stopped, it gracefully falls back to the persistent local storage engine with full interactive functionality so you can test every feature immediately!
