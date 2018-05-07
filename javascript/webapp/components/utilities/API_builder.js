import moment from 'moment';

const API_builder = {
    getURLFromPrams(tableName, startTime, endTime) {
        let host = 'http://' + window.location.hostname;
        let port = '9081';
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

        return `${host}:${port}/${resource}/${tableName}/${startTime}/${endTime}`;
    },

    // getURLFromPrams(tableName, startTime, endTime) {
    //     let host = 'http://54.219.174.5';
    //     let port = '9081';
    //     let format = 'YYYY-MM-DD';
        
    //     if (!tableName) {
    //         throw new Error({ API_ERROR: 'Missing tableName' });
    //     }
    //     if (!moment(startTime).format(format)) {
    //         startTime = 0;
    //     }
    //     if (!moment(endTime).format(format)) {
    //         endTime = moment().format('YYYY-MM-DD');
    //     }

    //     return `${host}:${port}?tableName=${tableName}&startTime=${startTime}&endTime=/${endTime}`;
    // }
}

export default API_builder;