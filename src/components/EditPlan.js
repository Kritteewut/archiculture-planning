import React from 'react'

// Material-ui Import
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';

// CSS Import
import './EditPlan.css';

//Import
import PlanMember from './PlanMember';
import DeletePlanMember from './DeletePlanMember';

//Material Import
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import DeleteIcon from '@material-ui/icons/Delete';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ListSubheader from '@material-ui/core/ListSubheader'

class EditPlan extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isPlanNameInputError: false,
            isAddColOpen: false,
            memberRole: ' ',
            member: {},
            isDeletePlanMemberOpen: false,
        }
        this.planNameInput = null;
        this.planDescriptionInput = null
        this.createPlanDateInput = null

        this.setPlanDescriptionInput = element => {
            this.planDescriptionInput = element;
        };
        this.setPlanNameInput = element => {
            this.planNameInput = element;
        };
        this.setCreatePlanDateInput = element => {
            this.createPlanDateInput = element;
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
    handleDeletePlanMemberClick = (member) => {
        this.setState({ member })
        this.onToggleDeletePlanMemberOpen()
    }
    onToggleDeletePlanMemberOpen = () => {
        this.setState({ isDeletePlanMemberOpen: !this.state.isDeletePlanMemberOpen })
    }

    render() {
        const { isEditPlanOpen, planData } = this.props
        return (
            <Dialog
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={isEditPlanOpen}
                onClose={this.handleToggleEditPlan}
                fullWidth
            >
                <DialogTitle id="alert-dialog-title">{" แก้ไขแปลง"}</DialogTitle>
                <DialogContent>

                    <PlanMember
                        onAddPlanMember={this.props.onAddPlanMember}
                        planData={planData}
                    />
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
                        fullWidth
                    />

                    <TextField className="textField"
                        label="รายละเอียดแปลง"
                        inputRef={this.setPlanDescriptionInput}
                        defaultValue={planData ? planData.planDescription : ''}
                        multiline
                        rowsMax="4"
                        fullWidth
                    />
                    <div>วันที่สร้างแปลง : {planData ? moment(planData.createPlanDate).format('ll') : ''}</div>
                    <List
                         component="div"
                         disablePadding
                         subheader={<ListSubheader component="div">รายชื่อสมาชิก</ListSubheader>}
                    >
                        {this.props.isWaitingForPlanMemberQuery ?
                            'กำลังโหลด...'
                            :
                            this.props.planMember.map((member) => {
                                return (
                                    <ListItem
                                        key={member.memberId}
                                    >
                                        <ListItemText
                                            primary={member.displayName}
                                            secondary={member.memberRole}
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton aria-label="Delete"
                                                onClick={() => this.handleDeletePlanMemberClick(member)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>

                                        </ListItemSecondaryAction>
                                    </ListItem>
                                )
                            })

                        }
                    </List>

                    < DeletePlanMember
                        onDeletePlanMember={this.props.onDeletePlanMember}
                        onToggleDeletePlanMemberOpen={this.onToggleDeletePlanMemberOpen}
                        {...this.state}
                    />

                </DialogContent>
                <DialogActions>
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
                </DialogActions>

            </Dialog>
        )
    }
}

export default EditPlan;
