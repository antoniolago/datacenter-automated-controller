from os import path
import subprocess

from flask import jsonify
from app.util import OperationalSystemEnum, create_response, is_machine_online
from app.managers.base_manager import BaseManager 
from app.models.machines import Machines
from app import db
import os
import sys
from shared.appsettings import AppSettings
from shared.notification import send_notification

isWindows = os.name == 'nt'
if not isWindows:
    from ansible_runner import run
    from ansible.inventory.manager import InventoryManager
    from ansible.parsing.dataloader import DataLoader
    from ansible.vars.manager import VariableManager
from wakeonlan import send_magic_packet
from ping3 import ping, verbose_ping

class MachineManager(BaseManager):
    def __init__(self):
        self.appsettings = AppSettings()
        super().__init__("machine", Machines)
        
    def get(self, id, filter):
        machine = super().get(id, filter)
        return machine
    
    def get_all(self, serialize_obj=False):
        machines = super().get_all(serialize_obj)
        for m in machines:
            print(m, file=sys.stderr)
            m["isOnline"] = is_machine_online(m["host"])
        return machines
    
    def get_operational_systems(self):
        operationalSystemEnumToList = [{"id": value, "name": key} for key, value in OperationalSystemEnum.items()]
        return operationalSystemEnumToList
    
    def returns_extra_vars(self, machine, privateKeyPath=None):
        print(machine, file=sys.stderr)
        extra_vars = {'ansible_user': machine.credential.user if machine.credential.user else 'root'}
        extra_vars['ansible_password'] = machine.credential.password
        extra_vars['ansible_os_family'] = 'Windows'
        
        if machine.operationalSystemId == OperationalSystemEnum["Linux"]:
            extra_vars['ansible_connection'] = 'ssh'
            if privateKeyPath:
                extra_vars['ansible_ssh_private_key_file'] = privateKeyPath
            extra_vars['ansible_ssh_common_args'] = f'-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o IdentityFile={privateKeyPath}'
        if machine.operationalSystemId == OperationalSystemEnum["Windows"]:
            extra_vars['ansible_connection'] = 'winrm'
            extra_vars['ansible_winrm_server_cert_validation'] = 'ignore'
            extra_vars['ansible_winrm_transport'] = 'basic'
        
        return extra_vars
    
    def setup_machine(self, machine):
        inventory_data = f"""[all]\n{machine.host}"""
        r = run(
            inventory=inventory_data,
            extravars=self.returns_extra_vars(machine),
            playbook='/api/app/managers/setup_machine.yaml',
            suppress_env_files=True
        )
        if r.status == 'successful':
            return jsonify({"message": "SSH keys successfully set up"}), 200
        else:
            return jsonify({"message": "Failed to set up SSH keys"}), 500
    
    def setup_host_inventory(self, host):
        if not isWindows:
            loader = DataLoader()
            inventory = InventoryManager(loader=loader)
            inventory.add_host(host)
            return inventory, loader
        else:
            return None, None
    
    def shutdown(self, id):
        machine = self.get(id, "id")
        self.setup_machine(machine)
        inventory, loader = self.setup_host_inventory(machine.host)
        path = '/ssh/' + machine.name
        privateKeyPath = path + '/id_rsa'
        inventory_data = f"""[all]\n{machine.host}"""
        
        if not os.path.exists(path):
            os.makedirs(path)
        
        with open(privateKeyPath, 'w') as f:
            f.write(machine.credential.privateKey)
        os.chmod(privateKeyPath, 0o600)
        
        r = run(
            inventory=inventory_data,
            extravars=self.returns_extra_vars(machine, privateKeyPath),
            playbook='/api/app/managers/shutdown-playbook.yml',
            suppress_env_files=True
        )
        
        result = {
            'stats': r.stats,
            'rc': r.rc,
            'status': r.status,
            'stdout': r.stdout.read() if r.stdout else None,
            'stderr': r.stderr.read() if r.stderr else None
        }
        print(result, file=sys.stderr)
        
        if r.rc == 0:
            message = f"Machine {machine.name} shut down successfully."
            send_notification(message)
            return create_response(True, result, "Machine shutdown successfully")
        
        raise Exception(f"Error: {result['stderr']} \n {result['stdout']}")
    
    def wake_on_lan(self, id):
        machine = self.get(id, "id")
        mac_address = machine.mac
        ip_base = '.'.join(machine.host.split('.')[:-1])
        broadcast_ip = f"{ip_base}.255"
        send_magic_packet(mac_address, port=9, ip_address=broadcast_ip)
        
        message = f"Magic packet sent to {machine.name} to wake it up."
        send_notification(message)
        
        return create_response(True, None, "Magic packet sent successfully")
