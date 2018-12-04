// ระบบเพิ่มงาน AddPlan

import React from 'react';
// Material-ui Import
import Modal from '@material-ui/core/Modal';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';

// CSS Import
import './AddPlanBtn.css';
import './Design.css';

class AddPlan extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isAddPlanOpen: false,
            isPlanNameInputError: false,
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
            this.setState({ isAddPlanOpen: !this.state.isAddPlanOpen, isPlanNameInputError: false });
        } else {
            this.props.handleDrawerOpen()
            this.props.onChangeDrawPage('homePage')
            alert(' กรุณา Login ')
        }

    }
    handleAdd = () => {
        const addPlanInput = this.addPlanInput.value
        if ((!addPlanInput.trim()) || (addPlanInput.length > 30)) {
            this.setState({ isPlanNameInputError: true })
        } else {
            this.setState({ isPlanNameInputError: false })
            var planData = {
                planName: this.addPlanInput.value,
                planDescription: this.planDescriptionInput.value,
                createPlanDate: new Date(),
                lastModifiedDate: new Date(),
            }
            this.props.onAddPlan(planData)
            this.onToggleAddPlanOpen()
            this.props.handleDrawerOpen()
        }

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
                    title="เพิ่มแปลง"
                    placement="top"
                    disableFocusListener
                    disableTouchListener
                >
                    <Button
                        variant="contained"
                        className="AddButton"
                        onClick={this.onToggleAddPlanOpen}
                        disabled={isWaitingForUserResult ? true : false}
                    >
                        <AddIcon />
                    </Button>
                </Tooltip>


                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.isAddPlanOpen}
                    onClose={this.onToggleAddPlanOpen}
                >
                    <div className="paperadd">
                        <p className="textcolor"> สร้างแปลงของคุณ </p>

                        <TextField className="TextAddPlan"
                            inputRef={this.setAddPlanInput}
                            autoFocus={true}
                            error={this.state.isPlanNameInputError}
                            helperText={this.state.isPlanNameInputError ? 'ชื่อแปลงต้องมีอย่างน้อย 1 ตัวอักษรแต่ไม่เกิน 30 ตัวอักษร' : ''}
                            onChange={this.handlePlanNameInputChange}
                        />

                        <TextField className="DataTextPlan"
                            inputRef={this.setPlanDescriptionInput}
                            defaultValue=''
                            multiline
                            rowsMax="4"
                        />

                        <Tooltip
                            title="Close Window"
                            placement="bottom"
                            disableFocusListener
                            disableTouchListener
                        >

                            <Button className="CancelButton" onClick={this.onToggleAddPlanOpen}>
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
                                    className="ContinueButton"
                                    onClick={this.handleAdd}
                                    disabled={this.state.isPlanNameInputError}
                                >
                                    เพิ่ม
                            </Button>
                            </div>
                        </Tooltip>

                    </div>

                </Modal>

            </div>

        );
    }
}

export default (AddPlan);;