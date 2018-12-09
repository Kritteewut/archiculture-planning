import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Assignment from '@material-ui/icons/Assignment';
import Event from '@material-ui/icons/Event';


const styles = {
    root: {
        textAlign: 'right',
    },
    flex: {
        flexGrow: 1,
        textAlign: 'left',
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    navbar: {
        backgroundColor: '#00CCFF',
    },
};


class Navbar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Menu: 'ลบงาน',
            value: 0,
        }
    }

    // handleDrawerOpen = (open) => {
    //     this.props.handleDrawerOpen(open)
    // };

    // handleMenuOpen = event => {
    //     this.setState({ anchorEl: event.currentTarget });
    // };

    // handleClose = () => {
    //     this.setState({ anchorEl: null });
    // };

    // handleMenuChange = (e) => {
    //     this.setState({ size: e.target.value });

    // handleMenu = (menu) => {
    //     this.setState({ Menu: menu });

    //     this.props.changeMenu(menu)

    handleChange = (event, value) => {
        this.setState({ value });
    };

    changePage(page) {
        this.props.changePage(page)
    }

    renderMenu = () => {
        const { classes } = this.props;
        const { value } = this.state;

        return (

            <BottomNavigation
                value={value}
                onChange={this.handleChange}
                showLabels
                className={classes.root}
            >
                <BottomNavigationAction key='1' onClick={() => this.changePage('งาน')} label="งาน" icon={<Assignment />} />
                <BottomNavigationAction key='2' onClick={() => this.changePage('ปฏิทิน')} label="ปฏิทิน" icon={<Event />} />
            </BottomNavigation>

        );


    }

    render() {
        const { classes, page } = this.props;
        return (
            <div className={classes.root}>
                <AppBar position="fixed" className={classes.navbar}>
                    <Toolbar>
                        <IconButton onClick={this.props.onToggleOverlayTaskOpen} className={classes.menuButton} color="inherit" aria-label="Menu">
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="title" color="inherit" className={classes.flex}>
                            {page}
                        </Typography>
                        {this.renderMenu()}
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}
Navbar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navbar);