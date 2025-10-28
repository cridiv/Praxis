from fastapi import APIRouter, UploadFile, File
from services.process_routes import evaluate_description
from services.process_routes import evaluate_files
from pydantic import BaseModel

router = APIRouter()


class DescriptionInput(BaseModel):
    description: str


@router.post("/classify")
async def classify_zip_route(file: UploadFile = File(...)):
    file_bytes = await file.read()
    return evaluate_files(file_bytes)


@router.post("/description")
async def description_route(data: DescriptionInput):
    return evaluate_description(data)
