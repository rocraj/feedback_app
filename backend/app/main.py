from dotenv import load_dotenv
from fastapi import FastAPI

# Load environment variables from the .env file.
# This must happen before any configuration (like Pydantic Settings) attempts to read them.
load_dotenv() 

# Initialize the FastAPI application instance
app = FastAPI(
    title="Simple Feedback App Backend",
    version="0.1.0"
)

@app.get("/")
async def root():
    """
    Simple health check/status endpoint.
    """
    return {"message": "Hello World from FastAPI Backend"}