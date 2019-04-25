import React, { Component } from 'react';
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
import shortid from 'shortid'

const styles = theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        margin: 'auto',
    },
    text: {
        textDecoration: 'line-through',
    },
    layout: {
        width: 'auto',
        heigth: 'auto',
        marginLeft: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2,
        [theme.breakpoints.up(1000 + theme.spacing.unit * 2 * 2)]: {
            width: 1000,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3
    }
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
        this.props.overlayTaskShow.forEach((task) => {
            const { taskRepetition } = task
            if (taskRepetition) {
                if (taskRepetition.doTaskDate) {
                    const doTaskDate = moment(task.taskRepetition.doTaskDate).format().split('T')[0]
                    const dayInCalendar = day.format().split('T')[0]
                    if (doTaskDate === dayInCalendar) {
                        const taskId = shortid.generate()
                        listData.push({ type: task.isDone ? 'success' : 'warning', content: task.name, taskId, })

                    }
                }
            }

        })
        return listData;
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

    onSelect = (selectedDate) => {
        this.setState({
            open: !this.state.open,
            selectedDate
        });
    }

    onPanelChange = (selectedDate) => {

        this.setState({ selectedDate });
    }

    handleClose = () => {
        this.setState({ open: false });
    };

    render() {
        const { overlayTaskShow, classes } = this.props
        const { selectedDate } = this.state;
        return (
            <div className={classes.root}>
                <Calendar
                    //className={classes.layout}
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
                                        task.name + ''
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
    return moment(date).format('MMMM Do YYYY')
}