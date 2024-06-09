
import sys
import pathlib
_parentdir = pathlib.Path(__file__).parent.parent.parent.resolve()
sys.path.insert(0, str(_parentdir))

from shared.nut import Nut

nut = Nut()
nut.start_upsd()