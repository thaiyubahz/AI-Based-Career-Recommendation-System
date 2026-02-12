"""
PathFinder AI - Career Recommendation Algorithm (ML Edition)
=============================================================
Machine Learning pipeline using three classifiers:
  1. Random Forest Classifier
  2. Support Vector Machine (SVM) with RBF kernel
  3. XGBoost Classifier

The final prediction is an ensemble average of all three models'
probability outputs, producing a ranked list of career recommendations.

Pipeline:
  1. Generate synthetic dataset (2400 student profiles across 12 careers)
  2. Preprocess: StandardScaler normalization, 80/20 train-test split
  3. Train all three classifiers
  4. Evaluate: accuracy, per-model comparison, feature importance
  5. Ensemble predict: average probability outputs for final ranking
  6. Generate personalized learning roadmap for the top career

Usage:
    python career_recommendation_algorithm.py          # interactive
    python career_recommendation_algorithm.py --demo   # auto-demo
"""

import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, classification_report
from xgboost import XGBClassifier
import warnings

warnings.filterwarnings("ignore")


# =====================================================================
# DATA DEFINITIONS
# =====================================================================

CAREERS = [
    "Software Developer",
    "Data Scientist",
    "AI/ML Engineer",
    "Web Developer",
    "DevOps Engineer",
    "Cybersecurity Analyst",
    "Cloud Architect",
    "Mobile App Developer",
    "Database Administrator",
    "UX/UI Designer",
    "Product Manager",
    "Blockchain Developer",
]

# Ideal profile for each career.
# behavioral vector: [work_env, activity, learning, prog_interest, math, comm, creativity]
#   work_env:      0=office, 1=remote, 2=hybrid
#   activity:      0=building, 1=data, 2=design, 3=managing
#   learning:      0=courses, 1=projects, 2=reading, 3=mentorship
#   prog_interest: 0=web, 1=ml, 2=mobile, 3=systems, 4=any
#   math:          0=avoid, 1=okay, 2=love
#   comm:          0=writing, 1=technical, 2=presenting
#   creativity:    0=follow, 1=improve, 2=innovate
#
# skills vector: [Python, JavaScript, Databases, HTML/CSS, Cloud, Data Tools, Git, DevOps]
#   each rated 0-4 (none to expert)

CAREER_PROFILES = {
    "Software Developer":    {"behavioral": [2, 0, 1, 4, 1, 1, 1], "skills": [4, 3, 3, 2, 2, 1, 3, 2]},
    "Data Scientist":        {"behavioral": [1, 1, 1, 1, 2, 1, 2], "skills": [4, 1, 3, 1, 2, 4, 2, 1]},
    "AI/ML Engineer":        {"behavioral": [1, 1, 2, 1, 2, 1, 2], "skills": [4, 1, 2, 1, 3, 4, 2, 1]},
    "Web Developer":         {"behavioral": [1, 0, 1, 0, 1, 1, 1], "skills": [2, 4, 2, 4, 1, 1, 3, 1]},
    "DevOps Engineer":       {"behavioral": [2, 0, 1, 3, 1, 1, 1], "skills": [3, 2, 3, 1, 4, 1, 3, 4]},
    "Cybersecurity Analyst": {"behavioral": [0, 0, 2, 3, 1, 1, 1], "skills": [3, 1, 3, 1, 3, 1, 2, 3]},
    "Cloud Architect":       {"behavioral": [2, 0, 2, 3, 1, 2, 1], "skills": [3, 2, 3, 1, 4, 2, 2, 4]},
    "Mobile App Developer":  {"behavioral": [1, 0, 1, 2, 1, 1, 2], "skills": [2, 3, 2, 3, 2, 1, 3, 1]},
    "Database Administrator":{"behavioral": [0, 0, 0, 3, 1, 1, 0], "skills": [2, 1, 4, 1, 2, 2, 2, 2]},
    "UX/UI Designer":        {"behavioral": [1, 2, 3, 0, 0, 2, 2], "skills": [1, 3, 1, 4, 1, 1, 2, 1]},
    "Product Manager":       {"behavioral": [2, 3, 3, 4, 1, 2, 1], "skills": [2, 2, 2, 2, 2, 2, 2, 2]},
    "Blockchain Developer":  {"behavioral": [1, 0, 2, 3, 2, 1, 2], "skills": [4, 3, 3, 2, 2, 1, 3, 2]},
}

SKILL_NAMES = [
    "Python", "JavaScript", "Databases", "HTML/CSS",
    "Cloud", "Data Tools", "Git", "DevOps",
]

BEHAVIORAL_NAMES = [
    "Work Environment", "Activity Preference", "Learning Style",
    "Programming Interest", "Math Comfort", "Communication", "Creativity",
]

FEATURE_NAMES = BEHAVIORAL_NAMES + SKILL_NAMES

SKILL_RESOURCES = {
    "Python":     {"url": "https://docs.python.org/3/tutorial/",                       "platform": "Python.org"},
    "JavaScript": {"url": "https://javascript.info/",                                  "platform": "JavaScript.info"},
    "Databases":  {"url": "https://www.khanacademy.org/computing/computer-programming/sql", "platform": "Khan Academy"},
    "HTML/CSS":   {"url": "https://web.dev/learn/css/",                                "platform": "web.dev"},
    "Cloud":      {"url": "https://aws.amazon.com/training/",                          "platform": "AWS Training"},
    "Data Tools": {"url": "https://pandas.pydata.org/docs/getting_started/",           "platform": "Pandas Docs"},
    "Git":        {"url": "https://learngitbranching.js.org/",                         "platform": "Learn Git Branching"},
    "DevOps":     {"url": "https://roadmap.sh/devops",                                 "platform": "roadmap.sh"},
}


# =====================================================================
# SYNTHETIC DATASET GENERATOR
# =====================================================================

def generate_synthetic_dataset(n_samples=2400, noise_std=0.55, seed=42):
    """
    Generate a synthetic dataset of student profiles with labeled career outcomes.
    Each sample: 7 behavioral + 8 skill = 15 features.
    Labels: one of 12 career paths.

    Samples are drawn around each career's ideal profile with Gaussian noise
    to create realistic variability.
    """
    rng = np.random.RandomState(seed)
    samples_per_career = n_samples // len(CAREERS)

    X_list, y_list = [], []

    for career in CAREERS:
        profile = CAREER_PROFILES[career]
        ideal = np.array(profile["behavioral"] + profile["skills"], dtype=float)

        for _ in range(samples_per_career):
            noise = rng.normal(0, noise_std, size=len(ideal))
            sample = ideal + noise

            # Clamp behavioral features
            sample[0] = np.clip(sample[0], 0, 2)
            sample[1] = np.clip(sample[1], 0, 3)
            sample[2] = np.clip(sample[2], 0, 3)
            sample[3] = np.clip(sample[3], 0, 4)
            sample[4] = np.clip(sample[4], 0, 2)
            sample[5] = np.clip(sample[5], 0, 2)
            sample[6] = np.clip(sample[6], 0, 2)
            # Clamp skills 0-4
            sample[7:] = np.clip(sample[7:], 0, 4)

            X_list.append(sample)
            y_list.append(career)

    X = np.array(X_list)
    y = np.array(y_list)
    indices = rng.permutation(len(X))
    return X[indices], y[indices]


# =====================================================================
# MODEL TRAINING
# =====================================================================

def train_models(X_train, y_train, X_test, y_test, label_encoder):
    """
    Train Random Forest, SVM, and XGBoost.
    Returns dict of models and dict of accuracy metrics.
    """
    models, metrics = {}, {}

    # -- Random Forest --
    print("\n  [1/3] Training Random Forest Classifier...")
    rf = RandomForestClassifier(
        n_estimators=200, max_depth=20,
        min_samples_split=5, min_samples_leaf=2,
        random_state=42, n_jobs=-1,
    )
    rf.fit(X_train, y_train)
    rf_acc = accuracy_score(y_test, rf.predict(X_test))
    models["Random Forest"] = rf
    metrics["Random Forest"] = rf_acc
    print(f"        Accuracy: {rf_acc:.4f} ({rf_acc * 100:.1f}%)")

    # -- SVM --
    print("\n  [2/3] Training Support Vector Machine (SVM)...")
    svm = SVC(kernel="rbf", C=10, gamma="scale", probability=True, random_state=42)
    svm.fit(X_train, y_train)
    svm_acc = accuracy_score(y_test, svm.predict(X_test))
    models["SVM"] = svm
    metrics["SVM"] = svm_acc
    print(f"        Accuracy: {svm_acc:.4f} ({svm_acc * 100:.1f}%)")

    # -- XGBoost --
    print("\n  [3/3] Training XGBoost Classifier...")
    xgb = XGBClassifier(
        n_estimators=200, learning_rate=0.1, max_depth=6,
        subsample=0.8, colsample_bytree=0.8,
        use_label_encoder=False, eval_metric="mlogloss",
        random_state=42, verbosity=0,
    )
    y_train_enc = label_encoder.transform(y_train)
    y_test_enc = label_encoder.transform(y_test)
    xgb.fit(X_train, y_train_enc)
    xgb_acc = accuracy_score(y_test_enc, xgb.predict(X_test))
    models["XGBoost"] = xgb
    metrics["XGBoost"] = xgb_acc
    print(f"        Accuracy: {xgb_acc:.4f} ({xgb_acc * 100:.1f}%)")

    return models, metrics


# =====================================================================
# ENSEMBLE PREDICTION
# =====================================================================

def ensemble_predict(models, scaler, label_encoder, feature_vector):
    """
    Average probability outputs from all 3 models.
    Returns list of (career, match_percent) sorted descending.
    """
    X_in = scaler.transform([feature_vector])
    all_probs = []

    # RF
    rf = models["Random Forest"]
    all_probs.append(dict(zip(rf.classes_, rf.predict_proba(X_in)[0])))

    # SVM
    svm = models["SVM"]
    all_probs.append(dict(zip(svm.classes_, svm.predict_proba(X_in)[0])))

    # XGB (encoded labels)
    xgb = models["XGBoost"]
    xgb_probs = xgb.predict_proba(X_in)[0]
    xgb_classes = label_encoder.inverse_transform(range(len(xgb_probs)))
    all_probs.append(dict(zip(xgb_classes, xgb_probs)))

    ensemble = {}
    for career in CAREERS:
        ensemble[career] = np.mean([p.get(career, 0.0) for p in all_probs])

    ranked = sorted(ensemble.items(), key=lambda x: x[1], reverse=True)
    return [(c, round(p * 100, 1)) for c, p in ranked]


def get_per_model_predictions(models, scaler, label_encoder, feature_vector):
    """Per-model probability breakdown for the display table."""
    X_in = scaler.transform([feature_vector])
    result = {}

    rf = models["Random Forest"]
    result["Random Forest"] = {c: round(p * 100, 1) for c, p in zip(rf.classes_, rf.predict_proba(X_in)[0])}

    svm = models["SVM"]
    result["SVM"] = {c: round(p * 100, 1) for c, p in zip(svm.classes_, svm.predict_proba(X_in)[0])}

    xgb = models["XGBoost"]
    xgb_probs = xgb.predict_proba(X_in)[0]
    xgb_classes = label_encoder.inverse_transform(range(len(xgb_probs)))
    result["XGBoost"] = {c: round(p * 100, 1) for c, p in zip(xgb_classes, xgb_probs)}

    return result


# =====================================================================
# FEATURE IMPORTANCE ANALYSIS
# =====================================================================

def analyze_feature_importance(models):
    """Extract feature importances from RF and XGBoost (SVM RBF has none)."""
    print("\n  " + "=" * 60)
    print("  FEATURE IMPORTANCE ANALYSIS")
    print("  " + "=" * 60)

    for name in ["Random Forest", "XGBoost"]:
        model = models[name]
        importances = model.feature_importances_
        ranked = sorted(zip(FEATURE_NAMES, importances), key=lambda x: x[1], reverse=True)
        print(f"\n  {name} - Top 8 Features:")
        for i, (feat, imp) in enumerate(ranked[:8]):
            bar = "#" * int(imp * 120)
            print(f"    {i + 1:2d}. {feat:<22s} {imp:.4f}  {bar}")


# =====================================================================
# LEARNING ROADMAP
# =====================================================================

def generate_learning_roadmap(career, user_skills):
    """Compare user skills to ideal; return gaps with resources."""
    ideal = CAREER_PROFILES[career]["skills"]
    roadmap = []
    for skill, target, current in zip(SKILL_NAMES, ideal, user_skills):
        gap = target - current
        if gap > 0:
            res = SKILL_RESOURCES.get(skill, {"url": "#", "platform": "Online"})
            roadmap.append({
                "skill": skill,
                "current": current,
                "target": target,
                "gap": gap,
                "days": gap * 15,
                "resource": res,
            })
    roadmap.sort(key=lambda x: x["gap"], reverse=True)
    return roadmap


# =====================================================================
# DISPLAY HELPERS
# =====================================================================

def display_model_comparison(metrics):
    print("\n  " + "=" * 60)
    print("  MODEL PERFORMANCE COMPARISON")
    print("  " + "=" * 60)
    print(f"  {'Model':<20s} {'Accuracy':>10s} {'Score':>10s}")
    print("  " + "-" * 42)
    best = max(metrics, key=metrics.get)
    for m, acc in sorted(metrics.items(), key=lambda x: x[1], reverse=True):
        tag = " <-- Best" if m == best else ""
        print(f"  {m:<20s} {acc * 100:>9.1f}% {acc:>9.4f}{tag}")
    avg = np.mean(list(metrics.values()))
    print("  " + "-" * 42)
    print(f"  {'Ensemble Average':<20s} {avg * 100:>9.1f}% {avg:>9.4f}")


def display_recommendations(ranked, per_model):
    print("\n  " + "=" * 60)
    print("  CAREER RECOMMENDATIONS  (Ensemble of RF + SVM + XGB)")
    print("  " + "=" * 60)
    print(f"  {'Rank':<6s} {'Career':<24s} {'Ensemble':>9s} {'RF':>6s} {'SVM':>6s} {'XGB':>6s}")
    print("  " + "-" * 58)
    for i, (career, pct) in enumerate(ranked[:6], 1):
        rf  = per_model["Random Forest"].get(career, 0)
        svm = per_model["SVM"].get(career, 0)
        xgb = per_model["XGBoost"].get(career, 0)
        print(f"  #{i:<5d} {career:<24s} {pct:>8.1f}% {rf:>5.1f}% {svm:>5.1f}% {xgb:>5.1f}%")


def display_roadmap(roadmap, career):
    if not roadmap:
        print(f"\n  You already have all the skills needed for {career}!")
        return
    print(f"\n  " + "=" * 60)
    print(f"  LEARNING ROADMAP FOR: {career.upper()}")
    print(f"  " + "=" * 60)
    total = 0
    for step, item in enumerate(roadmap, 1):
        total += item["days"]
        cur_bar = "*" * item["current"] + "." * (4 - item["current"])
        tgt_bar = "*" * item["target"]  + "." * (4 - item["target"])
        print(f"\n  Step {step}: {item['skill']}")
        print(f"    Current:  [{cur_bar}] Level {item['current']}")
        print(f"    Target:   [{tgt_bar}] Level {item['target']}")
        print(f"    Gap:      {item['gap']} level(s)  |  ~{item['days']} days")
        print(f"    Resource: {item['resource']['platform']} - {item['resource']['url']}")
    print(f"\n  " + "-" * 60)
    print(f"  Total estimated time: {total} days (~{total // 30} months)")


def display_classification_report(models, X_test, y_test, label_encoder):
    """Print sklearn classification reports for each model."""
    print("\n  " + "=" * 60)
    print("  DETAILED CLASSIFICATION REPORTS")
    print("  " + "=" * 60)

    for name in ["Random Forest", "SVM"]:
        model = models[name]
        preds = model.predict(X_test)
        print(f"\n  --- {name} ---")
        report = classification_report(y_test, preds, zero_division=0)
        for line in report.split("\n"):
            print(f"  {line}")

    # XGBoost uses encoded labels
    xgb = models["XGBoost"]
    y_test_enc = label_encoder.transform(y_test)
    xgb_preds = xgb.predict(X_test)
    xgb_preds_labels = label_encoder.inverse_transform(xgb_preds)
    print(f"\n  --- XGBoost ---")
    report = classification_report(y_test, xgb_preds_labels, zero_division=0)
    for line in report.split("\n"):
        print(f"  {line}")


# =====================================================================
# PIPELINE BUILDER
# =====================================================================

def build_pipeline():
    """Full ML pipeline: data generation, split, scale, train, evaluate."""
    print("\n  " + "#" * 62)
    print("  #                                                            #")
    print("  #    PATHFINDER AI  -  ML Career Recommendation Engine       #")
    print("  #    Models: Random Forest | SVM | XGBoost  (Ensemble)       #")
    print("  #                                                            #")
    print("  " + "#" * 62)

    # 1. Dataset
    print("\n  [Step 1] Generating synthetic dataset...")
    X, y = generate_synthetic_dataset(n_samples=2400, noise_std=0.55, seed=42)
    print(f"           Shape: {X.shape[0]} samples x {X.shape[1]} features")
    print(f"           Classes: {len(CAREERS)} careers")

    # 2. Encode labels
    le = LabelEncoder()
    le.fit(CAREERS)

    # 3. Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y,
    )
    print(f"           Train: {len(X_train)} | Test: {len(X_test)}")

    # 4. Scale
    scaler = StandardScaler()
    X_train_s = scaler.fit_transform(X_train)
    X_test_s  = scaler.transform(X_test)

    # 5. Train
    print("\n  [Step 2] Training ML models...")
    models, metrics = train_models(X_train_s, y_train, X_test_s, y_test, le)

    # 6. Evaluate
    display_model_comparison(metrics)
    analyze_feature_importance(models)
    display_classification_report(models, X_test_s, y_test, le)

    return models, scaler, le, metrics


# =====================================================================
# INTERACTIVE MODE
# =====================================================================

def main():
    models, scaler, le, _ = build_pipeline()

    behavioral_map = {
        "work_env":      {"office": 0, "remote": 1, "hybrid": 2},
        "activity":      {"building": 0, "data": 1, "design": 2, "managing": 3},
        "learning":      {"courses": 0, "projects": 1, "reading": 2, "mentorship": 3},
        "prog_interest": {"web": 0, "ml": 1, "mobile": 2, "systems": 3, "any": 4},
        "math":          {"avoid": 0, "okay": 1, "love": 2},
        "comm":          {"writing": 0, "technical": 1, "presenting": 2},
        "creativity":    {"follow": 0, "improve": 1, "innovate": 2},
    }

    print("\n\n  " + "=" * 60)
    print("  YOUR CAREER ASSESSMENT")
    print("  " + "=" * 60)

    questions = [
        ("work_env",      "Preferred work environment (office/remote/hybrid): "),
        ("activity",      "Preferred activity (building/data/design/managing): "),
        ("learning",      "Learning style (courses/projects/reading/mentorship): "),
        ("prog_interest", "Programming interest (web/ml/mobile/systems/any): "),
        ("math",          "Math comfort (avoid/okay/love): "),
        ("comm",          "Communication style (writing/technical/presenting): "),
        ("creativity",    "Creativity approach (follow/improve/innovate): "),
    ]

    print("\n  --- Behavioral Questions ---")
    behavioral = []
    for key, prompt in questions:
        while True:
            answer = input(f"  {prompt}").strip().lower()
            if answer in behavioral_map[key]:
                behavioral.append(behavioral_map[key][answer])
                break
            print(f"    Invalid. Options: {', '.join(behavioral_map[key].keys())}")

    print("\n  --- Skill Levels (0=None, 1=Beginner, 2=Intermediate, 3=Advanced, 4=Expert) ---")
    skills = []
    for skill in SKILL_NAMES:
        while True:
            try:
                level = int(input(f"  {skill} (0-4): ").strip())
                if 0 <= level <= 4:
                    skills.append(level)
                    break
                print("    Enter 0-4.")
            except ValueError:
                print("    Enter a valid number.")

    fv = np.array(behavioral + skills, dtype=float)
    ranked    = ensemble_predict(models, scaler, le, fv)
    per_model = get_per_model_predictions(models, scaler, le, fv)

    display_recommendations(ranked, per_model)

    top = ranked[0][0]
    roadmap = generate_learning_roadmap(top, skills)
    display_roadmap(roadmap, top)

    total_days = sum(r["days"] for r in roadmap) if roadmap else 0
    print(f"\n  {'=' * 60}")
    print(f"  SUMMARY")
    print(f"  {'=' * 60}")
    print(f"  Top Career:         {top}")
    print(f"  Ensemble Score:     {ranked[0][1]}%")
    print(f"  Skills to Improve:  {len(roadmap)}")
    if total_days:
        print(f"  Estimated Duration: {total_days} days (~{total_days // 30} months)")
    print(f"  {'=' * 60}\n")


# =====================================================================
# DEMO MODE
# =====================================================================

def demo():
    """Run the full pipeline with a sample student - no input needed."""
    models, scaler, le, _ = build_pipeline()

    # Sample: data-oriented student who loves ML, strong Python & data tools
    sample_b = [1, 1, 1, 1, 2, 1, 2]     # remote, data, projects, ml, love math, technical, innovate
    sample_s = [3, 2, 2, 1, 1, 3, 2, 1]   # Python 3, JS 2, DB 2, HTML 1, Cloud 1, Data 3, Git 2, DevOps 1

    print("\n\n  " + "=" * 60)
    print("  DEMO: SAMPLE STUDENT PROFILE")
    print("  " + "=" * 60)

    print("\n  Behavioral Profile:")
    for name, val in zip(BEHAVIORAL_NAMES, sample_b):
        print(f"    {name:<22s}: {val}")

    print("\n  Skill Levels:")
    for name, val in zip(SKILL_NAMES, sample_s):
        bar = "*" * val + "." * (4 - val)
        print(f"    {name:<14s} [{bar}] {val}/4")

    fv = np.array(sample_b + sample_s, dtype=float)
    ranked    = ensemble_predict(models, scaler, le, fv)
    per_model = get_per_model_predictions(models, scaler, le, fv)

    display_recommendations(ranked, per_model)

    top = ranked[0][0]
    roadmap = generate_learning_roadmap(top, sample_s)
    display_roadmap(roadmap, top)

    total_days = sum(r["days"] for r in roadmap) if roadmap else 0
    print(f"\n  {'=' * 60}")
    print(f"  DEMO SUMMARY")
    print(f"  {'=' * 60}")
    print(f"  Top Career:         {top}")
    print(f"  Ensemble Score:     {ranked[0][1]}%")
    print(f"  Models Used:        Random Forest, SVM (RBF), XGBoost")
    print(f"  Dataset Size:       2400 synthetic student profiles")
    print(f"  Features:           {len(FEATURE_NAMES)} (7 behavioral + 8 skills)")
    print(f"  Skills to Improve:  {len(roadmap)}")
    if total_days:
        print(f"  Estimated Duration: {total_days} days (~{total_days // 30} months)")
    print(f"\n  Algorithm successfully demonstrated!")
    print(f"  {'=' * 60}\n")


# =====================================================================
# ENTRY POINT
# =====================================================================

if __name__ == "__main__":
    import sys
    if "--demo" in sys.argv or not sys.stdin.isatty():
        demo()
    else:
        try:
            main()
        except (EOFError, KeyboardInterrupt):
            print("\n  Interactive mode unavailable. Running demo...\n")
            demo()
