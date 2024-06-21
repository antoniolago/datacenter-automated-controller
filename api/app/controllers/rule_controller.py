from app.managers.rule_manager import RuleManager
from flask import request
from app import app

@app.route('/api/rules', methods=["GET"])
def get_rules():
    return RuleManager().get_all(True)

@app.route('/api/rule/<id>', methods=["GET"])
def get_rule(id):
    return RuleManager().get(id, "id", True)

@app.route('/api/rule', methods=["POST"])
def add_rule():
    return RuleManager().add(request.json, True)

@app.route('/api/rule', methods=["PUT", "PATCH"])
def update_rule():
    return RuleManager().update(request.json, request.json["id"], "id", True, True)

@app.route('/api/rule/<id>', methods=["DELETE"])
def delete_rule(id):
    return RuleManager().delete(id, 'id')