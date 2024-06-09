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