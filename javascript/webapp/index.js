// require modules 
import React from 'react';
import { render } from 'react-dom';
// import { Router, Route, hashHistory } from 'react-router'

// import style
import style from './style/style.css';

// components
// import Button from './components/Button.jsx';
// import Calendar from './components/Calendar.jsx';
// import Layout from './components/Layout.jsx';
// import Searchbox from './components/Searchbox.jsx';
import Table from './components/Table.jsx';
// import Graph from './components/Graph.jsx';

var d = new Date();
document.getElementById("currentDate").innerHTML = d;

render(
    <div className='grid-main'>
        <Table className="grid-table"
            tableName='GOOG'
            startTime='2012-01-02'
            endTime='2013-01-02'
        />
    </div>, 
    document.getElementById('app'));
