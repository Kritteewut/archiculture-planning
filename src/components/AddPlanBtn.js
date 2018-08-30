import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

import './Design.css';

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const styles = theme => ({
    paper: {
        position: 'absolute',
        width: theme.spacing.unit * 50,
        height: theme.spacing.unit * 15,
        padding: theme.spacing.unit * 4,


        outline: 'none',

        background: 'linear-gradient(20deg, rgba(20 , 20 , 20 , 0.85) 40%, rgba(20 , 20 , 20, 0.85)) 60%',
        boxShadow: '0px 0px 10px 2px rgba(0 , 0 , 0 , 0.30)',
        borderRadius: 10,
    },

    fab: {
        margin: theme.spacing.unit * 2,
    },

    textcolor: {
        color: 'rgb(255, 255, 255)'
    },

    absolute: {
        position: 'absolute',
        bottom: theme.spacing.unit * 40,
        left: theme.spacing.unit * 1.5 ,
        color: 'rgb(255, 255, 255)',
        background: 'linear-gradient(20deg, rgba(37, 37, 37, 0.85) 40%, rgba(0, 43, 161, 0.9)) 60%',
        boxShadow: '0px 0px 0px 5px rgba(255, 255, 255, 0.60)',
    },

    absolute2: {
        position: 'absolute',
        bottom: theme.spacing.unit * 3,
        right: theme.spacing.unit * 5.5,
        color: 'rgb(255, 255, 255)',
        background: 'linear-gradient(20deg, rgba(131, 0, 39, 0.85) 40%, rgba(255, 73, 49, 0.85)) 60%',
        boxShadow: '0px 0px 10px 2px rgba(40, 40, 40, 0.30)',
    },

    absolute3: {
        position: 'absolute',
        bottom: theme.spacing.unit * 3 ,
        right: theme.spacing.unit * 16,
        color: 'rgb(255, 255, 255)',
        background: 'linear-gradient(20deg, rgba(92, 0, 197, 0.85) 40%, rgba(92, 244, 255, 0.85)) 60%',
        boxShadow: '0px 0px 10px 2px rgba(40, 40, 40, 0.30)',
    },

    absolute4: {
        position: 'absolute',
        background: 'rgb(50, 50, 50)',
        color: 'rgb(255, 255, 255)',
        outline: 'none',
        border: 'none',
        borderRadius: 5,

        padding: '7px 7px',
        width: '80%',

        top: theme.spacing.unit * 9,
    },

    absolute5: {
        position: 'absolute',
        background: 'rgb(50, 50, 50)',
        color: 'rgb(255, 255, 255)',
        outline: 'none',
        border: 'none',
        borderRadius: 5,

        padding: '7px 7px',
        width: '80%',

        top: theme.spacing.unit * 18,
    },

});

class AddPlanBtn extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            inputValue: '',
        };
    }


    handleOpen = () => {
        if (this.props.user) {
            this.setState({
                open: true,
                inputValue: ''
            });
        } else {
            alert(' กรุณา Login ')
            this.props.handleDrawerOpen()
            this.props.onChaneDrawPage('homePage')
        }

    };
    handleClose = () => {
        this.setState({
            open: false,
            inputValue: ''
        });
    };
    handleAdd = () => {
        if (this.state.inputValue === '') {
            alert('กรุณากรอกชื่อแปลง')
        } else {
            this.props.onAddPlan(this.state.inputValue)
            this.handleClose()
        }
    }
    updateInputValue = (evt) => {
        this.setState({ inputValue: evt.target.value });
    }

    render() {
        const { classes } = this.props;
        return (
            <div>

                <Tooltip title="Add Plan" placement="left">

                    <Button variant="fab" className={classes.absolute} onClick={this.handleOpen}>
                        <AddIcon />
                    </Button>

                </Tooltip>

                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.open}
                    onClose={this.handleClose}
                >
                    <div style={getModalStyle()} className={classes.paper}>

                        <p className={classes.textcolor}> สร้างแปลนของคุณ </p> <br />

                        <Tooltip title="Close Window" placement="top" >

                            <Button className={classes.absolute2} onClick={this.handleClose}>
                                ยกเลิก
                            </Button>

                        </Tooltip>

                        <Tooltip title="Add Plan" placement="top" >

                            <Button className={classes.absolute3} onClick={this.handleAdd}>
                                เพิ่ม
                            </Button>

                        </Tooltip>

                        <input className={classes.absolute4} value={this.state.inputValue} onChange={evt => this.updateInputValue(evt)} />
                    </div>

                </Modal>

            </div>

        );
    }
}

AddPlanBtn.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddPlanBtn);;