import React from 'react'

// Material-ui Import
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';

// CSS Import
import './EditPlan.css';

/*const styles = theme => ({
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
});*/

class EditPlan extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isPlanNameInputError: false
        }
        this.planNameInput = null;
        this.setPlanNameInput = element => {
            this.planNameInput = element;
        };
    }
    onSubmitEditPlan = () => {
        this.props.onEditPlanName(this.props.planData, this.planNameInput.value)
        this.props.onToggleEditPlanOpen()
    }
    handlePlanNameInputChange = (event) => {
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
    handleCheckHelperText = () => {
        if (this.planNameInput) {
            const planNameInput = this.planNameInput.value.trim().length
            var remainLength = 30 - planNameInput
            if (remainLength < 0) {
                remainLength = 0
            }
            return `ชืิอแปลงมีความยาวได้สูงสุด 30 ตัวอักษร (${remainLength}`
        } else {
            return ''
        }

    }
    render() {
        const { classes, isEditPlanOpen, planData } = this.props
        return (
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={isEditPlanOpen}
                onClose={this.handleToggleEditPlan}
            >
                <div className="paper">
                    แก้ไขชื่อแปลง
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
                        helperText={'ชืิอแปลงมีความยาวได้สูงสุด 30 ตัวอักษร'}
                    />
                    <br />
                    <Button
                        size="small"
                        color="primary"
                        onClick={this.onSubmitEditPlan}
                        disabled={this.state.isPlanNameInputError}
                    >
                        ตกลง
                    </Button>
                    <Button size="small" color="primary" onClick={this.handleToggleEditPlan}>
                        ยกเลิก
                    </Button>
                </div>
            </Modal>
        )
    }
}

export default (EditPlan);