import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import moment from 'moment';
import TaskEdit from './TaskEdit';
import TaskDelete from './TaskDelete';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Paper from '@material-ui/core/Paper';
import FormatListBulleted from '@material-ui/icons/FormatListBulleted';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

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

class TaskShow extends Component {

    constructor(props) {
        super(props)
        this.state = {
            checked: [1],
            item: [],
            openEdit: false,
            openDelete: false,
            selectedTaskIndex: '',
        }
    }

    handleEditOpen = (value, index) => {
        this.setState({ item: value, openEdit: true, selectedTaskIndex: index })
    }

    handleToggleEditTask = () => {
        this.setState({ openEdit: !this.state.openEdit })
    }

    handleToggleDeleteTask = (close) => {
        this.setState({ openDelete: close })
    }

    handleDeleteOpen = (value, index) => {
        this.setState({ item: value, openDelete: true, selectedTaskIndex: index })
    }

    handleToggle = value => () => {
        const { checked } = this.state;
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        this.setState({
            checked: newChecked,
        });
        console.log(newChecked)

        this.props.taskDone(value)
    };

    handleToggleHistory = value => () => {
        const { checked } = this.state;
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        this.setState({
            checked: newChecked,
        });
        console.log(newChecked)

        this.props.taskBack(value)
    };

    render() {
        const { items, classes, editItem, deleteItem, itemsHistory, show } = this.props;
        return (
            <div className={classes.root}>

                <main className={classes.layout}>

                    <List component="nav">
                        {items.map((value, index) => {
                            return (
                                <ListItem
                                    key={value.id}
                                    button
                                    onClick={() => this.handleEditOpen(value, index)}
                                >
                                    <ListItemText
                                        primary={value.name}
                                        secondary={moment(value.startAt).format('ll')} />

                                    {this.props.menu === 'ลบงาน' ?
                                        <ListItemSecondaryAction>
                                            <IconButton aria-label="Delete" onClick={() => this.handleDeleteOpen(value, index)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                        :
                                        <ListItemSecondaryAction>
                                            <Checkbox
                                                onChange={this.handleToggle(value)}
                                                checked={false}
                                            />
                                        </ListItemSecondaryAction>
                                    }
                                </ListItem>
                            )
                        }
                        )
                        }

                        <br />
                        
                        {show === 'ทั้งหมด' ?
                            <div>
                                <Divider />
                                <Typography variant="caption" gutterBottom>
                                    งานที่เสร็จแล้ว
                                </Typography>
                                <br />
                                {itemsHistory.map((value, index) => {
                                    return (
                                        <ListItem
                                            key={value.id}
                                            button
                                            onClick={() => this.handleEditOpen(value, index)}
                                        >
                                            <ListItemText
                                                className={classes.text}
                                                primary={value.name}
                                            />

                                            {this.props.menu === 'ลบงาน' ?
                                                <ListItemSecondaryAction>
                                                    <IconButton aria-label="Delete" onClick={() => this.handleDeleteOpen(value, index)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                                :
                                                <ListItemSecondaryAction>
                                                    <Checkbox
                                                        onChange={this.handleToggleHistory(value)}
                                                        checked={true}
                                                    />
                                                </ListItemSecondaryAction>
                                            }
                                        </ListItem>
                                    )
                                }
                                )
                                }</div> : null}

                    </List>


                </main>
                <TaskEdit
                    handleToggleEditTask={this.handleToggleEditTask}
                    editItem={editItem}
                    {...this.state}
                />

                <TaskDelete
                    handleToggleDeleteTask={this.handleToggleDeleteTask}
                    deleteItem={deleteItem}
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
