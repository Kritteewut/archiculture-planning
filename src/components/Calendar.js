import React, { Component } from 'react';

import TaskEdit from './TaskEdit';

import 'antd/dist/antd.css';
import './Calendar.css';
import { Calendar, Badge } from 'antd';
import moment from 'moment';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


const styles = theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    text: {
        textDecoration: 'line-through',
    },

});

class CalendarTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: moment(),
            selectedValue: moment(),
            open: false,
            selectedDate: '',
            items: [],
        }
        this.getListData = this.getListData.bind(this)
        this.dateCellRender = this.dateCellRender.bind(this)
        this.monthCellRender = this.monthCellRender.bind(this)
        this.onSelect = this.onSelect.bind(this)
        this.onPanelChange = this.onPanelChange.bind(this)
    }

    getListData(value) {
        let listData = []
        //console.log(this.props.items)
        this.props.items.map((item) => {
            var time = moment(new Date(item.startAt)).format('MMMM Do YYYY')
            var time2 = moment(new Date(value)).format('MMMM Do YYYY')

            if (time === time2) {
                // console.log(time, 'ตรงกัน', time2)
                listData.push(
                    { type: 'warning', content: item.name },
                )
            }
        })

        this.props.itemsHistory.map((item) => {
            var time = moment(new Date(item.startAt)).format('MMMM Do YYYY')
            var time2 = moment(new Date(value)).format('MMMM Do YYYY')

            if (time === time2) {
                // console.log(time, 'ตรงกัน', time2)
                listData.push(
                    { type: 'success', content: item.name },
                )
            }
        })

        return listData || [];
    }

    dateCellRender(value) {
        const listData = this.getListData(value);
        //console.log(listData)
        return (
            <ul className="events">
                {
                    listData.map(item => (
                        <li key={item.content}>
                            <Badge status={item.type} text={item.content} />
                        </li>
                    ))
                }
            </ul>
        );
    }

    getMonthData(value) {
        if (value.month() === 8) {
            return 1150;
        }
    }

    monthCellRender(value) {
        const num = this.getMonthData(value);
        return num ? (
            <div className="notes-month">
                <section>{num}</section>
                <span>Time</span>
            </div>
        ) : null;
    }

    onSelect = (value) => {

        var selectedDate = value._d

        var D = moment(selectedDate.toDateString()).format('YYYY-MM-DD');

        this.setState({
            value,
            selectedValue: value,
            open: !this.state.open,
            selectedDate: D
        });

        
        console.log(value._d)
        console.log(D)
        console.log(this.props.items)
    }

    onPanelChange = (value) => {
        console.log(value, 'phang')
        this.setState({ value });
    }

    handleClose = () => {
        this.setState({ open: false });
    };

    render() {

        const { items, itemsHistory, classes, editItem } = this.props
        const { value, selectedValue, selectedDate } = this.state;
        return (
            <div>
                <Calendar
                    dateCellRender={this.dateCellRender}
                    monthCellRender={this.monthCellRender}
                    value={value}
                    onSelect={this.onSelect}
                    onPanelChange={this.onPanelChange}
                />

                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{'งานวันที่ '}{moment(selectedValue).format('ll')}</DialogTitle>

                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {items.map((item) => {
                                return (
                                    <div className="calendar">
                                        {selectedDate === item.startAt ?
                                            <ListItem
                                                key={item.id}
                                                button
                                            >
                                                <ListItemText
                                                    primary={item.name} />
                                            </ListItem>
                                            : null
                                        }
                                    </div>
                                )
                            }
                            )
                            }
                            {itemsHistory.map((item) => {
                                return (
                                    <div className="calendar">
                                        {selectedDate === item.startAt ?
                                            <ListItem
                                                key={item.id}
                                                button
                                            >
                                                <ListItemText
                                                    className={classes.text}
                                                    primary={item.name}/>
                                            </ListItem>
                                            : null
                                        }
                                    </div>
                                )
                            }
                            )
                            }
                        </DialogContentText>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Close
                        </Button>

                    </DialogActions>
                </Dialog>

                

            </div>
        )
    }
}
CalendarTask.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CalendarTask);