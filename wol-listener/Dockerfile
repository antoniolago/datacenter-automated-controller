FROM python:3.8-slim
WORKDIR /app
RUN pip install wakeonlan

COPY main.py /app/main.py

ENTRYPOINT ["python", "/app/main.py"]