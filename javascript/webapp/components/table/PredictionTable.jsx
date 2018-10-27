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

const data11 = [{
    company: 'Company AAA',
    number: 5.65,
    percentage: '+1.7%',
}, {
    company: 'Company BBB',
    number: 3.22,
    percentage: '+1.23%',
}, {
    company: 'Company CCC',
    number: 2.43,
    percentage: '+0.92%',
}, {
    company: 'Company DDD',
    number: 1.37,
    percentage: '+0.33%',
}, {
    company: 'Company EEE',
    number: 1.22,
    percentage: '0%',
}];

const data12 = [{
    company: 'Company UUU',
    number: 4.97,
    percentage: '-1.3%',
}, {
    company: 'Company WWW',
    number: 4.01,
    percentage: '-1.15%',
}, {
    company: 'Company XXX',
    number: 3.65,
    percentage: '-0.72%',
}, {
    company: 'Company YYY',
    number: 2.49,
    percentage: '-0.68%',
}, {
    company: 'Company ZZZ',
    number: 1.92,
    percentage: '-0.42%',
}];

class PredictionTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            company: [],
            percentage: [],
        }

        // create state from props that pass down from parent
        // this.state = {
        //     data11: data11,
        //     data12: data12,
        // };
    }

    componentDidMount() {
        axios.get(`http://54.176.230.26:8081/Predict/top`)
            .then(res => {
                const data = res.data;
                this.setState({ data });
            })
    }

    render() {
        return (
            <table>
                <tbody>{this.state.data.map(function(item, key) {

                    return (
                        <tr key = {key}>
                            <td>{item.label}</td>
                            <td>{item.result}</td>
                        </tr>
                    )

                })}</tbody>
            </table>
        )
    }

    // render() {
    //     // let currPer = this.state.data => percentage;
    //     const columns1 = [{
    //         // Header: 'Company',
    //         accessor: 'company'
    //     }, {
    //         // Header: 'Number',
    //         accessor: 'number'
    //     }, {
    //         accessor: 'percentage',
    //         style: {
    //             background: 'rgba(96, 239, 255, 0.5)',
    //             // background: v.value === '0%' ? 'rgba(96, 239, 255, 0.4)' : 'red',
    //             color: 'black',
    //         },
    //     }
    //     ];
    //
    //     const columns2 = [{
    //         // Header: 'Company',
    //         accessor: 'company'
    //     }, {
    //         // Header: 'Number',
    //         accessor: 'number'
    //     }, {
    //         accessor: 'percentage',
    //         style: {
    //             background: 'rgba(255, 0, 167, 0.5)',
    //             // background: v.value === '0%' ? 'rgba(96, 239, 255, 0.4)' : 'red',
    //             color: 'black',
    //         },
    //     }
    //     ];
    //
    //     return (
    //         <Grid fluid>
    //             <Row>
    //                 {/*algorithm 1*/}
    //                 <Col sm={12} md={12} lg={12}>
    //                     <h2 className={"centerText bottomPadding20"}>Algorithm 1 - Regression Prediction Result</h2>
    //                 </Col>
    //                 <Col sm={12} md={12} lg={6} className="pre_winner">
    //                     <h3 className={"blueColor centerText"}>Top 5 Gainers</h3>
    //                     <ReactTable
    //                         data={data11}
    //                         noDataText='Loading Data ...'
    //                         columns={columns1}
    //                         defaultPageSize={5}
    //                         showPaginationBottom={false}
    //                     />
    //                 </Col>
    //                 <Col sm={12} md={12} lg={6} className="pre_loser">
    //                     <h3 className={"purpleColor centerText"}>Top 5 Losers</h3>
    //                     <ReactTable
    //                         data={data12}
    //                         noDataText='Loading Data ...'
    //                         columns={columns2}
    //                         defaultPageSize={5}
    //                         showPaginationBottom={false}
    //                     />
    //                 </Col>
    //                 <Col sm={12} md={12} lg={12}><hr /></Col>
    //
    //                 {/*algorithm 2*/}
    //                 <Col sm={12} md={12} lg={12}>
    //                     <h2 className={"centerText bottomPadding20"}>Algorithm 2 - xxx Prediction Result</h2>
    //                 </Col>
    //                 <Col sm={12} md={12} lg={6} className="pre_loser">
    //                     <h3 className={"purpleColor"}>Top 5 Losers -  Algorithm 1</h3>
    //                     <ReactTable
    //                         data={data12}
    //                         noDataText='Loading Data ...'
    //                         columns={columns2}
    //                         defaultPageSize={5}
    //                         showPaginationBottom={false}
    //                     />
    //                 </Col>
    //             </Row>
    //         </Grid>
    //     )
    //
    // }
}

export default PredictionTable;