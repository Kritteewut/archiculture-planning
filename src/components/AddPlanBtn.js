import React from 'react';
import PropTypes from 'prop-types';

// Material-ui Import
import Modal from '@material-ui/core/Modal';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';

// CSS Import
import './AddPlanBtn.css';
import './Design.css';

/*const styles = theme => ({
    paper: {
        position: 'absolute',
        width: theme.spacing.unit * 50,
        height: theme.spacing.unit * 15,
        padding: theme.spacing.unit * 4,

        top: `50%`,
        left: `50%`,
        transform: `translate(-50%, -50%)`,
        outline: 'none',

        background: 'linear-gradient(20deg, rgba(255 , 255 , 255 , 0.85) 40%, rgba(255 , 255 , 255, 0.85)) 60%',
        boxShadow: '0px 0px 10px 2px rgba(0 , 0 , 0 , 0.30)',
        borderRadius: 10,
    },

    fab: {
        margin: theme.spacing.unit * 2,
    },

    textcolor: {
        color: 'rgb(0, 0, 0)'
    },

    absolute: {
        position: 'absolute',
        top: theme.spacing.unit * 32,
        left: theme.spacing.unit * 1.5,
        color: 'rgba(0, 0, 0, 0.8)',
        background: 'linear-gradient(20deg, rgba(255, 255, 255, 0.9) 40%, rgba(255, 255, 255, 0.9)) 30%',
        boxShadow: '0px 0px 0px 3px rgba(255, 255, 255, 0.60)',
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
        bottom: theme.spacing.unit * 3,
        right: theme.spacing.unit * 16,
        color: 'rgb(255, 255, 255)',
        background: 'linear-gradient(20deg, rgba(92, 0, 197, 0.85) 40%, rgba(92, 244, 255, 0.85)) 60%',
        boxShadow: '0px 0px 10px 2px rgba(40, 40, 40, 0.30)',
    },

    absolute4: {
        position: 'absolute',
        color: 'rgba(0, 0, 0, 0.8)',
        background: 'linear-gradient(20deg, rgba(255, 255, 255, 0.9) 40%, rgba(255, 255, 255, 0.9)) 30%',
        boxShadow: '0px 0px 0px 3px rgba(255, 255, 255, 0.60)',
        outline: 'none',
        border: 'none',
        borderRadius: 5,

        padding: '7px 7px',
        width: '80%',

        top: theme.spacing.unit * 9,
    },

    absolute5: {
        position: 'absolute',
        color: 'rgba(0, 0, 0, 0.8)',
        background: 'linear-gradient(20deg, rgba(255, 255, 255, 0.9) 40%, rgba(255, 255, 255, 0.9)) 30%',
        boxShadow: '0px 0px 0px 3px rgba(255, 255, 255, 0.60)',
        outline: 'none',
        border: 'none',
        borderRadius: 5,

        padding: '7px 7px',
        width: '80%',

        top: theme.spacing.unit * 18,
    },

});*/

class AddPlanBtn extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isAddPlanOpen: false,
            isPlanNameInputError: true,
        };
        this.addPlanInput = null;
        this.planDescriptionInput = null

        this.setPlanDescriptionInput = element => {
            this.planDescriptionInput = element;
        };
        this.setAddPlanInput = element => {
            this.addPlanInput = element;
        };
    }

    onToggleAddPlanOpen = () => {
        if (this.props.user) {
            this.setState({ isAddPlanOpen: !this.state.isAddPlanOpen, });
            if (!this.state.isPlanNameInputError) {
                this.setState({ isPlanNameInputError: true })
            }
        } else {
            this.props.handleDrawerOpen()
            this.props.onChangeDrawPage('homePage')
            alert(' กรุณา Login ')
        }

    }
    handleAdd = () => {
        var planData = {
            planName: this.addPlanInput.value,
            planDescription: this.planDescriptionInput.value,
            createPlanDate: new Date()
        }
        this.props.onAddPlan(planData)
        this.onToggleAddPlanOpen()
        this.props.handleDrawerOpen()
    }
    handlePlanNameInputChange = (event) => {
        const addPlanInput = this.addPlanInput.value
        if ((!addPlanInput.trim()) || (addPlanInput.length > 30)) {
            this.setState({ isPlanNameInputError: true })
        } else {
            this.setState({ isPlanNameInputError: false })
        }
    }

    render() {
        const { isWaitingForUserResult } = this.props;
        return (
            <div>

                <Tooltip
                    title="Add Plan"
                    placement="right"
                    disableFocusListener
                    disableTouchListener
                >
                    <div >
                        <Button
                            variant="fab"
                            className="absolute"
                            onClick={this.onToggleAddPlanOpen}
                            disabled={isWaitingForUserResult ? true : false}
                        >
                            <AddIcon />
                        </Button>
                    </div>
                </Tooltip>

                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.isAddPlanOpen}
                    onClose={this.onToggleAddPlanOpen}
                >
                    <div className="FrameCenterAdd">
                        <div className="paperadd">
                            <p className="textcolor"> สร้างแปลนของคุณ </p> <br />

                            <Tooltip
                                title="Close Window"
                                placement="bottom"
                                disableFocusListener
                                disableTouchListener
                            >

                                <Button className="absolute2" onClick={this.onToggleAddPlanOpen}>
                                    ยกเลิก
                            </Button>

                            </Tooltip>


                            <Tooltip
                                title="Add Plan"
                                placement="bottom"
                                disableFocusListener
                                disableTouchListener
                            >
                                <div>
                                    <Button
                                        className="absolute3"
                                        onClick={this.handleAdd}
                                        disabled={this.state.isPlanNameInputError}
                                    >
                                        เพิ่ม
                            </Button>
                                </div>
                            </Tooltip>

                            <TextField className="absolute4"
                                inputRef={this.setAddPlanInput}
                                autoFocus={true}
                                error={this.state.isPlanNameInputError}
                                helperText={'ชืิอแปลงมีความยาวได้สูงสุด 30 ตัวอักษร'}
                                onChange={this.handlePlanNameInputChange}
                            />
                            <TextField className="absolute5"
                                inputRef={this.setPlanDescriptionInput}
                                defaultValue='-'
                                multiline
                                rowsMax="4"
                            />

                        </div>
                    </div>

                </Modal>

            </div>

        );
    }
}

AddPlanBtn.propTypes = {

};

export default (AddPlanBtn);;