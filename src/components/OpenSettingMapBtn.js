import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import MountainIcon from '@material-ui/icons/FilterHdr';
import { withStyles } from '@material-ui/core/styles';

import icon_airport from './icons/icon_airplane.png'
import icon_alert from './icons/icon_alert.png'
import icon_bamboo from './icons/icon_bamboo.png'
import icon_bonsai from './icons/icon_bonsai.png'
import icon_clock from './icons/icon_clock.png'
import icon_home from './icons/icon_home.png'
import icon_location from './icons/icon_location.png'
import icon_point from './icons/icon_point.png'
import icon_rain from './icons/icon_rain.png'
import icon_sakura1 from './icons/icon_sakura1.png'
import icon_sakura2 from './icons/icon_sakura2.png'
import icon_sale from './icons/icon_sale.png'
import icon_snow from './icons/icon_snow.png'
import icon_star from './icons/icon_star.png'
import icon_tool1 from './icons/icon_tool1.png'
import icon_tool2 from './icons/icon_tool2.png'
import light_bulb_icon from './icons/light_bulb_icon.png'
/* picture */
import Maplayer0 from './Picture/MapLayer0.jpg';
const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        minWidth: 300,
        width: '100%',
        zIndex:'1'
    },
    paper: {
        marginRight: theme.spacing.unit * 2,
    },
    Menu: {
        position: 'absolute',
        top: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2,
        color: 'rgb(255, 255, 255)',
        background: 'linear-gradient(20deg, rgba(37, 37, 37, 0.85) 40%, rgba(0, 43, 161, 0.9)) 60%',
        boxShadow: '0px 0px 0px 5px rgba(255, 255, 255, 0.60)',
    },

    image: {
        position: 'relative',
        height: 200,
        [theme.breakpoints.down('xs')]: {
            width: '100% !important', // Overrides inline-style
            height: 100,
        },
        '&:hover, &$focusVisible': {
            zIndex: 1,
            '& $imageBackdrop': {
                opacity: 0.15,
            },
            '& $imageMarked': {
                opacity: 0,
            },
            '& $imageTitle': {
                border: '4px solid currentColor',
            },
        },
    },
    focusVisible: {},
    imageButton: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.palette.common.white,
    },
    imageSrc: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
    },
    imageBackdrop: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: theme.palette.common.black,
        opacity: 0.4,
        transition: theme.transitions.create('opacity'),
    },
    imageTitle: {
        position: 'relative',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 4}px ${theme.spacing.unit + 6}px`,
    },
    imageMarked: {
        height: 3,
        width: 18,
        backgroundColor: theme.palette.common.white,
        position: 'absolute',
        bottom: -2,
        left: 'calc(50% - 9px)',
        transition: theme.transitions.create('opacity'),
    },
});


const images = [
    {
        src: Maplayer0,
        title: 'จุด',
        width: '5%',
        height: '5%',
    },
    {
        src: light_bulb_icon,
        title: 'หลอดไฟ',
        width: '5%',
        height: '5%',
    },
    {
        src: icon_airport,
        title: 'สนามบิน',
        width: '5%',
        height: '5%',
    },
    {
        src: icon_alert,
        title: 'เตือนภัย',
        width: '5%',
        height: '5%',
    },
    {
        src: icon_bamboo,
        title: 'เขตป่าไม้',
        width: '5%',
        height: '5%',
    },
    {
        src: icon_bonsai,
        title: 'เขตสวน',
        width: '5%',
        height: '5%',
    },
    {
        src: icon_clock,
        title: 'เตือนเวลา',
        width: '5%',
        height: '5%',
    },
    {
        src: icon_home,
        title: 'บ้าน',
        width: '5%',
        height: '5%',
    },
    {
        src: icon_location,
        title: 'จุดตำแหน่ง',
        width: '5%',
        height: '5%',
    },
    {
        src: icon_rain,
        title: 'สภาพอากาศฝนตก',
        width: '5%',
        height: '5%',
    },
    {
        src: icon_sakura1,
        title: 'ดอกไม้1',
        width: '5%',
        height: '5%',
    },
    {
        src: icon_sakura2,
        title: 'ดอกไม้2',
        width: '5%',
        height: '5%',
    },
    {
        src: icon_sale,
        title: 'ขาย',
        width: '5%',
        height: '5%',
    },
    {
        src: icon_snow,
        title: 'สภาพอากาศหนาว',
        width: '5%',
        height: '5%',
    },
    {
        src: icon_star,
        title: 'จุดสำคัญ',
        width: '5%',
        height: '5%',
    },
    {
        src: icon_tool1,
        title: 'จุดแก้ไข1',
        width: '5%',
        height: '5%',
    },
    {
        src: icon_tool2,
        title: 'จุดแก้ไข2',
        width: '5%',
        height: '5%',
    },


];


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

    render() {
        const { classes } = this.props;
        const { open } = this.state;

        return (
            <div className={classes.root}>
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

                        <MountainIcon />
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
                                        {images.map(image => (
                    <ButtonBase
                        focusRipple
                        key={image.title}
                        className={classes.image}
                        focusVisibleClassName={classes.focusVisible}
                        style={{
                            width: '8.7vw',
                        }}
                        onClick={() => this.props.onSetSelectedIcon(image.src)}
                    >

                        <span
                            className={classes.imageSrc}
                            style={{
                                backgroundImage: `url(${image.src})`,
                            }}
                        />
                        <span className={classes.imageButton}>
                        </span>
                    </ButtonBase>
                ))}
                                        </MenuList>

                                    </ClickAwayListener>
                                </Paper>
                            </Grow>

                        )}

                    </Popper>
                </div>
            </div>
        );
    }
}

MenuListComposition.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MenuListComposition);