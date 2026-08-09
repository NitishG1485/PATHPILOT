# app.py
from flask import Flask, jsonify, render_template, request
app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True # Ensures templates reload during development
# --- Route Handlers (Serving HTML Pages) ---
# The root '/' will serve the Landing Page.
@app.route('/')
def landing_page():
    # Renders the HTML file located in the 'templates' folder
    return render_template('index.html') 
# The /dashboard route serves the main progress view.
@app.route('/dashboard')
def dashboard_page():
    return render_template('dashboard.html')
@app.route('/level1')
def level1_page():
    return render_template('level1.html')
@app.route('/level2')
def level2_page():
    return render_template('level2.html')
@app.route('/level3')
def level3_page():
    return render_template('level3.html')
@app.route('/level4')
def level4_page():
    return render_template('level4.html')
@app.route('/level5')
def level5_page():
    return render_template('level5.html')
@app.route('/profile')
def profile_page():
    return render_template('profile.html')
@app.route('/certificate')
def certificate_page():
    return render_template('certificate.html')
# --- API Endpoints (Simulating Backend Intelligence) ---
@app.route('/api/skill-suggestions', methods=['POST'])
def skill_suggestions():
    """Simulates providing skill recommendations based on the stream result."""
    data = request.get_json()
    stream = data.get('stream')
    if stream == 'tech':
        skills = ["Python Programming", "Data Structures & Algorithms", "Cloud Computing (AWS/Azure)", "Agile Methodologies"]
    elif stream == 'creative':
        skills = ["UX/UI Design Principles", "Adobe Creative Suite", "Storytelling & Copywriting", "Figma Prototyping"]
    elif stream == 'business':
        skills = ["Financial Modeling", "Market Analysis", "Strategic Planning", "Presentation Skills"]
    else:
        skills = ["Communication", "Teamwork", "Problem Solving", "Time Management"]
    return jsonify({"success": True, "skills": skills})
@app.route('/api/resume-feedback', methods=['POST'])
def resume_feedback():
    """Simulates providing AI-powered feedback on a resume draft."""
    data = request.get_json()
    summary = data.get('summary', '')
    skills = data.get('skills', [])
    feedback = []
    # Rule 1: Check Summary Length
    if len(summary.split()) < 20:
        feedback.append({"type": "suggestion", "message": "The Professional Summary is too short. Aim for 3-4 strong sentences."})
    else:
        feedback.append({"type": "positive", "message": "Great job on the Professional Summary length and structure!"})
    # Rule 2: Check for Key Skills (Simulated)
    has_hard_skill = any(k.lower() in [s.lower() for s in skills] for k in ["python", "design", "finance", "data"])
    if not has_hard_skill and len(skills) > 0:
        feedback.append({"type": "suggestion", "message": "Ensure you list specific 'hard' skills relevant to your target role, not just soft skills."})
    # Rule 3: Pro Tip
    feedback.append({"type": "tip", "message": "Pro Tip: Quantify your achievements! Use numbers and metrics to show impact."})
    return jsonify({"success": True, "feedback": feedback})
if __name__ == '__main__':
    # Running on a custom port to avoid common conflicts
    # NOTE: The client-side JS must use this port: http://127.0.0.1:5001
    app.run(debug=True, port=5001)