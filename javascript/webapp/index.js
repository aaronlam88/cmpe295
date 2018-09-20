// require modules 
import React from 'react';
import { render } from 'react-dom';
import moment from 'moment';
// import { Router, Route, hashHistory } from 'react-router'

// import style
import './style/style.css';

// components
import Calendar from './components/calendar/Calendar.jsx';
import Searchbox from './components/searchBox/SearchBox.jsx';
import Table from './components/table/Table.jsx';
// import Graph from './components/graph/Graph.jsx';
// import Button from './components/button/Button.jsx';


let date = new Date();
document.getElementById("currentDate").innerHTML = date;

// default: when start, get the last 30 days of data, and tableName=GOOG
let defaultValue = {
    tableName: 'GOOG',
    endTime: moment().format('YYYY-MM-DD').toString(),
    startTime: moment().subtract(30, 'days').format('YYYY-MM-DD').toString()
}

render(
    <div className='grid-main'>
        <div className="sear_calen">
            <Calendar />
            <Searchbox
                {...defaultValue}
            />
        </div>
        <Table className="grid-table"
            {...defaultValue}
        />
    </div>,
    document.getElementById('app'));
