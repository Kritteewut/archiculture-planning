import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const styles = theme => ({
    Menu: {
        position: 'absolute',
        top: theme.spacing.unit * 10,
        left: theme.spacing.unit,
        color: '#FFFFFF',
        background: 'linear-gradient(45deg, #424242 30%, #585858 90%)',
        boxShadow: '0 2px 4px 1px hsla(0, 0%, 0%, 0.27)'

    },
})

class openSideBtn extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {}

        //this.deleteme = this.deleteme.bind(this)
    }
    onToggleDrawer = () => {
        this.props.openSide ?
            this.props.handleDrawerClose()
            :
            this.props.handleDrawerOpen()
    }
    render() {
        const { classes } = this.props;
        return (
            <div >
                <IconButton className={classes.Menu} onClick={this.onToggleDrawer} >
                    <MenuIcon />
                </IconButton>
            </div>
        )
    }
}

export default withStyles(styles)(openSideBtn)