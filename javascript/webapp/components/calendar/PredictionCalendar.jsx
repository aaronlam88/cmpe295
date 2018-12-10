import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { formatDate, parseDate } from 'moment';
import DayPickerInput from 'react-day-picker/DayPickerInput';


// import style
import './Calendar.scss';

export default class PredictionCalendar extends React.PureComponent {
    constructor(props) {
        super(props);
        let from = new Date(props.startTime);
        let to = new Date(props.endTime);
        to.setDate(to.getDate() + 1);
        this.state = {
            from: from,
            to: to,
        };

        this.handleFromChange = this.handleFromChange.bind(this);
        this.handleToChange = this.handleToChange.bind(this);
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    focusTo() {
        // Focus to `to` field. A timeout is required here because the overlays
        // already set timeouts to work well with input fields
        this.timeout = setTimeout(() => this.to.getInput().focus(), 0);
    }

    handleFromChange(from) {
        // Change the from date and focus the "to" input field
        this.setState({ from }, () => {
            if (!this.state.to) {
                this.focusTo();
            }
        });

        let event = new Event('timeChange');
        event.startTime = from.toISOString().substring(0, 10);
        window.dispatchEvent(event);
    }
    //
    // handleToChange = (event) => this.setState({ to }, this.showFromMonth);

    handleToChange(to) {
        this.setState({ to }, () => {
            if (!this.state.from) {
                this.focusTo();
            };
        });

        let event = new Event('timeChange');
        event.endTime = to.toISOString().substring(0, 10);
        window.dispatchEvent(event);
    }

    render() {
        const { from, to } = this.state;
        const modifiers = { start: from, end: to };
        const today = new Date();
        today.setDate(today.getDate() + 1);

        return (
            <div className="InputFromTo">
                <Grid fluid>
                    <Row>
                        <Col sm={12} md={5} className="prediction_calendar">
                            <DayPickerInput
                                value={from}
                                placeholder="Date From"
                                format="YYYY-MM-DD"
                                formatDate={formatDate}
                                parseDate={parseDate}
                                dayPickerProps={{
                                    selectedDays: [from, { from, to }],
                                    disabledDays: [
                                        { before: new Date(2013, 1, 13) },
                                        { after: this.state.to },
                                    ],
                                    toMonth: to,
                                    modifiers,
                                    numberOfMonths: 2,
                                }}
                                onDayChange={this.handleFromChange}
                            /></Col>
                        <Col sm={12} md={2} className="centerItem">
                            {' '} &nbsp;<span className="purpleColor">—</span> &nbsp;{' '}
                        </Col>
                        <Col sm={12} md={5} className="prediction_calendar">
                            <span className="InputFromTo-to">
                                <DayPickerInput
                                    ref={el => (this.to = el)}
                                    value={to}
                                    placeholder="Date To"
                                    format="YYYY-MM-DD"
                                    formatDate={formatDate}
                                    parseDate={parseDate}
                                    dayPickerProps={{
                                        selectedDays: [from, { from, to }],
                                        disabledDays: [
                                            { before: this.state.from },
                                            { after: today },
                                        ],
                                        modifiers,
                                        month: from,
                                        fromMonth: from,
                                        numberOfMonths: 2,
                                    }}
                                    onDayChange={this.handleToChange}
                                />
                            </span>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}