var LRU = require("lru-cache")
var options = {
    max: 20, 
    dispose: function (key, n) { n = null; }
}
var cache = new LRU(options)

module.exports = cache;
