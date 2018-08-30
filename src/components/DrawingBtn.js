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
    buttonGrab: {
        position: 'absolute',
        bottom: theme.spacing.unit * 59,
        right: theme.spacing.unit,
        width: '125px'
    },
    buttonPoint: {
        position: 'absolute',
        bottom: theme.spacing.unit * 51,
        right: theme.spacing.unit,
        width: '125px'
    },
    buttonLine: {
        position: 'absolute',
        bottom: theme.spacing.unit * 44,
        right: theme.spacing.unit,
        width: '125px'

    },
    buttonPolygon: {
        position: 'absolute',
        bottom: theme.spacing.unit * 37,
        right: theme.spacing.unit,
        width: '125px'
    },
    buttonMarker: {
        position: 'absolute',
        bottom: theme.spacing.unit * 30,
        right: theme.spacing.unit,
        width: '125px'
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
                <Button variant="contained" color="default" className={classes.buttonGrab}
                    onClick={() => this.props.onAddListenerGrabBtn()}
                >
                    <DeleteIcon className={classes.leftIcon} />
                    Grab

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
                <Button variant="contained" color="primary" className={classes.buttonMarker}
                    onClick={() => this.props.onSaveToFirestore()}>
                    <Place className={classes.leftIcon} />
                    Marker
          </Button>
            </div>
        );
    }
}
IconLabelButtons.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(IconLabelButtons);