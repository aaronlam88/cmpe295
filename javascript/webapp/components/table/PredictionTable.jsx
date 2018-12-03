import React, {Component} from 'react';
import ReactTable from "react-table";
import {
    Grid,
    Row,
    Col,
    Image,
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
    //
    // //gainer in Algorithm 1
    // alg01Gainer() {
    //     return (this.state.data.slice(0, 5).map(
    //         item => ({
    //             company: item.label,
    //             amount: item.amount,
    //             percentage: item.result,
    //         })
    //     ))
    // }
    //
    // // loser in Algorithm 1
    // alg01Loser() {
    //     return (this.state.data.slice(5, 10).map(
    //         item => ({
    //             company: item.label,
    //             amount: item.amount,
    //             percentage: item.result,
    //         })
    //     ))
    // }

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


    // algorithm 2 result / Dtree
    alg02Result() {
        let result = this.state.data.slice(20, 21).map(
            item => ({result: item.result,}));
        result.forEach(o => {
            for (let k in o)
                if (o[k] === 1) o[k] = 'Will Go Higher';
                else o[k] = 'Will Go Lower';
        });
        return result;
    }

    //algorithm 3 result / SVM
    alg03Result() {
        let result = this.state.data.slice(21, 22).map(
            item => ({result: item.result,}));
        result.forEach(o => {
            for (let k in o)
                if (o[k] === 1) o[k] = 'Will Go Higher';
                else o[k] = 'Will Go Lower';
        });
        return result;
    }

    //algorithm 4 result / SGDLinear
    alg04Result() {
        let result = this.state.data.slice(22, 23).map(
            item => ({result: item.result,}));
        result.forEach(o => {
            for (let k in o)
                if (o[k] === 1) o[k] = 'Will Go Higher';
                else o[k] = 'Will Go Lower';
        });
        return result;
    }

    // conclusion for algorithm 2,3 and 4
    algConclusion() {
        var count = 0;
        // console.log("slice", this.state.data.slice(20,23));
        this.state.data.slice(20, 23).forEach(e => {
            count += e.result;
        });
        var resultStr = "lower";
        count >= 2 ? resultStr = "The conclusion trend for this stock will go higher tomorrow" : resultStr = "The conclusion trend for this stock will go lower tomorrow";
        console.log(count);
        return [{result: resultStr}];
    }

    render() {
        console.log("tableName = ", this.state.value);

        // column style for algorithm 1 and 2
        const top5column = [{
            accessor: 'company'
        }, {
            accessor: 'amount'
        }, {
            accessor: 'percentage',

            Cell: row => {
                // console.log(row);
                return (<div
                    style={{
                        height: "120%",
                        marginTop: "-3px",
                        paddingTop: '6px',
                        textAlign: "center",
                        width: "110%",
                        backgroundColor:
                            row.value > 0.0
                                ? "rgba(96, 239, 255, 0.5)"
                                : row.value === 0.0
                                ? "rgba(155, 155, 155, 0.8)"
                                : "rgba(255, 0, 167, 0.5)",
                        transition: "all .2s ease-out"
                    }}
                > {row.value + '%'} </div>);
            }
        }];

        // column style for prediction goes higher or lower
        const trendColumn = [{
            accessor: 'result',
            Cell: row => {
                // console.log(row);
                return (<div
                    style={{
                        height: "200%",
                        marginTop: "-10px",
                        paddingTop: '10px',
                        textAlign: "center",
                        width: "100%",
                        backgroundColor:
                            row.value === 'Will Go Higher'
                                ? "rgba(96, 239, 255, 0.8)"
                                : "rgba(255, 0, 167, 0.8)",
                        transition: "all .2s ease-out"
                    }}
                > {row.value} </div>);
            }
        }];

        // column style for conclusion
        const conclusionColumn = [{
            accessor: 'result',
            Cell: row => {
                // console.log(row);
                return (<div
                    style={{
                        height: "200%",
                        marginTop: "-10px",
                        paddingTop: '10px',
                        textAlign: "center",
                        width: "100%",
                        color: "black",
                        backgroundColor:
                            row.value === 'The conclusion trend for this stock will go higher tomorrow'
                                ? "rgba(96, 239, 255, 0.8)"
                                : "rgba(255, 0, 167, 0.8)",
                        transition: "all .2s ease-out"
                    }}
                > {row.value} </div>);
            }
        }];

        return (
            <Grid fluid>
                <Row>

                    {/*algorithm LASSORegression*/}
                    <Col sm={12} md={12} lg={12}>
                        <h2 className={"centerText bottomPadding20"}>LASSORegression Algorithm Prediction Result</h2>
                    </Col>
                    <Col sm={12} md={12} lg={6} className="pre_winner">
                        <h3 className={"blueColor centerText"}>Top 5 Gainers</h3>
                        <ReactTable
                            data={this.alg02Gainer()}
                            noDataText='Loading Data ...'
                            columns={top5column}
                            defaultPageSize={5}
                            showPaginationBottom={false}
                        />
                    </Col>
                    <Col sm={12} md={12} lg={6} className="pre_loser">
                        <h3 className={"purpleColor centerText"}>Top 5 Losers</h3>
                        <ReactTable
                            data={this.alg02Loser()}
                            noDataText='Loading Data ...'
                            columns={top5column}
                            defaultPageSize={5}
                            showPaginationBottom={false}
                        />
                    </Col>
                    <Col sm={12} md={12} lg={12}>
                        <hr/>
                    </Col>

                    {/*algorithm 2, 3 and 4 conclusion*/}
                    <Col sm={12} md={12} lg={12} className="preAll">
                        <h2 className={"centerText"}>Algorithm Dtree, SVM and SGDLiner prediction Result conclusion</h2>
                        <ReactTable
                            data={this.algConclusion()}
                            // data={this.alg04Result()}
                            noDataText='Loading Data ...'
                            columns={conclusionColumn}
                            defaultPageSize={1}
                            showPaginationBottom={false}
                        />
                    </Col>
                    <Col sm={12} md={12} lg={12}>
                        <Image src='../../style/image/conclusionMark.png' alt="conclusionMark" responsive className="responsiveImg"/>
                    </Col>

                    {/*algorithm 2, 3 and 4 */}
                    <Col sm={12} md={12} lg={4} className="preAll">
                        <h2 className={"centerText"}>Algorithm Dtree prediction Result</h2>
                        <ReactTable
                            data={this.alg02Result()}
                            noDataText='Loading Data ...'
                            columns={trendColumn}
                            defaultPageSize={1}
                            showPaginationBottom={false}
                        />
                    </Col>

                    <Col sm={12} md={12} lg={4} className="preAll">
                        <h2 className={"centerText"}>Algorithm SVM prediction Result</h2>
                        <ReactTable
                            data={this.alg03Result()}
                            noDataText='Loading Data ...'
                            columns={trendColumn}
                            defaultPageSize={1}
                            showPaginationBottom={false}
                        />
                    </Col>

                    <Col sm={12} md={12} lg={4} className="preAll">
                        <h2 className={"centerText"}>Algorithm SGDLinear prediction Result</h2>
                        <ReactTable
                            data={this.alg04Result()}
                            noDataText='Loading Data ...'
                            columns={trendColumn}
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