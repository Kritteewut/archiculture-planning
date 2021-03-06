import React from 'react';

// Material-ui Import
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import MyLocation from '@material-ui/icons/MyLocation';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';

// Icon group
import IconComplete from '@material-ui/icons/Check';
import CenterFocusWeakIcon from '@material-ui/icons/CenterFocusWeak';
import Timeline from '@material-ui/icons/Timeline';
import TextureICon from '@material-ui/icons/Texture';
import FunctionIcon from '@material-ui/icons/Settings';
import PhoneIcon from '@material-ui/icons/PhoneAndroid';
import DestopIcon from '@material-ui/icons/PersonalVideo';

// CSS Import
import './Design.css';
import './FunctionBtn.css';

// JS Import
import Mapsetting from './OpenSettingMapBtn';
import GeolocatedMe from './Geolocation';
import ToggleDevice from './ToggleDevice';

//Pic Icon
import Roadmap from './Picture/Roadmap.jpg'
import Satellite from './Picture/Satellite.jpg'

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

    onSetMapTypeToRoadmap = () => {
        window.map.setMapTypeId('roadmap')
    }

    onSetMapTypeToSatellite = () => {
        //hybrid
        //roadmap
        //satellite
        //terrain
        window.map.setMapTypeId('satellite')
    }

    render() {
        const { isDrawInDesktopDevice, isFirstDraw, drawingBtnType } = this.props
        //const { drawingBtnType } = this.props;
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
                    <div className="ButtonIconColor">
                        <FunctionIcon />
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
                        onClick={this.onSetMapTypeToRoadmap}>

                        <button className="ButtonMaplayer">
                            <img src={Roadmap} className="Maplayer" alt='Roadmap' />
                        </button>

                    </MenuItem>

                    <MenuItem
                        variant="contained"
                        color="default"
                        onClick={this.onSetMapTypeToSatellite} >

                        <button className="ButtonMaplayer">
                            <img src={Satellite} className="Maplayer" alt='Satellite' />
                        </button>

                    </MenuItem>

                    <div>
                        <ToggleDevice
                            onToggleDeviceMode={this.props.onToggleDeviceMode}
                            {...this.props} />
                    </div>

                    <div>
                        <GeolocatedMe
                            onSetPanelName={this.props.onSetPanelName}
                            {...this.props}
                        />
                    </div>

                </Menu>
            </div>
        );
    }
}
IconLabelButtons.propTypes = {

};

export default (IconLabelButtons);