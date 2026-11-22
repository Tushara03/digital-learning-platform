# XAMPP & MongoDB Integration Guide
## Premium Rural Digital Learning Platform

This guide outlines step-by-step instructions to configure Apache (via XAMPP) and MongoDB Community Server to work seamlessly together with the PHP REST backend and React frontend.

---

### Prerequisites
1. **XAMPP** (Apache + PHP 7.4 / 8.x) installed on your system (e.g. `C:\xampp`).
2. **MongoDB Community Server** installed and running as a service or via `mongod.exe` on port `27017`.
3. **MongoDB Compass** for visual database inspection.

---

### Step 1: Enable the PHP MongoDB Extension in XAMPP
Because PHP in XAMPP does not bundle the MongoDB driver by default, follow these steps:
1. Check your PHP version in XAMPP (`php -v`) and architecture (x64 / Thread Safe).
2. Download the matching `php_mongodb.dll` from [PECL MongoDB](https://pecl.php.net/package/mongodb).
3. Place `php_mongodb.dll` inside your XAMPP PHP extensions directory:
   ```
   C:\xampp\php\ext\php_mongodb.dll
   ```
4. Open `C:\xampp\php\php.ini` in VS Code or Notepad.
5. Add this line under the extensions block:
   ```ini
   extension=mongodb
   ```
6. Restart Apache from the XAMPP Control Panel.
7. Verify installation:
   ```bash
   php -m | findstr mongodb
   ```

---

### Step 2: Set Up the PHP Backend in XAMPP
1. Copy or symlink the `backend` folder to your XAMPP `htdocs`:
   ```powershell
   # Example symlink or copy
   Copy-Item -Recurse "C:\Users\chiru\.gemini\antigravity\scratch\digital-learning-platform\backend" "C:\xampp\htdocs\digital-learning-platform\backend"
   ```
2. If Composer is installed, install the official MongoDB PHP library:
   ```bash
   cd C:\xampp\htdocs\digital-learning-platform\backend
   composer install
   ```
3. Run the database seeder to initialize all 12 MongoDB collections:
   ```bash
   php seed.php
   ```

---

### Step 3: Run MongoDB Community Server
Start MongoDB service or run:
```bash
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\data\db"
```
Connect MongoDB Compass to `mongodb://localhost:27017` to inspect the `rural_digital_learning` database and collections.

---

### Step 4: Run the React Frontend
In a terminal:
```bash
cd C:\Users\chiru\.gemini\antigravity\scratch\digital-learning-platform\frontend
npm run dev
```
Open `http://localhost:5173` in your browser.

The frontend is equipped with an intelligent dual-mode API engine:
- If Apache + PHP + MongoDB are running on `http://localhost/digital-learning-platform/backend`, it communicates directly with the live PHP REST API.
- If Apache/MongoDB is stopped, it gracefully and seamlessly falls back to the fully persistent local storage engine, preserving full interactivity (CRUD, quizzes, auto-badges, homework submission, grading, role switching).
