from fastapi import APIRouter, UploadFile, File, Form
from services.process_routes import process_description, DescriptionInput
from services.process_routes import classify_zip as process_files
from classifier.final_score import fuse_results
from starlette.responses import JSONResponse
import asyncio

router = APIRouter()


@router.post("/evaluate")
async def evaluate(description: str = Form(...), files: UploadFile = File(...)):
    desc_task = asyncio.create_task(
        asyncio.to_thread(
            process_description, DescriptionInput(description=description)
        )
    )

    file_bytes = await files.read()
    file_task = asyncio.create_task(asyncio.to_thread(process_files, file_bytes))

    desc_result, file_result = await asyncio.gather(desc_task, file_task)

    # ✅ unwrap JSONResponse if returned
    if isinstance(desc_result, JSONResponse):
        desc_result = desc_result.body.decode("utf-8")
        import json

        desc_result = json.loads(desc_result)
    if isinstance(file_result, JSONResponse):
        file_result = file_result.body.decode("utf-8")
        import json

        file_result = json.loads(file_result)

    # now both are dicts
    final_score = fuse_results(
        desc_result, file_result, labels=["toxicity", "language", "length"]
    )

    desc_score = desc_result.get("score", 0.0)
    dataset_score = file_result.get("dataset_score", 0.0)

    unified_score = round((0.6 * dataset_score + 0.4 * desc_score), 2)

    print("Unified Score:", unified_score)
    print("Final Fused Score:", final_score)
    return {
        "description": desc_result,
        "files": file_result,
        "final": final_score,
        "unified_score": unified_score,
    }
