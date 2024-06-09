from app.managers.base_manager import BaseManager
from app.models.arguments import Arguments
from app import db
from app.util import *

class ArgumentManager(BaseManager):
    def __init__(self):
        super().__init__('argument', Arguments)
        