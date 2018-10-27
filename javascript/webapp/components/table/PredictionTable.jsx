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
        }
    }

    componentDidMount() {
        axios.get(`http://54.176.230.26:8081/Predict/top`)
            .then(res => {
                const data = res.data;
                this.setState({data});
            })
    }

    processData() {
        let allJason = this.state.data.map(
            item => ({
                company: item.label,
                amount: item.amount,
                percentage: item.result,
            })
        );
        console.log(allJason)
    }

    render() {
        this.processData();

        //gainer in Algorithm 1
        let size = 5;
        let gainer1 = this.state.data.slice(0, size).map(
            item => ({
                company: item.label,
                amount: item.amount,
                percentage: item.result,
            })
        );

        // loser in Algorithm 1
        let loser1 = this.state.data.slice(5, 10).map(
            item => ({
                company: item.label,
                amount: item.amount,
                percentage: item.result,
            })
        );

        // column style for gainer
        const gainerColumn = [{
            // Header: 'Company',
            accessor: 'company'
        }, {
            // Header: 'Number',
            accessor: 'amount'
        }, {
            accessor: 'percentage',
            style: {
                background: 'rgba(96, 239, 255, 0.5)',
                // background: v.value === '0%' ? 'rgba(96, 239, 255, 0.4)' : 'red',
                color: 'black',
            },
        }];

        // column style for loser
        const loserColumn = [{
            // Header: 'Company',
            accessor: 'company'
        }, {
            // Header: 'Number',
            accessor: 'amount'
        }, {
            accessor: 'percentage',
            style: {
                background: 'rgba(255, 0, 167, 0.5)',
                // background: v.value === '0%' ? 'rgba(96, 239, 255, 0.4)' : 'red',
                color: 'black',
            },
        }];

        // column style for prediction goes higher
        const higherColumn = [{
            accessor: 'result',
            style: {
                background: 'rgba(96, 239, 255, 0.8)',
                // background: v.value === '0%' ? 'rgba(96, 239, 255, 0.4)' : 'red',
                color: 'black',
            },
        }];

        // column style for prediction goes lower
        const lowerColumn = [{
            accessor: 'result',
            style: {
                background: 'rgba(255, 0, 167, 0.8)',
                // background: v.value === '0%' ? 'rgba(96, 239, 255, 0.4)' : 'red',
                color: 'black',
            },
        }];

        let testData = [{
            result: 1,
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
                            data={gainer1}
                            noDataText='Loading Data ...'
                            columns={gainerColumn}
                            defaultPageSize={5}
                            showPaginationBottom={false}
                        />
                    </Col>
                    <Col sm={12} md={12} lg={6} className="pre_loser">
                        <h3 className={"purpleColor centerText"}>Top 5 Losers</h3>
                        <ReactTable
                            data={loser1}
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
                    <Col sm={12} md={12} lg={6} className="pre_loser">
                        <h3 className={"purpleColor"}>Top 5 Losers - Algorithm 1</h3>
                        <ReactTable
                            data={loser1}
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
                        <h3 className={"centerText"}>Algorithm 3 prediction Result</h3>
                        <ReactTable
                            data={testData}
                            noDataText='Loading Data ...'
                            columns={higherColumn}
                            defaultPageSize={1}
                            showPaginationBottom={false}
                        />
                    </Col>

                    <Col sm={12} md={12} lg={6} className="pre_loser">
                        <h3 className={"centerText"}>Algorithm 4 prediction Result</h3>
                        <ReactTable
                            data={testData}
                            noDataText='Loading Data ...'
                            columns={lowerColumn}
                            defaultPageSize={1}
                            showPaginationBottom={false}
                        />
                    </Col>

                </Row>
            </Grid>
        )

    }
}

export default PredictionTable;