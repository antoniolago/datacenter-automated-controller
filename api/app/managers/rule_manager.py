from app.managers.base_manager import BaseManager
from app.models.rules import Rules
from app import db
from app.util import *

class RuleManager(BaseManager):
    def __init__(self):
        super().__init__('rule', Rules)