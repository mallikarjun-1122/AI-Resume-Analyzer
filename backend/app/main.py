from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.jd import router as jd_router
from app.routes.upload import router as upload_router
from app.routes.match import router as match_router
from app.routes.analyze import router as analyze_router
app = FastAPI(
    title="AI Resume Analyzer API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://ai-resume-analyzer-tan-xi.vercel.app",
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(upload_router)
app.include_router(jd_router)
app.include_router(match_router)
app.include_router(analyze_router)

@app.get("/")
def root():
    return {
        "status": "success",
        "message": "AI Resume Analyzer Backend is Running 🚀"
    }