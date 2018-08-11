# get config to connect to database
import json
import mysql.connector

# use this to save data, so we don't have to keep getting data from database
import pickle

class GetData:
    def __init__(self):
        self._data = getData()
    
    @property
    def data(self):
        return self._data
    
    def getData(self):
        
    




dataCount = 1000
data

try:
    print('[INFO] Trying to load data', file=sys.stderr)
    data = pickle.load(open('data.save', 'rb'))
except Exception as e:
    print('[ERROR] Unable to load data, getting data from database', file=sys.stderr)
    print(e, file=sys.stderr)

    configData = json.load(open('../../ignore/db_config.json'))
    config = {
        'user': configData['username'],
        'password': configData['password'],
        'host': configData['host'],
        'database': configData['database'],
        'raise_on_warnings': True,
        'buffered': True
    }
    cnx = mysql.connector.connect(**config)
    cursor = cnx.cursor()

    # data column |Date|Open|High|Low|Close|CloseAdj|Volumn|

    # first try to get all the tables we have in our database
    allTables = []
    query = """SELECT Symbol FROM 4update ORDER BY Symbol;"""
    cursor.execute(query)

    try:
        result = cursor.fetchall()
        for row in result:
            allTables.append(row[0])
    except Exception as e:
        print('[ERROR] unable to fecth data', file=sys.stderr)
        print(e, file=sys.stderr)

    # get learn date
    data = {}
    for table in allTables:
        data[table] = []
        query = """SELECT * FROM `%s` ORDER BY Date DESC LIMIT %s;""" % (
            table, dataCount)
        cursor.execute(query)
        try:
            # just printing something so we know it's working
            print('          ', end='\r', file=sys.stderr)
            print(table, end='\r', file=sys.stderr)
            # save result
            result = cursor.fetchall()
            i = 0
            for row in result:
                temp = []
                temp.append(row[0].strftime("%Y%m%d"))
                temp.extend(row[1:])
                data[table].append(temp)
        except:
            print('[ERROR] Something wrong', file=sys.stderr)
            print(e, file=sys.stderr)

    print('          ', end='\r', file=sys.stderr)
    print('\n[DONE] get data: ' + str(len(data)), file=sys.stderr)

    # since we get all the data, we can close the cursor now
    cursor.close()
    # save all the data we get to local storage
    pickle.dump(data, open("data.save", "wb"))