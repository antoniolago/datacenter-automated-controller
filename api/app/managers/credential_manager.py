from app.managers.base_manager import BaseManager
from app.models.credentials import Credentials
from app import db
from app.util import *

class CredentialManager(BaseManager):
    def __init__(self):
        super().__init__('credential', Credentials)