# get config to connect to database
import json

data = json.load(open('../../javascript/server/ignore/db_config.json'))

import mysql.connector

config = {
  'user': data['username'],
  'password': data['password'],
  'host': data['host'],
  'database': data['database'],
  'raise_on_warnings': True,
}

cnx = mysql.connector.connect(**config)
cursor = cnx.cursor()

query = ("SELECT * FROM SP500.AAP WHERE Date <=  %s and Date >= %s;")
start_date =  '2018-02-08' 
end_date = '2018-02-01'

cursor.execute(query, (start_date, end_date))

for rows in cursor:
    print(rows)

cnx.close()
