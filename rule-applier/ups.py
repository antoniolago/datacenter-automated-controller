from sympy import false
from ansible.inventory.manager import InventoryManager
from ansible.parsing.dataloader import DataLoader
from ansible.vars.manager import VariableManager
from ansible_runner import run
from classes.api import Api

class Ups:
    def __init__(self, ups):
        self.id = ups.id
        self.name = ups.name
        self.driver = ups.driver
        self.description = ups.description
        self.arguments = ups.arguments
        self.machines = ups.machines
        self.rule = ups.rule
        self.outputVoltage = ups.outputVoltage
        self.inputVoltage = ups.inputVoltage
        self.batteryVoltage = ups.batteryVoltage
        self.batteryCharge = ups.batteryCharge
        self.load = ups.load

    def apply_rule_to_machines(self):
        for machine in self.machines:
            self.apply_rule(Machine(machine))
    
    def apply_rule(self, machine):
        rule = machine.rule

        humidity, temperature = Api().get("/sensor")
        isTemperatureOk = temperature < rule.temperature
        isHumidityOk = humidity < rule.humidity
        shouldShutdown = ((not isTemperatureOk or not isHumidityOk) or \
                          rule.chargeToShutdown > self.batteryCharge) and \
                          machine.isOnline
        shouldWakeOnLan = not machine.isOnline and rule.chargeToWol > self.batteryCharge
        # or rule.forceOnline
        if shouldShutdown:
            machine.shutdown()
        elif shouldWakeOnLan:
            machine.wake_on_lan()