from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
from groq import Groq
from datetime import datetime
from fastapi.responses import StreamingResponse
import json

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="Sprunt AI API")

# Initialize Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class Commit(BaseModel):
    sha: str
    message: str
    author: str
    date: datetime

class PullRequest(BaseModel):
    number: int
    title: str
    description: str
    state: str
    author: str
    created_at: datetime

class Task(BaseModel):
    id: str
    title: str
    description: str
    status: str
    priority: str
    assignee: Optional[str] = None

class Sprint(BaseModel):
    id: str
    name: str
    start_date: datetime
    end_date: datetime
    goals: List[str]
    tasks: List[Task]

async def generate_with_groq(system_prompt: str, user_prompt: str):
    """Helper function to generate streaming responses using Groq"""
    try:
        completion = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=1,
            top_p=1,
            stream=True,
            stop=None,
        )
        
        async def generate():
            for chunk in completion:
                if chunk.choices[0].delta.content:
                    yield f"data: {json.dumps({'content': chunk.choices[0].delta.content})}\n\n"
        
        return StreamingResponse(
            generate(),
            media_type="text/event-stream"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Groq API error: {str(e)}")

@app.post("/api/standup")
async def generate_standup(commits: List[Commit], pull_requests: List[PullRequest]):
    """Generate a daily standup summary based on commits and PRs"""
    try:
        # Prepare context for the AI
        context = f"""
        Generate a daily standup summary based on the following information:
        
        Commits:
        {[f"- {c.message} by {c.author}" for c in commits]}
        
        Pull Requests:
        {[f"- #{pr.number}: {pr.title} ({pr.state})" for pr in pull_requests]}
        """
        
        # Return streaming response
        return await generate_with_groq(
            "You are an AI Scrum Master. Generate a concise daily standup summary focusing on progress, blockers, and next steps.",
            context
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/tasks/generate")
async def generate_tasks(commits: List[Commit], sprint: Sprint):
    """Generate tasks based on commits and sprint goals"""
    try:
        context = f"""
        Generate tasks based on the following information:
        
        Sprint Goals:
        {[f"- {goal}" for goal in sprint.goals]}
        
        Recent Commits:
        {[f"- {c.message}" for c in commits]}
        """
        
        return await generate_with_groq(
            "You are an AI Task Manager. Generate relevant tasks based on sprint goals and recent commits.",
            context
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analytics/velocity")
async def analyze_velocity(sprints: List[Sprint]):
    """Analyze team velocity and generate insights"""
    try:
        context = f"""
        Analyze team velocity based on the following sprints:
        
        {[f"Sprint {s.id}: {len(s.tasks)} tasks" for s in sprints]}
        """
        
        return await generate_with_groq(
            "You are an AI Analytics Expert. Analyze team velocity and provide insights.",
            context
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analytics/bottlenecks")
async def detect_bottlenecks(tasks: List[Task], pull_requests: List[PullRequest]):
    """Detect bottlenecks in the development process"""
    try:
        context = f"""
        Analyze potential bottlenecks based on:
        
        Tasks:
        {[f"- {t.title} ({t.status})" for t in tasks]}
        
        Pull Requests:
        {[f"- #{pr.number}: {pr.title} ({pr.state})" for pr in pull_requests]}
        """
        
        return await generate_with_groq(
            "You are an AI Process Analyst. Identify bottlenecks in the development process.",
            context
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
