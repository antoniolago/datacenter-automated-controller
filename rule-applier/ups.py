
from machine import Machine
def return_instantiated_ups_list(upsList):
    instantiatedUpsList = []
    for ups in upsList:
        instantiatedUpsList.append(Ups(ups))
    return instantiatedUpsList
class Ups:
    def __init__(self, ups):
        #transform to dict so we can access the properties
        self.id = ups['id']
        self.name = ups['name']
        self.driver = ups['driver']
        self.description = ups['description']
        self.arguments = ups['arguments']
        self.machines = []
        self.rule = ups['rule']
        self.instantiate_machines(ups)
        #self.outputVoltage = ups['outputVoltage']
        #self.inputVoltage = ups['inputVoltage']
        #self.batteryVoltage = ups['batteryVoltage']
        #self.batteryCharge = ups['batteryCharge']
        #self.load = ups['load']

    def instantiate_machines(self, ups):
        for machine in ups['machines']:
            self.machines.push(Machine(machine))
    