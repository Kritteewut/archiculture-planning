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
                    <div className="ButtonIconColor">
                        <IconToolArt />
                    </div>
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
                        //className="buttonPoint"
                        onClick={() => this.props.onAddListenerMarkerBtn()}
                        disabled={(drawingBtnType === 'marker') ? true : false}
                    >
                        <CenterFocusWeakIcon className="leftIcon ButtonIconColor" />
                        Point

                </MenuItem>

                    <MenuItem
                        variant="contained"
                        color="default"
                        //className="buttonLine"
                        onClick={() => this.props.onAddListenerPolylineBtn()}
                        disabled={(drawingBtnType === 'polyline') ? true : false}
                    >
                        <Timeline className="leftIcon ButtonIconColor" />
                        Polyline

                </MenuItem>

                    <MenuItem
                        variant="contained"
                        color="default"
                        //className="buttonPolygon"
                        onClick={() => this.props.onAddListenerPolygonBtn()}
                        disabled={(drawingBtnType === 'polygon') ? true : false}
                    >
                        <TextureICon className="leftIcon ButtonIconColor" />
                        Polygon
                </MenuItem>

                </Menu>

                <Button
                    variant="fab"
                    color="default"
                    className="buttonComplete"
                    onClick={() => this.props.onAddListenerGrabBtn()}
                >
                    <div className="ButtonIconColor">
                        <IconComplete />
                    </div>
                </Button>

            </div>
        );
    }
}
IconLabelButtons.propTypes = {

};

export default (IconLabelButtons);