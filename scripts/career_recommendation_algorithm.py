"""
PathFinder AI - Career Recommendation Algorithm
=================================================
This is the core ML/AI recommendation engine that powers the PathFinder AI platform.
It uses a weighted scoring system with cosine similarity and a collaborative-filtering
inspired approach to match users' behavioral traits and skill levels to ideal career paths.

Usage:
    python career_recommendation_algorithm.py

The algorithm performs the following steps:
1. Collects behavioral assessment responses (work environment, interests, learning style)
2. Collects skills proficiency data (Python, JavaScript, databases, etc.)
3. Builds a user profile vector from both behavioral and skill dimensions
4. Computes cosine similarity between the user vector and each career's ideal vector
5. Produces a ranked list of career recommendations with match percentages
6. Generates a personalized learning roadmap with daily schedules
"""

import math
from collections import defaultdict

# =============================================================================
# DATA DEFINITIONS
# =============================================================================

# Career paths with their ideal profile vectors
# Each career has weights for behavioral traits and required skill levels
CAREER_PROFILES = {
    "Software Developer": {
        "behavioral": {
            "work_environment": {"remote": 3, "office": 2, "hybrid": 2, "startup": 2},
            "activity_preference": {"logic": 3, "design": 1, "data": 1, "systems": 2},
            "learning_style": {"theory": 2, "projects": 3, "structured": 2, "explore": 2},
            "programming_interest": {"web": 2, "ml": 1, "backend": 3, "security": 1},
            "math_comfort": {"love": 1, "comfortable": 2, "minimal": 1, "applied": 2},
            "communication": {"leader": 1, "writer": 2, "visual": 1, "technical": 3},
            "creativity": {"very": 1, "somewhat": 2, "structured": 2, "innovate": 2},
        },
        "skills": {
            "python": 3, "javascript": 3, "databases": 3,
            "html_css": 2, "cloud": 2, "data_tools": 1,
            "git": 3, "devops_tools": 2,
        },
        "required_skills": ["Python", "JavaScript", "Git", "Databases", "Data Structures & Algorithms", "System Design"],
    },
    "Frontend Developer": {
        "behavioral": {
            "work_environment": {"remote": 2, "office": 2, "hybrid": 3, "startup": 2},
            "activity_preference": {"logic": 1, "design": 3, "data": 0, "systems": 1},
            "learning_style": {"theory": 1, "projects": 3, "structured": 1, "explore": 3},
            "programming_interest": {"web": 3, "ml": 0, "backend": 1, "security": 0},
            "math_comfort": {"love": 0, "comfortable": 1, "minimal": 3, "applied": 1},
            "communication": {"leader": 1, "writer": 1, "visual": 3, "technical": 2},
            "creativity": {"very": 3, "somewhat": 2, "structured": 0, "innovate": 2},
        },
        "skills": {
            "python": 1, "javascript": 4, "databases": 1,
            "html_css": 4, "cloud": 1, "data_tools": 0,
            "git": 3, "devops_tools": 1,
        },
        "required_skills": ["HTML/CSS", "JavaScript", "React/Next.js", "Git", "UI/UX Principles", "Testing"],
    },
    "Full Stack Developer": {
        "behavioral": {
            "work_environment": {"remote": 3, "office": 2, "hybrid": 3, "startup": 3},
            "activity_preference": {"logic": 2, "design": 2, "data": 1, "systems": 3},
            "learning_style": {"theory": 1, "projects": 3, "structured": 1, "explore": 2},
            "programming_interest": {"web": 3, "ml": 0, "backend": 2, "security": 0},
            "math_comfort": {"love": 0, "comfortable": 2, "minimal": 2, "applied": 2},
            "communication": {"leader": 2, "writer": 1, "visual": 2, "technical": 2},
            "creativity": {"very": 2, "somewhat": 3, "structured": 1, "innovate": 2},
        },
        "skills": {
            "python": 3, "javascript": 4, "databases": 3,
            "html_css": 3, "cloud": 2, "data_tools": 1,
            "git": 3, "devops_tools": 2,
        },
        "required_skills": ["JavaScript", "Python/Node.js", "Databases", "HTML/CSS", "Git", "Cloud Basics", "APIs"],
    },
    "Data Scientist": {
        "behavioral": {
            "work_environment": {"remote": 3, "office": 1, "hybrid": 2, "startup": 1},
            "activity_preference": {"logic": 3, "design": 0, "data": 3, "systems": 1},
            "learning_style": {"theory": 3, "projects": 2, "structured": 2, "explore": 2},
            "programming_interest": {"web": 0, "ml": 3, "backend": 1, "security": 0},
            "math_comfort": {"love": 3, "comfortable": 2, "minimal": 0, "applied": 2},
            "communication": {"leader": 1, "writer": 2, "visual": 1, "technical": 2},
            "creativity": {"very": 1, "somewhat": 2, "structured": 2, "innovate": 3},
        },
        "skills": {
            "python": 4, "javascript": 1, "databases": 3,
            "html_css": 0, "cloud": 1, "data_tools": 4,
            "git": 2, "devops_tools": 1,
        },
        "required_skills": ["Python", "Statistics", "Machine Learning", "SQL", "Data Visualization", "Pandas/NumPy"],
    },
    "AI/ML Engineer": {
        "behavioral": {
            "work_environment": {"remote": 3, "office": 1, "hybrid": 2, "startup": 1},
            "activity_preference": {"logic": 3, "design": 0, "data": 3, "systems": 2},
            "learning_style": {"theory": 3, "projects": 2, "structured": 2, "explore": 2},
            "programming_interest": {"web": 0, "ml": 3, "backend": 2, "security": 0},
            "math_comfort": {"love": 3, "comfortable": 2, "minimal": 0, "applied": 2},
            "communication": {"leader": 1, "writer": 2, "visual": 0, "technical": 3},
            "creativity": {"very": 0, "somewhat": 2, "structured": 2, "innovate": 3},
        },
        "skills": {
            "python": 4, "javascript": 1, "databases": 2,
            "html_css": 0, "cloud": 2, "data_tools": 4,
            "git": 2, "devops_tools": 2,
        },
        "required_skills": ["Python", "Machine Learning", "Deep Learning", "Mathematics", "TensorFlow/PyTorch", "Data Engineering"],
    },
    "DevOps Engineer": {
        "behavioral": {
            "work_environment": {"remote": 3, "office": 1, "hybrid": 2, "startup": 2},
            "activity_preference": {"logic": 2, "design": 0, "data": 0, "systems": 3},
            "learning_style": {"theory": 1, "projects": 2, "structured": 3, "explore": 1},
            "programming_interest": {"web": 0, "ml": 0, "backend": 3, "security": 2},
            "math_comfort": {"love": 0, "comfortable": 2, "minimal": 1, "applied": 2},
            "communication": {"leader": 1, "writer": 1, "visual": 0, "technical": 3},
            "creativity": {"very": 0, "somewhat": 1, "structured": 3, "innovate": 2},
        },
        "skills": {
            "python": 2, "javascript": 1, "databases": 2,
            "html_css": 0, "cloud": 4, "data_tools": 0,
            "git": 4, "devops_tools": 4,
        },
        "required_skills": ["Linux", "Docker", "Kubernetes", "CI/CD", "Cloud (AWS/GCP)", "Scripting", "Monitoring"],
    },
    "Cloud Engineer": {
        "behavioral": {
            "work_environment": {"remote": 3, "office": 1, "hybrid": 2, "startup": 1},
            "activity_preference": {"logic": 2, "design": 0, "data": 1, "systems": 3},
            "learning_style": {"theory": 2, "projects": 1, "structured": 3, "explore": 1},
            "programming_interest": {"web": 0, "ml": 0, "backend": 3, "security": 2},
            "math_comfort": {"love": 0, "comfortable": 1, "minimal": 1, "applied": 2},
            "communication": {"leader": 1, "writer": 1, "visual": 0, "technical": 3},
            "creativity": {"very": 0, "somewhat": 1, "structured": 3, "innovate": 1},
        },
        "skills": {
            "python": 2, "javascript": 1, "databases": 2,
            "html_css": 0, "cloud": 4, "data_tools": 0,
            "git": 3, "devops_tools": 3,
        },
        "required_skills": ["Cloud Platforms (AWS/GCP/Azure)", "Networking", "Security", "Terraform/IaC", "Linux", "Scripting"],
    },
    "Cybersecurity Analyst": {
        "behavioral": {
            "work_environment": {"remote": 2, "office": 2, "hybrid": 2, "startup": 1},
            "activity_preference": {"logic": 2, "design": 0, "data": 1, "systems": 2},
            "learning_style": {"theory": 2, "projects": 1, "structured": 3, "explore": 1},
            "programming_interest": {"web": 0, "ml": 0, "backend": 1, "security": 3},
            "math_comfort": {"love": 1, "comfortable": 2, "minimal": 1, "applied": 1},
            "communication": {"leader": 1, "writer": 2, "visual": 0, "technical": 2},
            "creativity": {"very": 0, "somewhat": 1, "structured": 2, "innovate": 1},
        },
        "skills": {
            "python": 3, "javascript": 1, "databases": 2,
            "html_css": 0, "cloud": 2, "data_tools": 0,
            "git": 2, "devops_tools": 2,
        },
        "required_skills": ["Networking", "Linux", "Security Tools", "Python", "Cryptography", "Risk Assessment"],
    },
    "Data Engineer": {
        "behavioral": {
            "work_environment": {"remote": 3, "office": 1, "hybrid": 2, "startup": 1},
            "activity_preference": {"logic": 2, "design": 0, "data": 3, "systems": 2},
            "learning_style": {"theory": 2, "projects": 2, "structured": 2, "explore": 1},
            "programming_interest": {"web": 0, "ml": 1, "backend": 2, "security": 0},
            "math_comfort": {"love": 2, "comfortable": 2, "minimal": 0, "applied": 3},
            "communication": {"leader": 1, "writer": 1, "visual": 0, "technical": 3},
            "creativity": {"very": 0, "somewhat": 1, "structured": 3, "innovate": 1},
        },
        "skills": {
            "python": 4, "javascript": 0, "databases": 4,
            "html_css": 0, "cloud": 3, "data_tools": 3,
            "git": 2, "devops_tools": 2,
        },
        "required_skills": ["Python", "SQL", "Spark/Hadoop", "Cloud Services", "ETL Pipelines", "Data Modeling"],
    },
    "UI/UX Designer": {
        "behavioral": {
            "work_environment": {"remote": 2, "office": 3, "hybrid": 2, "startup": 2},
            "activity_preference": {"logic": 0, "design": 3, "data": 1, "systems": 0},
            "learning_style": {"theory": 1, "projects": 2, "structured": 1, "explore": 3},
            "programming_interest": {"web": 2, "ml": 0, "backend": 0, "security": 0},
            "math_comfort": {"love": 0, "comfortable": 1, "minimal": 3, "applied": 0},
            "communication": {"leader": 2, "writer": 1, "visual": 3, "technical": 1},
            "creativity": {"very": 3, "somewhat": 2, "structured": 0, "innovate": 2},
        },
        "skills": {
            "python": 0, "javascript": 1, "databases": 0,
            "html_css": 3, "cloud": 0, "data_tools": 0,
            "git": 1, "devops_tools": 0,
        },
        "required_skills": ["Figma/Sketch", "User Research", "Prototyping", "HTML/CSS Basics", "Design Thinking", "Accessibility"],
    },
    "Product Manager (Tech)": {
        "behavioral": {
            "work_environment": {"remote": 1, "office": 3, "hybrid": 2, "startup": 2},
            "activity_preference": {"logic": 1, "design": 1, "data": 2, "systems": 1},
            "learning_style": {"theory": 1, "projects": 2, "structured": 2, "explore": 2},
            "programming_interest": {"web": 1, "ml": 0, "backend": 1, "security": 0},
            "math_comfort": {"love": 0, "comfortable": 2, "minimal": 3, "applied": 1},
            "communication": {"leader": 3, "writer": 2, "visual": 2, "technical": 1},
            "creativity": {"very": 2, "somewhat": 2, "structured": 1, "innovate": 2},
        },
        "skills": {
            "python": 1, "javascript": 1, "databases": 1,
            "html_css": 1, "cloud": 0, "data_tools": 1,
            "git": 1, "devops_tools": 0,
        },
        "required_skills": ["Product Strategy", "Data Analysis", "Communication", "Agile/Scrum", "Technical Literacy", "User Research"],
    },
    "Project Manager (IT)": {
        "behavioral": {
            "work_environment": {"remote": 1, "office": 3, "hybrid": 2, "startup": 1},
            "activity_preference": {"logic": 1, "design": 0, "data": 1, "systems": 1},
            "learning_style": {"theory": 1, "projects": 1, "structured": 3, "explore": 1},
            "programming_interest": {"web": 1, "ml": 0, "backend": 1, "security": 0},
            "math_comfort": {"love": 0, "comfortable": 1, "minimal": 3, "applied": 1},
            "communication": {"leader": 3, "writer": 2, "visual": 1, "technical": 1},
            "creativity": {"very": 1, "somewhat": 2, "structured": 3, "innovate": 1},
        },
        "skills": {
            "python": 0, "javascript": 0, "databases": 1,
            "html_css": 0, "cloud": 0, "data_tools": 0,
            "git": 1, "devops_tools": 0,
        },
        "required_skills": ["Agile/Scrum", "Communication", "Risk Management", "Jira/Tools", "Budgeting", "Technical Basics"],
    },
}


# Behavioral questions with option mappings
BEHAVIORAL_QUESTIONS = [
    {
        "id": "work_environment",
        "question": "What type of work environment do you prefer?",
        "options": {
            "a": ("Remote / Independent work", "remote"),
            "b": ("Collaborative office setting", "office"),
            "c": ("Mix of team and solo work", "hybrid"),
            "d": ("Fast-paced startup culture", "startup"),
        },
    },
    {
        "id": "activity_preference",
        "question": "Which activity excites you the most?",
        "options": {
            "a": ("Solving complex puzzles and logical problems", "logic"),
            "b": ("Designing beautiful and intuitive interfaces", "design"),
            "c": ("Analyzing data to find insights", "data"),
            "d": ("Building and deploying systems", "systems"),
        },
    },
    {
        "id": "learning_style",
        "question": "How do you approach learning new technologies?",
        "options": {
            "a": ("I dive deep into documentation and theory", "theory"),
            "b": ("I learn by building projects", "projects"),
            "c": ("I follow structured courses and certifications", "structured"),
            "d": ("I experiment and explore on my own", "explore"),
        },
    },
    {
        "id": "programming_interest",
        "question": "Which programming area interests you the most?",
        "options": {
            "a": ("Web applications and user-facing products", "web"),
            "b": ("Machine learning and artificial intelligence", "ml"),
            "c": ("Backend systems, APIs, and infrastructure", "backend"),
            "d": ("Security, networking, and ethical hacking", "security"),
        },
    },
    {
        "id": "math_comfort",
        "question": "How do you feel about mathematics and statistics?",
        "options": {
            "a": ("I love it and want it in my daily work", "love"),
            "b": ("I'm comfortable with it when needed", "comfortable"),
            "c": ("I prefer minimal math involvement", "minimal"),
            "d": ("I enjoy applied math but not pure theory", "applied"),
        },
    },
    {
        "id": "communication",
        "question": "What best describes your communication style?",
        "options": {
            "a": ("I enjoy presenting ideas and leading discussions", "leader"),
            "b": ("I prefer writing detailed documentation", "writer"),
            "c": ("I communicate best through visual work", "visual"),
            "d": ("I focus on technical precision and code quality", "technical"),
        },
    },
    {
        "id": "creativity",
        "question": "How important is creativity in your ideal career?",
        "options": {
            "a": ("Very important - I want to create visual experiences", "very"),
            "b": ("Somewhat - creative problem solving matters to me", "somewhat"),
            "c": ("I prefer structured, systematic work", "structured"),
            "d": ("I want to innovate with new technologies", "innovate"),
        },
    },
]

# Skills assessment questions
SKILLS_QUESTIONS = [
    {"id": "python", "question": "What is your proficiency level in Python?"},
    {"id": "javascript", "question": "What is your proficiency level in JavaScript/TypeScript?"},
    {"id": "databases", "question": "How experienced are you with databases (SQL/NoSQL)?"},
    {"id": "html_css", "question": "What is your experience with HTML/CSS and UI design?"},
    {"id": "cloud", "question": "How familiar are you with cloud services (AWS/GCP/Azure)?"},
    {"id": "data_tools", "question": "What is your proficiency with Data Science tools (Pandas, NumPy, etc.)?"},
    {"id": "git", "question": "How experienced are you with version control (Git)?"},
    {"id": "devops_tools", "question": "What is your experience with DevOps tools (Docker, Kubernetes, CI/CD)?"},
]

SKILL_LEVELS = {
    "a": ("Currently learning", 1),
    "b": ("Beginner", 2),
    "c": ("Intermediate", 3),
    "d": ("Expert", 4),
}

# Skill learning roadmaps with estimated days
SKILL_ROADMAPS = {
    "Python": {"days": 30, "topics": ["Variables & Data Types", "Control Flow", "Functions", "OOP", "File Handling", "Modules", "Error Handling", "APIs"]},
    "JavaScript": {"days": 35, "topics": ["Variables & Types", "Functions & Scope", "DOM", "Async/Await", "ES6+", "Fetch API", "Modules"]},
    "HTML/CSS": {"days": 15, "topics": ["HTML Semantics", "CSS Selectors", "Flexbox", "Grid", "Responsive Design", "Animations"]},
    "Databases": {"days": 20, "topics": ["SQL Fundamentals", "Table Design", "Joins", "Indexing", "NoSQL Basics", "Query Optimization"]},
    "Machine Learning": {"days": 45, "topics": ["Linear Algebra", "Probability", "Supervised Learning", "Unsupervised Learning", "Neural Networks", "Scikit-learn"]},
    "Git": {"days": 7, "topics": ["Init & Clone", "Add & Commit", "Branching", "Merging", "Remote Repos", "Pull Requests"]},
    "Docker": {"days": 14, "topics": ["Containers", "Dockerfiles", "Images", "Docker Compose", "Networking", "Volumes"]},
    "Cloud Platforms (AWS/GCP/Azure)": {"days": 30, "topics": ["Cloud Concepts", "Compute", "Storage", "Databases", "Networking", "IAM", "Serverless"]},
    "Data Structures & Algorithms": {"days": 40, "topics": ["Arrays", "Linked Lists", "Trees", "Graphs", "Sorting", "Dynamic Programming", "Hash Maps"]},
    "Statistics": {"days": 20, "topics": ["Descriptive Stats", "Probability", "Distributions", "Hypothesis Testing", "Regression"]},
    "System Design": {"days": 25, "topics": ["Scalability", "Load Balancing", "Caching", "Database Sharding", "Microservices", "API Design"]},
    "Networking": {"days": 20, "topics": ["OSI Model", "TCP/IP", "DNS", "HTTP/HTTPS", "Firewalls", "Subnetting"]},
    "Linux": {"days": 14, "topics": ["File System", "Commands", "Permissions", "Shell Scripting", "Package Management"]},
    "Figma/Sketch": {"days": 15, "topics": ["Interface Basics", "Components", "Auto Layout", "Prototyping", "Design Systems"]},
}


# =============================================================================
# CORE ALGORITHM
# =============================================================================

def cosine_similarity(vec_a: list[float], vec_b: list[float]) -> float:
    """
    Compute cosine similarity between two vectors.
    Returns a value between -1 and 1 (1 = identical direction).
    
    Formula: cos(theta) = (A . B) / (||A|| * ||B||)
    """
    dot_product = sum(a * b for a, b in zip(vec_a, vec_b))
    magnitude_a = math.sqrt(sum(a ** 2 for a in vec_a))
    magnitude_b = math.sqrt(sum(b ** 2 for b in vec_b))
    
    if magnitude_a == 0 or magnitude_b == 0:
        return 0.0
    
    return dot_product / (magnitude_a * magnitude_b)


def build_user_behavioral_vector(answers: dict[str, str]) -> list[float]:
    """
    Convert behavioral answers into a numerical feature vector.
    Each answer maps to a value in each behavioral dimension.
    """
    # Build a flat vector from all behavioral dimensions
    vector = []
    for question in BEHAVIORAL_QUESTIONS:
        qid = question["id"]
        user_answer = answers.get(qid, "")
        # For each possible option in this question, encode 1 if selected, 0 otherwise
        for _key, (_label, value) in question["options"].items():
            vector.append(1.0 if value == user_answer else 0.0)
    return vector


def build_career_behavioral_vector(career_profile: dict) -> list[float]:
    """
    Convert a career's ideal behavioral profile into the same vector space
    as the user's behavioral vector, enabling cosine similarity comparison.
    """
    vector = []
    for question in BEHAVIORAL_QUESTIONS:
        qid = question["id"]
        behavioral_weights = career_profile["behavioral"].get(qid, {})
        for _key, (_label, value) in question["options"].items():
            vector.append(float(behavioral_weights.get(value, 0)))
    return vector


def build_skill_vector(skill_levels: dict[str, int]) -> list[float]:
    """
    Convert skill levels into a numerical vector.
    Skills are ordered consistently: python, javascript, databases, 
    html_css, cloud, data_tools, git, devops_tools
    """
    skill_order = ["python", "javascript", "databases", "html_css", "cloud", "data_tools", "git", "devops_tools"]
    return [float(skill_levels.get(s, 0)) for s in skill_order]


def recommend_careers(
    behavioral_answers: dict[str, str],
    skill_levels: dict[str, int],
    behavioral_weight: float = 0.6,
    skill_weight: float = 0.4,
) -> list[tuple[str, float, dict]]:
    """
    Main recommendation algorithm.
    
    Combines behavioral similarity and skill similarity using weighted scoring.
    
    Parameters:
        behavioral_answers: dict mapping question IDs to selected option values
        skill_levels: dict mapping skill IDs to proficiency scores (1-4)
        behavioral_weight: weight for behavioral similarity (default 0.6)
        skill_weight: weight for skill similarity (default 0.4)
    
    Returns:
        List of (career_name, match_percentage, career_data) sorted by match descending
    """
    user_behavioral_vec = build_user_behavioral_vector(behavioral_answers)
    user_skill_vec = build_skill_vector(skill_levels)
    
    results = []
    
    for career_name, career_data in CAREER_PROFILES.items():
        # Behavioral similarity via cosine
        career_behavioral_vec = build_career_behavioral_vector(career_data)
        behavioral_sim = cosine_similarity(user_behavioral_vec, career_behavioral_vec)
        
        # Skill similarity via cosine
        career_skill_vec = build_skill_vector(career_data["skills"])
        skill_sim = cosine_similarity(user_skill_vec, career_skill_vec)
        
        # Weighted combination
        combined_score = (behavioral_weight * behavioral_sim) + (skill_weight * skill_sim)
        
        # Normalize to percentage (cosine sim ranges from -1 to 1, but typically 0 to 1 here)
        match_percentage = max(0, min(100, round(combined_score * 100)))
        
        results.append((career_name, match_percentage, career_data))
    
    # Sort by match percentage descending
    results.sort(key=lambda x: x[1], reverse=True)
    return results


def compute_alignment_scores(
    behavioral_answers: dict[str, str],
    skill_levels: dict[str, int],
    chosen_career: str,
) -> dict[str, float]:
    """
    Compute granular alignment scores between the user's profile and chosen career.
    Returns a breakdown of how well skills, interests, and the career align.
    """
    career_data = CAREER_PROFILES.get(chosen_career)
    if not career_data:
        return {"skills_alignment": 0, "interest_alignment": 0, "overall_alignment": 0}
    
    # Skill alignment: how close user skills are to the career's ideal
    user_skill_vec = build_skill_vector(skill_levels)
    career_skill_vec = build_skill_vector(career_data["skills"])
    skills_alignment = cosine_similarity(user_skill_vec, career_skill_vec) * 100
    
    # Interest alignment: behavioral similarity
    user_beh_vec = build_user_behavioral_vector(behavioral_answers)
    career_beh_vec = build_career_behavioral_vector(career_data)
    interest_alignment = cosine_similarity(user_beh_vec, career_beh_vec) * 100
    
    # Overall
    overall = (skills_alignment * 0.4 + interest_alignment * 0.6)
    
    return {
        "skills_alignment": round(max(0, skills_alignment), 1),
        "interest_alignment": round(max(0, interest_alignment), 1),
        "overall_alignment": round(max(0, overall), 1),
    }


def generate_learning_roadmap(career_name: str, skill_levels: dict[str, int]) -> list[dict]:
    """
    Generate a personalized learning roadmap for a chosen career.
    Prioritizes skills the user is weakest in and includes daily schedules.
    
    Returns a list of skill plans, each with:
        - skill name
        - current level
        - estimated days
        - daily tasks
        - topics to cover
    """
    career_data = CAREER_PROFILES.get(career_name)
    if not career_data:
        return []
    
    # Map user's skill levels to career requirements
    skill_name_map = {
        "python": "Python",
        "javascript": "JavaScript",
        "databases": "Databases",
        "html_css": "HTML/CSS",
        "cloud": "Cloud Platforms (AWS/GCP/Azure)",
        "data_tools": "Data Science Tools",
        "git": "Git",
        "devops_tools": "DevOps Tools",
    }
    
    roadmap = []
    
    for skill in career_data["required_skills"]:
        # Find matching roadmap
        roadmap_data = SKILL_ROADMAPS.get(skill)
        if not roadmap_data:
            roadmap.append({
                "skill": skill,
                "current_level": "Unknown",
                "days": 14,
                "topics": [f"Study {skill} fundamentals", f"Practice {skill}", f"Build projects with {skill}"],
                "daily_tasks": [f"Day {i+1}: Study and practice {skill}" for i in range(14)],
            })
            continue
        
        # Find user's current level for this skill
        current_level = 0
        for skill_id, display_name in skill_name_map.items():
            if display_name.lower() in skill.lower() or skill.lower() in display_name.lower():
                current_level = skill_levels.get(skill_id, 0)
                break
        
        # Adjust days based on current level (experts need less time)
        level_multipliers = {0: 1.0, 1: 1.0, 2: 0.8, 3: 0.5, 4: 0.2}
        adjusted_days = max(3, int(roadmap_data["days"] * level_multipliers.get(current_level, 1.0)))
        
        level_names = {0: "Not started", 1: "Learning", 2: "Beginner", 3: "Intermediate", 4: "Expert"}
        
        # Generate daily tasks from topics
        topics = roadmap_data["topics"]
        daily_tasks = []
        for day in range(1, adjusted_days + 1):
            topic_idx = min(int((day - 1) / max(1, adjusted_days // len(topics))), len(topics) - 1)
            daily_tasks.append(f"Day {day}: {topics[topic_idx]} - Study & Practice")
        
        roadmap.append({
            "skill": skill,
            "current_level": level_names.get(current_level, "Unknown"),
            "days": adjusted_days,
            "topics": topics,
            "daily_tasks": daily_tasks,
        })
    
    # Sort by priority: weakest skills first
    roadmap.sort(key=lambda x: {"Not started": 0, "Learning": 1, "Beginner": 2, "Intermediate": 3, "Expert": 4}.get(x["current_level"], 0))
    
    return roadmap


# =============================================================================
# INTERACTIVE CLI
# =============================================================================

def collect_behavioral_answers() -> dict[str, str]:
    """Collect behavioral assessment answers from the user via CLI."""
    print("\n" + "=" * 60)
    print("  PART 1: BEHAVIORAL ASSESSMENT")
    print("  Understanding your work style and interests")
    print("=" * 60)
    
    answers = {}
    for i, q in enumerate(BEHAVIORAL_QUESTIONS, 1):
        print(f"\nQ{i}. {q['question']}")
        for key, (label, _value) in q["options"].items():
            print(f"   {key}) {label}")
        
        while True:
            choice = input("\n   Your answer (a/b/c/d): ").strip().lower()
            if choice in q["options"]:
                _label, value = q["options"][choice]
                answers[q["id"]] = value
                print(f"   -> Selected: {_label}")
                break
            print("   Invalid input. Please enter a, b, c, or d.")
    
    return answers


def collect_skill_levels() -> dict[str, int]:
    """Collect skill proficiency levels from the user via CLI."""
    print("\n" + "=" * 60)
    print("  PART 2: SKILLS ASSESSMENT")
    print("  Evaluating your technical proficiency")
    print("=" * 60)
    
    print("\n  Proficiency Levels:")
    for key, (label, score) in SKILL_LEVELS.items():
        print(f"   {key}) {label} (Score: {score}/4)")
    
    levels = {}
    for i, q in enumerate(SKILLS_QUESTIONS, 1):
        print(f"\nQ{i}. {q['question']}")
        
        while True:
            choice = input("   Your level (a/b/c/d): ").strip().lower()
            if choice in SKILL_LEVELS:
                _label, score = SKILL_LEVELS[choice]
                levels[q["id"]] = score
                print(f"   -> {_label} ({score}/4)")
                break
            print("   Invalid input. Please enter a, b, c, or d.")
    
    return levels


def display_results(
    recommendations: list[tuple[str, float, dict]],
    alignment: dict[str, float],
    behavioral_answers: dict[str, str],
    skill_levels: dict[str, int],
):
    """Display recommendation results with charts (text-based)."""
    print("\n" + "=" * 60)
    print("  YOUR CAREER ASSESSMENT RESULTS")
    print("=" * 60)
    
    # Alignment scores
    print(f"\n  Skills-Interest-Career Alignment:")
    print(f"  {'Skills Alignment:':<25} {alignment['skills_alignment']:.1f}%  {'*' * int(alignment['skills_alignment'] / 5)}")
    print(f"  {'Interest Alignment:':<25} {alignment['interest_alignment']:.1f}%  {'*' * int(alignment['interest_alignment'] / 5)}")
    print(f"  {'Overall Alignment:':<25} {alignment['overall_alignment']:.1f}%  {'*' * int(alignment['overall_alignment'] / 5)}")
    
    # Skills radar (text-based)
    print(f"\n  Your Skills Profile:")
    skill_names = {"python": "Python", "javascript": "JavaScript", "databases": "Databases",
                   "html_css": "HTML/CSS", "cloud": "Cloud", "data_tools": "Data Tools",
                   "git": "Git", "devops_tools": "DevOps"}
    for skill_id, display_name in skill_names.items():
        level = skill_levels.get(skill_id, 0)
        bar = "#" * (level * 5)
        level_text = ["N/A", "Learning", "Beginner", "Intermediate", "Expert"][level]
        print(f"    {display_name:<15} [{bar:<20}] {level_text}")
    
    # Career recommendations
    print(f"\n  Top Career Recommendations:")
    print(f"  {'Rank':<6} {'Career':<30} {'Match':>8}")
    print(f"  {'-' * 46}")
    for i, (name, match, _data) in enumerate(recommendations[:6], 1):
        bar = "#" * int(match / 5)
        print(f"  #{i:<5} {name:<30} {match:>5}%  {bar}")
    
    return recommendations


def display_roadmap(roadmap: list[dict], career_name: str):
    """Display the learning roadmap for a chosen career."""
    total_days = sum(r["days"] for r in roadmap)
    
    print(f"\n  {'=' * 60}")
    print(f"  LEARNING ROADMAP: {career_name.upper()}")
    print(f"  Total estimated duration: {total_days} days")
    print(f"  {'=' * 60}")
    
    for i, skill_plan in enumerate(roadmap, 1):
        print(f"\n  [{i}] {skill_plan['skill']}")
        print(f"      Current Level: {skill_plan['current_level']}")
        print(f"      Duration: {skill_plan['days']} days")
        print(f"      Topics: {', '.join(skill_plan['topics'][:5])}")
        print(f"      Sample Daily Tasks:")
        for task in skill_plan["daily_tasks"][:3]:
            print(f"        [ ] {task}")
        if len(skill_plan["daily_tasks"]) > 3:
            print(f"        ... and {len(skill_plan['daily_tasks']) - 3} more days")


def main():
    """Main entry point for the career recommendation system."""
    print("\n" + "#" * 60)
    print("#" + " " * 58 + "#")
    print("#    PATHFINDER AI - Career Recommendation System" + " " * 9 + "#")
    print("#    AI-Powered Career Guidance for Students" + " " * 14 + "#")
    print("#" + " " * 58 + "#")
    print("#" * 60)
    
    # Step 1: Collect behavioral data
    behavioral_answers = collect_behavioral_answers()
    
    # Step 2: Collect skill levels
    skill_levels = collect_skill_levels()
    
    # Step 3: Run recommendation algorithm
    print("\n  Processing your responses with our AI algorithm...")
    recommendations = recommend_careers(behavioral_answers, skill_levels)
    
    # Step 4: Compute alignment for top career
    top_career = recommendations[0][0]
    alignment = compute_alignment_scores(behavioral_answers, skill_levels, top_career)
    
    # Step 5: Display results
    display_results(recommendations, alignment, behavioral_answers, skill_levels)
    
    # Step 6: Let user choose a career
    print(f"\n  Select a career to view its learning roadmap:")
    for i, (name, match, _data) in enumerate(recommendations[:6], 1):
        print(f"    {i}) {name} ({match}% match)")
    
    while True:
        try:
            choice = int(input("\n  Enter your choice (1-6): ").strip())
            if 1 <= choice <= min(6, len(recommendations)):
                break
            print("  Please enter a valid number.")
        except ValueError:
            print("  Please enter a valid number.")
    
    chosen_career = recommendations[choice - 1][0]
    
    # Step 7: Generate and display roadmap
    roadmap = generate_learning_roadmap(chosen_career, skill_levels)
    display_roadmap(roadmap, chosen_career)
    
    # Step 8: Summary
    total_days = sum(r["days"] for r in roadmap)
    print(f"\n  {'=' * 60}")
    print(f"  SUMMARY")
    print(f"  {'=' * 60}")
    print(f"  Chosen Career: {chosen_career}")
    print(f"  Match Score: {recommendations[choice - 1][1]}%")
    print(f"  Skills to Learn: {len(roadmap)}")
    print(f"  Estimated Duration: {total_days} days (~{total_days // 30} months)")
    print(f"\n  Good luck on your career journey! You've got this!")
    print(f"  {'=' * 60}\n")


if __name__ == "__main__":
    main()
