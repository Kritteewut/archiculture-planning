import React, { Component } from 'react';

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
            isStartAtError: false
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

    handleChange = () => {
        const startAt = new Date(this.taskSartAtInput.value)
        const endAt = new Date(this.taskEndAtInput.value)
        if (+endAt < +startAt || this.taskEndAtInput.value === '') {
            this.setState({ isEndAtError: true, })
        }
        else {
            if (this.state.isEndAtError) {
                this.setState({ isEndAtError: false })
            }
        }

        if (+startAt > +endAt || this.taskSartAtInput.value === '') {
            this.setState({ isStartAtError: true, })
        }
        else {
            if (this.state.isStartAtError) {
                this.setState({ isStartAtError: false })
            }
        }
    }

    handleSaveClick = () => {
        if (this.taskSartAtInput.value === '' || this.taskEndAtInput.value === '') {
            return;
        }
        const { task } = this.props
        const startAt = new Date(this.taskSartAtInput.value)
        const endAt = new Date(this.taskEndAtInput.value)
        var Edittask = {
            name: this.taskNameInput.value,
            content: this.taskContentInput.value,
            startAt,
            endAt,
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
    getShowDate = (date) => {
        //(1)because of Material UI <TextFiled> accecpt date format 'YYYY-MM-DDThh:mm' with optional millisecond but just let's it go
        //incoming date format be like => YYYY-MM-DDTh:mm; eg. 2018-02-12T7:30

        //split date at 'T'(got an array with 2 element) result => result['YYYY-MM-DD', 'h:mm']
        var YMD = moment(date).format().split('T')[0]

        //result will be like 'h:mm' eg. 7:33, 12:02
        var time = moment(date).format('LT')

        //due (1) so you have to re-format it when is not fit with requirment
        //result will be like result => result[h,mm]
        var hr = time.split(':')[0]
        //convert string to integer
        var integerHr = parseInt(hr, 10)
        if (integerHr < 10) {
            //add '0' so from 7:20 become 07:20
            time = `0${time}`
        }
        var formated = `${YMD}T${time}`
        return formated
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
                                label="วันเริ่มงาน"
                                margin="normal"
                                type="datetime-local"
                                defaultValue={this.getShowDate(task.startAt)}
                                inputRef={this.setTaskSartAtInput}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={this.handleChange}
                                error={this.state.isStartAtError}
                                helperText={this.state.isStartAtError ? 'วันเริ่มงานไม่ถูกต้อง' : ''}
                            />
                            <br />
                            <TextField
                                className={classes.textField}
                                label="วันสิ้นสุดงาน"
                                margin="normal"
                                type="datetime-local"
                                defaultValue={this.getShowDate(task.endAt)}
                                inputRef={this.setTaskEndAtInput}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={this.handleChange}
                                error={this.state.isEndAtError}
                                helperText={this.state.isEndAtError ? 'วันสิ้นสุดงานไม่ถูกต้อง' : ''}
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