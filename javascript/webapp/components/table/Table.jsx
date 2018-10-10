import React from 'react';
import API from '../utilities/API.js';
import ReactTable from 'react-table';

// import css for react-table
import './Table.scss';

class Table extends React.PureComponent {
    // init setup, only call once when component is created
    // props is immutatable
    // component will change base on state
    constructor(props) {
        super(props);

        // create state from props that pass down from parent
        this.state = {
            tableName: props.tableName,
            startTime: props.startTime,
            endTime: props.endTime,

            data: {},
        };
        API.getData(props.tableName, props.startTime, props.endTime, 'dataIsReady');

        this.dataIsReady = this.dataIsReady.bind(this);
        this.symbolChange = this.symbolChange.bind(this);
    }

    // call after component is mounted to the dom
    // add listenner here if needed
    componentDidMount() {
        window.addEventListener('dataIsReady', this.dataIsReady);
        window.addEventListener('symbolChange', this.symbolChange);
    }

    // call before component is removed from dom
    // similar to destructor in c++
    // clean up before you leave to avoid memory leak (ex: remove listenner)
    componentWillUnmount() {
        window.removeEventListener('dataIsReady', this.dataIsReady);
        window.removeEventListener('symbolChange', this.symbolChange);
    }

    // call after component update
    componentDidUpdate(prevProps, prevState) {

    }

    symbolChange(event) {
        // when stock symbol change, try to get new data with data fields inside event
        // if any data field is missing from event, use current data fields from inside state
        API.getData(event.tableName || this.state.tableName, event.startTime || this.state.startTime, event.endTime || this.state.endTime, 'dataIsReady');
    }

    dataIsReady(event) {
        this.setState({
            data: event.data,
            tableName: event.tableName,
            startTime: event.startTime,
            endTime: event.endTime
        });
        event.preventDefault();
    }

    // render the React component or html component to the dom -> draw to browser
    // should return a single component
    render() {
        let data = this.state.data ? Array.from(this.state.data) : [];

        return (
            <div>
                <ReactTable
                    data={data}
                    noDataText='Loading Data ...'
                    columns={[
                        {
                            "Header": "Date",
                            "accessor": "Date"
                        },
                        {
                            "Header": "Open",
                            "id": "Open",
                            "accessor": d => {
                                return d.Open.toFixed(4);
                            }
                        },
                        {
                            "Header": "High",
                            "id": "High",
                            "accessor": d => {
                                return d.High.toFixed(4);
                            }
                        },
                        {
                            "Header": "Low",
                            "id": "Low",
                            "accessor": d => {
                                return d.Low.toFixed(4);
                            }
                        },
                        {
                            "Header": "Close",
                            "id": "Close",
                            "accessor": d => {
                                return d.Close.toFixed(4);
                            }
                        },
                        {
                            "Header": "Adj Close",
                            "id": "Adj Close",
                            "accessor": d => {
                                return d['Adj Close'].toFixed(4);
                            }
                        },
                        {
                            "Header": "Volume",
                            "accessor": "Volume"
                        }
                    ]}
                    defaultPageSize={10}
                />
            </div>);
    }
}

export default Table;