FROM alpine:3.17.2
#RUN echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories
RUN apk update
RUN apk add --no-cache nut openssh-server
RUN mkdir -p /var/run/nut
VOLUME ["/sys/fs/cgroup"]
#SSH INSTALL
COPY ./ssh/ /keys/
RUN mkdir -p /root/.ssh \
    && chmod 0700 /root/.ssh \
    && cat /keys/id_rsa.pub >> /root/.ssh/authorized_keys \
    #&& echo "$ssh_pub_key" > /root/.ssh/authorized_keys \
    && apk add openrc openssh \
    && ssh-keygen -A \
    && echo -e "PasswordAuthentication no" >> /etc/ssh/sshd_config \
    #&& echo -e "Host *\n  StrictHostKeyChecking=no" >> /etc/ssh/ssh_config \
    && mkdir -p /run/openrc \
    && touch /run/openrc/softlevel \
    && chown nut /var/run/nut
#RUN mkdir /var/run/nut && chown root:nut /var/run/nut && chmod 770 /var/run/nut
#ENTRYPOINT ["tail", "-f", "/dev/null"]
ENTRYPOINT ["sh", "-c", "rc-status; rc-service sshd start; service sshd restart; tail -f /dev/null;"]
#ENTRYPOINT ["sh", "-c", "rc-status; rc-service sshd start; service sshd restart; rc-service nut-upsd start; tail -f /dev/null;"]
#ENTRYPOINT ["upsd", "-F"]
#ENTRYPOINT ["python", "script/main.py"]