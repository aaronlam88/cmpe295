import React from 'react';
import { Line } from 'react-chartjs-2';

// import style
import colors from '../commonColor.js';

// import style
import './StockChart.scss';

class StockChart extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            tableName: props.tableName,
            startTime: props.startTime,
            endTime: props.endTime,

            data: {},
        };
    }

    // call after component is mounted to the dom
    // add listenner here if needed
    componentDidMount() {
        window.addEventListener('dataIsReady', (event) => this.dataIsReady(event));
    }

    // call after component update
    componentDidUpdate(prevProps, prevState) {

    }

    dataIsReady(event) {
        this.setState({
            tableName: event.tableName,
            startTime: event.startTime,
            endTime: event.endTime,
            data: event.data
        });
    }

    processData() {
        let rawData = this.state.data ? Array.from(this.state.data) : [];

        if (rawData === undefined || rawData.length === 0) return rawData;

        // make sure that data are in increasing time order
        // the api should return data in the correct order, just double check here
        let rawDataLength = rawData.length;
        if (rawDataLength > 1) {
            let date0 = new Date(rawData[0]['Date']);
            let date1 = new Date(rawData[1]['Date']);
            if (date0 > date1) {
                rawData.reverse();
            }
        }

        let labels = rawData.map(row => row['Date']);
        let open = rawData.map(row => row['Open']);
        let high = rawData.map(row => row['High']);
        let low = rawData.map(row => row['Low']);
        let close = rawData.map(row => row['Close']);
        let adjClose = rawData.map(row => row['AdjClose']);
        let volume = rawData.map(row => row['Volume']);


        let line = {};
        // read more about line datasets here http://www.chartjs.org/docs/latest/charts/line.html
        line.data = {
            labels: labels,
            responsive: true,
            datasets: [
                {
                    // ==== data used to draw the line ====
                    data: open,

                    // ==== label for the line ====
                    label: 'open',

                    // ==== the area under the line ===
                    fill: false, // should the area below the line be fill with color fillColor
                    fillColor: colors.green30,

                    // ==== the line ====
                    borderColor: colors.green30, // line color
                    borderWidth: 2, // width of the line

                    // ==== points on the line ====
                    pointBackgroundColor: colors.green, // point inside color
                    pointBorderColor: colors.green, // point outside color
                    pointHighlightFill: colors.white,
                    pointHighlightStroke: colors.green30,
                    pointRadius: 3,
                    pointStyle: 'circle', // 'circle', 'cross', 'crossRot', 'dash', 'line', 'rect', 'rectRounded', 'rectRot', 'star', 'triangle',
                },
                {
                    // ==== data used to draw the line ====
                    data: close,

                    // ==== label for the line ====
                    label: 'close',

                    // ==== the area under the line ===
                    fill: false, // should the area below the line be fill with color fillColor
                    fillColor: colors.purple,

                    // ==== the line ====
                    borderColor: colors.purple30, // line color
                    borderWidth: 2, // width of the line

                    // ==== points on the line ====
                    pointBackgroundColor: colors.purple, // point inside color
                    pointBorderColor: colors.purple, // point outside color
                    pointHighlightFill: colors.white,
                    pointHighlightStroke: colors.purple30,
                    pointRadius: 3,
                    pointStyle: 'circle', // 'circle', 'cross', 'crossRot', 'dash', 'line', 'rect', 'rectRounded', 'rectRot', 'star', 'triangle',
                },
            ],
        };

        // read more about options here http://www.chartjs.org/docs/latest/configuration/
        line.options = {
            responsive: true,
            title: {
                display: true,
                text: this.state.tableName,
                fill: true,
                backgroundColor: colors.green60,
                borderColor: colors.green,
                fontSize: 25,
                fontColor: colors.green,
                fontFamily: "DIN Condensed",
            },
            legend: {
                display: true,
                position: 'top', // 'top','bottom', 'left', 'right'
                labels: {
                    boxWidth: 50,
                    boxHeight: 40,
                    fontSize: 20,
                    fontColor: colors.white,
                    padding: 15,
                    fontFamily: "DIN Condensed",
                },
                onHover: function (e) {
                    e.target.style.cursor = 'pointer';
                }
            },
            hover: {
                onHover: function (e) {
                    let point = this.getElementAtEvent(e);
                    if (point.length) e.target.style.cursor = 'pointer';
                    else e.target.style.cursor = 'default';
                }
            },
            scales: {
                yAxes: [{
                    gridLines: {
                        // display: false,
                        color:colors.green5,
                    },
                    ticks: {
                        // beginAtZero:true,
                        fontColor: colors.green60,
                        fontFamily: "DIN",
                    },
                }],
                xAxes: [{
                    gridLines: {
                        // display: false,
                        color:colors.green5,
                    },
                    ticks: {
                        fontColor: colors.green,
                        fontFamily: "DIN",
                    },
                }]
            }
        };
        return line;
    }

    render() {
        let line = this.processData();
        if (line === undefined || line.length === 0) return (<div> Loading ... </div>);

        return (<Line {...line} />);
    }
}

export default StockChart;
