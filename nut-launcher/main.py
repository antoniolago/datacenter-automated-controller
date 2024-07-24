from launchers.launcher import Launcher
import pathlib
import sys
import time
_parentdir = pathlib.Path(__file__).parent.parent.parent.resolve()
sys.path.insert(0, str(_parentdir))

launcher = Launcher()
while True:
    launcher.launch_upsd_if_not_running_already()
    launcher.launch_subproccess_for_each_nobreak_that_is_not_already_running()
    time.sleep(10)