import React from 'react';
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

        this.dataIsReady = this.dataIsReady.bind(this);
    }

    // call after component is mounted to the dom
    // add listenner here if needed
    componentDidMount() {
        window.addEventListener('dataIsReady', this.dataIsReady);
    }

    // call before component is removed from dom
    // similar to destructor in c++
    // clean up before you leave to avoid memory leak (ex: remove listenner)
    componentWillUnmount() {
        window.removeEventListener('dataIsReady', this.dataIsReady);
    }

    // call after component update
    componentDidUpdate(prevProps, prevState) {

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
            <ReactTable className="currTable"
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
        );
    }
}

export default Table;