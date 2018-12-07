import os
import sys

# get_data_block_start
from get_data import GetData
from save_data import SaveData
from get_prediction_data import GetPredictionData
from priorityQueueImpl import PriorityQueueImpl
from save_top_5_and_last_5 import SaveRank

getData = GetData()
saveData = SaveData()
getPredictionData = GetPredictionData()
saveRank = SaveRank()

symbols = getData.getAllSymbols()

map = {'date': 0, 'open': 1, 'high': 2, 'low': 3, 'close': 4, 'adjClose': 5, 'volume': 6}
prediction_map = {'Date': 0, 'DTree': 1, 'SVM': 2, 'SGDLinear': 3, 'SGDRegression': 4, 'LASSORegression': 5}

dates = getPredictionData.getAllDates()

for date in dates:

    #save every stock's increase rate in PriorityQueueImpl, use -1 * increased_rate so that we can save data in decending order#
    q = PriorityQueueImpl()
    date_for_close_price = date[0].strftime("%Y-%m-%d")
    date_for_prediction_price = date[0].strftime("%Y-%m-%d 00:00:00")

    for symbol in symbols:
        close_price = getData.getSymbolClosePrice(symbol, date_for_close_price)
        prediction_price = getPredictionData.getSymbolsPredictionClosePrice(symbol, date_for_prediction_price)
        if len(prediction_price) != 0 and len(close_price) != 0:
            if prediction_price[0][0] is not None and close_price[0][0] is not None:
                difference = prediction_price[0][0] - close_price[0][0]
                if close_price[0][0] != 0:
                    increased_rate = difference / close_price[0][0]
                    q.push(date, symbol, increased_rate, difference)

    last5 = q.getLast5()
    rank = len(last5)
    for val in last5:
        saveRank.saveTop5AndBottom5(str(date_for_close_price), str(val[2]), str(val[0]), rank, str(val[4]), "bottom5")
        rank = rank - 1

    top5 = q.getTop5()
    count = 1
    for obj in top5:
        saveRank.saveTop5AndBottom5(str(date_for_close_price), str(obj[2]), str(-1 * obj[0]), count, str(obj[4]), "top5")
        count = count + 1
    



