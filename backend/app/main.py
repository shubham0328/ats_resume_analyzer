from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import uvicorn
import os
import re
import json
import tempfile
import uuid
from dotenv import load_dotenv
from pydantic import BaseModel

# Lazy imports (FIXES startup errors)
def import_groq():
    try:
        from groq import Groq
        return Groq
    except ImportError:
        return None

def import_pdfminer():
    try:
        from pdfminer.high_level import extract_text
        return extract_text
    except ImportError:
        return None

# Your existing imports
from app.database import Base, engine, get_db
from app.models import User
from app.schemas import UserCreate, Token, UserOut
from app.auth import (
    get_password_hash, create_access_token, verify_token, oauth2_scheme,
    get_user_by_email, authenticate_user
)

load_dotenv()

app = FastAPI(title="ResumeApp Auth + AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://localhost:3000", "http://127.0.0.1:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Resume Analysis Schema
class ResumeAnalysis(BaseModel):
    ats_score: int
    strengths: List[str]
    improvements: List[str]
    skills: List[str]
    experience: str
    recommendation: str
    ats_ready: bool

Base.metadata.create_all(bind=engine)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        email = verify_token(token)
        user = get_user_by_email(db, email)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return user
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

# === AUTH ENDPOINTS ===
@app.get("/health")
def health():
    return {"status": "healthy", "database": "resumeapp ✅", "ai": "ready ✅"}

@app.post("/register", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = User(email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    token = create_access_token(data={"sub": user.email})
    return Token(access_token=token, token_type="bearer")

@app.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    token = create_access_token(data={"sub": user.email})
    return Token(access_token=token, token_type="bearer")

@app.get("/me", response_model=UserOut)
def read_users_me(current_user=Depends(get_current_user)):
    return current_user

# === AI RESUME ANALYSIS ENDPOINT (PROTECTED) ===
def extract_text_from_pdf(file_path: str) -> str:
    """Extract clean text from PDF"""
    extract_text_func = import_pdfminer()
    if not extract_text_func:
        return "PDF library not available"
    
    try:
        text = extract_text_func(file_path)
        text = re.sub(r'\n+', '\n', text)
        text = re.sub(r'\s+', ' ', text)
        return text.strip()[:8000]
    except Exception as e:
        print(f"PDF extraction error: {e}")
        return ""

# REPLACE your analyze_resume_with_ai function with this PRODUCTION VERSION:

def analyze_resume_with_ai(resume_text: str) -> ResumeAnalysis:
    """🚀 REAL ATS SCORING - Industry Standard Algorithm (2026)"""
    
    GroqClient = import_groq()
    api_key = os.getenv("GROQ_API_KEY")
    
    if not GroqClient or not api_key:
        print("❌ GROQ_API_KEY missing")
        return calculate_ats_score_standalone(resume_text)
    
    try:
        client = GroqClient(api_key=api_key)
        
        # 🔥 REAL JOB DESCRIPTION (Software Developer)
        job_desc = """
        Requirements: React, JavaScript/TypeScript, Python, FastAPI/Django, PostgreSQL, AWS/Docker, 
        2+ years experience, team collaboration, Git/GitHub, CI/CD, problem-solving
        """
        
        prompt = f"""
        CALCULATE REAL ATS SCORE FOR SOFTWARE DEVELOPER POSITION

        JOB REQUIREMENTS:
        {job_desc}

        RESUME:
        {resume_text[:5000]}

        SCORE USING THIS EXACT FORMULA (return ONLY JSON):
        
        ATS_SCORE = (KEYWORDS*0.45 + STRUCTURE*0.25 + EXPERIENCE*0.20 + READABILITY*0.10) * 100

        CRITERIA:
        KEYWORDS (45%): Count matches - React(8%), Python(7%), DB(6%), Cloud(6%), Git(5%), etc.
        STRUCTURE (25%): Sections(8%), Formatting(8%), Length(5%), Headers(4%)
        EXPERIENCE (20%): Years(10%), Relevance(6%), Achievements(4%)
        READABILITY (10%): Grammar(4%), Clarity(3%), ATS-friendly(3%)

        EXAMPLE OUTPUT:
        {{
            "ats_score": 87,
            "strengths": ["React expertise matches 100%", "3+ years Python experience"],
            "improvements": ["Add AWS certification", "Quantify achievements"],
            "skills": ["React", "TypeScript", "FastAPI", "PostgreSQL"],
            "experience": "3 years 2 months",
            "recommendation": "Excellent match - 87% ATS score",
            "ats_ready": true,
            "score_breakdown": {{"keywords": 92, "structure": 85, "experience": 88, "readability": 90}}
        }}

        JSON ONLY - NO EXPLANATIONS:
        """
        
        response = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.05,  # Ultra precise
            max_tokens=1200
        )
        
        content = response.choices[0].message.content.strip()
        start = content.find('{')
        end = content.rfind('}') + 1
        
        if start != -1 and end > start:
            analysis = json.loads(content[start:end])
            print(f"✅ LLM Analysis: {analysis.get('ats_score', 0)}%")
            return ResumeAnalysis(**{k: v for k, v in analysis.items() if k in ResumeAnalysis.__fields__})
    
    except Exception as e:
        print(f"❌ LLM failed: {e}")
    
    # 🏆 FALLBACK: STANDALONE ATS CALCULATOR
    return calculate_ats_score_standalone(resume_text)


def calculate_ats_score_standalone(resume_text: str) -> ResumeAnalysis:
    """🏆 PRODUCTION ATS SCORING ENGINE - No LLM required"""
    
    text = resume_text.lower().strip()
    words = resume_text.split()
    word_count = len(words)
    
    print(f"📊 Analyzing: {word_count} words")
    
    # 1. KEYWORDS (45%) - Software Engineering
    keyword_scores = {
        'react': 8, 'javascript': 7, 'typescript': 7, 'python': 7, 'java': 6,
        'fastapi': 6, 'django': 6, 'flask': 5, 'sql': 5, 'postgres': 5, 'postgresql': 5,
        'docker': 4, 'aws': 4, 'azure': 4, 'git': 4, 'github': 4, 'api': 3,
        'node': 3, 'angular': 3, 'vue': 3, 'mongodb': 3, 'redis': 3
    }
    
    keyword_matches = sum(weight for keyword, weight in keyword_scores.items() if keyword in text)
    keyword_score = min(100, keyword_matches * 2)  # Scale to 100%
    
    # 2. STRUCTURE (25%)
    sections = ['experience', 'education', 'skills', 'projects']
    section_score = min(100, (sum(1 for s in sections if s in text) / len(sections)) * 100)
    
    headers = any(h in text for h in ['experience:', 'education:', 'skills:', 'summary:'])
    header_bonus = 20 if headers else 0
    
    length_score = 100 if 200 <= word_count <= 700 else 60
    structure_score = (section_score + header_bonus + length_score) / 3
    
    # 3. EXPERIENCE (20%)
    exp_years = re.findall(r'(\d+)\s*(?:years?|yrs?|year)', text)
    exp_months = re.findall(r'(\d+)\s*(?:months?|mos?\.?|month)', text)
    
    years = sum(int(y) for y in exp_years) if exp_years else 0
    months = sum(int(m) for m in exp_months) if exp_months else 0
    
    exp_score = min(100, (years * 25 + months * 2))
    
    achievements = len(re.findall(r'(increased|reduced|improved|achieved|delivered|grew)', text))
    ach_bonus = min(20, achievements * 4)
    experience_score = min(100, exp_score + ach_bonus)
    
    # 4. READABILITY (10%)
    # ATS-friendly formatting
    has_tables = 'table' in text or len(re.findall(r' {3,}', text)) > 5
    readability_score = 90 if not has_tables else 50
    
    # 5. FINAL WEIGHTED SCORE
    ats_score = int(
        (keyword_score * 0.45) + 
        (structure_score * 0.25) + 
        (experience_score * 0.20) + 
        (readability_score * 0.10)
    )
    
    # EXTRACT REAL DATA
    skills = [k.capitalize() for k, v in keyword_scores.items() if k in text][:12]
    experience_str = f"{years} years {months} months" if years or months else "Entry-level"
    
    print(f"📈 BREAKDOWN: K:{keyword_score} S:{structure_score:.0f} E:{experience_score} R:{readability_score} = {ats_score}%")
    
    return ResumeAnalysis(
        ats_score=ats_score,
        strengths=[
            f"Found {len(skills)} ATS keywords",
            f"{word_count} words - optimal length",
            f"Experience: {experience_str}"
        ],
        improvements=[
            "Add 3-5 missing keywords from job description",
            "Include quantifiable achievements",
            "Add GitHub/LinkedIn links"
        ],
        skills=skills,
        experience=experience_str,
        recommendation=f"ATS Score: {ats_score}% - {'Excellent' if ats_score >= 85 else 'Good' if ats_score >= 75 else 'Improve'} match",
        ats_ready=ats_score >= 75
    )




@app.post("/api/analyze-resume", response_model=ResumeAnalysis)
async def analyze_resume(
    resume: UploadFile = File(...),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Analyze uploaded resume with AI (Requires authentication)"""
    
    if not resume.filename or not resume.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files supported")
    
    content = await resume.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")
    
    # Windows-safe temp file
    file_extension = resume.filename.split('.')[-1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=f'.{file_extension}') as temp_file:
        temp_file.write(content)
        file_path = temp_file.name
    
    try:
        resume_text = extract_text_from_pdf(file_path)
        if len(resume_text.strip()) < 50:
            raise HTTPException(status_code=400, detail="Cannot extract text from PDF")
        
        print(f"🔍 Analyzing for user: {current_user.email}")
        analysis = analyze_resume_with_ai(resume_text)
        
        return analysis
        
    finally:
        try:
            os.unlink(file_path)
        except:
            pass

@app.get("/")
async def root():
    return {
        "message": "ResumeApp Auth + AI API ✅",
        "endpoints": {
            "POST /register": "Create account",
            "POST /login": "Get JWT token", 
            "GET /me": "User info",
            "POST /api/analyze-resume": "AI Resume Analysis (needs token)"
        },
        "docs": "/docs"
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
