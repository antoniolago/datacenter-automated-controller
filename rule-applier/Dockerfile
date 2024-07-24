FROM python:3.7.16-alpine3.16
WORKDIR /app
ENV PYTHONPATH=/shared:$PYTHONPATH

RUN pip install --upgrade pip
COPY ./requirements.txt ./requirements.txt
RUN pip install -r requirements.txt

# ENTRYPOINT [ "tail", "-f", "/dev/null" ]
CMD ["python", "/rule-applier/main.py"]