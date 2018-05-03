var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = require('jquery')(window);

console.log('==== benchmark get api ====');
console.time('jquery');
$.get(
    "http://54.219.174.5:8081/Stocks/AAL/2009-01-02/2018-01-02",
).done(function (data) {
    console.log(data.length);
}).fail(function (data) {
    console.log('fail');
}).always(function (data) {
    console.timeEnd('jquery');
    console.log('==== end ====');
});
console.log('\x1b[31m', 'Note: jquery is async, so this line may print before end msg', '\x1b[0m');