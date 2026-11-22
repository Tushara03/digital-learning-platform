# MongoDB Database Schema Specification (Updated)
## Premium Rural Digital Learning Platform

### Database Name: `rural_digital_learning`

---

### 1. `students` Collection
Stores enrolled students with dynamic grade selection.
```json
{
  "_id": "ObjectId",
  "studentId": "String (unique)",
  "name": "String",
  "emailOrUsername": "String (unique, indexed)",
  "passwordHash": "String (BCrypt hash)",
  "selectedClass": "String (c1 to c7, null if pending selection)",
  "className": "String ('Class 1' to 'Class 7')",
  "classStd": "String ('1st STD' to '7th STD')",
  "preferredLanguage": "String ('en', 'hi', 'kn')",
  "rollNumber": "String",
  "avatar": "String (URL)",
  "activeHours": "Number",
  "created_at": "ISODate",
  "updated_at": "ISODate"
}
```

---

### 2. `classes` Collection
7 Selectable Academic Classes (1st STD to 7th STD).
```json
{
  "_id": "ObjectId",
  "classId": "String (c1 to c7)",
  "name": "String ('Class 1' to 'Class 7')",
  "std": "String ('1st STD' to '7th STD')",
  "grade": "Number (1 to 7)",
  "stage": "String ('Foundational Stage', 'Preparatory Stage', 'Middle School Stage')",
  "description": "String"
}
```

---

### 3. `subjects` Collection
8 Core Academic Subjects per class (56 class-subject sections total).
```json
{
  "_id": "ObjectId",
  "subjectId": "String (unique)",
  "classId": "String (references classes.classId)",
  "code": "String (hindi, english, kannada, mathematics, environmentalStudies, biology, computerScience, generalKnowledge)",
  "subjectName": "String",
  "nameHi": "String",
  "nameKn": "String",
  "color": "String"
}
```

---

### 4. `units` Collection
**1,400 Named Learning Units** (7 Classes × 8 Subjects × 25 Units).
```json
{
  "_id": "ObjectId",
  "unitId": "String (e.g., u_c3_mathematics_9)",
  "classId": "String (references classes.classId, indexed)",
  "className": "String",
  "subjectId": "String (references subjects.subjectId, indexed)",
  "subjectCode": "String",
  "subjectName": "String",
  "unitNumber": "Number (1 to 25)",
  "unitNumberStr": "String ('01' to '25')",
  "unitTitle": "String (e.g. 'Unit 09 — Introduction to Fractions: Halves & Quarters')",
  "description": "String",
  "learningObjectives": ["Array of Strings"],
  "lessonContent": "String",
  "videoTitle": "String",
  "videoUrl": "String (verified educational YouTube embed)",
  "thumbnailUrl": "String",
  "publishedStatus": "Boolean (default: true)",
  "questions": [
    {
      "id": "String",
      "question": "String",
      "options": ["Array of 4 Strings"],
      "correctAnswer": "Number (0 to 3)",
      "explanation": "String"
    }
  ]
}
```

---

### 5. `quiz_attempts` Collection
Records unit-specific quiz submissions with score, answers, and time.
```json
{
  "_id": "ObjectId",
  "attemptId": "String (unique)",
  "studentId": "String (references students.studentId, indexed)",
  "classId": "String (references classes.classId, indexed)",
  "subjectId": "String (references subjects.subjectId, indexed)",
  "unitId": "String (references units.unitId, indexed)",
  "unitNumber": "Number",
  "score": "Number",
  "total": "Number",
  "percentage": "Number",
  "passed": "Boolean",
  "attemptNumber": "Number",
  "userAnswers": "Object",
  "completedAt": "ISODate"
}
```

---

### 6. `student_progress` Collection
Tracks completed units per student, class, and subject independently.
```json
{
  "_id": "ObjectId",
  "studentId": "String (indexed)",
  "classId": "String (indexed)",
  "subjectId": "String (indexed)",
  "completedUnits": ["Array of Numbers: e.g. [1, 2, 9]"],
  "progressPercentage": "Number (0 to 100)"
}
```

---

### 7. `badges` Collection
Isolated badges awarded per student, class, subject, and unit.
```json
{
  "_id": "ObjectId",
  "badgeId": "String (e.g., badge_c3_mathematics_u9)",
  "studentId": "String (references students.studentId, indexed)",
  "classId": "String (references classes.classId, indexed)",
  "subjectId": "String (references subjects.subjectId, indexed)",
  "unitId": "String (references units.unitId, optional for subject/class badges)",
  "badgeType": "String ('unit', 'excellence', 'subject', 'class')",
  "title": "String",
  "description": "String",
  "earnedAt": "ISODate"
}
```
