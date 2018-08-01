# get config to connect to database
import json
import mysql.connector


class MySQLConnector:
    "Singleton"
    
    instance = None

    class MySQLConnectorSingleton:
        "Inner Class"
        def __init__(self, config_path):
            data = json.load(open(config_path))
            config = {
                'user': data['username'],
                'password': data['password'],
                'host': data['host'],
                'database': data['database'],
                'raise_on_warnings': True,
            }
            self.connect = mysql.connector.connect(**config)
            self.val = None
    
    def __new__(cls, config_path): # __new__ always a classmethod
        if not MySQLConnector.instance:
            MySQLConnector.instance = MySQLConnector.MySQLConnectorSingleton(config_path)
        return MySQLConnector.instance
        