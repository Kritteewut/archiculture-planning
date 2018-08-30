import React, { Component } from 'react';
import { mailFolderListItems, otherMailFolderListItems } from './tileData';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import firebase, { auth, provider, provider2 } from '../config/firebase';
import Avatar from '@material-ui/core/Avatar';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Pic from './Picture/User-dummy-300x300.png';
import CardHeader from '@material-ui/core/CardHeader';

const styles = theme => ({
    toolbar: theme.mixins.toolbar,
    row: {
        display: 'flex',
        justifyContent: 'center',
    },
    avatar: {
        margin: 0,
    },
    bigAvatar: {
        margin: 5,
        width: 60,
        height: 60,
    },
    userName: {
        display: 'flex',
        justifyContent: 'center',
    },
});

class Plans extends React.PureComponent {

    constructor() {
        super();
        this.state = {
        };
        this.logout = this.logout.bind(this);
    }


    logout() {
        this.props.logout()
    }

    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({ user });
            }
        });
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.toolbar}>


                {this.state.user ?
                    <div className={classes.userName}>
                        <Avatar
                            alt={this.state.user.displayName || this.state.user.email}
                            src={this.state.user.photoURL || Pic}
                            className={classNames(classes.bigAvatar)}
                        />
                        <Typography variant="title">{this.state.user.displayname || this.state.user.email}  </Typography>
                    </div>
                    :
                    <Avatar
                        alt="No User"
                        src="/static/images/uxceo-128.jpg"
                        className={classNames(classes.avatar, classes.bigAvatar)}
                    />
                }


                <Divider />
                <List>{mailFolderListItems}</List>
                <Divider />
                <List>{otherMailFolderListItems}</List>
                <Button variant="contained" color="secondary" className={classes.button} onClick={this.logout}> logout </Button>
            </div>
        );


    }

}

Plans.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Plans);