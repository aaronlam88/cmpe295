// require modules 
import React from 'react';
import { render } from 'react-dom';
// import { Router, Route, hashHistory } from 'react-router'

// import style
import style from './style/style.css';

// components
import Button from './components/Button.jsx';
import Calendar from './components/Calendar.jsx';
import Layout from './components/Layout.jsx';
import Searchbox from './components/Searchbox.jsx';
import Table from './components/Table.jsx';
import Graph from './components/Graph.jsx';

render(
    <div className='grid-main'>
        <Graph className="grid-graph" text='grid-graph'/>
        <div className="grid-button-area">
            {/*5 winner buttons */}
            <Button className="winner-button" text='winner-button'/>
            <Button className="winner-button" text='winner-button'/>
            <Button className="winner-button" text='winner-button'/>
            <Button className="winner-button" text='winner-button'/>
            <Button className="winner-button" text='winner-button'/>
            {/*5 loser buttons */}
            <Button className="loser-button" text='loser-button'/>
            <Button className="loser-button" text='loser-button'/>
            <Button className="loser-button" text='loser-button'/>
            <Button className="loser-button" text='loser-button'/>
            <Button className="loser-button" text='loser-button'/>
        </div>
        {/* <Calendar className text='This is from Calendar'/> */}
        <Searchbox className="grid-searchbox" text='grid-searchbox'/>
        <Table className="grid-table" text='grid-table'/>
    </div>, 
    document.getElementById('app'));
