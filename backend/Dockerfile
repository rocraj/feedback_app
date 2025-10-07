FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Environment variables
ENV PYTHONUNBUFFERED=1 \
    PORT=8000 \
    HOST=0.0.0.0 \
    POSTGRES_USER=postgres \
    POSTGRES_DB=feedback_db \
    POSTGRES_HOST=cloudsql-proxy \
    CORS_ORIGINS=https://feedback-mini.web.app,http://localhost:5173,http://localhost:3000 \
    FRONTEND_URL=https://feedback-mini.web.app

# Expose the port
EXPOSE 8000

# Run the application with uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
