from api.app.managers.argument_manager import ArgumentManager
from api.app.managers.nobreak_manager import NobreakManager
from api.app.models.nobreaks import Nobreaks
from shared.appsettings import AppSettings


def test_add_nobreak_to_ups_conf():
    nobreak = Nobreaks()
    nobreak.name = "TestNobreak"
    nobreak.driver = "test_driver"
    nobreak.port = "/dev/ttyUSB0"
    nobreak.description = "Test Nobreak"
    nobreak.arguments = [
        ArgumentManager().create_argument("arg1", "value1"),
        ArgumentManager().create_argument("arg2", "value2"),
        ArgumentManager().create_argument("arg3", None)
    ]
    
    appsettings = AppSettings()
    ups_conf_path = "/path/to/ups.conf"  # Replace with the actual path to ups.conf
    
    # Call the method
    NobreakManager().add_nobreak_to_ups_conf(nobreak, ups_conf_path)
    
    # Read the ups.conf file and check if the nobreak is added correctly
    with open(ups_conf_path, "r") as f:
        lines = f.readlines()
    
    # Assert the expected lines in ups.conf
    assert f"#{nobreak.name}#S\n" in lines
    assert f"[{nobreak.name}]\n" in lines
    assert f"\tdriver = {nobreak.driver}\n" in lines
    assert f"\tport = {nobreak.port}\n" in lines
    assert f'\tdesc = "{nobreak.description}"\n' in lines
    assert f"\targ1 = value1\n" in lines
    assert f"\targ2 = value2\n" in lines
    assert f"\targ3\n" in lines
    assert f"#{nobreak.name}#E\n" in lines