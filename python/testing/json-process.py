import json

data = json.load(open('../../ignore/db_config.json'))

print(data['username'])
print(data['password'])