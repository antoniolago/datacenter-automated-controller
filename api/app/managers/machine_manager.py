from os import path
from app.managers.base_manager import BaseManager 
from app.models.machines import Machines
from app import db
import os
from app.util import *
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
    
    def returns_auth_vars(self, machine, path):
        print(machine, file=sys.stderr)
        auth_vars = {'ansible_user': machine.credential.user if machine.credential.user else 'root'}
        # if machine.credential.password:
            # auth_vars['ansible_password'] = machine.credential.password
        auth_vars['ansible_ssh_private_key_file'] = path
        # if machine.operationalSystemId == 2:
        #     auth_vars['ansible_connection'] = 'winrm'
        #     auth_vars['ansible_winrm_server_cert_validation'] = 'ignore'
        return auth_vars

    def shutdown(self, id):
        machine = self.get(id, "id")
        loader = DataLoader()
        inventory_data = f"""
        [all]
        {machine.host}
        """
        inventory = InventoryManager(loader=loader, sources=[inventory_data])
        inventory.add_host(machine.host)
        path = '/ssh/keys/'+machine.name
        publicKeyPath = path+'/id_rsa.pub'
        privateKeyPath = path+'/id_rsa'
        # os.remove(publicKeyPath)
        # os.remove(privateKeyPath)
        # Create a VariableManager and set the parameters for the current host
        variable_manager = VariableManager(loader=loader, inventory=inventory)
        # variable_manager.extra_vars = self.returns_auth_vars(machine, path)
        #Create machine name folder if it doesn't exis
        if not os.path.exists(path):
            os.makedirs(path)
        with open(publicKeyPath, 'w') as f:
            f.write(machine.credential.publicKey)
        with open(privateKeyPath, 'w') as f:
            f.write(machine.credential.privateKey)
        # Run the playbook using Ansible Runner for the current host
        r = run(
            private_data_dir='/api/data',
            inventory=inventory_data,
            extravars=self.returns_auth_vars(machine, privateKeyPath),
            playbook='/api/app/managers/shutdown-playbook.yml'
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
        # os.remove(path)
        if(r.rc == 0):
            return create_response(True, result, "Machine shutdown successfully")
        if(r.rc > 0):
            raise Exception(f"Error: {r.stderr.read()} \n {r.stdout.read()}")
        return result


    def wake_on_lan(self, id):
        machine = self.get(id, "id")
        send_magic_packet(machine["mac"])