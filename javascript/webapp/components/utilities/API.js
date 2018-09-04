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
        if (host === 'localhost') {
            host = '54.176.230.26';
        }
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
     * get data from backend server or local storage
     * will call jQueryGet, will do window.dispatchEvent(url)
     * to get the data, use window.addEventListener(url, (event) => (event.data))
     * @param {string} url 
     */
    getData(url, eventID) {
        this.jQueryGet(url, eventID)
    },

    /**
     * get data from backend server using jQuery get or local cache with localStorage
     * will call $.get, will do window.dispatchEvent(url)
     * to get the data, use window.addEventListener(url, (event) => (event.data))
     * @param {string} url 
     */
    jQueryGet(url, eventID) {
        $.get(
            url,
        ).done((data) => {
            console.info('success')
        }).fail(() => {
            console.error('fail');
        }).always((data) => {
            let event = new Event(eventID);
            event.data = data;
            window.dispatchEvent(event);
        });
    }
}

export default API;
