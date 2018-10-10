import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import purple from '@material-ui/core/colors/purple';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import update from 'immutability-helper';

import { Radio } from 'antd';

var shortid = require('shortid');



const styles = theme => ({

});

class ShowButtton extends Component {

    constructor(props) {
        super(props)
        this.state = {

        }

    }

    handleMenuChange = (e) => {
        this.setState({ size: e.target.value });
    }

    handleShowButton = (menu) => {
        this.setState({ Menu: menu });

        this.props.changeShow(menu)
    };

    render() {
        const { classes } = this.props;

        return (
            <div>
                <Radio.Group value={this.props.show} onChange={this.handleMenuChange}>
                    <Radio.Button value={'ทั้งหมด'} onClick={() => this.handleShowButton('ทั้งหมด')}>แสดงงานทั้งหมด</Radio.Button>
                    <Radio.Button value={'กำลังทำ'} onClick={() => this.handleShowButton('กำลังทำ')}>แสดงงานที่กำลังดำเนินงาน</Radio.Button>
                </Radio.Group>
            </div>
        );
    }
}
ShowButtton.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ShowButtton);