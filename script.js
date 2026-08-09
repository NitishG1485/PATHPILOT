// --- Global State Management ---
const STORAGE_KEY = 'pathPilotState';

let state = {
    totalXp: 0,
    completedLevels: [], // e.g., [1, 2, 3]
    level1Stream: null,
    level2Skills: [],
    level5Tasks: { 1: false, 2: false, 3: false, 4: false }, // Updated task list
    userName: '',
    userEmail: '',
};

const quizQuestions = [
    {
        question: "I prefer working with...",
        options: [
            { text: "A) Logic, data, and systems.", value: "tech" },
            { text: "B) Visuals, concepts, and communication.", value: "creative" },
            { text: "C) People, strategies, and numbers.", value: "business" },
        ],
    },
    {
        question: "In my free time, I enjoy...",
        options: [
            { text: "A) Solving complex puzzles or coding a side project.", value: "tech" },
            { text: "B) Drawing, photography, or creative writing.", value: "creative" },
            { text: "C) Planning events or managing a budget.", value: "business" },
        ],
    },
    {
        question: "I'm most interested in...",
        options: [
            { text: "A) Building the next generation of software tools.", value: "tech" },
            { text: "B) Creating compelling user experiences and brand identities.", value: "creative" },
            { text: "C) Leading teams and achieving organizational goals.", value: "business" },
        ],
    },
];

/**
 * Loads the application state from localStorage.
 */
function loadState() {
    try {
        const storedState = localStorage.getItem(STORAGE_KEY);
        if (storedState) {
            state = { ...state, ...JSON.parse(storedState) };
        }
    } catch (e) {
        console.error("Error loading state from localStorage", e);
    }
}

/**
 * Saves the current application state to localStorage.
 */
function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.error("Error saving state to localStorage", e);
    }
}

/**
 * Updates the total XP and saves the state.
 */
function updateTotalXp(xpChange) {
    state.totalXp += xpChange;
    const xpTotalElement = document.getElementById("xp-total");
    if (xpTotalElement) {
        xpTotalElement.textContent = state.totalXp;
    }
    saveState();
}

/**
 * Navigates the user to a page and ensures the level is unlocked.
 * @param {number} levelNum - The level number to check (1-5).
 * @param {string} url - The URL to navigate to if unlocked.
 */
function navigateToLevel(levelNum, url) {
    // Level 1 is always accessible
    if (levelNum === 1) {
        window.location.href = url;
        return;
    }
    // Check if the preceding level is complete
    if (state.completedLevels.includes(levelNum - 1)) {
        window.location.href = url;
    } else {
        alert(`Level ${levelNum - 1} must be completed first to unlock Level ${levelNum}!`);
    }
}

/**
 * Marks a level as complete and handles XP gain and state update.
 */
function completeLevel(levelNum, xpAmount) {
    if (!state.completedLevels.includes(levelNum)) {
        state.completedLevels.push(levelNum);
        updateTotalXp(xpAmount);
        saveState();
    }

    // Redirect to the dashboard after completion
    setTimeout(() => {
        window.location.href = '/dashboard'; 
    }, 500);
}


// --- UI/Helper Functions ---

function setupGlobalUI() {
    const xpTotalElement = document.getElementById("xp-total");
    if (xpTotalElement) {
        xpTotalElement.textContent = state.totalXp;
    }

    // Highlight active link
    const path = window.location.pathname;
    document.querySelectorAll('.navbar-nav a').forEach(a => {
        // Handle root (landing) and dashboard routes being related
        const isDashboardLink = a.getAttribute('href') === '/dashboard';
        const isDashboardActive = path === '/dashboard' || (path === '/' && state.userName); // If root and user started, highlight dashboard

        if ((isDashboardLink && isDashboardActive) || (a.getAttribute('href') === path && path !== '/')) {
            a.classList.add('active-link');
        } else {
            a.classList.remove('active-link');
        }
    });
}

// --- Page Specific Logic ---

/**
 * Logic for the new dedicated Landing Page at root '/'
 */
function initLandingPage() {
    console.log("Landing Page Initialized. Checking user status...");
    
    // If the user has started (i.e., has a name or completed levels), redirect to the dashboard
    if (state.userName || state.completedLevels.length > 0) {
        window.location.href = '/dashboard';
        return;
    }
    
    const startCta = document.getElementById('start-cta');
    if (startCta) {
        startCta.addEventListener('click', () => {
            window.location.href = '/level1';
        });
    } 
}

/**
 * The actual content generation logic for the Dashboard.
 */
function initDashboardPage() {
    // Redirect to Landing Page if user has not started
    if (!state.userName && state.completedLevels.length === 0) {
        window.location.href = '/';
        return;
    }

    // Check if all levels are complete to show the certificate link
    const allCompleted = state.completedLevels.length >= 5;
    
    // Dynamically generate the level cards on the dashboard
    const levelContainer = document.getElementById('level-container');
    if (!levelContainer) return;

    // Update Overall Progress
    const progressPercent = Math.round((state.completedLevels.length / 5) * 100);
    document.getElementById('progress-bar-fill').style.width = `${progressPercent}%`;
    document.getElementById('progress-text').textContent = `${progressPercent}%`;

    const levelData = [
        { num: 1, title: "Stream Discovery", xp: 100, desc: "Discover your ideal academic and career stream." },
        { num: 2, title: "Skill Forge", xp: 150, desc: "Build your skill portfolio with AI recommendations." },
        { num: 3, title: "University Navigator", xp: 200, desc: "Find the perfect institution based on your goals." },
        { num: 4, title: "Resume Optimizer", xp: 250, desc: "Get AI feedback to perfect your professional profile." },
        { num: 5, title: "Career Launchpad", xp: 300, desc: "Master networking and job search strategies." },
    ];
    
    levelContainer.innerHTML = ''; // Clear existing content

    levelData.forEach(level => {
        const isCompleted = state.completedLevels.includes(level.num);
        const isUnlocked = level.num === 1 || state.completedLevels.includes(level.num - 1);
        const statusClass = isCompleted ? 'completed' : (isUnlocked ? 'unlocked' : 'locked');

        const card = document.createElement('div');
        card.className = `level-card card ${statusClass}`; // Added 'card' class
        
        card.innerHTML = `
            <div class="level-header">
                <span class="level-number">${level.num}</span>
                <h3>${level.title}</h3>
                <span class="level-status">
                    <i class="fa-solid ${isCompleted ? 'fa-check-circle' : (isUnlocked ? 'fa-lock-open' : 'fa-lock')}"></i> 
                    ${isCompleted ? 'Completed' : (isUnlocked ? 'Unlocked' : 'Locked')}
                </span>
            </div>
            <p>${level.desc}</p>
            <div class="level-footer">
                <span class="xp-gain">+${level.xp} XP</span>
                <a href="/level${level.num}" class="cta-button ${isUnlocked ? '' : 'disabled'}" onclick="event.preventDefault(); navigateToLevel(${level.num}, '/level${level.num}')">
                    ${isCompleted ? 'Review' : (isUnlocked ? 'Start Level' : 'Locked')}
                </a>
            </div>
        `;
        levelContainer.appendChild(card);
    });

    // Handle Certificate Button visibility
    const certificateLink = document.getElementById('certificate-dashboard-link');
    if (certificateLink) {
        if (allCompleted) {
            certificateLink.classList.remove('hidden');
        } else {
            certificateLink.classList.add('hidden');
        }
    }
}

// --- Level 1 Logic ---
let currentQuestionIndex = 0;
let quizAnswers = [];

function initLevel1Page() {
    if (state.completedLevels.includes(1)) {
        document.getElementById('quiz-main-section').innerHTML = `<h3 style="text-align: center; color: var(--secondary-color);">Level 1 already complete. Your recommended Stream is: <span style="font-weight: 700;">${state.level1Stream.toUpperCase()}</span></h3><a href="/dashboard" class="cta-button" style="margin-top: 2rem;">Back to Dashboard</a>`;
        return;
    }
    
    document.getElementById('quiz-options').addEventListener('click', handleQuizAnswer);
    document.getElementById('complete-level-1').addEventListener('click', () => {
        if (state.level1Stream) {
            completeLevel(1, 100);
        }
    });

    loadQuizQuestion();
}

function loadQuizQuestion() {
    const quizContainer = document.getElementById('quiz-container');
    const quizResult = document.getElementById('quiz-result');
    
    if (currentQuestionIndex >= quizQuestions.length) {
        quizContainer.classList.add('hidden');
        showQuizResult();
        return;
    }
    quizResult.classList.add('hidden');
    quizContainer.classList.remove('hidden');

    const question = quizQuestions[currentQuestionIndex];
    document.getElementById('quiz-question-number').textContent = `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`;
    document.getElementById('quiz-question-text').textContent = question.question;

    const quizOptions = document.getElementById('quiz-options');
    quizOptions.innerHTML = ''; 

    question.options.forEach(option => {
        const button = document.createElement("button");
        button.className = "quiz-option cta-button-secondary";
        button.dataset.value = option.value;
        button.textContent = option.text;
        quizOptions.appendChild(button);
    });
}

function handleQuizAnswer(e) {
    if (e.target.tagName !== 'BUTTON') return;
    quizAnswers.push(e.target.dataset.value);
    
    // Add a slight delay for visual feedback
    e.target.style.backgroundColor = '#d1fae5'; // Highlight selected
    setTimeout(() => {
        e.target.style.backgroundColor = 'var(--card-background)';
        currentQuestionIndex++;
        loadQuizQuestion();
    }, 200);
}

function showQuizResult() {
    const counts = quizAnswers.reduce((acc, value) => {
        acc[value] = (acc[value] || 0) + 1;
        return acc;
    }, {});

    const result = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, "balanced");
    state.level1Stream = result; 
    saveState();

    let streamName = "a Balanced Mix";
    if (result === "tech") streamName = "Technology & Engineering";
    if (result === "creative") streamName = "Creative Arts & Design";
    if (result === "business") streamName = "Business & Commerce";

    document.getElementById('quiz-result-text').textContent = streamName;
    document.getElementById('quiz-result').classList.remove('hidden');
    document.getElementById('complete-level-1').disabled = false;
}


// --- Level 2 Logic ---
function initLevel2Page() {
    if (state.completedLevels.includes(2)) return;
    // Check dependency
    if (!state.completedLevels.includes(1)) {
        console.error("Please complete Level 1 first.");
        alert("Please complete Level 1 first.");
        window.location.href = '/level1';
        return;
    }
    
    const findSkillsBtn = document.getElementById("find-skills-btn");
    const addSkillBtn = document.getElementById("add-skill-btn");
    const skillInput = document.getElementById("skill-input");

    findSkillsBtn.addEventListener("click", handleSkillSuggestions);
    addSkillBtn.addEventListener("click", () => {
        addSkillToPortfolio(skillInput.value.trim());
        skillInput.value = "";
    });
    skillInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Prevent form submission
            addSkillBtn.click();
        }
    });
    
    document.getElementById("complete-level-2").addEventListener("click", () => {
        completeLevel(2, 150);
    });

    renderSkillPortfolio();
    checkLevel2Completion();
}

async function handleSkillSuggestions() {
    const findSkillsBtn = document.getElementById("find-skills-btn");
    const recommendedSkillsList = document.getElementById("recommended-skills-list");
    
    findSkillsBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Finding...`;
    findSkillsBtn.disabled = true;

    try {
        const response = await fetch('http://127.0.0.1:5001/api/skill-suggestions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stream: state.level1Stream }),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
            recommendedSkillsList.innerHTML = "<li>Recommended Skills for Your Stream:</li>";
            data.skills.forEach(skill => {
                const li = document.createElement("li");
                li.className = "recommended";
                li.innerHTML = `<span>${skill}</span> <button class="cta-button-secondary cta-xs" onclick="addSkillToPortfolio('${skill}')">+</button>`;
                recommendedSkillsList.appendChild(li);
            });
        }
    } catch (error) {
        console.error("Error getting skill suggestions:", error);
        recommendedSkillsList.innerHTML = `<li class="error-skill" style="color:var(--error-color)">Could not load skills. Backend may be offline (port 5001).</li>`;
    } finally {
        findSkillsBtn.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> Find Recommended Skills`;
        findSkillsBtn.disabled = false;
    }
}

function addSkillToPortfolio(skillName) {
    skillName = skillName.trim();
    if (!skillName || state.level2Skills.includes(skillName.toLowerCase())) {
        return;
    }

    state.level2Skills.push(skillName.toLowerCase());
    saveState();
    renderSkillPortfolio();
    checkLevel2Completion();
}

function removeSkillFromPortfolio(skillName) {
    state.level2Skills = state.level2Skills.filter(s => s !== skillName.toLowerCase());
    saveState();
    renderSkillPortfolio();
    checkLevel2Completion();
}

function renderSkillPortfolio() {
    const skillPortfolioList = document.getElementById("skill-portfolio-list");
    skillPortfolioList.innerHTML = '';
    
    if (state.level2Skills.length === 0) {
        skillPortfolioList.innerHTML = '<p style="color: var(--text-color-light); font-style: italic;">Add at least 3 skills to complete this level.</p>';
        return;
    }
    
    state.level2Skills.forEach(skill => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${skill}</span>
            <button class="remove-skill" data-skill="${skill}">&times;</button>
        `;
        li.querySelector(".remove-skill").addEventListener("click", () => removeSkillFromPortfolio(skill));
        skillPortfolioList.appendChild(li);
    });
}

function checkLevel2Completion() {
    document.getElementById("skill-count").textContent = state.level2Skills.length;
    document.getElementById("complete-level-2").disabled = state.level2Skills.length < 3;
}

// --- Level 3 Logic ---
function initLevel3Page() {
    if (state.completedLevels.includes(3)) return;
    // Check dependency
    if (!state.completedLevels.includes(2)) {
        console.error("Please complete Level 2 first.");
        alert("Please complete Level 2 first.");
        window.location.href = '/level2';
        return;
    }
    
    // Set default major filter based on Level 1 result
    if (state.level1Stream) {
        document.getElementById("filter-major").value = state.level1Stream;
    }
    
    document.getElementById("find-universities-btn").addEventListener("click", handleUniversitySearch);
    document.getElementById("complete-level-3").addEventListener("click", () => {
        completeLevel(3, 200);
    });

    // Run initial search on load
    handleUniversitySearch();
}

function handleUniversitySearch() {
    const location = document.getElementById("filter-location").value;
    const major = document.getElementById("filter-major").value;
    const universityResults = document.getElementById("university-results");
    
    const universities = [
        { name: "Tech University", loc: "USA", maj: "tech", rank: "Top 10", desc: "Top-tier engineering and computer science programs." },
        { name: "Creative Institute", loc: "UK", maj: "creative", rank: "Top 10", desc: "World-renowned for design and fine arts." },
        { name: "Global Business School", loc: "USA", maj: "business", rank: "Top 10", desc: "A leader in finance, marketing, and management." },
        { name: "Northern Tech", loc: "Canada", maj: "tech", rank: "Top 50", desc: "Cutting-edge research in AI and software." },
        { name: "London School of Art", loc: "UK", maj: "creative", rank: "Top 50", desc: "A vibrant community for aspiring artists." },
        { name: "Canadian Mgmt. Institute", loc: "Canada", maj: "business", rank: "Top 50", desc: "Focus on international business and entrepreneurship." },
        { name: "State Tech College", loc: "USA", maj: "tech", rank: "All", desc: "Affordable and highly rated for regional tech talent." },
        { name: "Euro Design Academy", loc: "UK", maj: "creative", rank: "All", desc: "Specializing in graphic design and animation." }
    ];

    const filteredUniversities = universities.filter(uni => {
        const locationMatch = !location || uni.loc === location;
        const majorMatch = !major || uni.maj === major;
        return locationMatch && majorMatch;
    });

    universityResults.innerHTML = "";
    if (filteredUniversities.length === 0) {
        universityResults.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: var(--warning-color); font-weight: 500;">
            <i class="fa-solid fa-search"></i> No universities found matching your criteria. Try different filters!
        </p>`;
    } else {
        filteredUniversities.forEach(uni => {
            const card = document.createElement("div");
            card.className = "university-card card";
            card.innerHTML = `
                <h5>${uni.name}</h5>
                <p class="location"><i class="fa-solid fa-map-marker-alt"></i> ${uni.loc} | <i class="fa-solid fa-medal"></i> ${uni.rank}</p>
                <p style="font-weight: 600; color: var(--secondary-color);">${uni.maj.charAt(0).toUpperCase() + uni.maj.slice(1)} Focus</p>
                <p>${uni.desc}</p>
            `;
            universityResults.appendChild(card);
        });
    }
    
    document.getElementById("complete-level-3").disabled = filteredUniversities.length === 0;
}


// --- Level 4 Logic ---
function initLevel4Page() {
    if (state.completedLevels.includes(4)) return;
    // Check dependency
    if (!state.completedLevels.includes(3)) {
        console.error("Please complete Level 3 first.");
        alert("Please complete Level 3 first.");
        window.location.href = '/level3';
        return;
    }
    
    document.getElementById("resume-form").addEventListener("submit", handleResumeFeedback);
    document.getElementById("complete-level-4").addEventListener("click", () => {
        completeLevel(4, 250);
    });
    document.getElementById("resume-form").addEventListener("input", () => {
        // Disable completion button if textareas are empty
        const summary = document.getElementById("resume-summary").value.trim();
        const skills = document.getElementById("resume-skills").value.trim();
        document.getElementById("get-feedback-btn").disabled = summary.length < 50 || skills.length < 10;
    });
}

async function handleResumeFeedback(e) {
    e.preventDefault();
    const feedbackLoading = document.getElementById("feedback-loading");
    const feedbackList = document.getElementById("feedback-list");
    const getFeedbackBtn = document.getElementById("get-feedback-btn");
    
    feedbackLoading.classList.remove("hidden");
    feedbackList.innerHTML = ""; 
    getFeedbackBtn.disabled = true;

    const summary = document.getElementById("resume-summary").value;
    const skillsInput = document.getElementById("resume-skills").value;
    const skills = skillsInput.split(',').map(skill => skill.trim()).filter(Boolean);

    try {
        const response = await fetch('http://127.0.0.1:5001/api/resume-feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ summary, skills }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success && data.feedback) {
            displayFeedback(data.feedback);
        } else {
            throw new Error(data.error || 'Failed to get feedback.');
        }

    } catch (error) {
        console.error("Error getting feedback:", error);
        feedbackList.innerHTML = `<li class="suggestion error-skill">
            <i class="fa-solid fa-exclamation-triangle"></i>
            Could not connect to the feedback service. Please make sure the backend is running (port 5001).
        </li>`;
        feedbackLoading.classList.add("hidden");
        getFeedbackBtn.disabled = false;
    } 
}

function displayFeedback(feedbackItems) {
    const feedbackList = document.getElementById("feedback-list");
    const completeLevel4Btn = document.getElementById("complete-level-4");
    const feedbackLoading = document.getElementById("feedback-loading");
    const getFeedbackBtn = document.getElementById("get-feedback-btn");

    feedbackLoading.classList.add("hidden");
    getFeedbackBtn.disabled = false;
    
    if (feedbackItems.length === 0) {
        feedbackList.innerHTML = `<li class="positive"><i class="fa-solid fa-check-circle"></i> No major suggestions! Your resume base looks solid.</li>`;
        completeLevel4Btn.disabled = false;
        return;
    }

    feedbackItems.forEach(item => {
        let icon = "fa-solid fa-lightbulb"; 
        if (item.type === "positive") icon = "fa-solid fa-check-circle";
        if (item.type === "suggestion") icon = "fa-solid fa-exclamation-circle";
        if (item.type === "tip") icon = "fa-solid fa-wand-magic-sparkles";

        const li = document.createElement("li");
        li.className = item.type;
        li.innerHTML = `
            <i class="${icon}"></i>
            <span>${item.message}</span>
        `;
        feedbackList.appendChild(li);
    });

    completeLevel4Btn.disabled = false; 
}


// --- Level 5 Logic ---
function initLevel5Page() {
    if (state.completedLevels.includes(5)) return;
    // Check dependency
    if (!state.completedLevels.includes(4)) {
        console.error("Please complete Level 4 first.");
        alert("Please complete Level 4 first.");
        window.location.href = '/level4';
        return;
    }
    
    const taskList = document.getElementById("task-list");
    taskList.addEventListener("change", handleTaskCheck);
    
    document.getElementById("complete-level-5").addEventListener("click", () => {
        completeLevel(5, 300);
        // After completing Level 5, prompt user to go to profile to ensure info is set for certificate
        setTimeout(() => {
            alert("Congratulations! All levels complete. Please check your Profile to ensure your name and email are correct for your certificate.");
            window.location.href = '/profile';
        }, 500);
    });
    
    // Load and render tasks from state
    document.querySelectorAll('.task-item input[type="checkbox"]').forEach(checkbox => {
        const taskId = checkbox.dataset.task;
        checkbox.checked = state.level5Tasks[taskId] || false;
        
        const label = checkbox.nextElementSibling;
        if (checkbox.checked) {
            label.classList.add("completed");
        } else {
            label.classList.remove("completed");
        }
    });
    
    checkLevel5Completion();
}

function handleTaskCheck(e) {
    const checkbox = e.target;
    if (checkbox.type !== 'checkbox') return;
    
    const taskId = checkbox.dataset.task;
    const label = checkbox.nextElementSibling;
    
    state.level5Tasks[taskId] = checkbox.checked;
    saveState();
    
    if (checkbox.checked) {
        label.classList.add("completed");
    } else {
        label.classList.remove("completed");
    }

    checkLevel5Completion();
}

function checkLevel5Completion() {
    const allComplete = Object.values(state.level5Tasks).every(task => task === true);
    document.getElementById("complete-level-5").disabled = !allComplete;
}


// --- Profile Logic ---
function initProfilePage() {
    const nameInput = document.getElementById('profile-name');
    const emailInput = document.getElementById('profile-email');
    const saveBtn = document.getElementById('save-profile-btn');
    const statusMessage = document.getElementById('profile-status');
    const xpHistory = document.getElementById('xp-history');
    const certificateBtn = document.getElementById('certificate-btn');
    const avatar = document.getElementById('profile-avatar');

    // Load existing profile data
    nameInput.value = state.userName;
    emailInput.value = state.userEmail;
    
    // Update avatar with first letter of name or a default
    const initial = (state.userName.trim().charAt(0) || 'U').toUpperCase();
    avatar.textContent = initial;

    // XP Summary
    xpHistory.innerHTML = `
        <li>Total XP Earned: <strong>${state.totalXp} XP</strong></li>
        <li>Levels Completed: <strong>${state.completedLevels.length} / 5</strong></li>
        <li>Recommended Stream: <strong>${state.level1Stream ? state.level1Stream.toUpperCase() : 'N/A'}</strong></li>
    `;

    // Certificate button visibility
    if (state.completedLevels.length >= 5) {
        certificateBtn.classList.remove('hidden');
    } else {
        certificateBtn.classList.add('hidden');
    }

    // Save handler
    saveBtn.addEventListener('click', () => {
        state.userName = nameInput.value.trim();
        state.userEmail = emailInput.value.trim();
        saveState();
        
        // Update avatar immediately
        avatar.textContent = (state.userName.trim().charAt(0) || 'U').toUpperCase();
        
        statusMessage.textContent = 'Profile saved successfully!';
        statusMessage.classList.remove('hidden');
        setTimeout(() => statusMessage.classList.add('hidden'), 3000);
        
        // Re-check certificate button visibility in case they just entered their name
        if (state.completedLevels.length >= 5) {
            certificateBtn.classList.remove('hidden');
        }
    });
    
    certificateBtn.addEventListener('click', () => {
        if (!state.userName || !state.userEmail) {
            alert("Please enter your Name and Email before viewing the certificate.");
            return;
        }
        window.location.href = '/certificate';
    });
}

// --- Certificate Logic ---
function initCertificatePage() {
    if (!state.completedLevels.includes(5) || !state.userName) {
        document.getElementById('certificate-page-content').innerHTML = '<div style="text-align: center; margin-top: 5rem;" class="card"><h3><i class="fa-solid fa-lock" style="color:var(--error-color)"></i> Certificate Locked</h3><p>You must complete all 5 levels and fill out your profile details to unlock your certificate.</p><a href="/dashboard" class="cta-button" style="margin-top: 1rem;">Go to Dashboard</a></div>';
        return;
    }
    
    document.getElementById('cert-user-name').textContent = state.userName.toUpperCase();
    document.getElementById('cert-total-xp').textContent = state.totalXp;
    
    // Generate a unique ID (simple hash)
    const certId = (Math.random().toString(36).substring(2, 9) + Date.now().toString(36).substring(2, 4)).toUpperCase();
    document.getElementById('cert-id').textContent = certId;
    
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('cert-date').textContent = date;
    
    document.getElementById('download-cert-btn').addEventListener('click', () => {
        window.print(); // Triggers the browser's print-to-PDF dialog
    });
}


// --- Initialization Logic ---
document.addEventListener("DOMContentLoaded", () => {
    loadState();
    setupGlobalUI();

    const path = window.location.pathname;

    if (path === '/home') {
        initLandingPage(); 
    } else if (path === '/dashboard') { 
        initDashboardPage();
    } else if (path === '/level1') {
        initLevel1Page();
    } else if (path === '/level2') {
        initLevel2Page();
    } else if (path === '/level3') {
        initLevel3Page();
    } else if (path === '/level4') {
        initLevel4Page();
    } else if (path === '/level5') {
        initLevel5Page();
    } else if (path === '/profile') {
        initProfilePage();
    } else if (path === '/certificate') {
        initCertificatePage();
    }
});
