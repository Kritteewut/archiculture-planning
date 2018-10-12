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
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Label,
    Input,
} from 'reactstrap';
import TextField from '@material-ui/core/TextField';

var shortid = require('shortid');

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

class TaskEdit extends Component {
    constructor(props) {
        super(props)
        this.state = {
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

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSave() {

        var task = {
            name: this.taskNameInput.value,
            content: this.taskContentInput.value,
            startAt: new Date(this.taskSartAtInput.value),
            endAt: this.taskSartAtInput.value,
            taskId: this.props.task.taskId
        }

        console.log(task)
        this.props.handleToggleEditTask()

    }

    render() {
        const { task, classes, isEditTaskOpen, handleToggleEditTask } = this.props;

        return (
            <div>
                <Dialog
                    fullScreen
                    open={isEditTaskOpen}
                    TransitionComponent={Transition}

                >
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton color="inherit" onClick={() => handleToggleEditTask()} aria-label="Close">
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="title" color="inherit" className={classes.flex}>
                                {task.name}
                            </Typography>
                            <Button color="inherit" onClick={() => this.handleSave()}>
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
                            <TextField
                                className={classes.textField}
                                label="วันเริ่มงาน"
                                margin="normal"
                                type="date"
                                defaultValue={moment(task.startAt).format('YYYY' - 'MM' - 'DD').split('T')[0]}
                                inputRef={this.setTaskSartAtInput}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <br />
                            <TextField
                                className={classes.textField}
                                label="วันสิ้นสุดงาน"
                                margin="normal"
                                type="date"
                                defaultValue={moment(task.endAt).format('YYYY' - 'MM' - 'DD').split('T')[0]}
                                inputRef={this.setTaskEndAtInput}
                                InputLabelProps={{
                                    shrink: true,
                                }}
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