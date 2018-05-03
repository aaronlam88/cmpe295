import React from 'react';
import $ from 'jquery';
import API_builder from './utilities/API_builder';
import ReactTable from "react-table";
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
            data: {},
        };

        let url = API_builder.getURLFromPrams(this.state.tableName, 
            this.state.startTime, 
            this.state.endTime);
        console.log(url);

        $.get(
            url,
        ).done((data) => {
            this.setState({ data: data });
            this.forceUpdate(); // need forceUpdate to by pass shouldUpdate
        }).fail(function (data) {
            console.log('fail');
        }).always(function (data) {
            console.log(data);
        });
    }

    // All componentWill* functions will be drop from React on v1.7
    // call before component is mounted to the dom
    // componentWillMount() {

    // }

    // when a new props is passed down from parents, 
    // this function will be call first
    // componentWillReceiveProps(nextProps) {

    // }

    // call before component update
    // componentWillUpdate(nextProps, nextState) {

    // }

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

    }

    // call after component update
    componentDidUpdate(prevProps, prevState) {

    }

    // call before component is removed from dom
    // similar to destructor in c++
    // clean up before you leave to avoid memory leak (ex: remove listenner)
    componentWillUnmount() {

    }


    // will only catch error of children, not itself
    // we can ignore this function for now
    // componentDidCatch(error, info) {

    // }

    // render the React component or html component to the dom -> draw to browser
    // should return a single component
    render() {
        let data = $.map(this.state.data, function (value, index) {
            return [value];
        });

        return (
            <div>
                <ReactTable
                    data={data}
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