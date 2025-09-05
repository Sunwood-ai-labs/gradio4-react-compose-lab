FROM python:3.11-slim
WORKDIR /app
COPY app.py ./
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*
# requirements.txt をコンテナにコピー
COPY ./requirements.txt /app/requirements.txt

# requirements.txt を使してパッケージをインストール
RUN pip install --no-cache-dir -r /app/requirements.txt

CMD ["python", "app.py"]
