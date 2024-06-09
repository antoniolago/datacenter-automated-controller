FROM python:3.7.16-alpine3.16
WORKDIR /app
ENV PYTHONPATH=/shared:$PYTHONPATH

RUN apk update && apk add nut openssh

#SSH CLIENT KEYS
COPY ./ssh/* /root/.ssh/
RUN chmod 600 /root/.ssh/id_rsa

RUN pip install --upgrade pip
COPY ./requirements.txt ./requirements.txt
RUN pip install -r requirements.txt

# ENTRYPOINT [ "tail", "-f", "/dev/null" ]
ENTRYPOINT ["python", "main.py"]