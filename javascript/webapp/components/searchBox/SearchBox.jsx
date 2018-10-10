import React from 'react';
import API from '../utilities/API.js';

// import style
import './SearchBox.scss';

class SearchBox extends React.PureComponent {
    // init setup, only call once when component is created
    // props is immutatable
    // component will change base on state
    constructor(props) {
        super(props);
        this.state = {
            value: props.tableName,
        };

        this._startTime = props.startTime;
        this._endTime = props.endTime;

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        if (props.tableName !== state.tableName ||
            props.startTime !== state.startTime ||
            props.endTime !== state.endTime) {
            return props;
        } else {
            return null;
        }
    }

    // call after component is mounted to the dom
    // add listenner here if needed
    componentDidMount() {
        window.addEventListener('table', (event) => this.dataIsReady(event));
        window.addEventListener('time', (event) => this.updateTime(event));
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
        });
        event.preventDefault();
    }

    updateTime(event) {
        this._startTime = event.startTime;
        this._endTime = event.endTime;
        event.preventDefault();
    }

    handleChange(event) {
        this.setState({
            value: event.target.value
        });
    }

    handleSubmit(event) {
        console.debug('SearchBox.handleSubmit');
        API.getData(this.state.value, this._startTime, this._endTime, 'table');
        event.preventDefault();
    }

    // render the React component or html component to the dom -> draw to browser
    // should return a single component
    render() {
        return (
            <div className="mySearch">
                <form onSubmit={this.handleSubmit}>
                    <section className="flex_search">
                        <div className="searchArea">
                            <input type="text"
                                placeholder="Search for..."
                                alt="inputVal"
                                ref={input => this.search = input}
                                value={this.state.value}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className="searchBtn">
                            <input type="submit" value="Search" />
                        </div>
                    </section>
                </form>
            </div>);
    }
}

export default SearchBox;