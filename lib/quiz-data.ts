export interface QuizQuestion {
  id: string
  question: string
  category: "behavioral" | "skills"
  options: { label: string; value: string; weight: Record<string, number> }[]
}

export interface CareerPath {
  id: string
  title: string
  description: string
  requiredSkills: string[]
  matchPercentage?: number
}

export interface SkillLevel {
  skill: string
  level: "learning" | "beginner" | "intermediate" | "expert"
  score: number
}

export const behavioralQuestions: QuizQuestion[] = [
  {
    id: "b1",
    question: "What type of work environment do you prefer?",
    category: "behavioral",
    options: [
      { label: "Remote / Independent work", value: "remote", weight: { "software_dev": 3, "data_science": 3, "cybersecurity": 2, "cloud_engineering": 3, "devops": 3, "ai_ml": 3 } },
      { label: "Collaborative office setting", value: "office", weight: { "product_management": 3, "ui_ux": 3, "project_management": 3, "software_dev": 2, "devops": 1 } },
      { label: "Mix of team and solo work", value: "hybrid", weight: { "software_dev": 2, "data_science": 2, "full_stack": 3, "ui_ux": 2, "ai_ml": 2 } },
      { label: "Fast-paced startup culture", value: "startup", weight: { "full_stack": 3, "product_management": 2, "devops": 2, "software_dev": 2, "cloud_engineering": 1 } },
    ],
  },
  {
    id: "b2",
    question: "Which activity excites you the most?",
    category: "behavioral",
    options: [
      { label: "Solving complex puzzles and logical problems", value: "logic", weight: { "software_dev": 3, "data_science": 3, "ai_ml": 3, "cybersecurity": 2 } },
      { label: "Designing beautiful and intuitive interfaces", value: "design", weight: { "ui_ux": 3, "frontend_dev": 3, "product_management": 1 } },
      { label: "Analyzing data to find insights", value: "data", weight: { "data_science": 3, "ai_ml": 3, "data_engineering": 3, "cybersecurity": 1 } },
      { label: "Building and deploying systems", value: "systems", weight: { "devops": 3, "cloud_engineering": 3, "full_stack": 2, "software_dev": 2 } },
    ],
  },
  {
    id: "b3",
    question: "How do you approach learning new technologies?",
    category: "behavioral",
    options: [
      { label: "I dive deep into documentation and theory", value: "theory", weight: { "ai_ml": 3, "data_science": 3, "cybersecurity": 2, "software_dev": 2 } },
      { label: "I learn by building projects", value: "projects", weight: { "full_stack": 3, "software_dev": 3, "frontend_dev": 2, "devops": 2 } },
      { label: "I follow structured courses and certifications", value: "structured", weight: { "cloud_engineering": 3, "cybersecurity": 3, "project_management": 2, "data_engineering": 2 } },
      { label: "I experiment and explore on my own", value: "explore", weight: { "ai_ml": 2, "data_science": 2, "ui_ux": 3, "full_stack": 2 } },
    ],
  },
  {
    id: "b4",
    question: "Which programming area interests you the most?",
    category: "behavioral",
    options: [
      { label: "Web applications and user-facing products", value: "web", weight: { "frontend_dev": 3, "full_stack": 3, "ui_ux": 2, "software_dev": 2 } },
      { label: "Machine learning and artificial intelligence", value: "ml", weight: { "ai_ml": 3, "data_science": 3, "data_engineering": 1 } },
      { label: "Backend systems, APIs, and infrastructure", value: "backend", weight: { "software_dev": 3, "devops": 3, "cloud_engineering": 3, "data_engineering": 2 } },
      { label: "Security, networking, and ethical hacking", value: "security", weight: { "cybersecurity": 3, "cloud_engineering": 2, "devops": 2 } },
    ],
  },
  {
    id: "b5",
    question: "How do you feel about mathematics and statistics?",
    category: "behavioral",
    options: [
      { label: "I love it and want it in my daily work", value: "love", weight: { "data_science": 3, "ai_ml": 3, "data_engineering": 2 } },
      { label: "I'm comfortable with it when needed", value: "comfortable", weight: { "software_dev": 2, "full_stack": 2, "cybersecurity": 2, "cloud_engineering": 1 } },
      { label: "I prefer minimal math involvement", value: "minimal", weight: { "ui_ux": 3, "frontend_dev": 3, "product_management": 3, "project_management": 3 } },
      { label: "I enjoy applied math but not pure theory", value: "applied", weight: { "data_engineering": 3, "devops": 2, "ai_ml": 2, "software_dev": 1 } },
    ],
  },
  {
    id: "b6",
    question: "What best describes your communication style?",
    category: "behavioral",
    options: [
      { label: "I enjoy presenting ideas and leading discussions", value: "leader", weight: { "product_management": 3, "project_management": 3, "ui_ux": 2 } },
      { label: "I prefer writing detailed documentation", value: "writer", weight: { "software_dev": 2, "data_science": 2, "cybersecurity": 2, "devops": 1 } },
      { label: "I communicate best through visual work", value: "visual", weight: { "ui_ux": 3, "frontend_dev": 3, "data_science": 1 } },
      { label: "I focus on technical precision and code quality", value: "technical", weight: { "software_dev": 3, "devops": 3, "cloud_engineering": 2, "data_engineering": 3 } },
    ],
  },
  {
    id: "b7",
    question: "How important is creativity in your ideal career?",
    category: "behavioral",
    options: [
      { label: "Very important - I want to create visual experiences", value: "very", weight: { "ui_ux": 3, "frontend_dev": 3, "product_management": 2 } },
      { label: "Somewhat - creative problem solving matters to me", value: "somewhat", weight: { "software_dev": 2, "full_stack": 2, "ai_ml": 2, "data_science": 2 } },
      { label: "I prefer structured, systematic work", value: "structured", weight: { "devops": 3, "cloud_engineering": 3, "data_engineering": 3, "cybersecurity": 2 } },
      { label: "I want to innovate with new technologies", value: "innovate", weight: { "ai_ml": 3, "data_science": 2, "full_stack": 2, "cybersecurity": 1 } },
    ],
  },
]

export const skillsQuestions: QuizQuestion[] = [
  {
    id: "s1",
    question: "What is your proficiency level in Python?",
    category: "skills",
    options: [
      { label: "Currently learning", value: "learning", weight: { "python": 1 } },
      { label: "Beginner - basic syntax and simple programs", value: "beginner", weight: { "python": 2 } },
      { label: "Intermediate - can build projects independently", value: "intermediate", weight: { "python": 3 } },
      { label: "Expert - advanced concepts and libraries", value: "expert", weight: { "python": 4 } },
    ],
  },
  {
    id: "s2",
    question: "What is your proficiency level in JavaScript/TypeScript?",
    category: "skills",
    options: [
      { label: "Currently learning", value: "learning", weight: { "javascript": 1 } },
      { label: "Beginner - basic DOM manipulation", value: "beginner", weight: { "javascript": 2 } },
      { label: "Intermediate - frameworks like React/Next.js", value: "intermediate", weight: { "javascript": 3 } },
      { label: "Expert - full-stack applications", value: "expert", weight: { "javascript": 4 } },
    ],
  },
  {
    id: "s3",
    question: "How experienced are you with databases (SQL/NoSQL)?",
    category: "skills",
    options: [
      { label: "Currently learning", value: "learning", weight: { "databases": 1 } },
      { label: "Beginner - basic CRUD operations", value: "beginner", weight: { "databases": 2 } },
      { label: "Intermediate - query optimization and design", value: "intermediate", weight: { "databases": 3 } },
      { label: "Expert - distributed systems and architecture", value: "expert", weight: { "databases": 4 } },
    ],
  },
  {
    id: "s4",
    question: "What is your experience with HTML/CSS and UI design?",
    category: "skills",
    options: [
      { label: "Currently learning", value: "learning", weight: { "html_css": 1 } },
      { label: "Beginner - basic web pages", value: "beginner", weight: { "html_css": 2 } },
      { label: "Intermediate - responsive and accessible designs", value: "intermediate", weight: { "html_css": 3 } },
      { label: "Expert - complex layouts and design systems", value: "expert", weight: { "html_css": 4 } },
    ],
  },
  {
    id: "s5",
    question: "How familiar are you with cloud services (AWS/GCP/Azure)?",
    category: "skills",
    options: [
      { label: "Currently learning", value: "learning", weight: { "cloud": 1 } },
      { label: "Beginner - basic deployments", value: "beginner", weight: { "cloud": 2 } },
      { label: "Intermediate - multiple services and architecture", value: "intermediate", weight: { "cloud": 3 } },
      { label: "Expert - certified and production experience", value: "expert", weight: { "cloud": 4 } },
    ],
  },
  {
    id: "s6",
    question: "What is your proficiency with Data Science tools (Pandas, NumPy, etc.)?",
    category: "skills",
    options: [
      { label: "Currently learning", value: "learning", weight: { "data_tools": 1 } },
      { label: "Beginner - basic data manipulation", value: "beginner", weight: { "data_tools": 2 } },
      { label: "Intermediate - analysis and visualization", value: "intermediate", weight: { "data_tools": 3 } },
      { label: "Expert - machine learning pipelines", value: "expert", weight: { "data_tools": 4 } },
    ],
  },
  {
    id: "s7",
    question: "How experienced are you with version control (Git)?",
    category: "skills",
    options: [
      { label: "Currently learning", value: "learning", weight: { "git": 1 } },
      { label: "Beginner - basic commit and push", value: "beginner", weight: { "git": 2 } },
      { label: "Intermediate - branching and collaboration", value: "intermediate", weight: { "git": 3 } },
      { label: "Expert - CI/CD and advanced workflows", value: "expert", weight: { "git": 4 } },
    ],
  },
  {
    id: "s8",
    question: "What is your experience with DevOps tools (Docker, Kubernetes, CI/CD)?",
    category: "skills",
    options: [
      { label: "Currently learning", value: "learning", weight: { "devops_tools": 1 } },
      { label: "Beginner - basic containerization", value: "beginner", weight: { "devops_tools": 2 } },
      { label: "Intermediate - orchestration and pipelines", value: "intermediate", weight: { "devops_tools": 3 } },
      { label: "Expert - production infrastructure", value: "expert", weight: { "devops_tools": 4 } },
    ],
  },
]

export const careerPaths: CareerPath[] = [
  {
    id: "software_dev",
    title: "Software Developer",
    description: "Build applications and systems using programming languages and frameworks. Work on both frontend and backend systems.",
    requiredSkills: ["Python", "JavaScript", "Git", "Databases", "Data Structures & Algorithms", "System Design"],
  },
  {
    id: "frontend_dev",
    title: "Frontend Developer",
    description: "Create beautiful, responsive user interfaces and web applications. Focus on user experience and performance.",
    requiredSkills: ["HTML/CSS", "JavaScript", "React/Next.js", "Git", "UI/UX Principles", "Testing"],
  },
  {
    id: "full_stack",
    title: "Full Stack Developer",
    description: "Handle both frontend and backend development. Build complete web applications end to end.",
    requiredSkills: ["JavaScript", "Python/Node.js", "Databases", "HTML/CSS", "Git", "Cloud Basics", "APIs"],
  },
  {
    id: "data_science",
    title: "Data Scientist",
    description: "Analyze complex data sets to find patterns and insights. Use statistical methods and machine learning.",
    requiredSkills: ["Python", "Statistics", "Machine Learning", "SQL", "Data Visualization", "Pandas/NumPy"],
  },
  {
    id: "ai_ml",
    title: "AI/ML Engineer",
    description: "Design and build artificial intelligence and machine learning systems. Work with deep learning and NLP.",
    requiredSkills: ["Python", "Machine Learning", "Deep Learning", "Mathematics", "TensorFlow/PyTorch", "Data Engineering"],
  },
  {
    id: "devops",
    title: "DevOps Engineer",
    description: "Automate and streamline development and deployment processes. Manage infrastructure and CI/CD pipelines.",
    requiredSkills: ["Linux", "Docker", "Kubernetes", "CI/CD", "Cloud (AWS/GCP)", "Scripting", "Monitoring"],
  },
  {
    id: "cloud_engineering",
    title: "Cloud Engineer",
    description: "Design, deploy, and manage cloud infrastructure. Ensure scalability, security, and efficiency.",
    requiredSkills: ["Cloud Platforms (AWS/GCP/Azure)", "Networking", "Security", "Terraform/IaC", "Linux", "Scripting"],
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity Analyst",
    description: "Protect systems and networks from cyber threats. Conduct security audits and implement defenses.",
    requiredSkills: ["Networking", "Linux", "Security Tools", "Python", "Cryptography", "Risk Assessment"],
  },
  {
    id: "data_engineering",
    title: "Data Engineer",
    description: "Build and maintain data pipelines and infrastructure. Ensure data quality and accessibility.",
    requiredSkills: ["Python", "SQL", "Spark/Hadoop", "Cloud Services", "ETL Pipelines", "Data Modeling"],
  },
  {
    id: "ui_ux",
    title: "UI/UX Designer",
    description: "Design user-centered digital experiences. Create wireframes, prototypes, and design systems.",
    requiredSkills: ["Figma/Sketch", "User Research", "Prototyping", "HTML/CSS Basics", "Design Thinking", "Accessibility"],
  },
  {
    id: "product_management",
    title: "Product Manager (Tech)",
    description: "Define product vision and strategy. Bridge the gap between business, design, and engineering teams.",
    requiredSkills: ["Product Strategy", "Data Analysis", "Communication", "Agile/Scrum", "Technical Literacy", "User Research"],
  },
  {
    id: "project_management",
    title: "Project Manager (IT)",
    description: "Plan, execute, and manage IT projects. Coordinate teams and ensure timely delivery.",
    requiredSkills: ["Agile/Scrum", "Communication", "Risk Management", "Jira/Tools", "Budgeting", "Technical Basics"],
  },
]

export const skillRoadmaps: Record<string, { days: number; topics: string[]; resources: { name: string; url: string; type: string }[]; miniProjects: string[] }> = {
  "Python": {
    days: 30,
    topics: ["Variables & Data Types", "Control Flow", "Functions", "OOP", "File Handling", "Modules & Packages", "Error Handling", "List Comprehensions", "Decorators", "Working with APIs"],
    resources: [
      { name: "Python.org Official Tutorial", url: "https://docs.python.org/3/tutorial/", type: "Documentation" },
      { name: "freeCodeCamp Python Course", url: "https://www.youtube.com/watch?v=rfscVS0vtbw", type: "YouTube" },
      { name: "Google Python Class (Free Certification)", url: "https://developers.google.com/edu/python", type: "Certification" },
    ],
    miniProjects: ["Build a Calculator CLI", "Create a To-Do App", "Web Scraper with BeautifulSoup", "REST API with Flask"],
  },
  "JavaScript": {
    days: 35,
    topics: ["Variables & Types", "Functions & Scope", "DOM Manipulation", "Async/Await", "ES6+ Features", "Error Handling", "Modules", "Fetch API", "Event Handling", "Closures & Prototypes"],
    resources: [
      { name: "MDN Web Docs", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript", type: "Documentation" },
      { name: "JavaScript.info", url: "https://javascript.info/", type: "Tutorial" },
      { name: "freeCodeCamp JS Course", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/", type: "Certification" },
    ],
    miniProjects: ["Interactive Quiz App", "Weather App using API", "Expense Tracker", "Drag & Drop Kanban Board"],
  },
  "React/Next.js": {
    days: 25,
    topics: ["JSX & Components", "Props & State", "Hooks", "Routing", "API Integration", "Context & State Management", "Server Components", "Performance Optimization"],
    resources: [
      { name: "React Official Docs", url: "https://react.dev/", type: "Documentation" },
      { name: "Next.js Learn", url: "https://nextjs.org/learn", type: "Tutorial" },
      { name: "freeCodeCamp React Course", url: "https://www.youtube.com/watch?v=bMknfKXIFA8", type: "YouTube" },
    ],
    miniProjects: ["Portfolio Website", "Blog with Markdown", "E-commerce Product Page", "Real-time Chat App"],
  },
  "Databases": {
    days: 20,
    topics: ["SQL Fundamentals", "Table Design", "Joins & Subqueries", "Indexing", "Normalization", "NoSQL Basics", "MongoDB", "Query Optimization"],
    resources: [
      { name: "SQLBolt", url: "https://sqlbolt.com/", type: "Interactive" },
      { name: "MongoDB University", url: "https://university.mongodb.com/", type: "Certification" },
      { name: "freeCodeCamp SQL Tutorial", url: "https://www.youtube.com/watch?v=HXV3zeQKqGY", type: "YouTube" },
    ],
    miniProjects: ["Student Management System", "Library Database", "Blog Backend with PostgreSQL"],
  },
  "Machine Learning": {
    days: 45,
    topics: ["Linear Algebra Basics", "Probability & Stats", "Supervised Learning", "Unsupervised Learning", "Model Evaluation", "Feature Engineering", "Neural Networks Intro", "Scikit-learn", "Model Deployment"],
    resources: [
      { name: "Andrew Ng ML Course (Coursera)", url: "https://www.coursera.org/learn/machine-learning", type: "Certification" },
      { name: "Kaggle Learn", url: "https://www.kaggle.com/learn", type: "Interactive" },
      { name: "StatQuest YouTube", url: "https://www.youtube.com/c/joshstarmer", type: "YouTube" },
    ],
    miniProjects: ["House Price Predictor", "Spam Email Classifier", "Image Classifier with CNN", "Sentiment Analysis Tool"],
  },
  "HTML/CSS": {
    days: 15,
    topics: ["HTML Semantics", "CSS Selectors", "Flexbox", "Grid Layout", "Responsive Design", "Animations", "Accessibility", "CSS Variables"],
    resources: [
      { name: "MDN HTML/CSS", url: "https://developer.mozilla.org/en-US/docs/Learn/HTML", type: "Documentation" },
      { name: "CSS-Tricks", url: "https://css-tricks.com/", type: "Tutorial" },
      { name: "freeCodeCamp Responsive Design", url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/", type: "Certification" },
    ],
    miniProjects: ["Personal Portfolio", "Responsive Landing Page", "CSS Art Challenge"],
  },
  "Git": {
    days: 7,
    topics: ["Init & Clone", "Add & Commit", "Branching", "Merging & Rebasing", "Remote Repos", "Pull Requests", "Conflict Resolution"],
    resources: [
      { name: "Git Official Docs", url: "https://git-scm.com/doc", type: "Documentation" },
      { name: "Learn Git Branching", url: "https://learngitbranching.js.org/", type: "Interactive" },
      { name: "GitHub Skills", url: "https://skills.github.com/", type: "Interactive" },
    ],
    miniProjects: ["Contribute to an Open Source Project", "Set up a CI/CD Pipeline"],
  },
  "Docker": {
    days: 14,
    topics: ["Containers Basics", "Dockerfiles", "Images & Layers", "Docker Compose", "Networking", "Volumes", "Multi-stage Builds"],
    resources: [
      { name: "Docker Official Docs", url: "https://docs.docker.com/get-started/", type: "Documentation" },
      { name: "Docker Mastery (YouTube)", url: "https://www.youtube.com/watch?v=3c-iBn73dDE", type: "YouTube" },
    ],
    miniProjects: ["Containerize a Web App", "Multi-container App with Compose", "Microservices Setup"],
  },
  "Cloud Platforms (AWS/GCP/Azure)": {
    days: 30,
    topics: ["Cloud Concepts", "Compute (EC2/GCE)", "Storage (S3/GCS)", "Databases (RDS)", "Networking (VPC)", "IAM & Security", "Serverless (Lambda)", "Deployment"],
    resources: [
      { name: "AWS Free Tier", url: "https://aws.amazon.com/free/", type: "Platform" },
      { name: "Google Cloud Skills Boost", url: "https://www.cloudskillsboost.google/", type: "Certification" },
      { name: "freeCodeCamp AWS Course", url: "https://www.youtube.com/watch?v=SOTamWNgDKc", type: "YouTube" },
    ],
    miniProjects: ["Deploy a Serverless API", "Static Website on S3", "Auto-scaling Web Application"],
  },
  "Data Structures & Algorithms": {
    days: 40,
    topics: ["Arrays & Strings", "Linked Lists", "Stacks & Queues", "Trees & Graphs", "Sorting & Searching", "Dynamic Programming", "Greedy Algorithms", "Hash Maps", "Recursion", "Big-O Notation"],
    resources: [
      { name: "NeetCode", url: "https://neetcode.io/", type: "Interactive" },
      { name: "LeetCode", url: "https://leetcode.com/", type: "Practice" },
      { name: "Abdul Bari Algorithms (YouTube)", url: "https://www.youtube.com/channel/UCZCFT11CWBi3MHNlGf019nw", type: "YouTube" },
    ],
    miniProjects: ["Implement a Hash Map from Scratch", "Pathfinding Visualizer", "Sorting Algorithm Visualizer"],
  },
  "Statistics": {
    days: 20,
    topics: ["Descriptive Statistics", "Probability", "Distributions", "Hypothesis Testing", "Regression", "Bayesian Thinking", "A/B Testing"],
    resources: [
      { name: "Khan Academy Statistics", url: "https://www.khanacademy.org/math/statistics-probability", type: "Tutorial" },
      { name: "StatQuest", url: "https://www.youtube.com/c/joshstarmer", type: "YouTube" },
    ],
    miniProjects: ["Statistical Analysis Dashboard", "A/B Test Simulator"],
  },
  "Linux": {
    days: 14,
    topics: ["File System", "Commands & Navigation", "Permissions", "Shell Scripting", "Package Management", "Process Management", "Networking Basics"],
    resources: [
      { name: "Linux Journey", url: "https://linuxjourney.com/", type: "Interactive" },
      { name: "OverTheWire Bandit", url: "https://overthewire.org/wargames/bandit/", type: "Interactive" },
    ],
    miniProjects: ["Automate Backups with Shell Script", "Set up a Web Server"],
  },
  "Networking": {
    days: 20,
    topics: ["OSI Model", "TCP/IP", "DNS", "HTTP/HTTPS", "Firewalls", "Subnetting", "Load Balancing", "VPN"],
    resources: [
      { name: "Cisco Networking Basics", url: "https://www.netacad.com/", type: "Certification" },
      { name: "Computer Networking (YouTube)", url: "https://www.youtube.com/watch?v=qiQR5rTSshw", type: "YouTube" },
    ],
    miniProjects: ["Build a Simple Chat Server", "Network Scanner Tool"],
  },
  "System Design": {
    days: 25,
    topics: ["Scalability", "Load Balancing", "Caching", "Database Sharding", "Microservices", "Message Queues", "API Design", "CAP Theorem"],
    resources: [
      { name: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer", type: "Documentation" },
      { name: "Gaurav Sen (YouTube)", url: "https://www.youtube.com/c/GauravSensei", type: "YouTube" },
    ],
    miniProjects: ["Design a URL Shortener", "Design a Chat Application"],
  },
  "Figma/Sketch": {
    days: 15,
    topics: ["Interface Basics", "Components", "Auto Layout", "Prototyping", "Design Systems", "Collaboration", "Plugins"],
    resources: [
      { name: "Figma Official Tutorials", url: "https://www.figma.com/resources/learn-design/", type: "Tutorial" },
      { name: "Figma YouTube Channel", url: "https://www.youtube.com/c/Figmadesign", type: "YouTube" },
    ],
    miniProjects: ["Design a Mobile App", "Create a Design System", "Prototype an E-commerce Flow"],
  },
}
