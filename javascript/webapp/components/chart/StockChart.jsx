import React from 'react';
import API from '../utilities/API.js';
import { Chart, Axis, Series, Tooltip, Cursor, Line } from 'react-chartjs';

// import style
import colors from '../commonColor.js';

class StockChart extends React.PureComponent {
  constructor(props) {
      super(props);

      this.state = {
          tableName: props.tableName,
          startTime: props.startTime,
          endTime: props.endTime,

          data: {},
      };
      API.getData(props.tableName, props.startTime, props.endTime, 'table');
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

  dataIsReady(event) {
      this.setState({
          data: event.data
      });
  }

  processData() {
    let data = this.state.data ? Array.from(this.state.data) : [];
    let labels = [];
    let dataset = [];
    if (data.length > 0) {
      var i;
      for (i = 0; i < data.length; i++) {
      if (i % 5 == 0 || i == data.length - 1) {
        labels.push(data[i]["Date"]);
      } else {
        labels.push('');
      }
      dataset.push(data[i]["Close"]);
    }
  }

    let chartData = {
      labels: labels,
      responsive: true,

      datasets: [
        {
          label: "My First dataset",
            fillColor: colors.green30,
            strokeColor: colors.green60,
            pointColor: colors.green,
            pointStrokeColor: colors.green,
            pointHighlightFill: colors.white,
            pointHighlightStroke: colors.green30,
          data: dataset,
        }
      ]
    };
    return chartData
  }



render() {
    let data = this.processData();

    var chartOptions = {
        responsive: true,
        // showScale: true,
        // pointDot: true,
        // showLines: false,

        title: {
            display: true,
            text: 'current stock',
            fill: true,
            backgroundColor: colors.green60,
            borderColor: colors.green,
        },

        // legend: {
        //     display: true,
        //     labels: {
        //         boxWidth: 50,
        //         fontSize: 10,
        //         fontColor: '#bbb',
        //         padding: 5,
        //     }
        // },

    };

    return (
      <div>
        <Line
          data={data} options={chartOptions} width="1300" height="250"
        />
      </div>
    );
  }
}

export default StockChart;
