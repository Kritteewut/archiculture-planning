import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';
import { DateFormatInput } from 'material-ui-next-pickers'
import TimeInput from 'material-ui-time-picker'
import TaskRepetition from './TaskRepetition';

const styles = theme => ({
    appBar: {
        position: 'relative',
        backgroundColor: '#00CCFF'
    },
    flex: {
        flex: 1,
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2,
        [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3,
        padding: theme.spacing.unit * 2,
        [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
            marginTop: theme.spacing.unit * 6,
            marginBottom: theme.spacing.unit * 6,
            padding: theme.spacing.unit * 3,
        },
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
});

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class TaskEdit extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            taskRepetition: null,
            taskDueDate: null,
        }
        this.taskNameInput = null
        this.setTaskNameInput = element => {
            this.taskNameInput = element;
        };
        this.taskContentInput = null
        this.setTaskContentInput = element => {
            this.taskContentInput = element;
        };
    }
    componentWillReceiveProps(props) {
        const { taskRepetition, taskDueDate } = props.task
        if (taskRepetition) {
            this.setState({ taskRepetition })
        } else {
            if (taskDueDate) {
                this.setState({ taskDueDate })
            }
        }
    }
    onDueDateChange = (date) => {
        const { taskDueDate } = this.state
        var format = this.onFormatedDateTime(date, taskDueDate)
        this.setState({ taskDueDate: format })
    }
    onDueTimeChange = (time) => {
        const { taskDueDate } = this.state
        var format = this.onFormatedDateTime(taskDueDate, time)
        this.setState({ taskDueDate: format })
    }
    onFormatedDateTime = (unCloneDate, time) => {
        var date = moment(unCloneDate).clone()
        var format = moment(date).minute(moment(time).minute())
        format = moment(format).hours(moment(time).hours()).toDate()
        return format
    }
    handleSaveClick = () => {
        const { taskId } = this.props.task
        const { taskDueDate, taskRepetition } = this.state
        var Edittask = {
            name: this.taskNameInput.value,
            content: this.taskContentInput.value,
            taskRepetition,
            taskDueDate,
        }
        this.props.onEditTask(taskId, Edittask)
        this.props.handleToggleEditTask()
        this.onResetState()
    }
    handleCancleClick = () => {
        this.onResetState()
        this.props.handleToggleEditTask()
    }
    onSetDueDate = () => {
        this.setState({ taskDueDate: new Date() })
    }
    onSetTaskRepetition = (taskRepetition) => {
        this.setState({ taskRepetition, taskDueDate: null })
        console.log(taskRepetition)
    }
    onSetDueDateNull = () => {
        this.setState({ taskDueDate: null })
    }
    onResetState = () => {
        this.setState({ taskRepetition: null, taskDueDate: null, })
    }
    render() {
        const { task, classes, isEditTaskOpen } = this.props;
        const { taskRepetition, taskDueDate } = this.state
        return (
            <div>
                <Dialog
                    fullScreen
                    open={isEditTaskOpen}
                    TransitionComponent={Transition}
                >
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton color="inherit" onClick={this.handleCancleClick} aria-label="Close">
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="title" color="inherit" className={classes.flex}>
                                {task.name}
                            </Typography>
                            <Button
                                color="inherit"
                                onClick={this.handleSaveClick}
                            >
                                save
                            </Button>
                        </Toolbar>
                    </AppBar>

                    <main className={classes.layout}>
                        <Paper className={classes.paper}>
                            <TextField
                                className={classes.textField}
                                label="ชื่องาน"
                                margin="normal"
                                defaultValue={task.name}
                                inputRef={this.setTaskNameInput}
                                autoFocus={true}
                                name='taskName'
                            />
                            <br />
                            <TextField
                                className={classes.textField}
                                label="รายละเอียด"
                                margin="normal"
                                defaultValue={task.content}
                                inputRef={this.setTaskContentInput}
                                multiline
                                name={'taskDescription'}
                            />
                            <br />
                            <TaskRepetition
                                onSetTaskRepetition={this.onSetTaskRepetition}
                                {...this.state}
                            />
                            {
                                taskRepetition ?
                                    null
                                    :
                                    taskDueDate ?
                                        <div>
                                            <DateFormatInput
                                                okToConfirm={true}
                                                dialog={true}
                                                name='date'
                                                value={this.state.taskDueDate}
                                                onChange={this.onDueDateChange}
                                            />
                                            <br />
                                            <TimeInput
                                                mode='24h'
                                                value={this.state.taskDueDate}
                                                onChange={this.onDueTimeChange}
                                                cancelLabel='ยกเลิก'
                                                okLabel='ตกลง'
                                                label="ชื่องาน"
                                            />
                                            <Button
                                                onClick={this.onSetDueDateNull}
                                            >
                                                ยกเลิกการกำหนดวันสิ้นสุด
                                        </Button>
                                        </div >
                                        :
                                        <Button
                                            onClick={this.onSetDueDate}
                                        >
                                            ไม่มีการกำหนดวันสิ้นสุด
                                        </Button>
                            }
                        </Paper>
                    </main>
                </Dialog>
            </div>
        )
    }
}

TaskEdit.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TaskEdit);