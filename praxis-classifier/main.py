from fastapi import FastAPI
from routes.classify_routes import router as classify_router

app = FastAPI(title="Praxis Classifier API")

app.include_router(classify_router, prefix="/api", tags=["Classification"])

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
