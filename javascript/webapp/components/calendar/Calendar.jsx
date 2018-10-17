import React from 'react';
import  {moment, formatDate, parseDate } from 'moment';

import DayPicker from "react-day-picker";
import DayPickerInput from 'react-day-picker/DayPickerInput';
import {
    Grid,
    Row,
    Col,
} from 'react-bootstrap';

// import style
import './Calendar.scss';

export default class Calendar extends React.PureComponent {
    constructor(props) {
        super(props);
        this.handleFromChange = this.handleFromChange.bind(this);
        this.handleToChange = this.handleToChange.bind(this);
        this.state = {
            from: undefined,
            to: undefined,
        };
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
        return (
            <div className="InputFromTo">
                <Grid fluid>
                    <Row>
                        <Col sm={12} md={5}>
                            <DayPickerInput
                            value={from}
                            placeholder="Date From"
                            format="YYYY-MM-DD"
                            formatDate={formatDate}
                            parseDate={parseDate}
                            dayPickerProps={{
                                selectedDays: [from, { from, to }],
                                disabledDays: [
                                    { after: to },
                                    { before: new Date(2013, 9, 1)},
                                    { after: today},
                                ],
                                toMonth: to,
                                modifiers,
                                numberOfMonths: 2,
                            }}
                            onDayChange={this.handleFromChange}
                        /></Col>
                        <Col sm={12} md={2} className="centerItem">
                            {' '} &nbsp;<span className="blueColor">—</span> &nbsp;{' '}
                        </Col>
                        <Col sm={12} md={5}>
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
                                          { after: to },
                                          { before: new Date(2013, 9, 1)},
                                          { after: today},
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