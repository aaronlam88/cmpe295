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
            submittedValue: props.tableName
        };

        this._startTime = props.startTime;
        this._endTime = props.endTime;

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.timeChange = this.timeChange.bind(this);
    }

    // call after component is mounted to the dom
    // add listenner here if needed
    componentDidMount() {
        window.addEventListener('timeChange', this.timeChange);
    }

    // call after component update
    componentDidUpdate(prevProps, prevState) {

    }

    // call before component is removed from dom
    // similar to destructor in c++
    // clean up before you leave to avoid memory leak (ex: remove listenner)
    componentWillUnmount() {
        window.removeEventListener('timeChange', this.timeChange);
    }

    timeChange(event) {
        this._startTime = event.startTime || this._startTime;
        this._endTime = event.endTime || this._endTime;
        event.preventDefault();
    }

    handleChange(event) {
        this.setState({
            value: event.target.value,
        });
        event.preventDefault();
    }

    handleSubmit(event) {
        event.preventDefault();
        let newEvent = new Event('symbolChange');
        newEvent.startTime = this._startTime;
        newEvent.endTime = this._endTime;
        newEvent.tableName = this.state.value;
        window.dispatchEvent(newEvent);
        this.setState({ submittedValue: this.state.value });
    }


    // render the React component or html component to the dom -> draw to browser
    // should return a single component
    render() {
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