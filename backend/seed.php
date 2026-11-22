<?php
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/services/MongoDBService.php';

use App\Services\MongoDBService;

echo "Seeding MongoDB Community Server database 'rural_learning_platform'...\n";

$mongo = new MongoDBService();
$db = $mongo->getDatabase();

if (!$db) {
    echo "ERROR: Unable to connect to MongoDB server!\n";
    exit(1);
}

// 0. Ensure unique indexes on email
echo "Ensuring unique indexes on students and admins collections...\n";
$db->selectCollection('students')->createIndex(['email' => 1], ['unique' => true, 'name' => 'unique_student_email']);
$db->selectCollection('admins')->createIndex(['email' => 1], ['unique' => true, 'name' => 'unique_admin_email']);
echo "✓ MongoDB unique indexes configured on email.\n";

// 1. Classes 1 to 7
$classes = [
    ['classId' => 'c1', 'id' => 'c1', 'name' => 'Class 1', 'std' => '1st STD', 'grade' => 1, 'stage' => 'Foundational Stage - Primary'],
    ['classId' => 'c2', 'id' => 'c2', 'name' => 'Class 2', 'std' => '2nd STD', 'grade' => 2, 'stage' => 'Foundational Stage - Literacy & Numeracy'],
    ['classId' => 'c3', 'id' => 'c3', 'name' => 'Class 3', 'std' => '3rd STD', 'grade' => 3, 'stage' => 'Preparatory Stage - Science & Logic'],
    ['classId' => 'c4', 'id' => 'c4', 'name' => 'Class 4', 'std' => '4th STD', 'grade' => 4, 'stage' => 'Preparatory Stage - Exploration'],
    ['classId' => 'c5', 'id' => 'c5', 'name' => 'Class 5', 'std' => '5th STD', 'grade' => 5, 'stage' => 'Preparatory Stage - Advanced Concepts'],
    ['classId' => 'c6', 'id' => 'c6', 'name' => 'Class 6', 'std' => '6th STD', 'grade' => 6, 'stage' => 'Middle Stage - Analytical Reasoning'],
    ['classId' => 'c7', 'id' => 'c7', 'name' => 'Class 7', 'std' => '7th STD', 'grade' => 7, 'stage' => 'Middle Stage - Higher Foundation'],
];

foreach ($classes as $c) {
    $existing = $mongo->findOne('classes', ['classId' => $c['classId']]);
    if (!$existing) {
        $mongo->insertOne('classes', $c);
    }
}
echo "✓ 7 Selectable Classes (Class 1 to Class 7) seeded in MongoDB.\n";

// 2. 8 Subjects
$subjects = [
    ['subjectId' => 'kannada', 'code' => 'kannada', 'name' => 'Kannada', 'nameHi' => 'कन्नड़', 'nameKn' => 'ಕನ್ನಡ'],
    ['subjectId' => 'hindi', 'code' => 'hindi', 'name' => 'Hindi', 'nameHi' => 'हिन्दी', 'nameKn' => 'ಹಿಂದಿ'],
    ['subjectId' => 'english', 'code' => 'english', 'name' => 'English', 'nameHi' => 'अंग्रेज़ी', 'nameKn' => 'ಇಂಗ್ಲಿಷ್'],
    ['subjectId' => 'mathematics', 'code' => 'mathematics', 'name' => 'Mathematics', 'nameHi' => 'गणित', 'nameKn' => 'ಗಣಿತ'],
    ['subjectId' => 'environmentalStudies', 'code' => 'environmentalStudies', 'name' => 'Environmental Studies', 'nameHi' => 'पर्यावरण अध्ययन', 'nameKn' => 'ಪರಿಸರ ಅಧ್ಯಯನ'],
    ['subjectId' => 'biology', 'code' => 'biology', 'name' => 'Biology', 'nameHi' => 'जीव विज्ञान', 'nameKn' => 'ಜೀವಶಾಸ್ತ್ರ'],
    ['subjectId' => 'computerScience', 'code' => 'computerScience', 'name' => 'Computer Science', 'nameHi' => 'कंप्यूटर विज्ञान', 'nameKn' => 'ಕಂಪ್ಯೂಟರ್ ವಿಜ್ಞಾನ'],
    ['subjectId' => 'generalKnowledge', 'code' => 'generalKnowledge', 'name' => 'General Knowledge', 'nameHi' => 'सामान्य ज्ञान', 'nameKn' => 'ಸಾಮಾನ್ಯ ಜ್ಞಾನ'],
];

foreach ($subjects as $s) {
    $existing = $mongo->findOne('subjects', ['subjectId' => $s['subjectId']]);
    if (!$existing) {
        $mongo->insertOne('subjects', $s);
    }
}
echo "✓ 8 Core Academic Subjects seeded in MongoDB.\n";

// 3. Admin Account
$adminEmail = 'admin@rurallearn.in';
$existingAdmin = $mongo->findOne('admins', ['email' => $adminEmail]);
if (!$existingAdmin) {
    $admin = [
        'id' => 'admin_1',
        'adminId' => 'admin_1',
        'name' => 'Headmaster Admin',
        'email' => $adminEmail,
        'emailOrUsername' => $adminEmail,
        'role' => 'admin',
        'passwordHash' => password_hash('admin123', PASSWORD_BCRYPT),
        'school' => 'Karnataka Rural Model School',
        'status' => 'active'
    ];
    $mongo->insertOne('admins', $admin);
    echo "✓ Headmaster Admin created ($adminEmail / admin123)\n";
} else {
    echo "✓ Headmaster Admin already exists ($adminEmail)\n";
}

// 4. Sample Student Account
$studentEmail = 'hammad@rurallearn.in';
$existingStudent = $mongo->findOne('students', ['email' => $studentEmail]);
if (!$existingStudent) {
    $student = [
        'id' => 's_hammad',
        'studentId' => 's_hammad',
        'name' => 'Hammad',
        'email' => $studentEmail,
        'emailOrUsername' => $studentEmail,
        'role' => 'student',
        'classId' => 'c5',
        'selectedClass' => 'c5',
        'className' => 'Class 5',
        'classStd' => '5th STD',
        'rollNumber' => '05-14',
        'passwordHash' => password_hash('password123', PASSWORD_BCRYPT),
        'status' => 'active',
        'joinedDate' => date('Y-m-d'),
        'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
    ];
    $mongo->insertOne('students', $student);
    echo "✓ Sample student account created ($studentEmail / password123, Class 5)\n";
} else {
    echo "✓ Sample student account already exists ($studentEmail)\n";
}

echo "=== Seeder finished successfully with MongoDB Community Server! ===\n";
