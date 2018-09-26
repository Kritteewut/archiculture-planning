import React from 'react'
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
    card: {
        maxWidth: 345,
    },
    media: {
        // ⚠️ object-fit is not supported by IE11.
        objectFit: 'cover',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    paper: {
        position: 'absolute',
        width: theme.spacing.unit * 50,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    },
});

class EditPlan extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {}
        this.planNameInput = null;
        this.setPlanNameInput = element => {
            this.planNameInput = element;
        };
    }
    onSubmitEditPlan = () => {
        this.props.onEditPlanName(this.props.planData, this.planNameInput.value)
        this.props.onToggleEditPlanOpen()
    }
    render() {
        const { classes, isEditPlanOpen, onToggleEditPlanOpen, planData } = this.props
        return (
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={isEditPlanOpen}
                onClose={onToggleEditPlanOpen}
            >
                <div className={classes.paper}>
                    แก้ไขชื่อแปลง
                    <br />
                    <TextField
                        id="with-placeholder"
                        label="ชื่อแปลง"
                        className={classes.textField}
                        margin="normal"
                        name="planName"
                        defaultValue={planData ? planData.planName : null}
                        inputRef={this.setPlanNameInput}
                        autoFocus={true}
                    />
                    <br />
                    <Button size="small" color="primary" onClick={this.onSubmitEditPlan}>
                        ตกลง
                    </Button>
                    <Button size="small" color="primary" onClick={onToggleEditPlanOpen}>
                        ยกเลิก
                    </Button>
                </div>
            </Modal>
        )
    }
}

export default withStyles(styles)(EditPlan);