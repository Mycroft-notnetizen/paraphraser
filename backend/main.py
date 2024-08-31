from fastapi import FastAPI, Request, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from common.models import HealthResponse
from preprocessing.paraphrasing import analysis
from dotenv import load_dotenv


from PyPDF2 import PdfReader
import io


load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/paraphrase")
async def paraphrase(
    file: UploadFile = File(None),
    text: str = Form(None),
):

    print(f"File: {file}, Text: {text}")
    text_to_process = ''

    if file:
        content = await file.read()
        if file.content_type == 'application/pdf':
            # Process PDF file
            pdf_reader = PdfReader(io.BytesIO(content))
            text_to_process = ""
            for page in pdf_reader.pages:
                text_to_process += page.extract_text()
        elif file.content_type == 'text/plain':
            # Process TXT file
            text_to_process = content.decode('utf-8')
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type")

    if not text_to_process:
        text_to_process = text

    if not text_to_process:
        raise HTTPException(status_code=400, detail="No text or file provided")


    paraphrased_text = analysis(text_to_process)

    return {"original": text_to_process, "paraphrased": paraphrased_text}


@app.get("/health")
async def health_check():
    return HealthResponse(alive=True)


