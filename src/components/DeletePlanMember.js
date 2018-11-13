import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
function Transition(props) {
    return <Slide direction="up" {...props} />;
}
class DeletePlanMember extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {}
    }
    handleAcceptToDeletePlanMember = (memeber) => {
        this.props.onDeletePlanMember(memeber)
        this.props.onToggleDeletePlanMemberOpen()
    }
    render() {
        const { isDeletePlanMemberOpen, onToggleDeletePlanMemberOpen, member } = this.props
        return (
            <Dialog
                TransitionComponent={Transition}
                keepMounted
                open={isDeletePlanMemberOpen}
                onClose={onToggleDeletePlanMemberOpen}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">
                    {"ลบสมากชิก"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        ท่านต้องการจะลบ{member.displayName}ออกจากแปลงนี้ใช่หรือไม่?
               </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.handleAcceptToDeletePlanMember(member)} color="primary">
                        ตกลง
               </Button>
                    <Button onClick={onToggleDeletePlanMemberOpen} color="primary">
                        ยกเลิก
               </Button>
                </DialogActions>
            </Dialog>
        )
    }
}
export default DeletePlanMember