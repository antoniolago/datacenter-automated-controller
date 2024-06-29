from os import path
import subprocess
from app.managers.base_manager import BaseManager 
from app.models.machines import Machines
from app import db
import os
from app.util import *
isWindows = os.name == 'nt'
if not isWindows:
    from ansible_runner import run
    from ansible.inventory.manager import InventoryManager
    from ansible.parsing.dataloader import DataLoader
    from ansible.vars.manager import VariableManager
from wakeonlan import send_magic_packet

class MachineManager(BaseManager):
    def __init__(self):
        super().__init__("machine", Machines)
        
    def get(self, id, filter):
        machine = super().get(id, filter)
        # machine.isOnline = is_machine_online(machine["ip"], 22)
        return machine
    
    def get_all(self, serialize_obj=False):
        machines = super().get_all(serialize_obj)
        # print(machines)
        for m in machines:
            print(m, file=sys.stderr)
            m["isOnline"] = is_machine_online(m["host"])
        return machines
    
    def get_operational_systems(self):
        # Transforming the dictionary into a list of dictionaries
        operationalSystemEnumToList = [{"id": value, "name": key} for key, value in OperationalSystemEnum.items()]
        return operationalSystemEnumToList
    
    def returns_extra_vars(self, machine, privateKeyPath = None):
        print(machine, file=sys.stderr)
        extra_vars = {'ansible_user': machine.credential.user if machine.credential.user else 'root'}
        # if machine.credential.password:
        extra_vars['ansible_password'] = machine.credential.password
        extra_vars['ansible_os_family'] = 'Windows'
        # extra_vars['ansible_port'] = machine.credential.sshPort if machine.credential.sshPort else 22
        # extra_vars['ansible_ssh_private_key_file'] = privateKeyPath
        #Create operational systems enum:
        # 1 = Linux
        # 2 = Windows
        #
        if machine.operationalSystemId == OperationalSystemEnum["Linux"]:
            extra_vars['ansible_connection'] = 'ssh'
            if privateKeyPath:
                extra_vars['ansible_ssh_private_key_file'] = privateKeyPath
            extra_vars['ansible_ssh_common_args'] = f'-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o IdentityFile={privateKeyPath}'
        if machine.operationalSystemId == OperationalSystemEnum["Windows"]:
            extra_vars['ansible_connection'] = 'winrm'
            extra_vars['ansible_winrm_server_cert_validation'] = 'ignore'
            extra_vars['ansible_winrm_transport'] = 'basic'
        # extra_vars['ansible_winrm_scheme'] = 'http'
        return extra_vars
    
    def setup_ssh(self, machine):
        inventory_data = f"""[all]\n{machine.host}"""
        r = run(
            # private_data_dir='/api/data',
            inventory=inventory_data,
            extravars=self.returns_extra_vars(machine),
            playbook='/api/app/managers/setup_ssh.yaml',
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
        self.setup_ssh(machine)
        inventory, loader = self.setup_host_inventory(machine.host)
        path = '/ssh/'+machine.name
        privateKeyPath = path+'/id_rsa'
        inventory_data = f"""[all]\n{machine.host}"""
        # Create a VariableManager and set the parameters for the current host
        # variable_manager = VariableManager(loader=loader, inventory=inventory)
        # variable_manager.extra_vars = self.returns_auth_vars(machine, path)
        #Create machine name folder if it doesn't exis
        if not os.path.exists(path):
            os.makedirs(path)
        # print(f'creds : {machine.credential.publicKey}', file=sys.stderr) 
        # with open(publicKeyPath, 'w') as f:
        #     f.write(machine.credential.publicKey)
        with open(privateKeyPath, 'w') as f:
            f.write(machine.credential.privateKey)
        #set private key to 0644
        os.chmod(privateKeyPath, 0o600)
        # Run the playbook using Ansible Runner for the current host
        print(f'Running playbook for {machine.host}', file=sys.stderr)
        r = run(
            # private_data_dir='/api/data',
            inventory=inventory_data,
            extravars=self.returns_extra_vars(machine, privateKeyPath),
            playbook='/api/app/managers/shutdown-playbook.yml',
            # ssh_key=machine.credential.privateKey,
            # verbosity=15,
            suppress_env_files=True
            # timeout=10
        )
        print(f'Results for {machine.host}:', file=sys.stderr)
        result = {
            'stats': r.stats,
            'rc': r.rc,
            'status': r.status,
            'stdout': r.stdout.read() if r.stdout else None,
            'stderr': r.stderr.read() if r.stderr else None
        }
        print(result, file=sys.stderr)
        if(r.rc == 0):
            return create_response(True, result, "Machine shutdown successfully")
        if(r.rc > 0):
            raise Exception(f"Error: {r.stderr.read()} \n {r.stdout.read()}")
        return result


    # def wake_on_lan(self, id):
    #     machine = self.get(id, "id")
    #     shellCommand = f"echo {machine.mac} | nc host.docker.internal 18888"
    #     #exec shellCommand
    #     os.system(shellCommand)
    #     return create_response(True, None, "Magic packet sent successfully")
    def wake_on_lan(self, id):
        machine = self.get(id, "id")
        mac_address = machine.mac
        ip_base = '.'.join(machine.host.split('.')[:-1])
        broadcast_ip = f"{ip_base}.255"
        send_magic_packet(mac_address, port=9, ip_address=broadcast_ip)
        return create_response(True, None, "Magic packet sent successfully")