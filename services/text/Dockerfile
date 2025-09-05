FROM python:3.11-slim
WORKDIR /app
COPY app.py ./
# requirements.txt をコンテナにコピー
COPY ./requirements.txt /app/requirements.txt

# requirements.txt を使してパッケージをインストール
RUN pip install --no-cache-dir -r /app/requirements.txt
CMD ["python", "app.py"]
