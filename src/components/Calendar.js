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
import shortid from 'shortid'


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
            open: false,
            selectedDate: moment(),
        }
    }

    getListData = (day) => {
        let listData = []
        this.props.overlayTaskShow.map((task) => {
            const startAt = moment(new Date(task.startAt)).format('MMMM Do YYYY')
            const endAt = moment(new Date(task.endAt)).format('MMMM Do YYYY')
            const dayInCalendar = moment(new Date(day)).format('MMMM Do YYYY')
            if (startAt === dayInCalendar) {
                const taskId = task.taskId
                if (task.isDone) {
                    listData.push(
                        { type: 'success', content: task.name + '(เริ่ม)', taskId, },
                    )
                } else {
                    listData.push(
                        { type: 'warning', content: task.name + '(เริ่ม)', taskId },
                    )
                }
            }
            if (endAt === dayInCalendar) {
                const taskId = task.taskId
                if (task.isDone) {
                    listData.push(
                        { type: 'success', content: task.name + '(สิ้นสุด)', taskId },
                    )
                } else {
                    listData.push(
                        { type: 'warning', content: task.name + '(สิ้นสุด)', taskId },
                    )
                }
            }
        })
        return listData || [];
    }

    dateCellRender = (value) => {
        const listData = this.getListData(value);
        return (
            <ul className="events">
                {
                    listData.map(task => (
                        <li key={task.taskId}>
                            <Badge status={task.type} text={task.content} />
                        </li>
                    ))
                }
            </ul>
        );
    }

    getMonthData = (value) => {
        // if (value.month() === 8) {
        //     return 1150;
        // }
    }

    monthCellRender = (value) => {
        // const num = this.getMonthData(value);
        // return num ? (
        //     <div className="notes-month">
        //         <section>{num}</section>
        //         <span>Time</span>
        //     </div>
        // ) : null;
    }

    onSelect = (value) => {
        this.setState({
            open: !this.state.open,
            selectedDate: value
        });
    }

    onPanelChange = (value) => {
        console.log(value, 'phang')
        this.setState({ value });
    }

    handleClose = () => {
        this.setState({ open: false });
    };

    render() {

        const { overlayTaskShow } = this.props
        const { selectedDate } = this.state;
        return (
            <div>
                <Calendar
                    dateCellRender={this.dateCellRender}
                    monthCellRender={this.monthCellRender}
                    value={selectedDate}
                    onSelect={this.onSelect}
                    onPanelChange={this.onPanelChange}
                />

                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{'งานวันที่ '}{moment(selectedDate).format('ll')}</DialogTitle>

                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {overlayTaskShow.map((task) => {
                                const day = getCompareDate(selectedDate)
                                const endAt = getCompareDate(task.endAt)
                                const startAt = getCompareDate(task.startAt)
                                return (
                                    ((day === startAt) || (day === endAt)) ?
                                        // <ListItem
                                        //     button
                                        //     className="calendar"
                                        //     key={task.taskId}
                                        // >

                                        //     <ListItemText
                                        //         primary={task.name}
                                        //     />

                                        // </ListItem>
                                        task.name

                                        :
                                        null

                                )
                            })
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

function getCompareDate(date) {
    return moment(date.toString()).format('YYYY-MM-DD')
}