from launchers.launcher import Launcher
import time

launcher = Launcher()
while True:
    launcher.launch_upsd_if_not_running_already()
    launcher.launch_subproccess_for_each_nobreak_that_is_not_already_running()
    time.sleep(10)