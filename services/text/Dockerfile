FROM python:3.11-slim
WORKDIR /app
COPY app.py ./
RUN pip install --no-cache-dir "gradio==4.19.2"
CMD ["python", "app.py"]
