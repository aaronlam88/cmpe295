import React, {PureComponent} from 'react';
import ReactTable from 'react-table';
import {
    Grid,
    Row,
    Col,
    Image,
} from 'react-bootstrap';
import axios from 'axios';

// import css for react-table
import './Table.scss';

class PredictionTable extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            value: props.tableName,
            tableName: props.tableName,
            // startTime: props.startTime,
            // endTime: props.endTime,
            top5Data: [],
            bottom5Data:[],
        };
        this.predictDataIsReady = this.predictDataIsReady.bind(this);
    }

    /*
    * example: http://localhost:8081/Predict/GOOG/20181112/20181121
    * [
    * {"Date":"2018-11-16 00:00:00","DTree":1,"SVM":0,"SGDLinear":0,"SGDRegression":-33924368239540.305,"LASSORegression":1058.6251924196856},
    * {"Date":"2018-11-15 00:00:00","DTree":0,"SVM":0,"SGDLinear":0,"SGDRegression":-33540837479602.82,"LASSORegression":1056.375909863339},
    * {"Date":"2018-11-14 00:00:00","DTree":0,"SVM":0,"SGDLinear":0,"SGDRegression":-33475034013078.4,"LASSORegression":1043.0930812316162},
    * {"Date":"2018-11-13 00:00:00","DTree":0,"SVM":0,"SGDLinear":0,"SGDRegression":-33417228092627.6,"LASSORegression":1045.69616019958},
    * {"Date":"2018-11-12 00:00:00","DTree":1,"SVM":0,"SGDLinear":0,"SGDRegression":-33646793315375.812,"LASSORegression":1046.3033048127943}]
    * */


    // call after component update
    componentDidUpdate(prevProps, prevState) {

    }

    predictDataIsReady(event) {
        this.setState({
            tableName: event.tableName,
            // startTime: event.startTime,
            // endTime: event.endTime,
        });
        console.log("predictDataIsReady", event.tableName);
    }

    // call before component is removed from dom
    // similar to destructor in c++
    // clean up before you leave to avoid memory leak (ex: remove listenner)
    componentWillUnmount() {
        window.removeEventListener('predictDataIsReady', this.predictDataIsReady);
    }

    // call after component is mounted to the dom
    // add listener here if needed
    componentDidMount() {
        window.addEventListener('predictDataIsReady', (event) => this.predictDataIsReady(event));
        let currTable = this.state.tableName;
        let newData = `http://localhost:8081/Predict/${currTable}/latest`;
        axios.get(newData)
        // axios.get(`http://localhost:8081/Predict/GOOG/2018-11-06/2018-11-06`)
            .then(res => {
                this.setState({data: res.data});
            }).catch((err) => {
        });


        axios.get(`http://localhost:8081/Predict/TOP5/top5`)
            .then(res => {
                this.setState({top5Data: res.data});
            }).catch((err) => {
        });

        axios.get(`http://localhost:8081/Predict/BOTTOM5/bottom5`)
            .then(res => {
                this.setState({bottom5Data: res.data});
            }).catch((err) => {
        });
    }

    /*
    * [{'Date':'2018-10-29 00:00:00','Symbol':'DXC','Rate':0.06664174431664008,'Rank':5,'Difference':4.6342669664208955},
    * {'Date':'2018-10-29 00:00:00','Symbol':'BA','Rate':0.0688791147976129,'Rank':4,'Difference':23.11514185941445},
    * {'Date':'2018-10-29 00:00:00','Symbol':'NVDA','Rate':0.07096435225707545,'Rank':3,'Difference':13.172402711136584},
    * {'Date':'2018-10-29 00:00:00','Symbol':'TTWO','Rate':0.07467415365278805,'Rank':2,'Difference':8.342596520763635},
    * {'Date':'2018-10-29 00:00:00','Symbol':'HRS','Rate':0.0831705565981325,'Rank':1,'Difference':12.200289113721169}]
    * */

    //last update date of LASSO Regression predict data
    LASSODate() {
        let dateJson = this.state.top5Data.slice(0, 1);
        let dateKey = "Date";
        for (let key in dateJson) {
            var latestDate = dateJson[key][dateKey];
        }
        return latestDate;
    }

    //last update date of trend
    trendDate() {
        let dateJson = this.state.data;
        let dateKey = "Date";
        for (let key in dateJson) {
            var latestDate = dateJson[key][dateKey];
        }
        return latestDate;
    }

    //gainer in Algorithm LASSO Regression
    LASSOGainer() {
        return (this.state.top5Data.reverse().map(
            item => ({
                company: item.Symbol,
                amount: '+ ' + item.Difference.toFixed(4),
                percentage: (item.Rate * 100).toFixed(4),
            })
        ));
    }


    // loser in Algorithm LASSO Regression
    LASSOLoser() {
        return (this.state.bottom5Data.reverse().map(
            item => ({
                company: item.Symbol,
                amount: item.Difference.toFixed(4),
                percentage: (item.Rate * 100).toFixed(4),
            })
        ));
    }


    // algorithm Dtree result
    DtreeResult() {
        // [{"Date":"2018-11-29 00:00:00","DTree":null,"SVM":null,"SGDLinear":null,"SGDRegression":null,"LASSORegression":1087.5860614651904}]
        let latestJson = this.state.data;
        let dtree = "DTree";
        for (let key in latestJson) {
            var dTreeRes = latestJson[key][dtree];
        }
        let resultStr = 'Calculating ...';
        if(dTreeRes === 1) resultStr = 'Will Go Higher';
        else if (dTreeRes === null) resultStr = 'Still calculating, please check later';
        else resultStr = 'Will Go Lower';
        return [{result: resultStr}];
    }

    //algorithm SVM result
    SVMResult() {
        let latestJson = this.state.data;
        let SVM = "SVM";
        for (let key in latestJson) {
            var SVMRes = latestJson[key][SVM];
        }
        let resultStr = 'Calculating ...';
        if(SVMRes === 1) resultStr = 'Will Go Higher';
        else if (SVMRes === null) resultStr = 'Still calculating, please check later';
        else resultStr = 'Will Go Lower';
        return [{result: resultStr}];
    }

    //algorithm 4 result / SGDLinear
    SGDLinearResult() {
        let latestJson = this.state.data;
        let SGDLinear = "SGDLinear";
        for (let key in latestJson) {
            var SGDLinearRes = latestJson[key][SGDLinear];
        }
        let resultStr = 'Calculating ...';
        if(SGDLinearRes === 1) resultStr = 'Will Go Higher';
        else if (SGDLinearRes === null) resultStr = 'Still calculating, please check later';
        else resultStr = 'Will Go Lower';
        return [{result: resultStr}];
        // let result = this.state.data.slice(22, 23).map(
        //     item => ({result: item.result,}));
        // result.forEach(o => {
        //     for (let k in o)
        //         if (o[k] === 1) o[k] = 'Will Go Higher';
        //         else if (o[k] === null) o[k] = 'Still calculating, please check later';
        //         else o[k] = 'Will Go Lower';
        // });
        // return result;
    }

    // conclusion for algorithm 2,3 and 4
    algConclusion() {
        let count = 0;
        let latestJson = this.state.data;
        for (let key in latestJson) {
            for (let key1 in latestJson[key]) {
                let currRes = latestJson[key][key1];
                if (currRes === null) return [{result: 'Still calculating, please check later'}];
                else count += currRes;
            }
        }
        let resultStr = 'Calculating ...';
        count >= 2 ? resultStr = 'The conclusion trend for this stock will go higher in the next business day of last update date'
            : resultStr = 'The conclusion trend for this stock will go lower in the next business day of last update date';
        return [{result: resultStr}];
        // let count = 0;
        // // console.log('slice', this.state.data.slice(20, 23));
        // this.state.data.slice(20, 23).forEach(e => {
        //     if (e.result === null) return [{result: 'Still calculating, please check later'}];
        //     else count += e.result;
        // });
        // let resultStr = 'Calculating ...';
        // count >= 2 ? resultStr = 'The conclusion trend for this stock will go higher in the next business day of last update date'
        //     : resultStr = 'The conclusion trend for this stock will go lower in the next business day of last update date';
        // return [{result: resultStr}];
    }

    render() {
        console.log('tableName', this.state.tableName);

        // column style for algorithm LASSO Regression top 5
        const top5column = [{
            accessor: 'company'
        }, {
            accessor: 'amount'
        }, {
            accessor: 'percentage',

            Cell: row => {
                return (<div
                    style={{
                        height: '120%',
                        marginTop: '-3px',
                        paddingTop: '6px',
                        textAlign: 'center',
                        width: '110%',
                        backgroundColor:
                            row.value > 0.0000
                                ? 'rgba(96, 239, 255, 0.5)'
                                : row.value === 0.0000
                                ? 'rgba(155, 155, 155, 0.8)'
                                : 'rgba(255, 0, 167, 0.5)',
                        transition: 'all .2s ease-out'
                    }}
                > {row.value + ' %'} </div>);
            }
        }];

        // column style for prediction goes higher or lower
        const trendColumn = [{
            accessor: 'result',
            Cell: row => {
                return (<div
                    style={{
                        height: '200%',
                        marginTop: '-10px',
                        paddingTop: '10px',
                        textAlign: 'center',
                        width: '100%',
                        backgroundColor:
                            row.value === 'Will Go Higher'
                                ? 'rgba(96, 239, 255, 0.8)'
                                : row.value === 'Still calculating, please check later'
                                ? 'rgba(155, 155, 155, 0.8)'
                                : 'rgba(255, 0, 167, 0.8)',
                        transition: 'all .2s ease-out'
                    }}
                > {row.value} </div>);
            }
        }];

        // column style for conclusion
        const conclusionColumn = [{
            accessor: 'result',
            Cell: row => {
                return (<div
                    style={{
                        height: '200%',
                        marginTop: '-10px',
                        paddingTop: '10px',
                        textAlign: 'center',
                        width: '100%',
                        // color: 'black',
                        backgroundColor:
                            row.value === 'The conclusion trend for this stock will go higher in the next business day of last update date'
                                ? 'rgba(96, 239, 255, 0.8)'
                                : row.value === 'Still calculating, please check later'
                                ? 'rgba(155, 155, 155, 0.8)'
                                : 'rgba(255, 0, 167, 0.8)',
                        transition: 'all .2s ease-out'
                    }}
                > {row.value} </div>);
            }
        }];

        return (
            <Grid fluid>
                <Row>

                    {/*algorithm LASSO Regression*/}
                    <Col sm={12} md={12} lg={12}>
                        <h2 className={'centerText bottomPadding20'}>LASSO Regression Algorithm Prediction Result For Next Business Day</h2>
                        <h4 className={'centerText bottomPadding20'}>Last Update: {this.LASSODate()}</h4>
                    </Col>
                    <Col sm={12} md={12} lg={6} className='pre_winner'>
                        <h3 className={'blueColor centerText'}>Top 5 Gainers</h3>
                        <ReactTable
                            data={this.LASSOGainer()}
                            noDataText='Loading Data ...'
                            columns={top5column}
                            defaultPageSize={5}
                            showPaginationBottom={false}
                        />
                    </Col>
                    <Col sm={12} md={12} lg={6} className='pre_loser'>
                        <h3 className={'purpleColor centerText'}>Top 5 Losers</h3>
                        <ReactTable
                            data={this.LASSOLoser()}
                            noDataText='Loading Data ...'
                            columns={top5column}
                            defaultPageSize={5}
                            showPaginationBottom={false}
                        />
                    </Col>
                    <Col sm={12} md={12} lg={12}>
                        <hr/>
                    </Col>

                    {/*algorithm Dtree, SVM and SGDLiner conclusion*/}
                    <Col sm={12} md={12} lg={12} className='preAll'>
                        <h2 className={'centerText bottomPadding20'}>Algorithm Dtree, SVM and SGDLiner Prediction Result Conclusion</h2>
                        <h4 className={'centerText bottomPadding20'}>Last Update: {this.trendDate()}</h4>
                        <ReactTable
                            data={this.algConclusion()}
                            noDataText='Loading Data ...'
                            columns={conclusionColumn}
                            defaultPageSize={1}
                            showPaginationBottom={false}
                        />
                    </Col>
                    <Col sm={12} md={12} lg={12}>
                        <Image src='../../style/image/conclusionMark.png' alt='conclusionMark' responsive
                               className='responsiveImg'/>
                    </Col>

                    {/*algorithm Dtree, SVM and SGDLiner */}
                    <Col sm={12} md={12} lg={4} className='preAll'>
                        <h2 className={'centerText'}>Algorithm Dtree Prediction Result</h2>
                        <ReactTable
                            data={this.DtreeResult()}
                            noDataText='Loading Data ...'
                            columns={trendColumn}
                            defaultPageSize={1}
                            showPaginationBottom={false}
                        />
                    </Col>

                    <Col sm={12} md={12} lg={4} className='preAll'>
                        <h2 className={'centerText'}>Algorithm SVM Prediction Result</h2>
                        <ReactTable
                            data={this.SVMResult()}
                            noDataText='Loading Data ...'
                            columns={trendColumn}
                            defaultPageSize={1}
                            showPaginationBottom={false}
                        />
                    </Col>

                    <Col sm={12} md={12} lg={4} className='preAll'>
                        <h2 className={'centerText'}>Algorithm SGDLinear Prediction Result</h2>
                        <ReactTable
                            data={this.SGDLinearResult()}
                            noDataText='Loading Data ...'
                            columns={trendColumn}
                            defaultPageSize={1}
                            showPaginationBottom={false}
                        />
                    </Col>
                    <Col sm={12} md={12} lg={12} className={'bottomPadding20'}>
                        <hr/>
                    </Col>
                </Row>
            </Grid>
        )

    }
}

export default PredictionTable;