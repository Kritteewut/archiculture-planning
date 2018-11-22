import React from 'react';

// Material-ui Import
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

// Icon group
import IconComplete from '@material-ui/icons/Check';
import CenterFocusWeakIcon from '@material-ui/icons/CenterFocusWeak';
import Timeline from '@material-ui/icons/Timeline';
import TextureICon from '@material-ui/icons/Texture';
import IconToolArt from '@material-ui/icons/Brush';

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

    state = {
        anchorEl: null,
    };

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    render() {
        const { drawingBtnType } = this.props;
        const { anchorEl } = this.state;

        return (
            <div>

                <Button
                    variant="fab"
                    aria-owns={anchorEl ? 'simple-menu' : null}
                    aria-haspopup="true"
                    color="default"
                    className="MenuToolButton"
                    onClick={this.handleClick}
                >
                    <IconToolArt />
                </Button>

                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >

                    <MenuItem
                        variant="contained"
                        color="default"
                        //className="buttonComplete"
                        onClick={() => this.props.onAddListenerGrabBtn()}
                    >
                        <IconComplete className="leftIcon" />
                        Complete

                    </MenuItem>

                    <MenuItem
                        variant="contained"
                        color="default"
                        //className="buttonPoint"
                        onClick={() => this.props.onAddListenerMarkerBtn()}
                        disabled={(drawingBtnType === 'marker') ? true : false}
                    >
                        <CenterFocusWeakIcon className="leftIcon" />
                        Point

                </MenuItem>

                    <MenuItem
                        variant="contained"
                        color="default"
                        //className="buttonLine"
                        onClick={() => this.props.onAddListenerPolylineBtn()}
                        disabled={(drawingBtnType === 'polyline') ? true : false}
                    >
                        <Timeline className="leftIcon" />
                        Polyline

                </MenuItem>

                    <MenuItem
                        variant="contained"
                        color="default"
                        //className="buttonPolygon"
                        onClick={() => this.props.onAddListenerPolygonBtn()}
                        disabled={(drawingBtnType === 'polygon') ? true : false}
                    >
                        <TextureICon className="leftIcon" />
                        Polygon
                </MenuItem>




                </Menu>
            </div>
        );
    }
}
IconLabelButtons.propTypes = {

};

export default (IconLabelButtons);