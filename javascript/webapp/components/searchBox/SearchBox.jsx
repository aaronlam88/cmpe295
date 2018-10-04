import React from 'react';
import API from '../utilities/API.js';

// import style
import './SearchBox.scss';

// const ChildrenComponent = ({ value }) => (
//     <div>Current Stock: {value}</div>
// );


class SearchBox extends React.PureComponent {
    // init setup, only call once when component is created
    // props is immutatable
    // component will change base on state
    constructor(props) {
        super(props);
        this.state = {
            value: props.tableName,
            startTime: props.startTime,
            endTime: props.endTime,
            submittedValue: 'GOOG',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        if (props.tableName !== state.tableName ||
            props.startTime !== state.startTime ||
            props.endTime !== state.endTime) {

            API.getData(props.tableName, props.startTime, props.endTime, 'table');
            return props;
        } else {
            return null;
        }
    }

    // call after component is mounted to the dom
    // add listenner here if needed
    componentDidMount() {
        window.addEventListener('table', (event) => this.dataIsReady(event));
    }

    // call after component update
    componentDidUpdate(prevProps, prevState) {

    }

    // call before component is removed from dom
    // similar to destructor in c++
    // clean up before you leave to avoid memory leak (ex: remove listenner)
    componentWillUnmount() {

    }

    dataIsReady(event) {
        this.setState({
            value: event.tableName,
            startTime: event.startTime,
            endTime: event.endTime
        });
    }

    handleChange(event) {
        this.setState({
            value: event.target.value,
        });
    }

    handleSubmit(event) {
        API.getData(this.state.value, this.state.startTime, this.state.endTime, 'table');
        event.preventDefault();
        this.setState({ submittedValue: this.state.value });
    }


    // render the React component or html component to the dom -> draw to browser
    // should return a single component
    render() {
        console.log(" to " + this.state.endTime);
        return (
            <div className="mySearch">
                <form onSubmit={this.handleSubmit}>
                    <section className="flex_search">
                        <div className="searchArea">
                            <label id="currStock" htmlFor="stockInput">Current Stock: {this.state.submittedValue}</label>
                            {/*<ChildrenComponent value={this.state.submittedValue} id="currStock"/>*/}
                            <input
                                id="stockInput"
                                name="stockInput"
                                type="text"
                                placeholder="Search for..."
                                alt="inputVal"
                                ref={input => this.search = input}
                                value={this.state.value}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div>
                            <input type="submit" value="Search" className="searchBtn" />
                        </div>
                    </section>
                </form>
            </div>);
    }
}

export default SearchBox;