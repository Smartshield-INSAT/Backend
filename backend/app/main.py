from fastapi import FastAPI, UploadFile, File
from celery.result import AsyncResult
from app.tasks import process_pcap_task

app = FastAPI()


@app.post("/upload_pcap/")
async def upload_pcap(file: UploadFile = File(...)):
    contents = await file.read()
    result = process_pcap_task.delay(contents)
    return {"task_id": result.id}


@app.get("/task_status/{task_id}")
def get_task_status(task_id: str):
    result = AsyncResult(task_id)
    return {"task_id": task_id, "status": result.status, "result": str(result.result)}
