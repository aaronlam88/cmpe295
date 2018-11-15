import csv
import urllib.request
import codecs

class GetData:
    def getData(self, tableName, startDate, endDate):
        url = 'http://54.176.230.26:8081/Stocks/#TABLE/#STARTDATE/#ENDDATE'
        url = url.replace('#TABLE', tableName)
        url = url.replace('#STARTDATE', startDate)
        url = url.replace('#ENDDATE', endDate)
        ftpstream = urllib.request.urlopen(url)
        csvfile = csv.reader(codecs.iterdecode(ftpstream, 'utf-8'))
        return csvfile