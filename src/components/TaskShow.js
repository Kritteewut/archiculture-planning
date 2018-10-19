import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import moment from 'moment';
import TaskEdit from './TaskEdit';
import TaskDelete from './TaskDelete';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import './TaskShow.css';
import 'moment/locale/th';

var shortid = require('shortid');

const styles = theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2,
        [theme.breakpoints.up(1000 + theme.spacing.unit * 2 * 2)]: {
            width: 1000,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    text: {
        textDecoration: 'line-through',
    },

});

class TaskShow extends React.PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            checked: [1],
            task: [],
            isEditTaskOpen: false,
            isDeleteTaskOpen: false,
            selectedTaskIndex: '',
        }
    }

    handleEditOpen = (task) => {
        this.setState({ task, isEditTaskOpen: true })
    }

    handleToggleEditTask = () => {
        this.setState({ isEditTaskOpen: !this.state.isEditTaskOpen })
    }

    handleDeleteTaskClick = (task) => {
        this.setState({ task, isDeleteTaskOpen: true })
    }
    handleToggleDeleteTask = () => {
        this.setState({ isDeleteTaskOpen: !this.state.isDeleteTaskOpen })
    }

    render() {
        const { overlayTaskShow, classes, } = this.props;
        return (
            <div className={classes.root}>

                <main className={classes.layout}>

                    <List component="nav">
                        {overlayTaskShow.map((task) => {
                            return (
                                <ListItem
                                    key={task.taskId}
                                    button
                                    onClick={() => this.props.onToggleIsTaskDone(task.taskId)}
                                >
                                    <ListItemText
                                        primary={task.name}
                                        secondary={'เริ่มงาน : ' + moment(task.startAt).format('ll')}
                                    />
                                    <ListItemSecondaryAction>

                                        <IconButton aria-label="Edit"
                                            onClick={() => this.handleEditOpen(task)}
                                        >
                                            <EditIcon />
                                        </IconButton>

                                        <IconButton aria-label="Delete" onClick={() => this.handleDeleteTaskClick(task)}>
                                            <DeleteIcon />
                                        </IconButton>

                                        <Checkbox
                                            onChange={() => this.props.onToggleIsTaskDone(task.taskId)}
                                            checked={task.isDone}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )
                        })
                        }
                    </List>


                </main>
                <TaskEdit
                    handleToggleEditTask={this.handleToggleEditTask}
                    onEditTask={this.props.onEditTask}
                    {...this.state}
                />

                <TaskDelete
                    handleToggleDeleteTask={this.handleToggleDeleteTask}
                    onDeleteTask={this.props.onDeleteTask}
                    {...this.state}
                />
            </div>
        );
    }
}

TaskShow.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TaskShow);
