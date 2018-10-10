import $ from 'jquery';
import moment from 'moment';

/**
 * an API to get data
 */
const API = {
    /**
     * create an URL to get data from the backend server
     * @param {String} tableName the name of the stock symbol
     * @param {String} startTime from time in YYYY-MM-DD
     * @param {String} endTime to time in YYYY-MM-DD
     */
    getURLFromPrams(tableName, startTime, endTime) {
        let host = window.location.hostname;
        let port = '8081';
        let resource = 'Stocks'
        let format = 'YYYY-MM-DD';

        if (!tableName) {
            throw new Error({ API_ERROR: 'Missing tableName' });
        }
        if (!startTime ||
            !startTime.length === 0 ||
            !moment(startTime).format(format)) {
            startTime = moment().add(-1, 'days').format(format);
        }
        if (!endTime ||
            !endTime.length === 0 ||
            !moment(endTime).format(format)) {
            endTime = moment().format(format);
        }

        // for dev
        if (host === 'localhost' || host === '0.0.0.0') {
            host = '54.176.230.26';
        }

        // save params
        this.tableName = tableName;
        this.startTime = startTime;
        this.endTime = endTime;

        return `http://${host}:${port}/${resource}/${tableName}/${startTime}/${endTime}`;
    },

    /**
     * get data from backend server or local storage
     * will call jQueryGet, will do window.dispatchEvent(url)
     * to get the data, use window.addEventListener(url, (event) => (event.data))
     * @param {string} tableName name of the table (stock symbol)
     * @param {string} startTime start time for this query
     * @param {string} endTime   end time for this query
     * @param {string} eventID   an ID will be emitted when got data
     */
    getData(tableName, startTime, endTime, eventID) {
        let url = this.getURLFromPrams(tableName, startTime, endTime);
        this.jQueryGet(url, eventID)
    },

    /**
     * get data from backend server using jQuery get or local cache with localStorage
     * will call $.get, will do window.dispatchEvent(url)
     * to get the data, use window.addEventListener(url, (event) => (event.data))
     * @param {string} url 
     */
    jQueryGet(url, eventID) {
        // if query the cached data, return cache without calling get
        // this is client side cache, so make cache simple and small--> cache size = 1
        if (this.url && this.url === url && this.data) {
            let event = new Event(eventID);
            event.tableName = this.tableName;
            event.startTime = this.startTime;
            event.endTime = this.endTime;
            event.data = this.data;
            window.dispatchEvent(event);
            console.debug('hit cache');
            return;
        }

        $.get(
            url,
        ).done((data) => {
            console.debug('success')
        }).fail(() => {
            console.error('fail');
        }).always((data) => {
            this.data = data; // cache data
            let event = new Event(eventID);
            event.tableName = this.tableName;
            event.startTime = this.startTime;
            event.endTime = this.endTime;
            event.data = this.data;
            window.dispatchEvent(event);
        });
    }
}

export default API;
