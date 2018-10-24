import React from 'react'

// Material-ui Import
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';
import AddCol from '@material-ui/icons/GroupAdd';
// CSS Import
import './EditPlan.css';
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';


class EditPlan extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isPlanNameInputError: false,
            isAddColOpen: false,
            memberRole: ' ',
        }
        this.planNameInput = null;
        this.planDescriptionInput = null
        this.memberId = null

        this.setPlanDescriptionInput = element => {
            this.planDescriptionInput = element;
        };

        this.setPlanNameInput = element => {
            this.planNameInput = element;
        };

        this.setMemberIdInput = element => {
            this.memberId = element;
        };
    }
    onSubmitEditPlan = () => {
        const planNameInput = this.planNameInput.value
        if ((!planNameInput.trim()) || (planNameInput.length > 30)) {
            this.setState({ isPlanNameInputError: true })
        } else {
            this.setState({ isPlanNameInputError: false })
            var planData = {
                planId: this.props.planData.planId,
                planName: this.planNameInput.value,
                planDescription: this.planDescriptionInput.value,
            }
            this.props.onEditPlanName(planData)
            this.props.onToggleEditPlanOpen()
        }

    }
    handlePlanNameInputChange = () => {
        const planNameInput = this.planNameInput.value
        if ((!planNameInput.trim()) || (planNameInput.length > 30)) {
            this.setState({ isPlanNameInputError: true })
        } else {
            this.setState({ isPlanNameInputError: false })
        }
    }
    handleToggleEditPlan = () => {
        this.props.onToggleEditPlanOpen()
        this.setState({ isPlanNameInputError: false })
    }
    handleToggleAddCol = () => {
        this.setState({ isAddColOpen: !this.state.isAddColOpen, memberRole: ' ' })
        this.memberId.value = ''
    }
    handleSubmitAddCol = () => {
        const memberId = this.memberId.value
        const memberRole = this.state.memberRole
        const planId = this.props.planData.planId
        if (memberId === '' || memberRole === ' ') {
        } else {
            const data = {
                memberId,
                memberRole,
                planId,
            }
            this.props.onAddPlanMember(data)
            this.handleToggleAddCol()
        }
    }
    handleSelectChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }
    render() {
        const { isEditPlanOpen, planData } = this.props
        return (
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={isEditPlanOpen}
                onClose={this.handleToggleEditPlan}
            >
                <div className="papereditplan">
                    แก้ไขแปลง
                    <Tooltip
                        title="เพิ่มผู้ดูแลแปลง"
                        placement="right"
                        disableFocusListener
                        disableTouchListener
                    >
                        <Button
                            variant="fab"
                            onClick={this.handleToggleAddCol}
                        >
                            <AddCol />
                        </Button>
                    </Tooltip>
                    <br />
                    <TextField
                        id="with-placeholder"
                        label="ชื่อแปลง"
                        className="textField"
                        margin="normal"
                        name="planName"
                        defaultValue={planData ? planData.planName : ''}
                        inputRef={this.setPlanNameInput}
                        onChange={this.handlePlanNameInputChange}
                        autoFocus={true}
                        error={this.state.isPlanNameInputError}
                        helperText={this.state.isPlanNameInputError ? 'ชื่อแปลงต้องมีอย่างน้อย 1 ตัวอักษรแต่ไม่เกิน 30 ตัวอักษร' : ''}
                    />
                    <br />                    <br />
                    <TextField className="textField"
                        label="รายละเอียดแปลง"
                        inputRef={this.setPlanDescriptionInput}
                        defaultValue={planData ? planData.planDescription : ''}
                        multiline
                        rowsMax="4"
                    />
                    <br />                    <br />
                    <TextField className="textField"
                        label="วันที่สร้างแปลง"
                        inputRef={this.setPlanDescriptionInput}
                        defaultValue={planData ? moment(planData.createPlanDate).format('ll') : ''}
                        multiline
                        rowsMax="4"
                        disabled
                    />
                    <br />                    <br />
                    <Button
                        className="buttoncontinueedit"
                        onClick={this.onSubmitEditPlan}
                        disabled={this.state.isPlanNameInputError}
                    >
                        ตกลง
                    </Button>
                    <Button
                        className="buttoncanceledit"
                        onClick={this.handleToggleEditPlan}>
                        ยกเลิก
                    </Button>
                    <Dialog
                        open={this.state.isAddColOpen}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={this.handleToggleAddCol}
                        aria-labelledby="alert-dialog-slide-title"
                        aria-describedby="alert-dialog-slide-description"
                    >
                        <DialogTitle id="alert-dialog-slide-title">
                            {"เพิ่มสมาชิกแปลง"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-slide-description">
                                กรอก ID ผู้ใช้งานที่ต้องการเพิ่ม
                            </DialogContentText>
                            <TextField className="textField"
                                autoFocus={true}
                                id="user-id"
                                label="ID ผู้ใช้"
                                className="textField"
                                margin="normal"
                                name="planName"
                                label="ID ผู้ใช้"
                                inputRef={this.setMemberIdInput}
                            />
                            <form className="root" autoComplete="off">
                                <FormControl className={"formControl"}>
                                    <InputLabel
                                        htmlFor="role-select"
                                    >
                                        บทบาท
                                    </InputLabel>
                                    <Select
                                        value={this.state.memberRole}
                                        onChange={this.handleSelectChange}
                                        inputProps={{
                                            name: 'memberRole',
                                            id: 'role-select',
                                        }}

                                    >
                                        <MenuItem value={'manager'}>ผู้ดูแล</MenuItem>
                                        <MenuItem value={'viewer'}>ผู้เข้าชม</MenuItem>
                                    </Select>
                                </FormControl>
                            </form>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleToggleAddCol} color="primary">
                                ยกเลิก
                            </Button>
                            <Button onClick={this.handleSubmitAddCol} color="primary">
                                ตกลง
                             </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </Modal>
        )
    }
}

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

export default (EditPlan);
