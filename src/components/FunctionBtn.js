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
import FunctionIcon from '@material-ui/icons/Settings';

// CSS Import
import './Design.css';
import './FunctionBtn.css';

// JS Import
import Mapsetting from './OpenSettingMapBtn';
import GPS from './Geolocation';
import Device from './ToggleDevice';

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
                    className="FunctionButton"
                    onClick={this.handleClick}
                >
                    <FunctionIcon />
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
                    >

                        <Mapsetting />

                    </MenuItem>

                    <MenuItem
                        variant="contained"
                        color="default"
                    >

                        <GPS />

                    </MenuItem>

                    <MenuItem
                        variant="contained"
                        color="default"
                    >

                        <Device />

                    </MenuItem>



                </Menu>
            </div>
        );
    }
}
IconLabelButtons.propTypes = {

};

export default (IconLabelButtons);