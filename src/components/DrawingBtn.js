import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import Timeline from '@material-ui/icons/Timeline';
import KeyboardVoiceICon from '@material-ui/icons/KeyboardVoice';
import SendIcon from '@material-ui/icons/Send';
import Place from '@material-ui/icons/Place';
// import Category from '@material-ui/icons/Category';

const styles = theme => ({
    buttonComplete: {
        position: 'absolute',
        bottom: theme.spacing.unit * 31,
        left: theme.spacing.unit * 1.5,
        width: '125px',
        color: 'rgb(255, 255, 255)',
        background: 'linear-gradient(20deg, rgba(37, 37, 37, 0.9) 40%, rgba(0, 43, 161, 0.9)) 30%',
        boxShadow: '0px 0px 0px 3px rgba(255, 255, 255, 0.60)',
    },
    buttonPoint: {
        position: 'absolute',
        bottom: theme.spacing.unit * 23,
        left: theme.spacing.unit * 1.5,
        width: '125px',
        color: 'rgb(255, 255, 255)',
        background: 'linear-gradient(20deg, rgba(37, 37, 37, 0.9) 40%, rgba(37, 37, 37, 0.9)) 60%',
        boxShadow: '0px 0px 0px 3px rgba(255, 255, 255, 0.60)',
    },
    buttonLine: {
        position: 'absolute',
        bottom: theme.spacing.unit * 15,
        left: theme.spacing.unit * 1.5,
        width: '125px',
        color: 'rgb(255, 255, 255)',
        background: 'linear-gradient(20deg, rgba(37, 37, 37, 0.9) 40%, rgba(37, 37, 37, 0.9)) 60%',
        boxShadow: '0px 0px 0px 3px rgba(255, 255, 255, 0.60)',

    },
    buttonPolygon: {
        position: 'absolute',
        bottom: theme.spacing.unit * 7,
        left: theme.spacing.unit * 1.5,
        width: '125px',
        color: 'rgb(255, 255, 255)',
        background: 'linear-gradient(20deg, rgba(37, 37, 37, 0.9) 40%, rgba(37, 37, 37, 0.9)) 60%',
        boxShadow: '0px 0px 0px 3px rgba(255, 255, 255, 0.60)',
    },


    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
    iconSmall: {
        fontSize: 20,
    },
});

class IconLabelButtons extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        const { classes } = this.props;
        return (
            <div>
                <Button variant="contained" color="default" className={classes.buttonComplete}
                    onClick={() => this.props.onAddListenerGrabBtn()}
                >
                    <DeleteIcon className={classes.leftIcon} />
                    Complete

          </Button>
                <Button variant="contained" color="default" className={classes.buttonPoint}
                    onClick={() => this.props.onAddListenerMarkerBtn()}
                >
                    <SendIcon className={classes.leftIcon} />
                    Point

          </Button>
                <Button variant="contained" color="default" className={classes.buttonLine}
                    onClick={() => this.props.onAddListenerPolylineBtn()}>
                    <Timeline className={classes.leftIcon} />
                    Polyline

          </Button>
                <Button variant="contained" color="default" className={classes.buttonPolygon}
                    onClick={() => this.props.onAddListenerPolygonBtn()}>
                    <KeyboardVoiceICon className={classes.leftIcon} />
                    Polygon
          </Button>


            </div>
        );
    }
}
IconLabelButtons.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(IconLabelButtons);