from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.api.routes import auth, meter, forecast, recommendations

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SOLIX API",
    description="AI-Powered Energy Intelligence Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://solix-black.vercel.app",
        "https://solix-updated.vercel.app",  # add your actual URL here
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(meter.router)
app.include_router(forecast.router)
app.include_router(recommendations.router)

@app.get("/")
def root():
    return {"message": "SOLIX API is running", "version": "1.0.0"}

@app.get("/health")
def health():
    return {"status": "healthy"}
