from shared.api import Api

class Machine:
    def __init__(self, machine):
        self.id = machine.id
        self.name = machine.name
        self.description = machine.description
        self.isOnline = machine.isOnline
        self.ip = machine.ip
        self.mac = machine.mac
        self.operationalSystemId = machine.operationalSystemId
        self.nobreakId = machine.nobreakId

        self.ruleId = machine.ruleId
        self.rule = machine.rule

        self.credentialId = machine.credentialId
        self.credential = machine.credential

    def shutdown(self):
        Api().post("/machine/shutdown", {"id": self.id})
        
    def wake_on_lan(self):
        Api().post("/machine/wake_on_lan", {"id": self.id})
        
    def apply_rule(self):
        rule = self.rule
        humidity, temperature = Api().get("/sensor")
        isTemperatureOk = temperature < rule.temperature
        isHumidityOk = humidity < rule.humidity
        shouldShutdown = ((not isTemperatureOk or not isHumidityOk) or \
                          rule.chargeToShutdown > self.batteryCharge) and \
                          self.isOnline
        shouldWakeOnLan = not self.isOnline and rule.chargeToWol > self.batteryCharge
        # or rule.forceOnline
        if shouldShutdown:
            self.shutdown()
        elif shouldWakeOnLan:
            self.wake_on_lan()