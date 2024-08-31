import openai
import supabase
import os
from docx import Document
import PyPDF2
from pathlib import Path
from dotenv import load_dotenv
from numpy import dot
import numpy as np
from numpy.linalg import norm
from typing import List, Dict, Any, Tuple
from postgrest.exceptions import APIError

openai.api_key = ""

class VectorStore:
    def __init__(self) -> None:
        """Initialize the VectorStore with API keys and Supabase client."""
        load_dotenv()
       
        self.supabase_client = supabase.create_client(os.getenv('supabase_url'), os.getenv('supabase_key'))

    def generate_embedding(self, text: str) -> List[float]:
        """Generate an embedding for the given text using OpenAI."""
        response = openai.Embedding.create(
            model="text-embedding-ada-002",
            input=text
        )
        embedding = response['data'][0]['embedding']
        return embedding

    def save_embedding_to_db(self, title: str, text: str, embedding: List[float]) -> None:
        """Save the embedding to the database."""
        data = {
            "title": title,
            "body": text,
            "embedding": embedding
        }
        response = self.supabase_client.table('documents').insert(data).execute()
        print(response)

    def extract_text(self, file_path: Path) -> str:
        """Extract text from the given file path."""
        if not file_path.is_file():
            raise FileNotFoundError(f"No file found at {file_path}")

        extension = file_path.suffix
        if extension == '.txt':
            with open(file_path, 'r') as file:
                return file.read()
        elif extension == '.docx':
            doc = Document(file_path)
            return '\n'.join([para.text for para in doc.paragraphs])
        elif extension == '.pdf':
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = []
                for page in pdf_reader.pages:
                    text.append(page.extract_text())
                return '\n'.join(text)
        else:
            raise ValueError(f"Unsupported file type: {extension}")

    def create_store_embedding(self, file: Path) -> tuple[str , str] :
        """Create and store an embedding for the text extracted from the given file."""
        text = self.extract_text(file)
        print(text)
        embedding = self.generate_embedding(text)
        response = self.save_embedding_to_db(file.stem, text, embedding)
        return text , response
    
    @staticmethod
    def string_to_float_list(embedding_str):
        # Remove brackets and split the string into components
        embedding_str = embedding_str.strip('[]')
        embedding_list = [float(num) for num in embedding_str.split(',')]
        return embedding_list
        
    def semantic_search(self, query_embedding: List[float], threshold: float = 0.3) -> List[Dict[str, Any]]:
        """Perform a semantic search for embeddings above the given threshold."""
        results = self.supabase_client.table('documents').select("*").execute()
        print(f"Query embeddings type " , type(query_embedding))
        print(f"DB embeddings type " , type(results.data[0].get('embedding')))
        db_embedding = results.data[0].get('embedding')
        db_embedding = self.string_to_float_list(db_embedding)
        print(f"DB embeddings type after conversion " , type(db_embedding))
        # filtered_results = [result for result in results if self.cosine_similarity(query_embedding, results.data[0].get('embedding')) > threshold]
        filtered_results = [result for result in results if self.cosine_similarity(query_embedding, db_embedding) > threshold]
        return filtered_results
    
    

    def hybrid_search(self, query_text: str, threshold: float = 0.3) -> List[Dict[str, Any]]:
        """Perform a hybrid search using text and semantic search."""
        query_embedding = self.generate_embedding(query_text)
        return self.semantic_search(query_embedding, threshold)

    @staticmethod
    def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
        """Calculate the cosine similarity between two vectors."""
        return dot(vec1, vec2) / (norm(vec1) * norm(vec2))