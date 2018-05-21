import React from 'react';
import API from './utilities/API.js';
import ReactTable from "react-table";

// import css for react-table
import "react-table/react-table.css";

class Table extends React.Component {
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
            url: API.getURLFromPrams(props.tableName, props.startTime, props.endTime),
            data: {},
        };
        API.getData(this.state.url);
    }

    // check if component should re-render
    shouldComponentUpdate(nextProps, nextState) {
        // if not a new tableName or new time range, should not update
        if (nextProps.tableName === this.state.tableName &&
            nextProps.startTime === this.state.startTime &&
            nextProps.endTime === this.state.endTime) {
            return false;
        }
        return true;
    }

    // call after component is mounted to the dom
    // add listenner here if needed
    componentDidMount() {
        window.addEventListener(this.state.url, (event) => this.dataIsReady(event));
    }

    // call after component update
    componentDidUpdate(prevProps, prevState) {

    }


    // will only catch error of children, not itself
    // we can ignore this function for now
    // componentDidCatch(error, info) {

    // }

    dataIsReady(event) {
        this.setState({
            data: event.data
        });
        this.forceUpdate();
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
                            Header: "Date",
                            accessor: "Date"
                        },
                        {
                            Header: "Open",
                            accessor: "Open"
                        },
                        {
                            Header: "High",
                            accessor: "High"
                        },
                        {
                            Header: "Low",
                            accessor: "Low"
                        },
                        {
                            Header: "Close",
                            accessor: "Close"
                        },
                        {
                            Header: "Adj Close",
                            accessor: "Adj Close"
                        },
                        {
                            Header: "Volume",
                            accessor: "Volume"
                        }
                    ]}
                    defaultPageSize={10}
                />
            </div>);
    }
}

export default Table;