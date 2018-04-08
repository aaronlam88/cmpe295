// require modules 
import React from 'react'
import { render } from 'react-dom'
// import { Router, Route, hashHistory } from 'react-router'

// components
import Button from './components/Button.jsx';
import Calendar from './components/Calendar.jsx';
import Layout from './components/Layout.jsx';
import Searchbox from './components/Searchbox.jsx';
import Table from './components/Table.jsx';

render(
    <div className='grid-main'>
        <Layout className="grid-graph" text='This is from Layout'/>
        <Button className="grid-butto" text='This is from Button'/>
        {/* <Calendar className text='This is from Calendar'/>
        <Searchbox className text='This is from Searchbox'/> */}
        <Table className="grid-table" text='This is from Table'/>
    </div>, 
    document.getElementById('app'));