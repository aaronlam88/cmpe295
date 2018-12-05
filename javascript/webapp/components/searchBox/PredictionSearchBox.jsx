import React from 'react';
import predictionAPI from '../utilities/predictionAPI.js';
import API from '../utilities/API.js';
import { Grid, Row, Col, } from 'react-bootstrap';

// import style
import './SearchBox.scss';

/**
 * SearchBox is React.PureComponent which control the data of the page
 * Since we will only get new data when user hits the search button
 * it's better to call predictionAPI.getData here
 */
class PredictionSearchBox extends React.PureComponent {
    // init setup, only call once when component is created
    // props is immutatable
    // component will change base on state
    constructor(props) {
        super(props);
        this.state = {
            value: props.tableName,
            submittedValue: props.tableName
        };
        // take startTime endTime out of the state, and set as private internal variables
        // reason: avoid re-render the searchbox when Calender change state
        this._startTime = props.startTime;
        this._endTime = props.endTime;

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.timeChange = this.timeChange.bind(this);
    }

    // call after component is mounted to the dom
    // add listenner here if needed
    componentDidMount() {
        predictionAPI.getData(this.state.value, this._startTime, this._endTime, 'predictDataIsReady');
        API.getData(this.state.value, this._startTime, this._endTime, 'realDataIsReady');
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
            value: event.target.value.toUpperCase(),
        });
        event.preventDefault();
    }

    handleSubmit(event) {
        predictionAPI.getData(this.state.value, this._startTime, this._endTime, 'predictDataIsReady');
        API.getData(this.state.value, this._startTime, this._endTime, 'realDataIsReady');
        this.setState({ submittedValue: this.state.value });
        event.preventDefault();
    }


    // render the React component or html component to the dom -> draw to browser
    // should return a single component
    render() {
        return (
            <div className="mySearch">
                <form onSubmit={this.handleSubmit}>
                    <Grid id="searchBar" fluid>
                        <Row className="show-grid">
                            <Col xs={12} md={5} className="centerItem singleCol">
                                <label id="currStock" htmlFor="stockInput">Current Stock: <span className="purpleColor">{this.state.submittedValue}</span></label>
                            </Col>
                            <Col xs={12} md={4} className="singleCol">
                                <input
                                    id="stockInput"
                                    className="predictionInput"
                                    name="stockInput"
                                    type="text"
                                    placeholder="Search for..."
                                    alt="inputVal"
                                    ref={input => this.search = input}
                                    value={this.state.value}
                                    onChange={this.handleChange}
                                />
                            </Col>
                            <Col xs={12} md={3} className="singleCol">
                                <input id="subBtn" type="submit" value="Search" className="predictionSearchBtn" />
                            </Col>
                        </Row>
                    </Grid>
                </form>
            </div>
        );
    }
}

export default PredictionSearchBox;