FROM python:3.11-slim
WORKDIR /app
COPY app.py ./
RUN pip install --no-cache-dir gradio>=4.50.0
CMD ["python", "app.py"]
