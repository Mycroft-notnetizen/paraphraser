
class PromptStore:
    prompts = [
        {
            "role": "system",
            "content": "Generates a structured prompt for the OpenAI system to paraphrase the provided text. The prompt ensures that the paraphrased text is new and plagiarism-free."
        },
        {
            "role": "user",
            "content": lambda text: f"Please paraphrase the following text, ensuring the new version is unique and free from plagiarism: {text}"
        }
    ]



