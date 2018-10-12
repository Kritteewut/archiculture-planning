import React from 'react'

// Material-ui Import
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import farm2 from './Picture/Picfarm2.jpg';
import CardMedia from '@material-ui/core/CardMedia';
import Modal from '@material-ui/core/Modal';

// CSS Import
import './EditOverlay.css';

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

class EditOverlay extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {}
        this.overlayNameInput = null;
        this.overlayDetailInput = null
        this.setOverlayNameInput = element => {
            this.overlayNameInput = element;
        };
        this.setOverlayDetailInput = element => {
            this.overlayDetailInput = element;
        };
    }
    onSubmitEdit = () => {
        this.props.handleDetailEdit(this.overlayNameInput.value, this.overlayDetailInput.value)
        this.props.onToggleEditoverlayOpen()
    }
    render() {
        const { classes, isEditOverlayOpen, onToggleEditoverlayOpen, selectedOverlay } = this.props
        return (
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={isEditOverlayOpen}
                onClose={onToggleEditoverlayOpen}
            >
                <div className="papereditoverlay">
                    <Card className="classes.card">
                        <CardMedia
                            component="img"
                            className="classes.media"
                            height="140"
                            image={farm2}
                            title="Contemplative Reptile"
                        />
                    </Card>
                    <TextField
                        id="with-placeholder"
                        label="ชื่อ"
                        className="textField"
                        margin="normal"
                        name="name"
                        defaultValue={selectedOverlay.overlayName}
                        inputRef={this.setOverlayNameInput}
                        autoFocus={true}
                    />
                    <TextField
                        id="multiline-flexible"
                        label="รายละเอียด"
                        multiline
                        className="textField"
                        margin="normal"
                        name="detail"
                        rowsMax="4"
                        defaultValue={selectedOverlay.overlayDetail}
                        inputRef={this.setOverlayDetailInput}
                    />
                    <br /><br/>
                    <Button className="buttoncontinueOverlay" onClick={this.onSubmitEdit}>
                        ตกลง
                        </Button>
                    <Button className="buttoncancelOverlay" onClick={onToggleEditoverlayOpen}>
                        ยกเลิก
                        </Button>
                </div>
            </Modal>
        )
    }
}

export default (EditOverlay);