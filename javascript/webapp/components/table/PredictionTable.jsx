import React, {Component} from 'react';
import ReactTable from "react-table";

// import css for react-table
import './Table.scss';

const data = [{
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
    percentage: '+0.15%',
}];

class PredictionTable extends Component {

    constructor(props) {
        super(props);

        // create state from props that pass down from parent
        this.state = {
            data: data,
        };
    }

    render() {
        const columns = [{
            // Header: 'Name',
            accessor: 'company'
        }, {
            // Header: 'Age',
            accessor: 'number'
        }, {
            accessor: 'percentage',
            style: {
                background: 'rgba(96, 239, 255, 0.4)',
                color: 'black',

            },
        }
        ];

        return (
            <div id="pre_winner">
                <ReactTable
                    data={data}
                    columns={columns}
                    defaultPageSize={5}
                    showPaginationBottom={false}
                />
            </div>
        )

    }
}

export default PredictionTable;