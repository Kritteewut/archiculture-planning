import React, { Component } from 'react';
import ColorPicker from './ColorPicker';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconPicker from './IconPicker';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Modal from '@material-ui/core/Modal';
import farm2 from './Picture/Picfarm2.jpg';
import TextField from '@material-ui/core/TextField';
import { throws } from 'assert';

const styles = theme => ({
    drawerPaper: {
        drawerPaper: {
            position: 'relative',
            width: '25vw',
            hiegth: '25vw',
        },
    },
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

class OverlayOptions extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isEditOverlayOpen: false,
            name: '',
            detail: '',
            isDeleteOverlayOpen: false,
        };
        this.overlayNameInput = null;
        this.overlayDetailInput = null
        this.setOverlayNameInput = element => {
            this.overlayNameInput = element;
        };
        this.setOverlayDetailInput = element => {
            this.overlayDetailInput = element;
        };
    }
    onToggleEditoverlayOpen = () => {
        this.setState({ isEditOverlayOpen: !this.state.isEditOverlayOpen })
    }
    onEditOverlay = () => {
        const { selectedOverlay } = this.props
        this.setState({
            name: selectedOverlay.overlayName,
            detail: selectedOverlay.overlayDetail,
            isEditOverlayOpen: true,
        })
    }

    onSubmitEdit = () => {
        this.props.handleDetailEdit(this.state.name, this.state.detail)
        this.onToggleEditoverlayOpen()
    }
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    renderEditOverlayDetailModal = () => {
        const { classes, } = this.props
        return (
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.state.isEditOverlayOpen}
                onClose={this.onToggleEditoverlayOpen}
            >
                <div className={classes.paper}>
                    <Card className={classes.card}>
                        <CardMedia
                            component="img"
                            className={classes.media}
                            height="140"
                            image={farm2}
                            title="Contemplative Reptile"
                        />
                    </Card>
                    <TextField
                        id="with-placeholder"
                        label="ชื่อ"
                        className={classes.textField}
                        margin="normal"
                        onChange={this.handleChange}
                        name="name"
                        value={this.state.name}
                        inputRef={this.setOverlayNameInput}
                    />
                    <TextField
                        id="multiline-flexible"
                        label="รายละเอียด"
                        multiline
                        className={classes.textField}
                        margin="normal"
                        onChange={this.handleChange}
                        name="detail"
                        rowsMax="4"
                        value={this.state.detail}
                        inputRef={this.setOverlayDetailInput}
                    />
                    <br />
                    <Button size="small" color="primary" onClick={this.onSubmitEdit}>
                        ตกลง
                        </Button>
                    <Button size="small" color="primary" onClick={this.onToggleEditoverlayOpen}>
                        ยกเลิก
                        </Button>
                </div>
            </Modal>
        )
    }
    onToggleDeleteOverlayOpen = () => {
        this.setState({ isDeleteOverlayOpen: !this.state.isDeleteOverlayOpen })
    }
    handleDeleteClick = () => {
        this.props.onDeleteOverlay(this.props.selectedOverlay)
        this.onToggleDeleteOverlayOpen()
    }
    renderDeleteOverlayModal = () => {
        const { classes } = this.props
        return (
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.state.isDeleteOverlayOpen}
                onClose={this.onToggleDeleteOverlayOpen}
            >
                <div className={classes.paper}>
                    <div>
                        หากลบแล้วจะไม่สามารถกู้คืนได้
                    </div>
                    <Button size="small" color="primary" onClick={this.handleDeleteClick}>
                        ตกลง
                    </Button>
                    <Button size="small" color="primary" onClick={this.onToggleDeleteOverlayOpen}>
                        ยกเลิก
                    </Button>
                </div>
            </Modal>
        )
    }
    drawOverlayDetail = () => {
        const { classes, selectedOverlay, onRedoCoords,onUndoCoords} = this.props;
        return (
            <div>
                <div>
                    ชื่อ : {selectedOverlay.overlayName}
                    <br />
                </div>
                <div>
                    รายละเอียด : {selectedOverlay.overlayDetail}
                    <br />
                </div>
                {
                    selectedOverlay.overlayType === 'marker' ?
                        <div>
                            ตำแหน่ง :
                            <br />
                            - lat : {selectedOverlay.getPosition().lat()}
                            <br />
                            - lng : {selectedOverlay.getPosition().lng()}
                            <br />
                        </div>
                        :
                        null
                }
                <Button variant="contained" size="small" color="primary" className={classes.button} onClick={this.onEditOverlay}>
                    แก้ไข
                </Button>
                <Button variant="contained" size="small" color="secondary" className={classes.button} onClick={this.onToggleDeleteOverlayOpen}>
                    ลบ
                </Button>
                <Button variant="contained" size="small" className={classes.button} onClick={()=>onUndoCoords(selectedOverlay)}>
                    Undo
                </Button>
                <Button variant="contained" size="small" className={classes.button} onClick={()=>onRedoCoords(selectedOverlay)}>
                    Redo
                </Button>
                {this.renderEditOverlayDetailModal()}
                {this.renderDeleteOverlayModal()}
            </div>
        )
    }
    render() {
        const {
            onChangePolyStrokeColor,
            onChangePolyFillColor,
            overlayOptionsType,
            onSetSelectedIcon,
            selectedOverlay,
            isFirstDraw,
            onUndoDrawingCoords,
            onRedoDrawingCoords,
        } = this.props
        //const currentOverlay = overlayObject[overlayObject.length-1]
        //const currentUndoCoords = currentOverlay.undoCoods
        //const undoCoordsLength = currentUndoCoords.length 
        //overlayObject[overlayObject.length-1].undoCoods.length > 1

        return (
            <div>
                {
                    overlayOptionsType === 'marker' ?
                        <div>
                            <IconPicker
                                onSetSelectedIcon={onSetSelectedIcon}
                            />
                        </div>
                        :
                        <div>

                            <ColorPicker
                                onChangePolyStrokeColor={onChangePolyStrokeColor}
                                onChangePolyFillColor={onChangePolyFillColor}
                            />
                            {//(undoCoordsLength > 1)
                                (!isFirstDraw) ?
                                    <div>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            disabled={false}
                                            onClick={onUndoDrawingCoords}
                                        >
                                            Undo
                                        </Button>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            disabled={false}
                                            onClick={onRedoDrawingCoords}
                                        >
                                            Redo
                                        </Button>
                                    </div>

                                    :
                                    null
                            }

                        </div>
                }
                {
                    selectedOverlay ?
                        this.drawOverlayDetail()
                        :
                        null
                }
            </div>
        )
    }
}

OverlayOptions.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(OverlayOptions);
