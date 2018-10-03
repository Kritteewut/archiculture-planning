import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material-ui Import
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

// Import Group
import ColorPicker from './ColorPicker';
import IconPicker from './IconPicker';
import EditOverlay from './EditOverlay';
import DeleteOverlay from './DeleteOverlay';

// CSS Import
import './OverlayOptions.css';

/*const styles = theme => ({
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
});*/

class OverlayOptions extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isEditOverlayOpen: false,
            name: '',
            detail: '',
            isDeleteOverlayOpen: false,
        };
    }
    onToggleEditoverlayOpen = () => {
        this.setState({ isEditOverlayOpen: !this.state.isEditOverlayOpen })
    }
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    renderEditOverlayDetailModal = () => {
    }
    onToggleDeleteOverlayOpen = () => {
        this.setState({ isDeleteOverlayOpen: !this.state.isDeleteOverlayOpen })
    }
    drawOverlayDetail = () => {
        const { classes, selectedOverlay, onRedoCoords, onUndoCoords, handleDetailEdit } = this.props;
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
                <Button variant="contained" size="small" color="primary" className="button" onClick={this.onToggleEditoverlayOpen}>
                    แก้ไข
                </Button>
                <Button variant="contained" size="small" color="secondary" className="button" onClick={this.onToggleDeleteOverlayOpen}>
                    ลบ
                </Button>
                <Button variant="contained" size="small" className="button" onClick={() => onUndoCoords(selectedOverlay)}>
                    Undo
                </Button>
                <Button variant="contained" size="small" className="button" onClick={() => onRedoCoords(selectedOverlay)}>
                    Redo
                </Button>
                <EditOverlay
                    isEditOverlayOpen={this.state.isEditOverlayOpen}
                    selectedOverlay={selectedOverlay}
                    onToggleEditoverlayOpen={this.onToggleEditoverlayOpen}
                    handleDetailEdit={handleDetailEdit}
                />
                <DeleteOverlay
                    isDeleteOverlayOpen={this.state.isDeleteOverlayOpen}
                    selectedOverlay={selectedOverlay}
                    onToggleDeleteOverlayOpen={this.onToggleDeleteOverlayOpen}
                    onDeleteOverlay={this.props.onDeleteOverlay}
                />
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
                            {
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

export default (OverlayOptions);
