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
            isEndAtError: false,
            prevEndAt: null,
            isStartAtError: false,
            startAtTime: new Date(),
            startAtDate: new Date(),
            endAtTime: new Date(),
            endAtDate: new Date(),
        }
        this.taskNameInput = null
        this.setTaskNameInput = element => {
            this.taskNameInput = element;
        };

        this.taskSartAtInput = null
        this.setTaskSartAtInput = element => {
            this.taskSartAtInput = element;
        };

        this.taskEndAtInput = null
        this.setTaskEndAtInput = element => {
            this.taskEndAtInput = element;
        };

        this.taskContentInput = null
        this.setTaskContentInput = element => {
            this.taskContentInput = element;
        };
    }
    componentWillReceiveProps(props) {
        this.setState({
            startAtTime: props.task.startAt,
            startAtDate: props.task.startAt,
            endAtTime: props.task.endAt,
            endAtDate: props.task.endAt,
        })
    }
    onStartAtDateChange = (startAtDate) => {
        this.setState({ startAtDate })
    }
    onStartAtTimeChange = (startAtTime) => {
        this.setState({ startAtTime })
    }
    onEndAtDateChange = (endAtDate) => {
        this.setState({ endAtDate })
    }
    onEndAtTimeChange = (endAtTime) => {
        this.setState({ endAtTime })
    }
    onCompareDateTime = () => {
        var test = moment(new Date());
        var test2 = moment(new Date());
        console.log(test.isBefore(test2))
    }

    handleSaveClick = () => {
        const { task } = this.props
        const { startAtDate, endAtDate } = this.state
        var Edittask = {
            name: this.taskNameInput.value,
            content: this.taskContentInput.value,
            startAt: startAtDate,
            endAt: endAtDate,
        }
        const data = {
            ...task,
            ...Edittask,
        }
        this.props.onEditTask(data)
        this.props.handleToggleEditTask()
    }
    handleCancleClick = () => {
        if (this.state.isEndAtError || this.state.isStartAtError) {
            this.setState({ isEndAtError: false, isStartAtError: false })
        }
        this.props.handleToggleEditTask()
    }
    render() {
        const { task, classes, isEditTaskOpen } = this.props;
        return (
            <div>
                <Dialog
                    fullScreen
                    open={isEditTaskOpen}
                    TransitionComponent={Transition}

                >
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton color="inherit" onClick={() => this.handleCancleClick()} aria-label="Close">
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="title" color="inherit" className={classes.flex}>
                                {task.name}
                            </Typography>
                            <Button
                                color="inherit"
                                onClick={() => this.handleSaveClick()}
                                disabled={this.state.isEndAtError || this.state.isStartAtError}
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
                            />
                            <br />
                            <TextField
                                className={classes.textField}
                                label="รายละเอียด"
                                margin="normal"
                                defaultValue={task.content}
                                inputRef={this.setTaskContentInput}
                                multiline
                            />
                            <br />
                            <DateFormatInput
                                okToConfirm={true}
                                dialog={true}
                                name='date'
                                value={this.state.startAtDate}
                                onChange={this.onStartAtDateChange}
                            />
                            <br />
                            <TimeInput
                                mode='24h'
                                value={this.state.startAtTime}
                                onChange={this.onStartAtTimeChange}
                                cancelLabel='ยกเลิก'
                                okLabel='ตกลง'
                            />
                            <br />
                            <DateFormatInput
                                okToConfirm={true}
                                dialog={true}
                                name='date'
                                value={this.state.endAtDate}
                                onChange={this.onEndAtDateChange}
                            />
                            <br />
                            <TimeInput
                                mode='24h'
                                value={this.state.endAtTime}
                                onChange={this.onEndAtTimeChange}
                                cancelLabel='ยกเลิก'
                                okLabel='ตกลง'
                                label="ชื่องาน"
                            />

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