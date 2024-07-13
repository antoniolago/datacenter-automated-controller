from app import db
from app.util import *
import json
from sqlalchemy.orm import AppenderQuery, relationship
class BaseManager:
    def __init__(self, name, model):
        self.name = name
        self.model = model
        self.mapped_obj = None
        self.mapped_obj_list = []
        
    def get_all(self, serialize_obj=False):
        try:
            objs = self.model.query.all()
            if serialize_obj:
                return model_to_dict(objs)
            else:
                return objs
        except Exception as e:
            raise Exception(f"Error fetching {self.name}. Error:" + str(e))
    
    def get(self, filterValue, filterKey, serialize_obj=False):
        try:
            obj = db.session.query(self.model).filter(getattr(self.model, filterKey) == filterValue).first()
            if not obj:
                raise Exception(f"No {self.name} found with {filterKey} = {filterValue}.")
            #iobj = db.session.query(self.model).filter(getattr(self.model, filterKey) == filterValue)
            if serialize_obj:
                return create_response(True, model_to_dict(obj))
            else:
                return obj
        except Exception as e:
            raise Exception(f"Error fetching {self.name}. Error:" + str(e))
        

    def add(self, obj, commit=False):
        try:
            obj["id"] = None
            self.map_obj(obj)
            db.session.add(self.mapped_obj)
            if commit:
                db.session.commit()
            return create_response(True, message=f"{self.name} created successfully.")
        except Exception as e:
            db.session.rollback()
            raise Exception(f"Error creating {self.name}. Error:" + str(e))
        
    def update(self, obj, filterValue, filterKey, commit=False, serialize=False):
        """
        Update an object in the database that matches the given filter key and filter value with the values provided in the obj dictionary.

        Parameters:
            obj (dict): A dictionary containing the updated values to be applied to the object in the database.
            filterValue (str or int): The value to filter the database by for updating the object.
            filterKey (str): The key to filter the database by for updating the object.
            commit (bool, optional): A flag indicating whether to commit the changes to the database. Defaults to False.
            serialize (bool, optional): A flag indicating whether to return a serialized response message if the update was successful. Defaults to False.

        Returns:
            The updated object from the database as a SQLAlchemy query object or a serialized response message, if the serialize flag is set to True.

        Raises:
            Exception: If there is an error updating the object in the database.
        """
        try:
            # Map the obj dictionary to the model's columns
            self.map_obj(obj)
            # Get the filter key attribute of the model
            filterkeyModel = getattr(self.model, filterKey)
            # Create a list to hold any lists found in the obj dictionary
            lists = []
            # Iterate over a copy of the dictionary keys to avoid modifying the original while iterating
            for k in list(obj.keys()):
                v = obj[k]
                if isinstance(v, list):
                    # Add any lists found to the lists list and remove them from the obj dictionary
                    lists.append({'key': k, 'val': v})
                    del obj[k]
            # Query the database for the object to update
            sessionObj = db.session.query(self.model).filter(filterkeyModel == filterValue)
            # Set any list attributes on the updated object
            for ls in lists:
                setattr(sessionObj.first(), ls['key'], ls['val'])
            # Update the object with the values from the obj dictionary
            sessionObj.update(obj)
            # Commit the changes to the database if the commit flag is set to True
            if commit:
                db.session.commit()
            # Return the updated object from the database or a serialized response message if the serialize flag is set to True
            if serialize:
                return create_response(True, message=f"{self.name} updated successfully.")
            else:
                return sessionObj
        except Exception as e:
            # Rollback the session if an error occurs and raise an exception
            db.session.rollback()
            raise Exception(f"Error updating {self.name}. Error:" + str(e))
        
    def delete(self, filterValue, filterKey):
        try:
            filterkeyModel = getattr(self.model, filterKey)
            affectedRows = db.session.query(self.model).filter(filterkeyModel == filterValue).delete()
            if affectedRows == 0:
                raise Exception(f"No {self.name} found to delete.")
            db.session.commit()
            return create_response(True, message=f"{self.name} deleted successfully.")
        except Exception as e:
            db.session.rollback()
            raise Exception(f"Error deleting {self.name}. Error:" + str(e))
        
    def map_obj(self, obj):
        self.mapped_obj = self.model()
        for key, val in obj.items():
            if not isinstance(val, list):
                setattr(self.mapped_obj, key, val)
        self.map_inner_lists(obj)
        return self.mapped_obj

    def map_inner_lists(self, obj, list_keys=None):
        if list_keys is None:
            list_keys = obj.keys()
        for key, val in obj.items():
            # if val is None:
            #     continue
            if isinstance(val, list) and key in list_keys:
                getattr(self.mapped_obj, key).extend(val)
            elif isinstance(val, dict):
                self.map_inner_lists(self, val, list_keys)
    
    def map_obj_list(self, objList):
        if len(objList) > 0:
            for obj in objList:
                self.mapped_obj_list.append(self.map_obj(obj))
        # else:
        #     return None
        return self.mapped_obj_list