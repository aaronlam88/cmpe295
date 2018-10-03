import React from 'react';
import API from '../utilities/API.js';
import { Chart, Axis, Series, Tooltip, Cursor, Line } from 'react-chartjs';

// import style
import './StockChart.scss';
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
      datasets: [
        {
          label: "My First dataset",
          // fillColor: "rgba(220,220,220,0.2)",
          // strokeColor: "rgba(220,220,220,1)",
          // pointColor: "rgba(220,220,220,1)",
          // pointStrokeColor: "#fff",
          // pointHighlightFill: "#fff",
          // pointHighlightStroke: "rgba(220,220,220,1)",
            fillColor: colors.fillColor,
            strokeColor: colors.strokeColor,
            pointColor: colors.pointColor,
            pointStrokeColor: colors.white,
            pointHighlightFill: colors.white,
            pointHighlightStroke: colors.pointHighlightStroke,
          data: dataset,
        }
      ]
    };

    return chartData
  }

  render() {
    let data = this.processData();
    return (
      <div>
        <Line
          data={data}
        />
      </div>
    );
  }
}

export default StockChart;
