// Initial persistent data store for Rural Digital Learning Platform

export const INITIAL_CLASSES = [
  { id: 'c1', name: 'Class 1', grade: 1, section: 'A', totalStudents: 24, description: 'Early Childhood Foundational Stage' },
  { id: 'c2', name: 'Class 2', grade: 2, section: 'A', totalStudents: 26, description: 'Foundational Literacy & Numeracy' },
  { id: 'c3', name: 'Class 3', grade: 3, section: 'A', totalStudents: 28, description: 'Preparatory Stage - Primary' },
  { id: 'c4', name: 'Class 4', grade: 4, section: 'A', totalStudents: 30, description: 'Preparatory Stage - Science & Languages' },
  { id: 'c5', name: 'Class 5', grade: 5, section: 'A', totalStudents: 32, description: 'Preparatory Stage - Advanced Concepts' },
  { id: 'c6', name: 'Class 6', grade: 6, section: 'A', totalStudents: 34, description: 'Middle Stage - Conceptual Learning' },
  { id: 'c7', name: 'Class 7', grade: 7, section: 'A', totalStudents: 35, description: 'Middle Stage - Analytical Reasoning' },
];

export const SUBJECT_DEFINITIONS = [
  { code: 'hindi', name: 'Hindi', nameHi: 'हिन्दी', nameKn: 'ಹಿಂದಿ', icon: 'BookOpen', color: '#F59E0B' },
  { code: 'english', name: 'English', nameHi: 'अंग्रेज़ी', nameKn: 'ಇಂಗ್ಲಿಷ್', icon: 'FileText', color: '#38BDF8' },
  { code: 'kannada', name: 'Kannada', nameHi: 'कन्नड़', nameKn: 'ಕನ್ನಡ', icon: 'Languages', color: '#EC4899' },
  { code: 'mathematics', name: 'Mathematics', nameHi: 'गणित', nameKn: 'ಗಣಿತ', icon: 'Calculator', color: '#10B981' },
  { code: 'environmentalStudies', name: 'Environmental Studies', nameHi: 'पर्यावरण अध्ययन', nameKn: 'ಪರಿಸರ ಅಧ್ಯಯನ', icon: 'Leaf', color: '#C8F535' },
  { code: 'biology', name: 'Biology', nameHi: 'जीव विज्ञान', nameKn: 'ಜೀವಶಾಸ್ತ್ರ', icon: 'Dna', color: '#A855F7' },
  { code: 'computerScience', name: 'Computer Science', nameHi: 'कंप्यूटर विज्ञान', nameKn: 'ಕಂಪ್ಯೂಟರ್ ವಿಜ್ಞಾನ', icon: 'Laptop', color: '#2BD1C7' },
  { code: 'generalKnowledge', name: 'General Knowledge', nameHi: 'सामान्य ज्ञान', nameKn: 'ಸಾಮಾನ್ಯ ಜ್ಞಾನ', icon: 'Globe', color: '#F97316' },
];

export const INITIAL_STUDENTS = [
  {
    id: 's1',
    name: 'Hammad',
    email: 'hammad@rurallearn.in',
    role: 'student',
    classId: 'c5',
    className: 'Class 5',
    rollNumber: '05-14',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    joinedDate: '2026-06-15',
    activeHours: 24.9,
    quizzesCompleted: 12,
    quizzesInProgress: 8,
    homeworkPending: 2,
    completionRate: 64,
  },
  {
    id: 's2',
    name: 'Ananya Rao',
    email: 'ananya@rurallearn.in',
    role: 'student',
    classId: 'c5',
    className: 'Class 5',
    rollNumber: '05-02',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    joinedDate: '2026-06-15',
    activeHours: 31.4,
    quizzesCompleted: 18,
    quizzesInProgress: 5,
    homeworkPending: 1,
    completionRate: 78,
  },
  {
    id: 's3',
    name: 'Chetan Kumar',
    email: 'chetan@rurallearn.in',
    role: 'student',
    classId: 'c4',
    className: 'Class 4',
    rollNumber: '04-09',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
    joinedDate: '2026-06-15',
    activeHours: 19.2,
    quizzesCompleted: 9,
    quizzesInProgress: 7,
    homeworkPending: 3,
    completionRate: 52,
  }
];

export const INITIAL_ADMIN = {
  id: 'admin1',
  name: 'Admin Headmaster',
  email: 'admin@rurallearn.in',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
  schoolName: 'Karnataka Model Rural Digital School',
  district: 'Dharwad',
};

// Badges system
export const INITIAL_BADGES = [
  {
    id: 'b1',
    code: 'first_quiz',
    title: 'First Step Explorer',
    titleHi: 'पहला कदम खोजी',
    titleKn: 'ಮೊದಲ ಹೆಜ್ಜೆ ಪರಿಶೋಧಕ',
    description: 'Awarded for completing your very first quiz on the platform.',
    icon: 'Compass',
    color: '#38BDF8',
    category: 'quiz',
  },
  {
    id: 'b2',
    code: 'quiz_master_5',
    title: 'Quiz Enthusiast',
    titleHi: 'प्रश्नोत्तरी उत्साही',
    titleKn: 'ಕ್ವಿಜ್ ಉತ್ಸಾಹಿ',
    description: 'Successfully completed 5 individual quizzes with high accuracy.',
    icon: 'Zap',
    color: '#C8F535',
    category: 'quiz',
  },
  {
    id: 'b3',
    code: 'high_scorer',
    title: 'Perfectionist Champion',
    titleHi: 'उत्कृष्टता विजेता',
    titleKn: 'ಪರಿಪೂರ್ಣತೆಯ ಚಾಂಪಿಯನ್',
    description: 'Scored 100% on any quiz challenge.',
    icon: 'Trophy',
    color: '#F59E0B',
    category: 'score',
  },
  {
    id: 'b4',
    code: 'subject_master_math',
    title: 'Mathematics Pioneer',
    titleHi: 'गणित पथप्रदर्शक',
    titleKn: 'ಗಣಿತ ಪ್ರವರ್ತಕ',
    description: 'Mastered 25 quizzes in Mathematics.',
    icon: 'Award',
    color: '#10B981',
    category: 'subject',
  },
  {
    id: 'b5',
    code: 'hw_punctual',
    title: 'Homework Hero',
    titleHi: 'गृहकार्य नायक',
    titleKn: 'ಹೋಮ್‌ವರ್ಕ್ ಹೀರೋ',
    description: 'Submitted 5 homework assignments on time.',
    icon: 'CheckCircle2',
    color: '#2BD1C7',
    category: 'homework',
  },
  {
    id: 'b6',
    code: 'class_topper',
    title: 'Grand Class Scholar',
    titleHi: 'कक्षा विद्वान',
    titleKn: 'ತರಗತಿ ಪಂಡಿತ',
    description: 'Mastered all 8 subjects in your current class level.',
    icon: 'Crown',
    color: '#EC4899',
    category: 'class',
  }
];

export const INITIAL_STUDENT_BADGES = [
  { studentId: 's1', badgeId: 'b1', earnedAt: '2026-10-12', score: 100 },
  { studentId: 's1', badgeId: 'b2', earnedAt: '2026-11-04', score: 90 },
  { studentId: 's1', badgeId: 'b5', earnedAt: '2026-11-18', score: 95 }
];

// Learning Schedule matching reference screenshot
export const INITIAL_SCHEDULE = [
  {
    id: 'sch1',
    time: '10:30-12:00',
    subject: 'Environmental Science',
    topic: 'Plant Life & Soil Types',
    level: 'Beginners',
    levelColor: 'lime',
    mentorName: 'Kristin Watson',
    mentorRole: 'Mentor',
    mentorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    classId: 'c5'
  },
  {
    id: 'sch2',
    time: '13:00-14:00',
    subject: 'English Grammar',
    topic: 'English Punctuation Made Easy',
    level: 'Advanced',
    levelColor: 'cyan',
    mentorName: 'Cody Fisher',
    mentorRole: 'Mentor',
    mentorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    classId: 'c5'
  },
  {
    id: 'sch3',
    time: '16:00-17:00',
    subject: 'Kannada Literature',
    topic: 'Descriptive Sentences & Stories',
    level: 'Beginners',
    levelColor: 'amber',
    mentorName: 'Jacob Jones',
    mentorRole: 'Mentor',
    mentorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    classId: 'c5'
  }
];

// Activity breakdown matching reference screenshot
export const INITIAL_BREAKDOWN = [
  { id: 'b-1', lessonsCount: '8 Lessons', name: 'English Literature', hours: '12.5 h', iconColor: '#C8F535' },
  { id: 'b-2', lessonsCount: '5 Lessons', name: 'Mathematics & Logic', hours: '18.6 h', iconColor: '#A855F7' },
  { id: 'b-3', lessonsCount: '3 Lessons', name: 'Environmental Studies', hours: '4.2 h', iconColor: '#2BD1C7' },
  { id: 'b-4', lessonsCount: '2 Lessons', name: 'Computer Science Basics', hours: '2.5 h', iconColor: '#38BDF8' },
];

// Homework data
export const INITIAL_HOMEWORK = [
  {
    id: 'hw1',
    classId: 'c5',
    subjectCode: 'english',
    subjectName: 'English',
    title: 'Punctuation Marks in Direct Speech',
    instructions: 'Rewrite the given 5 sentences using proper inverted commas, question marks, and capital letters. Explain why quotation marks are placed before commas.',
    deadline: '2026-11-28',
    assignedDate: '2026-11-20',
    attachments: [
      { name: 'Punctuation_Rules_Class5.pdf', size: '240 KB', url: '#' }
    ],
    status: 'Assigned',
    maxMarks: 20
  },
  {
    id: 'hw2',
    classId: 'c5',
    subjectCode: 'mathematics',
    subjectName: 'Mathematics',
    title: 'Fractions in Daily Rural Life',
    instructions: 'Calculate the fractions of harvest distributed among 4 farming families based on the worksheet. Show your full step-by-step arithmetic work.',
    deadline: '2026-11-30',
    assignedDate: '2026-11-21',
    attachments: [
      { name: 'Fractions_Worksheet.pdf', size: '512 KB', url: '#' }
    ],
    status: 'Assigned',
    maxMarks: 25
  },
  {
    id: 'hw3',
    classId: 'c5',
    subjectCode: 'environmentalStudies',
    subjectName: 'Environmental Studies',
    title: 'Local Water Conservation Study',
    instructions: 'Visit a nearby water well or rainwater pond. List three natural filtration steps and draw a simple diagram of the rural water cycle.',
    deadline: '2026-11-25',
    assignedDate: '2026-11-15',
    attachments: [],
    status: 'Submitted',
    maxMarks: 15
  }
];

export const INITIAL_HOMEWORK_SUBMISSIONS = [
  {
    id: 'sub1',
    homeworkId: 'hw3',
    studentId: 's1',
    studentName: 'Hammad',
    submissionText: 'I visited the village pond in Ward 3. Water enters through sand, gravel, and natural reed grass beds before settling. The drawing is attached.',
    fileName: 'Water_Cycle_Observation.jpg',
    submittedAt: '2026-11-21 14:30',
    status: 'Reviewed',
    marks: 14,
    feedback: 'Excellent observational notes Hammad! Your explanation of reed beds is very accurate.'
  }
];

// Helper to generate full realistic educational quizzes for 7 classes x 8 subjects x 25 quizzes
export const generateEducationalQuizzes = () => {
  const quizzes = [];
  const classList = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'];

  // Educational question templates per subject
  const templates = {
    english: [
      {
        q: 'Which punctuation mark is used to conclude a question in English?',
        options: ['Period (.)', 'Question mark (?)', 'Exclamation mark (!)', 'Comma (,)'],
        ans: 1,
        exp: 'A question mark (?) is placed at the end of an interrogative sentence.'
      },
      {
        q: 'Identify the noun in the sentence: "The diligent farmer harvested the golden wheat."',
        options: ['Diligent', 'Harvested', 'Farmer', 'Golden'],
        ans: 2,
        exp: '"Farmer" is a person, hence a noun naming the subject.'
      },
      {
        q: 'Choose the correct opposite (antonym) of the word "Ancient":',
        options: ['Old', 'Modern', 'Historic', 'Antique'],
        ans: 1,
        exp: 'Modern is the direct antonym of ancient (belonging to very distant past).'
      },
      {
        q: 'Fill in the blank with the appropriate preposition: "The birds flew ____ the banyan tree."',
        options: ['Over', 'Between', 'Inside', 'Underneath'],
        ans: 0,
        exp: '"Over" denotes passing in the sky above the tree branches.'
      }
    ],
    mathematics: [
      {
        q: 'What is the sum of 45 and 38?',
        options: ['73', '83', '85', '93'],
        ans: 1,
        exp: '45 + 38 = 83.'
      },
      {
        q: 'Which of the following numbers is an even prime number?',
        options: ['1', '2', '3', '5'],
        ans: 1,
        exp: '2 is the only even prime number in mathematics.'
      },
      {
        q: 'If a rope of 60 meters is cut equally into 5 pieces, how long is each piece?',
        options: ['10 meters', '12 meters', '15 meters', '18 meters'],
        ans: 1,
        exp: '60 / 5 = 12 meters per piece.'
      },
      {
        q: 'What fraction represents 3 quarters of an hour (45 minutes)?',
        options: ['1/2', '2/3', '3/4', '4/5'],
        ans: 2,
        exp: '45/60 simplifies to 3/4.'
      }
    ],
    environmentalStudies: [
      {
        q: 'What is the primary source of natural light and energy on Earth?',
        options: ['The Moon', 'The Sun', 'Electric grid', 'Ocean waves'],
        ans: 1,
        exp: 'The Sun provides solar energy necessary for plant photosynthesis and life on Earth.'
      },
      {
        q: 'Which part of a plant absorbs water and minerals from the soil?',
        options: ['Stem', 'Leaves', 'Flower', 'Roots'],
        ans: 3,
        exp: 'Roots anchor the plant and draw water/nutrients from the earth.'
      },
      {
        q: 'Why should we plant native trees along farm borders?',
        options: ['To stop rain', 'To prevent soil erosion and provide bird habitats', 'To make soil dry', 'To block sunlight'],
        ans: 1,
        exp: 'Tree root systems hold topsoil firmly and shelter beneficial rural pollinators.'
      },
      {
        q: 'Which of these is biodegradable waste?',
        options: ['Plastic bag', 'Banana peel', 'Glass bottle', 'Aluminium can'],
        ans: 1,
        exp: 'Organic materials like fruit peels decompose naturally into rich compost.'
      }
    ],
    biology: [
      {
        q: 'Which green pigment allows plant leaves to perform photosynthesis?',
        options: ['Hemoglobin', 'Chlorophyll', 'Melanin', 'Carotene'],
        ans: 1,
        exp: 'Chlorophyll captures solar light energy inside plant chloroplasts.'
      },
      {
        q: 'How many chambers are there in the human heart?',
        options: ['Two', 'Three', 'Four', 'Six'],
        ans: 2,
        exp: 'The human heart has 4 chambers: right atrium, left atrium, right ventricle, and left ventricle.'
      },
      {
        q: 'Which organ in the human body filters waste from the bloodstream?',
        options: ['Lungs', 'Kidneys', 'Stomach', 'Skin'],
        ans: 1,
        exp: 'The kidneys filter blood, creating urine to balance fluid levels.'
      },
      {
        q: 'What gas do animals inhale for cellular respiration?',
        options: ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Helium'],
        ans: 1,
        exp: 'Animals take in oxygen to release energy from digested nutrients.'
      }
    ],
    computerScience: [
      {
        q: 'Which component is known as the "Brain" of a computer?',
        options: ['Monitor', 'Keyboard', 'CPU (Central Processing Unit)', 'Mouse'],
        ans: 2,
        exp: 'The CPU processes instructions and executes software calculations.'
      },
      {
        q: 'What does the keyboard shortcut "Ctrl + C" do on most computers?',
        options: ['Cut', 'Copy selected item', 'Paste', 'Close window'],
        ans: 1,
        exp: 'Ctrl + C copies highlighted text or files to the clipboard.'
      },
      {
        q: 'Which of the following is an input device?',
        options: ['Printer', 'Speaker', 'Keyboard', 'Projector'],
        ans: 2,
        exp: 'A keyboard sends user input keystrokes into the computer system.'
      },
      {
        q: 'What does "WWW" stand for in a website address?',
        options: ['World Wide Web', 'World With Words', 'Wide Wireless Web', 'Work Wide World'],
        ans: 0,
        exp: 'WWW stands for World Wide Web, invented by Tim Berners-Lee.'
      }
    ],
    generalKnowledge: [
      {
        q: 'Which river is known as the holy lifeline of northern India?',
        options: ['Ganga', 'Yamuna', 'Godavari', 'Krishna'],
        ans: 0,
        exp: 'The Ganga originates from Gangotri glacier and flows across northern India.'
      },
      {
        q: 'What is the national animal of India?',
        options: ['Asiatic Lion', 'Royal Bengal Tiger', 'Indian Elephant', 'Peacock'],
        ans: 1,
        exp: 'The Royal Bengal Tiger is India\'s national animal representing grace and strength.'
      },
      {
        q: 'How many states are there in India?',
        options: ['25', '28', '30', '32'],
        ans: 1,
        exp: 'India consists of 28 states and 8 union territories.'
      },
      {
        q: 'Which planet is known as the "Red Planet" in our solar system?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        ans: 1,
        exp: 'Mars appears reddish due to iron oxide (rust) on its rocky surface.'
      }
    ],
    hindi: [
      {
        q: 'हिन्दी वर्णमाला में कुल कितने स्वर (Vowels) होते हैं?',
        options: ['9', '11', '13', '15'],
        ans: 1,
        exp: 'हिन्दी मानक वर्णमाला में मुख्य रूप से 11 स्वर माने जाते हैं।'
      },
      {
        q: '"सूर्य" का सही पर्यायवाची शब्द कौन सा है?',
        options: ['दिनकर', 'शशि', 'पवन', 'वारिद'],
        ans: 0,
        exp: 'दिनकर, रवि, भास्कर सूर्य के प्रसिद्ध पर्यायवाची हैं।'
      },
      {
        q: '"सत्य" शब्द का सही विलोम (Opposite) क्या होगा?',
        options: ['असत्य', 'झूठा', 'कठोर', 'अधर्म'],
        ans: 0,
        exp: 'सत्य का सटीक विलोम असत्य है।'
      },
      {
        q: 'संज्ञा के स्थान पर प्रयुक्त होने वाले शब्द को क्या कहते हैं?',
        options: ['क्रिया', 'सर्वनाम', 'विशेषण', 'अव्यय'],
        ans: 1,
        exp: 'संज्ञा के बदले बोले जाने वाले शब्द को सर्वनाम (Pronoun) कहते हैं।'
      }
    ],
    kannada: [
      {
        q: 'ಕನ್ನಡ ವರ್ಣಮಾಲೆಯಲ್ಲಿ ಒಟ್ಟು ಎಷ್ಟು ಅಕ್ಷರಗಳಿವೆ?',
        options: ['49', '52', '50', '48'],
        ans: 0,
        exp: 'ಕನ್ನಡ ವರ್ಣಮಾಲೆಯಲ್ಲಿ ಒಟ್ಟು 49 ಅಕ್ಷರಗಳಿವೆ (ಸ್ವರಗಳು, ಯೋಗವಾಹಗಳು, ವ್ಯಂಜನಗಳು).'
      },
      {
        q: 'ಕನ್ನಡದ ರಾಷ್ಟ್ರಕವಿ ಬಿರುದು ಪಡೆದ ಮೊದಲ ಕವಿ ಯಾರು?',
        options: ['ಕುವೆಂಪು', 'ಎಂ. ಗೋವಿಂದ ಪೈ', 'ದ.ರಾ. ಬೇಂದ್ರೆ', 'ಮಾಸ್ತಿ'],
        ans: 1,
        exp: 'ಮಂಜೇಶ್ವರ ಗೋವಿಂದ ಪೈ ಅವರಿಗೆ ಕನ್ನಡದ ಪ್ರಥಮ ರಾಷ್ಟ್ರಕವಿ ಗೌರವ ನೀಡಲಾಯಿತು.'
      },
      {
        q: '"ಮನೆ" ಪದದ ಸಮಾನಾರ್ಥಕ ಪದ ಯಾವುದು?',
        options: ['ಗೃಹ', 'ತರು', 'ವಾರಿ', 'ವನ'],
        ans: 0,
        exp: 'ಮನೆ ಪದಕ್ಕೆ ಸಮಾನಾರ್ಥಕ ಪದ ಗೃಹ / ನಿಲಯ.'
      },
      {
        q: 'ಕರ್ನಾಟಕದ ರಾಜ್ಯ ಹಕ್ಕಿ ಯಾವುದು?',
        options: ['ನೀಲಕಂಠ (ಇಂಡಿಯನ್ ರೋಲರ್)', 'ಗಿಳಿ', 'ನವಿಲು', 'ಕೋಗಿಲೆ'],
        ans: 0,
        exp: 'ಕರ್ನಾಟಕದ ರಾಜ್ಯ ಪಕ್ಷಿ ನೀಲಕಂಠ ಪಕ್ಷಿ (Indian Roller).'
      }
    ]
  };

  // Generate 25 quizzes for each class & subject combination
  classList.forEach((classId, cIdx) => {
    const classNum = cIdx + 1;
    SUBJECT_DEFINITIONS.forEach((subj) => {
      const qTemplateList = templates[subj.code] || templates.english;
      for (let quizNum = 1; quizNum <= 25; quizNum++) {
        const quizId = `q_${classId}_${subj.code}_${quizNum}`;
        const questions = [];

        // 4 questions per quiz
        qTemplateList.forEach((tpl, qIdx) => {
          questions.push({
            id: `${quizId}_q${qIdx + 1}`,
            question: `[Class ${classNum} - ${subj.name} Quiz #${quizNum}] ${tpl.q}`,
            options: tpl.options,
            correctAnswer: tpl.ans,
            explanation: tpl.exp
          });
        });

        quizzes.push({
          id: quizId,
          classId: classId,
          className: `Class ${classNum}`,
          subjectCode: subj.code,
          subjectName: subj.name,
          quizNumber: quizNum,
          title: `${subj.name} - Unit ${quizNum}: Foundation Mastery`,
          description: `Test your understanding of core concepts in ${subj.name} for Class ${classNum}.`,
          durationMinutes: 10,
          totalQuestions: questions.length,
          passingScore: 75,
          published: true,
          questions: questions
        });
      }
    });
  });

  return quizzes;
};

// Initial student quiz attempts history
export const INITIAL_QUIZ_ATTEMPTS = [
  {
    id: 'att_1',
    studentId: 's1',
    quizId: 'q_c5_english_1',
    score: 100,
    total: 4,
    passed: true,
    percentage: 100,
    attemptedAt: '2026-11-20 11:15',
    userAnswers: { 0: 1, 1: 2, 2: 1, 3: 0 }
  },
  {
    id: 'att_2',
    studentId: 's1',
    quizId: 'q_c5_mathematics_1',
    score: 75,
    total: 4,
    passed: true,
    percentage: 75,
    attemptedAt: '2026-11-21 16:40',
    userAnswers: { 0: 1, 1: 1, 2: 1, 3: 1 }
  }
];
