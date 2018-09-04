// require modules 
import React from 'react';
import { render } from 'react-dom';
// import { Router, Route, hashHistory } from 'react-router'

// import style
import style from './style/style.css';

// components
import Calendar     from './components/calendar/Calendar.jsx';
import Searchbox    from './components/searchBox/SearchBox.jsx';
import Table        from './components/table/Table.jsx';
// import Graph from './components/graph/Graph.jsx';
// import Button from './components/button/Button.jsx';


var d = new Date();
var s = "Today is ";
document.getElementById("currentDate").innerHTML = s + d;

render(
    <div className='grid-main'>
        <div className="sear_calen">
            <Calendar />
            <Searchbox />
        </div>
        <Table className="grid-table"
            tableName='GOOG'
            startTime='2012-01-02'
            endTime='2013-01-02'
        />
    </div>,
    document.getElementById('app'));
