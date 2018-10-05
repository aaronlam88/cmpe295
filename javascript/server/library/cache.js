var LRU = require("lru-cache")
var options = {
    max: 20, 
    dispose: function (key, n) { n = null; }
}
var cache = LRU(options)

module.exports = cache;
