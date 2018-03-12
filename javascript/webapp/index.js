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
    <div>
        <Layout text='This is from Layout'/>
        <Button text='This is from Button'/>
        <Calendar text='This is from Calendar'/>
        <Searchbox text='This is from Searchbox'/>
        <Table text='This is from Table'/>
    </div>, 
    document.getElementById('app'));