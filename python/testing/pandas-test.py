import matplotlib.pyplot as plt
import datetime
import pandas as pd

yhoo = DataReader("yhoo", "yahoo", datetime.datetime(2007, 1, 1), 
    datetime.datetime(2012,1,1))

top = plt.subplot2grid((4,4), (0, 0), rowspan=3, colspan=4)
top.plot(yhoo.index, yhoo["Close"])
plt.title('Yahoo Price from 2007 - 2012')

bottom = plt.subplot2grid((4,4), (3,0), rowspan=1, colspan=4)
bottom.bar(yhoo.index, yhoo['Volume'])
plt.title('Yahoo Trading Volume')

plt.gcf().set_size_inches(15,8)


mavg = yhoo['30_MA_Open'] = pd.stats.moments.rolling_mean(yhoo['Open'], 30)
yhoo['30_MA_Open'].tail() 

mavg = yhoo['30_MA_Open'] = pd.stats.moments.rolling_mean(yhoo['Open'], 30)
yhoo['30_MA_Open'].tail() 