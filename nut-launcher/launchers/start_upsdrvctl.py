
import sys
import pathlib
_parentdir = pathlib.Path(__file__).parent.parent.parent.resolve()
sys.path.insert(0, str(_parentdir))

from shared.nut import Nut
import sys
import os

nut = Nut()
# Get the parameter from the command-line arguments
if len(sys.argv) > 1:
    nobreak_id = sys.argv[1]
    nobreak_name = sys.argv[2]
else:
    print("ERROR!")

# Use the parameter in your script
if nobreak_id is not None:
    #print(f'The parameter value is {nobreak_id}', flush=True)
    nut.start_ups_driver(nobreak_id, nobreak_name)
else:
    print('No parameter value specified', flush=True)