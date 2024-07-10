
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
        #if outputVoltage is None, assign it NOne
        try:
            self.outputVoltage = ups['outputVoltage']
        except:
            self.outputVoltage = None
        #Make the same for others:
        try:
            self.inputVoltage = ups['inputVoltage']
        except:
            self.inputVoltage = None
        try:
            self.batteryVoltage = ups['batteryVoltage']
        except:
            self.batteryVoltage = None
        try:
            self.batteryCharge = ups['batteryCharge']
        except:
            self.batteryCharge = None
        try:
            self.load = ups['load']
        except:
            self.load = None
        

    def instantiate_machines(self, ups):
        for machine in ups['machines']:
            self.machines.append(Machine(machine))
    