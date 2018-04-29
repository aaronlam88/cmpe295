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

render(
    <div className='grid-main'>
        <Table className="grid-table" text='grid-table'/>
    </div>, 
    document.getElementById('app'));
