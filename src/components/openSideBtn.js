import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';

const styles = theme => ({
    Menu: {
        position: 'absolute',
        top: theme.spacing.unit * 10,
        left: theme.spacing.unit * 1.5,
        color: 'rgba(0, 0, 0, 0.8)',
        background: 'linear-gradient(20deg, rgba(255, 255, 255, 0.9) 40%, rgba(255, 255, 255, 0.9)) 30%',
        boxShadow: '0px 0px 0px 3px rgba(255, 255, 255, 0.60)',
    },
})

class openSideBtn extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        }

        //this.deleteme = this.deleteme.bind(this)
    }
    onToggleDrawer = () => {
        this.props.openSide ?
            this.props.handleDrawerClose()
            :
            this.props.handleDrawerOpen()
    }
    render() {
        const { classes, } = this.props;
        return (
            <div >
                <Button variant="fab" className={classes.Menu} onClick={this.onToggleDrawer} >
                    <MenuIcon />
                </Button>
            </div>
        )
    }
}

export default withStyles(styles)(openSideBtn)