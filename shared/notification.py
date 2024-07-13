import os
import smtplib
from email.mime.text import MIMEText
import sys
import requests
from shared.appsettings import AppSettings

appsettings = AppSettings()

def send_discord_webhook(message):
    webhook_url = appsettings.DISCORD_WEBHOOK_URL
    if webhook_url:
        data = {"content": message}
        response = requests.post(webhook_url, json=data)
        return response.status_code

def send_email(subject, message):
    from_email = appsettings.SMTP_USER
    smtp_server = appsettings.SMTP_HOST
    email_password = appsettings.SMTP_PASSWORD
    to_email = appsettings.EMAILS_TO_SEND_ALERTS
    
    if from_email and smtp_server and email_password and to_email:
        msg = MIMEText(message)
        msg['Subject'] = subject
        msg['From'] = from_email
        msg['To'] = to_email

        try:
            with smtplib.SMTP(smtp_server) as server:
                server.login(from_email, email_password)
                server.sendmail(from_email, [to_email], msg.as_string())
            return True
        except Exception as e:
            print(f"Failed to send email: {e}", file=sys.stderr)
            return False

def send_notification(message):
    notify_type = appsettings.NOTIFY_TYPE
    
    if notify_type == "discord":
        send_discord_webhook(message)
    elif notify_type == "email":
        send_email("Notification", message)
    elif notify_type == "both":
        send_discord_webhook(message)
        send_email("Notification", message)
