import React from 'react';
import PropTypes from 'prop-types';

// Material-ui Import
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { withStyles } from '@material-ui/core/styles';
import MapIcon from '@material-ui/icons/FilterHdr';
import { Tooltip } from '@material-ui/core';

// Icon Group
import target_icon from './icons/target_icon.png'
import Roadmap from './Picture/Roadmap.jpg'
import Satellite from './Picture/Satellite.jpg'

// CSS Import
import './OpenSettingMapBtn.css';
import './Design.css';

/*const styles = theme => ({
    root: {
        display: 'flex',
    },
    paper: {
        marginRight: theme.spacing.unit * 2,
    },
    Menu: {
        position: 'absolute',
        top: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2,
        color: 'rgba(0, 0, 0, 0.8)',
        background: 'linear-gradient(20deg, rgba(255, 255, 255, 0.9) 40%, rgba(255, 255, 255, 0.9)) 30%',
        boxShadow: '0px 0px 0px 3px rgba(255, 255, 255, 0.60)',
    },
});*/

const mapimages = [
    {
        //src: Roadmap,
        key: ''
    },
    {
        // src: Roadmap,
        key: ''
    },
    {
        // src: Roadmap,
        key: ''
    },
    {
        //  src: Roadmap,
        key: ''
    },
]

class MenuListComposition extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        }
        this.Roadmap = null
    }

    handleToggle = () => {
        this.setState(state => ({ open: !state.open }));
    };

    handleClose = event => {
        if (this.anchorEl.contains(event.target)) {
            return;
        }

        this.setState({ open: false });
    };
    onSetMapTypeToSatellite = () => {
        //hybrid
        //roadmap
        //satellite
        //terrain
        window.map.setMapTypeId('satellite')
    }
    onSetMapTypeToRoadmap = () => {
        window.map.setMapTypeId('roadmap')
    }
    onSetMapTypeId = () => {
        console.log(window.map)
        console.log(document.getElementById('RoadmapExample'))

    }
    render() {
        const { classes } = this.props;
        const { open } = this.state;

        return (
            <div>

                <Tooltip
                    title="Change Map Style"
                    placement="right"
                    disableFocusListener
                    disableTouchListener
                >

                    <Button
                        buttonRef={node => {
                            this.anchorEl = node;
                        }}
                        aria-owns={open ? 'menu-list-grow' : null}
                        aria-haspopup="true"
                        onClick={this.handleToggle}
                        variant="fab" className="MenuSetmap"
                    >

                        <MapIcon />
                    </Button>

                </Tooltip>


                <Popper open={open} anchorEl={this.anchorEl} transition disablePortal>
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            id="menu-list-grow"
                            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                        >

                            <Paper>
                                <ClickAwayListener onClickAway={this.handleClose}>

                                    <MenuList>
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
                                    </MenuList>

                                </ClickAwayListener>
                            </Paper>

                        </Grow>
                    )}
                </Popper>
            </div>
        );
    }
}

MenuListComposition.propTypes = {

};

export default (MenuListComposition);