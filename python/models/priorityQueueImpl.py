import heapq
 
class PriorityQueueImpl:
    def __init__(self):
        self._queue = []
        self._index = 0
 
    def push(self, date, symbol, priority):
        heapq.heappush(self._queue, (-priority, self._index, symbol, date))
        self._index += 1
 
    def pop(self):
        return heapq.heappop(self._queue)

    def __len__(self):
        return len(self._queue)

    def next(self):
        """ Get all elements ordered by their priority (lowest first). """
        try:
            return self.pop()
        except IndexError:
            raise StopIteration