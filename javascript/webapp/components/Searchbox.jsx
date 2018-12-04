import React from 'react'

class Searchbox extends React.Component {
    // init setup, only call once when component is created
    // props is immutatable
    // component will change base on state
    constructor(props) {
        super(props);
        this.state = {
            text: props.text,
        };
    }

    // call before component is mounted to the dom
    componentWillMount() {

    }

    // call after component is mounted to the dom
    // add listenner here if needed
    componentDidMount() {

    }

    // when a new props is passed down from parents, 
    // this function will be call first
    componentWillReceiveProps(nextProps) {

    }

    // check if component should re-render
    // ignore from now
    // shouldComponentUpdate(nextProps, nextState) {

    // }

    // call before component update
    componentWillUpdate(nextProps, nextState) {

    }

    // call after component update
    componentDidUpdate(prevProps, prevState) {

    }

    // call before component is removed from dom
    // similar to destructor in c++
    // clean up before you leave to avoid memory leak (ex: remove listenner)
    componentWillUnmount() {

    }


    // will only catch error of children, not itself
    // we can ignore this function for now
    // componentDidCatch(error, info) {

    // }

    // render the React component or html component to the dom -> draw to browser
    // should return a single component
    render() {
        return ( 
            <div class="mySearch">
                <section class="flex_search">
                    <div class="searchArea">
                        <input type="text"
                               placeholder="Search for..."
                               alt="inputVal"
                               ref={input => this.search = input}
                               onchange={this.handleInputChange}
                        />
                    </div>
                    <div class="searchBtn">
                        <button>Search</button>
                    </div>
                </section>

            </div>);
    }
}

export default Searchbox;