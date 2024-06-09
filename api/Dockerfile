FROM python:3.7.16-alpine3.16
WORKDIR /api
ENV PYTHONPATH=/shared:$PYTHONPATH

RUN apk update && apk add nut gcc musl-dev libffi-dev

RUN pip install --upgrade pip
COPY ./requirements.txt ./requirements.txt
RUN pip install -r requirements.txt
# RUN pip3 install Adafruit_DHT --global-option="--force-pi"
ENTRYPOINT ["python", "main.py"]
#ENTRYPOINT ["python", "-m", "flask", "--app", "main.py", "--debug", "run", "--host", "0.0.0.0"]
#ENTRYPOINT [ "tail", "-f", "/dev/null" ]
#python -m flask --app app.py --debug run --host 0.0.0.0