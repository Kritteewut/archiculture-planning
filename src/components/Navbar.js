import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '@material-ui/icons/Menu';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { Radio, Button } from 'antd';


const styles = {
    root: {
        flexGrow: 1,
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
            Menu: 'ลบงาน'
        }
    }

    handleDrawerOpen = (open) => {
        this.props.handleDrawerOpen(open)
    };

    // handleMenuOpen = event => {
    //     this.setState({ anchorEl: event.currentTarget });
    // };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    handleMenu = (menu) => {
        this.setState({ Menu: menu });

        this.props.changeMenu(menu)
    };

    handleMenuChange = (e) => {
        this.setState({ size: e.target.value });
    }

    renderMenu = () => {
        switch (this.props.page) {
            case 'งาน':
                return (

                    <Radio.Group value={this.props.menu} onChange={this.handleMenuChange}>
                        <Radio.Button value={'งานเสร็จ'} onClick={() => this.handleMenu('งานเสร็จ')}>งานเสร็จสิ้น</Radio.Button>
                        <Radio.Button value={'ลบงาน'} onClick={() => this.handleMenu('ลบงาน')}>ลบงาน</Radio.Button>
                    </Radio.Group>

                );
            case 'ประวัติ':
                return (

                    null

                );
            case 'ปฏิทิน':
                return (
                    null
                );
            default: return;
        }

    }

    render() {
        const { classes, page } = this.props;
        return (
            <div className={classes.root}>
                <AppBar position="fixed" className={classes.navbar}>
                    <Toolbar>

                        {/* <IconButton onClick={() => this.handleDrawerOpen(true)} className={classes.menuButton} color="inherit" aria-label="Menu">
                            <MenuIcon />
                        </IconButton> */}

                        <IconButton onClick={this.props.onToggleOverlayTaskOpen} className={classes.menuButton} color="inherit" aria-label="Menu">
                            <MenuIcon />
                        </IconButton>

                        <Typography variant="title" color="inherit" className={classes.flex}>
                            {page}
                        </Typography>

                        {this.renderMenu()}

                    </Toolbar>
                </AppBar>


                {/* <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    <MenuItem onClick={() => this.handleMenu('งานเสร็จ')}>งานเสร็จสิ้น</MenuItem>
                    <MenuItem onClick={() => this.handleMenu('ลบงาน')}>ลบงาน</MenuItem>
                </Menu> */}
            </div>
        );
    }
}
Navbar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navbar);