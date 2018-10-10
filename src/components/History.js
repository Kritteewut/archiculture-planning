import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import TaskEdit from './TaskEdit';
import TaskDelete from './TaskDelete';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

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

class History extends Component {

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

    render() {
        const { itemsHistory, classes, deleteItem, editItem } = this.props;
        return (
            <div className={classes.root}>
                <main className={classes.layout}>
                    <List component="nav">
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

                                    <ListItemSecondaryAction>
                                        <IconButton aria-label="Delete" onClick={() => this.handleDeleteOpen(value, index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>


                                </ListItem>
                            )
                        }
                        )
                        }
                    </List>

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

                </main>
            </div>
        )
    }
}

History.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(History);

