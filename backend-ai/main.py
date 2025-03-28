from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
import openai
from datetime import datetime

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="Sprunt AI API")

# Configure OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

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
        
        # Call OpenAI API
        response = await openai.ChatCompletion.acreate(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an AI Scrum Master. Generate a concise daily standup summary focusing on progress, blockers, and next steps."},
                {"role": "user", "content": context}
            ]
        )
        
        return {
            "summary": response.choices[0].message.content,
            "timestamp": datetime.now().isoformat()
        }
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
        
        response = await openai.ChatCompletion.acreate(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an AI Task Manager. Generate relevant tasks based on sprint goals and recent commits."},
                {"role": "user", "content": context}
            ]
        )
        
        # Parse the AI response into structured tasks
        # This is a simplified example - you'd want more robust parsing
        tasks = []
        for line in response.choices[0].message.content.split('\n'):
            if line.strip().startswith('-'):
                tasks.append(Task(
                    id=str(len(tasks) + 1),
                    title=line.strip('- '),
                    description="",
                    status="TODO",
                    priority="MEDIUM"
                ))
        
        return tasks
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
        
        response = await openai.ChatCompletion.acreate(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an AI Analytics Expert. Analyze team velocity and provide insights."},
                {"role": "user", "content": context}
            ]
        )
        
        return {
            "analysis": response.choices[0].message.content,
            "timestamp": datetime.now().isoformat()
        }
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
        
        response = await openai.ChatCompletion.acreate(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an AI Process Analyst. Identify bottlenecks in the development process."},
                {"role": "user", "content": context}
            ]
        )
        
        return {
            "bottlenecks": response.choices[0].message.content,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
