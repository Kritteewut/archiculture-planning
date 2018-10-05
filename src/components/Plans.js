import React, { Component } from 'react';
import { mailFolderListItems, otherMailFolderListItems } from './tileData';
import firebase, { auth, provider, provider2 } from '../config/firebase';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Material-ui Import
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CardHeader from '@material-ui/core/CardHeader';

// Icon Group
import Pic from './Picture/User-dummy-300x300.png';

// CSS Import
import './Plans.css';

/*const styles = theme => ({
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
});*/

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
            <div className="toolbar">


                {this.state.user ?
                    <div className="userName">
                        <Avatar
                            alt={this.state.user.displayName || this.state.user.email}
                            src={this.state.user.photoURL || Pic}
                            className="bigAvatar"
                        />
                        <Typography variant="title">{this.state.user.displayname || this.state.user.email}  </Typography>
                    </div>
                    :
                    <Avatar
                        alt="No User"
                        src="/static/images/uxceo-128.jpg"
                        className="avatar bigAvatar"
                    />
                }


                <Divider />
                <List>{mailFolderListItems}</List>
                <Divider />
                <List>{otherMailFolderListItems}</List>
                <Button variant="contained" color="secondary" className="button" onClick={this.logout}> logout </Button>
            </div>
        );


    }

}

Plans.propTypes = {
    
};

export default (Plans);