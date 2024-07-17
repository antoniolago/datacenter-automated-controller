import os

class AppSettings:
    def __init__(self):
        self._settings = {}

    def _get_setting(self, key, default=None):
        if key not in self._settings:
            self._settings[key] = os.getenv(key, default)
        return self._settings[key]

    @property
    def APP_NAME(self):
        return self._get_setting("APP_NAME")

    @property
    def NUT_HOST(self):
        return self._get_setting("NUT_HOST")

    @property
    def APP_DEBUG(self):
        return self._get_setting("APP_DEBUG")

    @property
    def SOCKET_IO_UPSD_EVENT(self):
        return self._get_setting("SOCKET_IO_UPSD_EVENT")

    @property
    def SOCKET_IO_UPSDRVCTL_EVENT(self):
        return self._get_setting("SOCKET_IO_UPSDRVCTL_EVENT")

    @property
    def SOCKET_IO_RULE_APPLIER_EVENT(self):
        return self._get_setting("SOCKET_IO_RULE_APPLIER_EVENT")

    @property
    def REDIS_HOST(self):
        return self._get_setting("REDIS_HOST")

    @property
    def REDIS_PORT(self):
        return self._get_setting("REDIS_PORT")

    @property
    def REDIS_URL(self):
        return self._get_setting("REDIS_URL", 'redis://redis')

    @property
    def REDIS_UPSD_STREAM_KEY(self):
        return self._get_setting("REDIS_UPSD_STREAM_KEY")

    @property
    def REDIS_UPSDRVCTL_STREAM_KEY(self):
        return self._get_setting("REDIS_UPSDRVCTL_STREAM_KEY")

    @property
    def REDIS_RULE_APPLIER_STREAM_KEY(self):
        return self._get_setting("REDIS_RULE_APPLIER_STREAM_KEY")

    @property
    def UPS_CONF_PATH(self):
        return self._get_setting('UPS_CONF_PATH', "/nut/ups.conf")

    @property
    def SQLALCHEMY_DATABASE_URI(self):
        return self._get_setting('DATABASE_URL', 'sqlite:///' + os.path.join(os.path.abspath(os.path.dirname(__file__)), 'datacenter-automated-controller.db').replace("shared", "api"))

    @property
    def SQLALCHEMY_TRACK_MODIFICATIONS(self):
        return False

    @property
    def JSON_SORT_KEYS(self):
        return False

    @property
    def DISCORD_WEBHOOK_URL(self):
        return self._get_setting("DISCORD_WEBHOOK_URL")

    @property
    def SMTP_HOST(self):
        return self._get_setting("SMTP_HOST")

    @property
    def SMTP_USER(self):
        return self._get_setting("SMTP_USER")

    @property
    def SMTP_PASSWORD(self):
        return self._get_setting("SMTP_PASSWORD")

    @property
    def SMTP_USE_SSL(self):
        return self._get_setting("SMTP_USE_SSL") == "true"

    @property
    def EMAILS_TO_SEND_ALERTS(self):
        return self._get_setting("EMAILS_TO_SEND_ALERTS")
    
    @property
    def NOTIFY_TYPE(self):
        return self._get_setting("NOTIFY_TYPE", "discord")
    
    @property
    def REDIS_CHANGE_NOBREAK_CONFIG_EVENT(self):
        return self._get_setting("REDIS_CHANGE_NOBREAK_CONFIG_EVENT")