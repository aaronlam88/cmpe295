// require modules
import React from 'react';
import { render } from 'react-dom';
import moment from 'moment';
import {
    Grid,
    Row,
    Col,
} from 'react-bootstrap';
// import { Router, Route, hashHistory } from 'react-router'

// import style
import './style/newStyle.css';

// components
import Calendar from './components/calendar/Calendar.jsx';
import Searchbox from './components/searchBox/SearchBox.jsx';
import Table from './components/table/Table.jsx';
import StockChart from './components/chart/StockChart.jsx'
// import Graph from './components/graph/Graph.jsx';
// import Button from './components/button/Button.jsx';

let date = new Date();
document.getElementById("currentDate").innerHTML = date;

// default: when start, get the last 30 days of data, and tableName=GOOG
let defaultValue = {
    tableName: 'GOOG',
    endTime: moment().format('YYYY-MM-DD').toString(),
    startTime: moment().subtract(30, 'days').format('YYYY-MM-DD').toString()
};

class TableComponent extends React.Component {
    render() {
        return (
            <div>
                <Grid fluid>
                    <Row>
                        <Col sm={12} md={12} lg={5} className="customCalendar">
                            <Calendar />
                        </Col>
                        <Col sm={12} md={12} lg={7} className="customSearch">
                            <Searchbox
                                {...defaultValue}
                            />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}


class StockChartComponent extends React.Component {
    render() {
        return (
            <div>
            <StockChart className="line-chart"
                        {...defaultValue}
            />
            <Table className="grid-table"
                   {...defaultValue}
            />
            </div>
    );
    }
}

render(
    <TableComponent />,
    document.getElementById('app')
);

render(
    <StockChartComponent />,
    document.getElementById('stockChart')
);
