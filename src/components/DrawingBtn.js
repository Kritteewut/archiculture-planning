import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material-ui Import
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import target_icon from './icons/target_icon.png'

// Icon group
import IconComplete from '@material-ui/icons/Check';
import CenterFocusWeakIcon from '@material-ui/icons/CenterFocusWeak';
import Timeline from '@material-ui/icons/Timeline';
import TextureICon from '@material-ui/icons/Texture';
import PhoneIcon from '@material-ui/icons/PhoneAndroid';
import DestopIcon from '@material-ui/icons/PersonalVideo';
import TargetIcon from '@material-ui/icons/Flare';

// CSS Import
import './Design.css';
import './DrawingBtn.css';

// import Category from '@material-ui/icons/Category';

/*const styles = theme => ({
    buttonComplete: {
        position: 'absolute',
        top: theme.spacing.unit * 43,
        left: theme.spacing.unit * 1.5,
        width: '125px',
        color: 'rgba(0, 0, 0, 0.8)',
        background: 'linear-gradient(20deg, rgba(255, 255, 255, 0.9) 40%, rgba(255, 255, 255, 0.9)) 30%',
        boxShadow: '0px 0px 0px 3px rgba(255, 255, 255, 0.60)',
    },
    buttonPoint: {
        position: 'absolute',
        top: theme.spacing.unit * 51,
        left: theme.spacing.unit * 1.5,
        width: '125px',
        color: 'rgba(0, 0, 0, 0.8)',
        background: 'linear-gradient(20deg, rgba(255, 255, 255, 0.9) 40%, rgba(255, 255, 255, 0.9)) 30%',
        boxShadow: '0px 0px 0px 3px rgba(255, 255, 255, 0.60)',
    },
    buttonLine: {
        position: 'absolute',
        top: theme.spacing.unit * 59,
        left: theme.spacing.unit * 1.5,
        width: '125px',
        color: 'rgba(0, 0, 0, 0.8)',
        background: 'linear-gradient(20deg, rgba(255, 255, 255, 0.9) 40%, rgba(255, 255, 255, 0.9)) 30%',
        boxShadow: '0px 0px 0px 3px rgba(255, 255, 255, 0.60)',

    },
    buttonPolygon: {
        position: 'absolute',
        top: theme.spacing.unit * 67,
        left: theme.spacing.unit * 1.5,
        width: '125px',
        color: 'rgba(0, 0, 0, 0.8)',
        background: 'linear-gradient(20deg, rgba(255, 255, 255, 0.9) 40%, rgba(255, 255, 255, 0.9)) 30%',
        boxShadow: '0px 0px 0px 3px rgba(255, 255, 255, 0.60)',
    },
    buttonToggleDeviceMode: {
        position: 'absolute',
        top: theme.spacing.unit * 75,
        left: theme.spacing.unit * 1.5,
        width: '125px',
        color: 'rgba(0, 0, 0, 0.8)',
        background: 'linear-gradient(20deg, rgba(255, 255, 255, 0.9) 40%, rgba(255, 255, 255, 0.9)) 30%',
        boxShadow: '0px 0px 0px 3px rgba(255, 255, 255, 0.60)',
    },
    buttonTarget: {
        position: 'relative',
        top: theme.spacing.unit * 105,
        //left: theme.spacing.unit * 60,
        left: '50%',
        color: 'rgba(0, 0, 0, 0.8)',
        background: 'linear-gradient(20deg, rgba(255, 255, 255, 0.9) 40%, rgba(255, 255, 255, 0.9)) 30%',
        boxShadow: '0px 0px 0px 3px rgba(255, 255, 255, 0.60)',
    },
    targetIcon: {
        position: 'relative',
        //top: '50%',
        //bottom: '50%',
        //left: '45%',
        top: theme.spacing.unit * 54,
        left: theme.spacing.unit * 84,
        //right: '50%'
        // color: 'rgba(0, 0, 0, 0.8)',
        // background: 'linear-gradient(20deg, rgba(255, 255, 255, 0.9) 40%, rgba(255, 255, 255, 0.9)) 30%',
        // boxShadow: '0px 0px 0px 3px rgba(255, 255, 255, 0.60)',
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    pointIcon: {
        marginRight: theme.spacing.unit * 4,
    },
    iconSmall: {
        fontSize: 20,
    },
});*/

class IconLabelButtons extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {}
    }
    handleTargetClick = () => {
        const { drawOverlayUsingTouchScreen } = this.props
        drawOverlayUsingTouchScreen()
    }
    render() {
        const {  drawingBtnType, isDrawInDesktopDevice, isFirstDraw
        } = this.props;

        return (
            <div>
                <Button
                    variant="contained"
                    color="default"
                    className="buttonComplete"
                    onClick={() => this.props.onAddListenerGrabBtn()}
                >
                    <IconComplete className="leftIcon" />
                    Complete

                </Button>
                <Button
                    variant="contained"
                    color="default"
                    className="buttonPoint"
                    onClick={() => this.props.onAddListenerMarkerBtn()}
                    disabled={(drawingBtnType === 'marker') ? true : false}
                >
                    <CenterFocusWeakIcon className="leftIcon" />
                    Point

                </Button>
                <Button
                    variant="contained"
                    color="default"
                    className="buttonLine"
                    onClick={() => this.props.onAddListenerPolylineBtn()}
                    disabled={(drawingBtnType === 'polyline') ? true : false}
                >
                    <Timeline className="leftIcon" />
                    Polyline

                </Button>
                <Button
                    variant="contained"
                    color="default"
                    className="buttonPolygon"
                    onClick={() => this.props.onAddListenerPolygonBtn()}
                    disabled={(drawingBtnType === 'polygon') ? true : false}
                >
                    <TextureICon className="leftIcon" />
                    Polygon
                </Button>

                <Button
                    variant="contained"
                    color="default"
                    className="buttonToggleDeviceMode"
                    onClick={() => this.props.onToggleDeviceMode()}
                    disabled={drawingBtnType || !isFirstDraw ? true : false}
                >
                    {
                        isDrawInDesktopDevice ?
                            <DestopIcon className="leftIcon" />
                            :
                            <PhoneIcon className="leftIcon" />
                    }

                    {
                        isDrawInDesktopDevice ?
                            'DESKTOP'
                            :
                            'TOUCH'
                    }
                </Button>

                {isDrawInDesktopDevice ?
                    null
                    :
                    <div>
                        <Button
                            variant="fab"
                            className="buttonTarget"
                            onClick={this.handleTargetClick}
                            disabled={(drawingBtnType || !isFirstDraw) ? false : true}
                        >
                            <TargetIcon />

                        </Button>
                        {(drawingBtnType || !isFirstDraw) ?
                            <Button
                                className="targetIcon"
                                disabled={true}
                            >
                                <img
                                    src={target_icon}
                                    alt='Target'
                                />
                            </Button>
                            :
                            null
                        }
                    </div>

                }


            </div>
        );
    }
}
IconLabelButtons.propTypes = {

};

export default (IconLabelButtons);