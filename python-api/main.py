from fastapi import FastAPI
from ollama import chat
app=FastAPI()
@app.get("/")
def home():
    return{
        "message":"python api is working!"
    }
@app.post("/generate-question")
def generate_question(data:dict):
    resposne=chat(
        model="llama3.2:3b",
        messages=[
            {
                "role":"user",
                "content":f""" 
                   generate one question based on this job description.
                   
                   job description:
                   {data["job_description"]}
                   only return the interview question.
                """
            }
        ]
    )
    return{
        "question":resposne["message"]["content"]
    }
@app.post("/evaluate-answer")
def evaluate_answer(data:dict):
    response=chat(
        model="llama3.2:3b",
        messages=[{
            "role":"user",
            "content":f""" 
            You are an experienced technical interviewer.
            
            Question:
            {data["question"]}
            
            Answer:
            {data["answer"]}
            
            Evaluate the answer.
            
            Return ONLY in this format:
            Score: <score out of 10>
            Feedback: <feedback>
            Next Question: <next interview question>
            """
        }]
    )
    return{
        "response":response["message"]["content"]
    }