import React from 'react';

// Icon Group
import Pic from './Picture/User-dummy-300x300.png';

// CSS Import
import './Plans.css';

class Plans extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};

    }
    componentDidMount() {
        this.props.onSetPlan()
    }
    render() {
        return (null)
    }

}

Plans.propTypes = {

};

export default (Plans);