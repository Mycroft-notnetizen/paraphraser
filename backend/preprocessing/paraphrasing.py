from llm.openai import generate_response
from store.prompts import PromptStore

def analysis(text):
    prompt_store = PromptStore()

    analysis_text = prompt_store.prompts[1]["content"](text)
    
    return generate_response(analysis_text)
