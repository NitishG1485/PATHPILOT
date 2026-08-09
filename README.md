**🗺️ Path Pilot**

An interactive, gamified career guidance web application designed to help users navigate their professional journeys through level-based progression, interactive skill assessments, and personalized career roadmap recommendations.
The platform transforms traditional career exploration into an engaging visual experience, combining tailored assessment algorithms with a modern graphical interface to evaluate skill sets, track growth, and map out optimal career pathways.

**📂 Project Files Overview**

1️⃣ Backend (backend/)
server.py: The core Flask backend serving as the API gateway between the frontend interface and business logic. Exposes endpoints to process assessment responses, update user progression, and fetch career recommendations.
assessment_engine.py: Houses the logic and algorithms for evaluating user input, scoring skill levels, and matching user profiles with career paths.
data/ / models.py: Manages career path structures, skill matrix datasets, level milestones, and profile data models.

2️⃣ Frontend (frontend/) → App.jsx
Control Panel & User Interface: The primary React entry point rendering the visual career map, interactive dashboards, and active assessment views.
components/: Modular UI components styled with Tailwind CSS to present level progression, interactive skill quizzes, and dynamic career roadmaps.
API Integration: Connects with the Flask backend via RESTful API calls (fetch / Axios) to sync progress and update user paths in real-time.

**⚙️ Installation & Setup**

To set up and run Path Pilot on your local system:
1️⃣ Clone the repository
Bash
git clone https://github.com/NitishG/path-pilot.git
cd path-pilot
2️⃣ Install backend dependencies
Bash
cd backend
pip install -r requirements.txt
3️⃣ Run the Backend Server
Bash
python server.py
4️⃣ Setup and Run the Frontend
Bash
cd ../frontend
npm install
npm run dev
✅ Make sure you have Python ≥ 3.9 and Node.js (v16+) with npm installed.
✅ The backend server must be running before starting the frontend development server.

**🧠 Tech Highlights**

Frontend: React, Vite, Tailwind CSS
Backend: Python (Flask), RESTful API Architecture
Core Logic: Gamified progression engine, custom skill-assessment scoring algorithms
Integration: Asynchronous REST API communication between Flask (backend) and React (frontend)

**🚀 Outcome**

Once executed, Path Pilot:
Evaluates user competencies through interactive, level-based skill assessments.
Generates clear, structured career progression roadmaps tailored to individual goals.
Visualizes skill growth and milestone achievements on an interactive dashboard.
Delivers a smooth, engaging user experience across desktop and mobile browsers.

✨ Credits
Developer: Nitish G 👨‍💻

Guiding career pathways — one level at a time.
