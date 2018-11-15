// require modules
import React from 'react';
import { render } from 'react-dom';
import moment from 'moment';
import {
    Grid,
    Row,
    Col,
} from 'react-bootstrap';
// import ReactFontFace from 'react-font-face'

// import { Router, Route, hashHistory } from 'react-router'

// import style
import './style/newStyle.css';

// components
import Calendar from './components/calendar/Calendar.jsx';
import Searchbox from './components/searchBox/SearchBox.jsx';
import Table from './components/table/Table.jsx';
import StockChart from './components/chart/StockChart.jsx';
import PredictionTable from './components/table/PredictionTable.jsx';
import PredictionCalendar from './components/calendar/PredictionCalendar.jsx';
import PredictionSearchBox from './components/searchBox/PredictionSearchBox.jsx';
import PredictionStockChart from './components/chart/PredictionStockChart.jsx';
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

class SearchBarComponent extends React.PureComponent {
    render() {
        return (
            <Grid fluid>
                <Row>
                    <Col sm={12} md={12} lg={5} className="customCalendar">
                        <Calendar
                            {...defaultValue}
                        />
                    </Col>
                    <Col sm={12} md={12} lg={7} className="customSearch">
                        <Searchbox
                            {...defaultValue}
                        />
                    </Col>
                </Row>
            </Grid>
        );
    }
}

class PredictionSearchBarComponent extends React.PureComponent {
    render() {
        return (
            <Grid fluid>
                <Row>
                    <Col sm={12} md={12} lg={5} className="customCalendar">
                        <PredictionCalendar
                            {...defaultValue}
                        />
                    </Col>
                    <Col sm={12} md={12} lg={7} className="customSearch">
                        <PredictionSearchBox
                            {...defaultValue}
                        />
                    </Col>
                </Row>
            </Grid>
        );
    }
}


class StockChartComponent extends React.PureComponent {
    render() {
        return (
            <StockChart className="line-chart"
                {...defaultValue}
            />
        );
    }
}

class PredictionStockChartComponent extends React.PureComponent {
    render() {
        return (
            <PredictionStockChart className="line-chart"
                        {...defaultValue}
            />
        );
    }
}

class StockTableComponent extends React.PureComponent {
    render() {
        return (
            <Table className="grid-table"
                {...defaultValue}
            />
        )
    }
}

class PredictionComponent extends React.PureComponent {
    render() {
        return (
            <PredictionTable />
        )
    }
}

render(
    <SearchBarComponent />,
    document.getElementById('SearchBar')
);

render(
    <StockChartComponent />,
    document.getElementById('StockChart')
);

render(
    <StockTableComponent />,
    document.getElementById('StockTable')
);
