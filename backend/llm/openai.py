import openai
from openai import OpenAIError
import os

openai.api_key = ""
def generate_response(prompt, **kwargs):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0,
            max_tokens=4096,
            **kwargs
        )
        return response['choices'][0]['message']['content']
    except OpenAIError as e:
        print(f"An error occurred: {str(e)}")
        return "An error occurred while generating the response."


    
