from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from services.process_routes import (
    evaluate_description,
    evaluate_files,
    combine_results,
)
from starlette.responses import JSONResponse
import asyncio
import traceback

router = APIRouter()


@router.post("/evaluate")
async def evaluate(description: str = Form(...), files: UploadFile = File(...)):
    """
    Handles concurrent evaluation of both description and ZIP dataset,
    then fuses results into a unified response with robust error handling.
    """
    print("/evaluate route has been hit")

    try:
        # Read file safely
        try:
            file_bytes = await files.read()
            if not file_bytes:
                raise ValueError("Uploaded file is empty or unreadable.")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"File read error: {e}")

        # Run description and file evaluations concurrently
        desc_task = asyncio.to_thread(evaluate_description, description)
        file_task = asyncio.to_thread(evaluate_files, file_bytes)

        try:
            desc_result, file_result = await asyncio.gather(desc_task, file_task)
        except Exception as e:
            traceback.print_exc()
            raise HTTPException(
                status_code=500, detail=f"Error in evaluation tasks: {str(e)}"
            )

        # Ensure results are valid dicts
        if not isinstance(desc_result, dict):
            raise TypeError(
                "Invalid response from evaluate_description() — expected dict."
            )
        if not isinstance(file_result, dict):
            raise TypeError("Invalid response from evaluate_files() — expected dict.")

        # Combine results safely
        try:
            final_output = combine_results(desc_result, file_result)
        except Exception as e:
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"Fusion error: {str(e)}")
        return JSONResponse(final_output)

    except HTTPException as e:
        # Pass-through FastAPI-style errors
        raise e

    except Exception as e:
        # Fallback for unexpected issues
        traceback.print_exc()
        raise HTTPException(
            status_code=500, detail=f"Unexpected server error: {str(e)}"
        )
