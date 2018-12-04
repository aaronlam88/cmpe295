import heapq
 
class PriorityQueueImpl:
    def __init__(self):
        self._queue_top = []
        self._queue_bottom = []
        self._index = 0
 
    def push(self, date, symbol, priority, difference):
        heapq.heappush(self._queue_top, (-priority, self._index, symbol, date, difference))
        heapq.heappush(self._queue_bottom, (priority, self._index, symbol, date, difference))
        self._index += 1
 
    def popBiggest(self):
        return heapq.heappop(self._queue_top)

    def popSmallest(self):
        return heapq.heappop(self._queue_bottom)

    def __len__(self):
        return len(self._queue_top)
 
    def getLast5(self):
        last5 = []
        limit = 5
        if len(self._queue_bottom) < 5:
            limit = len(self._queue_bottom)

        for i in range (0, limit):
            last5.append(self.popSmallest())
        return last5

    def getTop5(self):
        top5 = []
        limit = 5
        if len(self._queue_top) < 5:
            limit = len(self._queue_top)

        for i in range (0, limit):
            top5.append(self.popBiggest())
        return top5