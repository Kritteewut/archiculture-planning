import React from 'react'
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
import AddMember from '@material-ui/icons/GroupAdd';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

//CSS import
import './EditPlan.css';
import './Design.css';

class PlanMember extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            isAddPlanmemberOpen: false,
            memberRole: '',
        }
        this.memberIdInput = null;
        this.setMemberIdInput = element => {
            this.memberIdInput = element;
        };
    }
    handleToggleAddPlanMember = () => {
        this.setState({ isAddPlanmemberOpen: !this.state.isAddPlanmemberOpen, memberRole: ' ' })
        this.memberIdInput.value = ''
    }
    handleSubmitAddPlanMember = () => {
        const memberId = this.memberIdInput.value
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
            this.handleToggleAddPlanMember()
        }
    }
    handleSelectChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }
    render() {
        return (
            <div>
                <Tooltip
                    title="เพิ่มผู้ดูแลแปลง"
                    placement="right"
                    disableFocusListener
                    disableTouchListener
                >
                    <Button
                        className="buttonAddUser"
                        variant="fab"
                        onClick={this.handleToggleAddPlanMember}
                    >
                        <div className="ButtonIconColor">
                            <AddMember />
                        </div>
                    </Button>

                </Tooltip>

                <Dialog
                    open={this.state.isAddPlanmemberOpen}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.handleToggleAddPlanMember}
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
                        <TextField
                            className="textField"
                            autoFocus={true}
                            id="user-id"
                            label="ID ผู้ใช้"
                            margin="normal"
                            name="memberId"
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
                                    <MenuItem value={'editor'}>ผู้แก้ไข</MenuItem>
                                    <MenuItem value={'viewer'}>ผู้เข้าชม</MenuItem>
                                </Select>
                            </FormControl>

                        </form>

                    </DialogContent>
                    <DialogActions>

                        <Button onClick={this.handleSubmitAddPlanMember} color="primary" className="buttoncontinueedit">
                            ตกลง
                             </Button>

                        <Button onClick={this.handleToggleAddPlanMember} color="primary" className="buttoncanceledit">
                            ยกเลิก
                            </Button>

                    </DialogActions>
                </Dialog>
            </div>
        )
    }

}
export default PlanMember

function Transition(props) {
    return <Slide direction="up" {...props} />;
}
