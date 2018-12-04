import React from 'react';
import { Line } from 'react-chartjs-2';

// import style
import colors from '../commonColor.js';

// import style
import './StockChart.scss';

class PredictionStockChart extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            tableName: props.tableName,
            startTime: props.startTime,
            endTime: props.endTime,
            data: {},
            predictionData: {},
        };
    }

    // call after component is mounted to the dom
    // add listenner here if needed
    componentDidMount() {
        window.addEventListener('predictDataIsReady', (event) => this.predictionDataIsReady(event));
        window.addEventListener('realDataIsReady', (event) => this.dataIsReady(event));
    }

    // call after component update
    componentDidUpdate(prevProps, prevState) {

    }

    predictionDataIsReady(event) {
        this.setState({
            tableName: event.tableName,
            startTime: event.startTime,
            endTime: event.endTime,
            predictionData: event.data,
        });
        // console.log("predictionDataIsReady", event.data);
    }

    dataIsReady(event) {
        this.setState({
            tableName: event.tableName,
            startTime: event.startTime,
            endTime: event.endTime,
            data: event.data,
        });
        // console.log("dataIsReady", event.data);
    }

    processData() {
        let rawData = this.state.data ? Array.from(this.state.data) : [];
        let predictionData = this.state.predictionData ? Array.from(this.state.predictionData) : [];

        if (rawData === undefined || rawData.length === 0) return rawData;
        if (predictionData === undefined || predictionData.length === 0) return predictionData;

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



        // prediction part
        let predictionDataLength = predictionData.length;
        if (predictionDataLength > 1) {
            let date0 = new Date(rawData[0]['Date']);
            // console.log("date0", date0);
            let date1 = new Date(rawData[1]['Date']);
            if (date0 > date1) {
                predictionData.reverse();
            }
        }

        let predictionClose = predictionData.map(row => row['LASSORegression']);

        let line = {};
        // read more about line datasets here http://www.chartjs.org/docs/latest/charts/line.html
        line.data = {
            labels: labels,
            responsive: true,
            datasets: [
                {
                    // ==== data used to draw the line ====
                    data: predictionClose,

                    // ==== label for the line ====
                    label: 'LASSORegression Algorithm Prediction',

                    // ==== the area under the line ===
                    fill: false, // should the area below the line be fill with color fillColor
                    fillColor: colors.green30,

                    // ==== the line ====
                    borderColor: colors.green60, // line color
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
                    label: 'Real Market Close Data',

                    // ==== the area under the line ===
                    fill: false, // should the area below the line be fill with color fillColor
                    fillColor: colors.purple,

                    // ==== the line ====
                    borderColor: colors.purple50, // line color
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
                backgroundColor: colors.purple60,
                borderColor: colors.purple,
                fontSize: 25,
                fontColor: colors.purple,
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
                        color: colors.purple20,
                    },
                    ticks: {
                        // beginAtZero:true,
                        fontColor: colors.purple,
                        fontFamily: "DIN",
                    },
                }],
                xAxes: [{
                    gridLines: {
                        // display: false,
                        color: colors.purple20,
                    },
                    ticks: {
                        fontColor: colors.purple,
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

export default PredictionStockChart;
