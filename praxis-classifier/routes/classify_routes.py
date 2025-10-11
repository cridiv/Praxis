from fastapi import APIRouter, UploadFile, File
from services.process_routes import process_description
from services.process_routes import classify_zip as classify_zip_service
from pydantic import BaseModel

router = APIRouter()


class DescriptionInput(BaseModel):
    description: str


@router.post("/classify")
async def classify_zip_route(file: UploadFile = File(...)):
    file_bytes = await file.read()
    return classify_zip_service(file_bytes)


@router.post("/description")
async def description_route(data: DescriptionInput):
    return process_description(data)
