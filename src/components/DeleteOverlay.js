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

class DeleteOverlay extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {}
    }
    handleDeleteClick = () => {
        this.props.onDeleteOverlay(this.props.selectedOverlay)
        this.props.onToggleDeleteOverlayOpen()
    }
    render() {
        const { classes, onToggleDeleteOverlayOpen, isDeleteOverlayOpen, selectedOverlay } = this.props
        return (
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={isDeleteOverlayOpen}
                onClose={onToggleDeleteOverlayOpen}
            >
                <div className={classes.paper}>
                    <div>
                        รูปร่างที่จะลบ : {selectedOverlay.overlayName}
                    </div>
                    <div>
                        หากลบแล้วจะไม่สามารถกู้คืนได้
                    </div>
                    <Button size="small" color="primary" onClick={this.handleDeleteClick}>
                        ตกลง
                    </Button>
                    <Button size="small" color="primary" onClick={onToggleDeleteOverlayOpen}>
                        ยกเลิก
                    </Button>
                </div>
            </Modal>
        )
    }
}

export default withStyles(styles)(DeleteOverlay);