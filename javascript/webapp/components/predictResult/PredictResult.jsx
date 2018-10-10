import React from 'react';
import $ from 'jquery';

export default class UserList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      result: []
    };
  }

  componentDidMount() {
    $.get(
        'http://54.176.230.26:8081/Stocks/predict-result',
    ).done((data) => {
        console.debug('success')
    }).fail(() => {
        console.error('fail');
    }).always((data) => {
        this.setState({ result: data });
    });
  }

  render() {
    const result = this.state.result.map((item, i) => (
      <div key={i}>
        <h1>{ item.label }</h1>
        <h1>{ item.result }</h1>
      </div>
    ));

    return (
      <div id="layout-content" className="layout-content-wrapper">
        <div className="panel-list">{ result }</div>
      </div>
    );
  }
}
