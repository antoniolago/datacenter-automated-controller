import os 
from classes.api import Api
from ups import Ups

def return_instantiated_ups_list(upsList):
    instantiatedUpsList = []
    for ups in upsList:
        instantiatedUpsList.append(Ups(ups))
    return instantiatedUpsList

print("Instantiating Api...")
api = Api()

print("Instantiating Upsses...")
upsList = return_instantiated_ups_list(api.get("/nobreaks"))

for ups in upsList:
    print("Applying rules to " + ups.name + "...")
    ups.apply_rules()