var LRU = require("lru-cache");
var options = {
    max: 100,
    length: function (n, key) {
        return n * 2 + key.length
    },
    dispose: function (key, n) {
        n.close()
    },
    maxAge: 1000 * 60 * 60
};

var cache = LRU(options);

module.exports = cache;