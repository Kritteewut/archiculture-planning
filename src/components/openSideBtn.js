import React from 'react';
// Material-ui Import
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';

// CSS Import
import './openSideBtn.css';
import './Design.css';

/*const styles = theme => ({
    Menu: {
        position: 'absolute',
        top: theme.spacing.unit * 10,
        left: theme.spacing.unit * 1.5,
        color: 'rgba(0, 0, 0, 0.8)',
        background: 'linear-gradient(20deg, rgba(255, 255, 255, 0.9) 40%, rgba(255, 255, 255, 0.9)) 30%',
        boxShadow: '0px 0px 0px 3px rgba(255, 255, 255, 0.60)',
    },
})*/

class openSideBtn extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {}
        //this.deleteme = this.deleteme.bind(this)
    }
    render() {
        return (
            <div >
                <Button variant="fab" className="MenuSlide" onClick={this.props.handleDrawerToggle} >
                    <div className="ButtonIconColor">
                        <MenuIcon />
                    </div>
                </Button>
            </div>
        )
    }
}

export default (openSideBtn)