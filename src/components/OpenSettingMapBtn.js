import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { withStyles } from '@material-ui/core/styles';
import MapIcon from '@material-ui/icons/FilterHdr';

import MapLayer0 from './Picture/MapLayer0.jpg'
import MapLayer1 from './Picture/MapLayer1.jpg'

import './Design.css';

const styles = theme => ({
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
});

class MenuListComposition extends React.Component {
    state = {
        open: false,
    };

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

    render() {
        const { classes } = this.props;
        const { open } = this.state;

        return (
            <div>
                <Button
                    buttonRef={node => {
                        this.anchorEl = node;
                    }}
                    aria-owns={open ? 'menu-list-grow' : null}
                    aria-haspopup="true"
                    onClick={this.handleToggle}
                    variant="fab" className={classes.Menu}
                >
                    <MapIcon />
                </Button>
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

                                        <MenuItem onClick={this.onSetMapTypeToRoadmap}>
                                            <button className="ButtonMaplayer">
                                                <img src={MapLayer0} className="Maplayer" />
                                            </button>
                                        </MenuItem>

                                        <MenuItem onClick={this.onSetMapTypeToSatellite} >
                                            <button className="ButtonMaplayer">
                                                <img src={MapLayer1} className="Maplayer" />
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
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MenuListComposition);