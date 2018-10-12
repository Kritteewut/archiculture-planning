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
import OverlayTask from './OverlayTask'

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
            isDeleteOverlayOpen: false,
            isOverlayTaskOpen: false,
        };
    }
    onToggleEditoverlayOpen = () => {
        this.setState({ isEditOverlayOpen: !this.state.isEditOverlayOpen })
    }
    renderEditOverlayDetailModal = () => {
    }
    onToggleDeleteOverlayOpen = () => {
        this.setState({ isDeleteOverlayOpen: !this.state.isDeleteOverlayOpen })
    }
    onToggleOverlayTaskOpen = () => {
        this.setState({ isOverlayTaskOpen: !this.state.isOverlayTaskOpen })
    }
    drawOverlayDetail = () => {
        const { selectedOverlay, onRedoCoords, onUndoCoords, handleDetailEdit } = this.props;
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
<<<<<<< HEAD
                <Button variant="contained" size="small" color="primary" className="button" onClick={this.onToggleOverlayTaskOpen}>
                    จัดการงาน
=======
                <Button variant="contained" className="buttoneditwork" className="button" onClick={this.onToggleOverlayTaskOpen}>
                    เพิ่มงาน
>>>>>>> 6bf806a10367ce9cec5b8f0dc773836da85e88ff
                </Button>
                <Button variant="contained" className="buttoneditwork" className="button" onClick={this.onToggleEditoverlayOpen}>
                    แก้ไข
                </Button>
                <Button variant="contained" className="buttondeletework" onClick={this.onToggleDeleteOverlayOpen}>
                    ลบ
                </Button>
                <Button variant="contained" className="buttonundowork" onClick={() => onUndoCoords(selectedOverlay)}>
                    Undo
                </Button>
                <Button variant="contained" className="buttonredowork" onClick={() => onRedoCoords(selectedOverlay)}>
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
                <OverlayTask
                    {...this.state}
                    onAddTask={this.props.onAddTask}
                    onToggleOverlayTaskOpen={this.onToggleOverlayTaskOpen}
                    selectedOverlay={selectedOverlay}
                    overlayTaskShow={this.props.overlayTaskShow}
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
            fillColor,
            strokeColor,
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
                                selectedOverlay={selectedOverlay}
                                fillColor={fillColor}
                                strokeColor={strokeColor}
                            />
                            {
                                (!isFirstDraw) ?
                                    <div>
                                        <Button
                                            variant="contained"
                                            className="buttonundoonwork"
                                            disabled={false}
                                            onClick={onUndoDrawingCoords}
                                        >
                                            Undo
                                        </Button>
                                        <Button
                                            variant="contained"
                                            className="buttonredoonwork"
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
};

export default (OverlayOptions);
