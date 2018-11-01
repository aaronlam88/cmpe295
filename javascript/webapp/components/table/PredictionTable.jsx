import React, {Component} from 'react';
import ReactTable from "react-table";
import {
    Grid,
    Row,
    Col,
} from 'react-bootstrap';
import axios from 'axios';

// import css for react-table
import './Table.scss';

class PredictionTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            value: props.tableName,
        };
    }

    componentDidMount() {
        axios.get(`http://localhost:8081/Predict/top`)
            .then(res => {
                this.setState({data: res.data});
            });
    }

    //gainer in Algorithm 1
    alg01Gainer() {
        let result = this.state.data.slice(0, 5).map(
            item => ({
                company: item.label,
                amount: item.amount,
                percentage: item.result,
            })
        );
        //add color pair for setting background color in render
        result.forEach(o => {
            for (let k in o) {
                var key = 'percentage';
                var original = o[key];
                if (original > 4) {
                    o["color"] = 'green';
                }
                else if (original === 0) {
                    o["color"] = 'gray';
                } else {
                    o["color"] = 'red';
                }
            }
            // o[key] = original + '%';
        });
        console.log(result);
        return result;
    }

    // loser in Algorithm 1
    alg01Loser() {
        return (this.state.data.slice(5, 10).map(
            item => ({
                company: item.label,
                amount: item.amount,
                percentage: item.result,
            })
        ))
    }

    //gainer in Algorithm 2
    alg02Gainer() {
        return (this.state.data.slice(10, 15).map(
            item => ({
                company: item.label,
                amount: item.amount,
                percentage: item.result,
            })
        ))
    }


    // loser in Algorithm 2
    alg02Loser() {
        return (this.state.data.slice(15, 20).map(
            item => ({
                company: item.label,
                amount: item.amount,
                percentage: item.result,
            })
        ))
    }


    // algorithm 3 result
    alg03Result() {
        let result = this.state.data.slice(20, 21).map(
            item => ({result: item.result,}));
        result.forEach(o => {
            for (let k in o)
                if (o[k] === 1) o[k] = 'Go Higher';
                else o[k] = 'Go Lower';
        });
        return result;
    }

    //algorithm 4 result
    alg04Result() {
        let result = this.state.data.slice(21, 22).map(
            item => ({result: item.result,}));
        result.forEach(o => {
            for (let k in o)
                if (o[k] === 1) o[k] = 'Go Higher';
                else o[k] = 'Go Lower';
        });
        return result;
    }

    changeBG(key) {
        let bgColor;
        if (key === 'green') {
            bgColor = 'rgba(96, 239, 255, 0.4)';
        } else if (key === 'gray') {
            bgColor = 'rgba(65, 65, 65, 0.4)';
        } else {
            bgColor = 'rgba(96, 239, 255, 0.4)';
        }
        console.log("color, ", key);
        return bgColor;
    }


    render() {
        console.log("tableName = ", this.state.value);

        const testColumn = [{
            accessor: 'company'
        }, {
            accessor: 'amount'
        }, {
            accessor: 'percentage',

            Cell: row => {
                console.log(row);
                return (<div
                    style={{
                        // width: `${row.value}%`,
                        height: "100%",
                        backgroundColor:
                            row.value > 4.0
                                ? "#85cc00"
                                : row.value > 2.0
                                ? "#ffbf00"
                                : "#ff2e00",
                        borderRadius: "2px",
                        transition: "all .2s ease-out"
                    }}
                > {row.value+'%'} </div>);
            }
        }];



        // column style for gainer
        const gainerColumn = [{
            // Header: 'Company',
            accessor: 'company'
        }, {
            accessor: 'amount'
        }, {
            accessor: 'percentage',
            style: {
                background: 'rgba(96, 239, 255, 0.5)',
                color: 'black',
            },
        }];

        // column style for loser
        const loserColumn = [{
            accessor: 'company'
        }, {
            accessor: 'amount'
        }, {
            accessor: 'percentage',

            // Cell: row => (
            style: {
                background: 'rgba(255, 0, 167, 0.5)',
                //         // background: this.changeBG('color'),
                //         background: this.value > 0
                //             ? "rgba(255, 0, 167, 0.5)"
                //             : this.value === 0
                //             ? "rgba(65, 65, 65, 0.4)"
                //             : "rgba(96, 239, 255, 0.4)",
                color: 'black',
            }
            // )
        }];

        // column style for prediction goes higher
        const higherColumn = [{
            accessor: 'result',
            style: {
                background: 'rgba(96, 239, 255, 0.8)',
                color: 'black',
            },
        }];

        // column style for prediction goes lower
        const lowerColumn = [{
            accessor: 'result',
            style: {
                background: 'rgba(255, 0, 167, 0.8)',
                color: 'black',
            },
        }];

        return (
            <Grid fluid>
                <Row>
                    {/*algorithm 1*/}
                    <Col sm={12} md={12} lg={12}>
                        <h2 className={"centerText bottomPadding20"}>Algorithm 1 - Regression Prediction Result</h2>
                    </Col>
                    <Col sm={12} md={12} lg={6} className="pre_winner">
                        <h3 className={"blueColor centerText"}>Top 5 Gainers</h3>
                        <ReactTable
                            data={this.alg01Gainer()}
                            noDataText='Loading Data ...'
                            columns={testColumn}
                            defaultPageSize={5}
                            showPaginationBottom={false}
                        />
                    </Col>
                    <Col sm={12} md={12} lg={6} className="pre_loser">
                        <h3 className={"purpleColor centerText"}>Top 5 Losers</h3>
                        <ReactTable
                            data={this.alg01Loser()}
                            noDataText='Loading Data ...'
                            columns={loserColumn}
                            defaultPageSize={5}
                            showPaginationBottom={false}
                        />
                    </Col>
                    <Col sm={12} md={12} lg={12}>
                        <hr/>
                    </Col>

                    {/*algorithm 2*/}
                    <Col sm={12} md={12} lg={12}>
                        <h2 className={"centerText bottomPadding20"}>Algorithm 2 - xxx Prediction Result</h2>
                    </Col>
                    <Col sm={12} md={12} lg={6} className="pre_winner">
                        <h3 className={"blueColor centerText"}>Top 5 Gainers</h3>
                        <ReactTable
                            data={this.alg02Gainer()}
                            noDataText='Loading Data ...'
                            columns={gainerColumn}
                            defaultPageSize={5}
                            showPaginationBottom={false}
                        />
                    </Col>
                    <Col sm={12} md={12} lg={6} className="pre_loser">
                        <h3 className={"purpleColor centerText"}>Top 5 Losers</h3>
                        <ReactTable
                            data={this.alg02Loser()}
                            noDataText='Loading Data ...'
                            columns={loserColumn}
                            defaultPageSize={5}
                            showPaginationBottom={false}
                        />
                    </Col>
                    <Col sm={12} md={12} lg={12}>
                        <hr/>
                    </Col>

                    {/*algorithm 3 and 4 */}
                    <Col sm={12} md={12} lg={6} className="pre_winner">
                        <h2 className={"centerText"}>Algorithm 3 prediction Result</h2>
                        <ReactTable
                            data={this.alg03Result()}
                            noDataText='Loading Data ...'
                            columns={higherColumn}
                            defaultPageSize={1}
                            showPaginationBottom={false}
                        />
                    </Col>

                    <Col sm={12} md={12} lg={6} className="pre_loser">
                        <h2 className={"centerText"}>Algorithm 4 prediction Result</h2>
                        <ReactTable
                            data={this.alg04Result()}
                            noDataText='Loading Data ...'
                            columns={lowerColumn}
                            defaultPageSize={1}
                            showPaginationBottom={false}
                        />
                    </Col>
                    <Col sm={12} md={12} lg={12} className={"bottomPadding20"}>
                        <hr/>
                    </Col>

                </Row>
            </Grid>
        )

    }
}

export default PredictionTable;