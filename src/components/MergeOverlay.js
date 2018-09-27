import React from 'react'
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

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

class MergeOverlay extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        const { planData, onToggleMergeOverlayModal, isMergeOverlayOpen ,
            handleAccecptToMergeOverlay,handleDiscardToMergeOverlay
        } = this.props
        return (
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={isMergeOverlayOpen}
                onClose={onToggleMergeOverlayModal}
            >
                <div className={this.props.classes.paper}>
                    <div>
                        แปลงที่จะเลือก : {planData ? planData.planName : ''}
                    </div>
                    <div>
                        ยังมีรูปร่างที่วาดไว้อยู่ หากต้องการรวมรูปร่างที่วาดไว้กับแปลงที่เลือกให้กดปุ่ม ตกลง หากต้องการละทิ้งรูปร่างที่วาดไว้ให้กดปุ่ม ละทิ้ง
                    </div>
                    <Button size="small" color="primary" onClick={handleAccecptToMergeOverlay}>
                        ตกลง
                    </Button>
                    <Button size="small" color="secondary" onClick={handleDiscardToMergeOverlay}>
                        ละทิ้ง
                    </Button>
                    <Button size="small" onClick={onToggleMergeOverlayModal}>
                        ยกเลิก
                    </Button>
                </div>
            </Modal>
        )
    }
}

export default withStyles(styles)(MergeOverlay);