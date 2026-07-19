from fastapi import FastAPI;
from dotenv import load_dotenv;
from google import genai;
import os;
import json;
load_dotenv("../backend/.env")
app=FastAPI()
client=genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
@app.get("/")
def home():
    return{
        "message":"python api is working!"
    }
@app.post("/generate-question")
def generate_question(data:dict):
    response=client.models.generate_content(
        model="gemini-3.5-flash",
        contents=f"""
                   generate one question based on this job description.
                   
                   job description:
                   {data["job_description"]}
                   only return the interview question.
                """
    )
    return{
        "question":response.text
    }
@app.post("/evaluate-answer")
def evaluate_answer(data: dict):
    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents=f"""
You are an experienced technical interviewer.

Question:
{data["question"]}

Answer:
{data["answer"]}

Evaluate the answer.

Return ONLY valid JSON in this format:

{{
    "score": <integer>,
    "feedback": "<feedback>",
    "next_question": "<generate a completely new interview question>"
}}

Do not include any extra text.
"""
)

    return json.loads(response.text)

@app.post("/final-report")
def final_report(data: dict):
    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents=f"""
You are an experienced technical interviewer.

Here is the complete interview history:

{data["history"]}

Based on all the answers, provide:

1. Overall Score (out of 10)
2. Strengths
3. Weaknesses
4. Suggestions for Improvement

Return the report in a neat format.
"""
)

    return {
        "report": response.text
    }