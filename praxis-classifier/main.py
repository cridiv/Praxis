from fastapi import FastAPI
from routes.classify_routes import router as classify_router
from routes.evaluate_routes import router as evaluate_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Praxis Classifier API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(classify_router, prefix="/api", tags=["Classification"])
app.include_router(evaluate_router, prefix="/api", tags=["Evaluation"])

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
