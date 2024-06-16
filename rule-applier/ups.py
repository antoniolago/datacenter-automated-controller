from ansible.inventory.manager import InventoryManager
from ansible.parsing.dataloader import DataLoader
from ansible.vars.manager import VariableManager
from ansible_runner import run

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
            Machine(machine).apply_rule()
    