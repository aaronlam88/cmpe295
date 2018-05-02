import React from 'react';
import $ from 'jquery';
import ReactTable from "react-table";
import "react-table/react-table.css";

class Table extends React.Component {
    // init setup, only call once when component is created
    // props is immutatable
    // component will change base on state
    constructor(props) {
        super(props);
        this.state = {
            text: props.text,
            data: {},
        };

        $.get(
            "http://54.219.174.5:9081/Stocks/AMD/2009-01-02/2018-01-02",
        ).done( (data) => {
            this.setState({data: data});
        }).fail(function (data) {
            console.log('fail');
        }).always(function (data) {
            console.log(data);
        });
    }

    // call before component is mounted to the dom
    componentWillMount() {

    }

    // call after component is mounted to the dom
    // add listenner here if needed
    componentDidMount() {
        
    }

    // when a new props is passed down from parents, 
    // this function will be call first
    componentWillReceiveProps(nextProps) {

    }

    // check if component should re-render
    // ignore from now
    // shouldComponentUpdate(nextProps, nextState) {

    // }

    // call before component update
    componentWillUpdate(nextProps, nextState) {

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
        let data = $.map(this.state.data, function(value, index) {
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