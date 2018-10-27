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
                this.setState({ data });
            })
    }

    processData() {
        let allJason = this.state.data.map(
            item => ({
                company: item.label,
                number: 1.23,
                percentage: item.result,
            })
        );
        console.log(allJason)
    }

    render() {
        this.processData();

        //gainer 1
        let size = 5;
        let gainer1 = this.state.data.slice(0, size).map(
            item => ({
                company: item.label,
                number: 1.23,
                percentage: item.result,
            })
        );

        let loser1 = this.state.data.slice(5, 10).map(
            item => ({
                company: item.label,
                number: 1.23,
                percentage: item.result,
            })
        );

        const columns1 = [{
            // Header: 'Company',
            accessor: 'company'
        }, {
            // Header: 'Number',
            accessor: 'number'
        }, {
            accessor: 'percentage',
            style: {
                background: 'rgba(96, 239, 255, 0.5)',
                // background: v.value === '0%' ? 'rgba(96, 239, 255, 0.4)' : 'red',
                color: 'black',
            },
        }
        ];

        const columns2 = [{
            // Header: 'Company',
            accessor: 'company'
        }, {
            // Header: 'Number',
            accessor: 'number'
        }, {
            accessor: 'percentage',
            style: {
                background: 'rgba(255, 0, 167, 0.5)',
                // background: v.value === '0%' ? 'rgba(96, 239, 255, 0.4)' : 'red',
                color: 'black',
            },
        }
        ];

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
                            columns={columns1}
                            defaultPageSize={5}
                            showPaginationBottom={false}
                        />
                    </Col>
                    <Col sm={12} md={12} lg={6} className="pre_loser">
                        <h3 className={"purpleColor centerText"}>Top 5 Losers</h3>
                        <ReactTable
                            data={loser1}
                            noDataText='Loading Data ...'
                            columns={columns2}
                            defaultPageSize={5}
                            showPaginationBottom={false}
                        />
                    </Col>
                    <Col sm={12} md={12} lg={12}><hr /></Col>

                    {/*algorithm 2*/}
                    <Col sm={12} md={12} lg={12}>
                        <h2 className={"centerText bottomPadding20"}>Algorithm 2 - xxx Prediction Result</h2>
                    </Col>
                    <Col sm={12} md={12} lg={6} className="pre_loser">
                        <h3 className={"purpleColor"}>Top 5 Losers -  Algorithm 1</h3>
                        <ReactTable
                            data={loser1}
                            noDataText='Loading Data ...'
                            columns={columns2}
                            defaultPageSize={5}
                            showPaginationBottom={false}
                        />
                    </Col>
                </Row>
            </Grid>
        )

    }
}

export default PredictionTable;