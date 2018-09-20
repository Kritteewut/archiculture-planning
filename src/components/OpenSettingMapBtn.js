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

/* picture */
import Maplayer0 from './Picture/MapLayer0.jpg';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        minWidth: 300,
        width: '100%',
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
        url: '/Picture/MapLayer0.jpg',
        title: 'Hybrid',
        width: '40%',
    },
    {
        url: '/static/images/grid-list/burgers.jpg',
        title: 'Burgers',
        width: '30%',
    },
    {
        url: '/static/images/grid-list/camera.jpg',
        title: 'Camera',
        width: '30%',
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
                                            <Button
                                                onClick={this.handleClose}>
                                                {images.map(image => (
                                                    <ButtonBase
                                                        focusRipple
                                                        key={image.title}
                                                        className={classes.image}
                                                        focusVisibleClassName={classes.focusVisible}
                                                        style={{
                                                            width: image.width,
                                                        }}
                                                    >
                                                        <span
                                                            className={classes.imageSrc}
                                                            style={{
                                                                backgroundImage: `url(${image.url})`,
                                                            }}
                                                        />
                                                        <span className={classes.imageBackdrop} />
                                                        <span className={classes.imageButton}>
                                                            <Typography
                                                                component="span"
                                                                variant="subheading"
                                                                color="inherit"
                                                                className={classes.imageTitle}
                                                            >
                                                                {image.title}
                                                                <span className={classes.imageMarked} />
                                                            </Typography>
                                                        </span>
                                                    </ButtonBase>
                                                ))}
                                            </Button>
                                        </MenuList>
                                        <MenuList>
                                            <Button
                                                onClick={this.handleClose}>
                                                {images.map(image => (
                                                    <ButtonBase
                                                        focusRipple
                                                        key={image.title}
                                                        className={classes.image}
                                                        focusVisibleClassName={classes.focusVisible}
                                                        style={{
                                                            width: image.width,
                                                        }}
                                                    >
                                                        <span
                                                            className={classes.imageSrc}
                                                            style={{
                                                                backgroundImage: `url(${image.url})`,
                                                            }}
                                                        />
                                                        <span className={classes.imageBackdrop} />
                                                        <span className={classes.imageButton}>
                                                            <Typography
                                                                component="span"
                                                                variant="subheading"
                                                                color="inherit"
                                                                className={classes.imageTitle}
                                                            >
                                                                {image.title}
                                                                <span className={classes.imageMarked} />
                                                            </Typography>
                                                        </span>
                                                    </ButtonBase>
                                                ))}
                                            </Button>
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