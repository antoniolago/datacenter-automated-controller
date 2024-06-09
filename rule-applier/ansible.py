from ansible_runner import run
from ansible.inventory.manager import InventoryManager
from ansible.parsing.dataloader import DataLoader
from ansible.vars.manager import VariableManager

# Define your host list and parameters
my_hosts = ['host1', 'host2']
my_parameters = {'param1': 'value1', 'param2': 'value2'}

# Create a DataLoader and InventoryManager to dynamically create the inventory
loader = DataLoader()
inventory = InventoryManager(loader=loader, sources='')

# Add the hosts to the inventory
for host in my_hosts:
    inventory.add_host(host)

# Create a VariableManager and set the parameters
variable_manager = VariableManager(loader=loader, inventory=inventory)
variable_manager.extra_vars = my_parameters

# Define the path to your playbook
playbook_path = '/path/to/playbook.yml'

# Run the playbook using Ansible Runner
r = run(
    private_data_dir='/path/to/private/data/dir',
    inventory=inventory,
    variable_manager=variable_manager,
    playbook=playbook_path
)

# Print the results
print(r.stats)