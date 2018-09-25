import React from 'react';
import  {moment, formatDate, parseDate } from 'moment';

import DayPicker from "react-day-picker";
import DayPickerInput from 'react-day-picker/DayPickerInput';

// import style
import './Calendar.scss';

export default class Calendar extends React.Component {
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

    showFromMonth() {
        const { from, to } = this.state;
        if (!from) {
            return;
        }
        if (moment(to).diff(moment(from), 'months') < 2) {
            this.to.getDayPicker().showMonth(from);
        }
    }

    handleFromChange(from) {
        // Change the from date and focus the "to" input field
        this.setState({ from }, () => {
            if (!this.state.to) {
                this.focusTo();
            }
        });
    }

    handleToChange(to) {
        this.setState({ to }, this.showFromMonth);
    }

    render() {
        const { from, to } = this.state;
        const modifiers = { start: from, end: to };
        const today = new Date();
        return (
            <div className="InputFromTo">
                <section className="flex_calendar">
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
                />
                {' '} —{' '}
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
                </section>
            </div>
        );
    }
}