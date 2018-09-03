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
            isOpen: false,
            name: '',
            detail: '',
            isRaise: false
        }
    }
    onToggleOpen = () => {
        this.setState({ isOpen: !this.state.isOpen })
    }
    onEditOverlay = () => {
        const { selectedOverlay } = this.props
        this.setState({
            name: selectedOverlay.overlayName,
            detail: selectedOverlay.overlayDetail,
            isOpen: true,
        })
    }
    onDeleteOverlay = (overlayId) => {

    }

    onSubmitEdit = () => {
        this.props.handleDetailEdit(this.state.name, this.state.detail)
        this.onToggleOpen()
    }
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    drawOverlayDetail = () => {
        const { classes, selectedOverlay, onDeleteOverlay } = this.props;
        return (
            <div>
                ชื่อ : {selectedOverlay.overlayName}
                <br />
                รายละเอียด : {selectedOverlay.overlayDetail}
                <br />
                <Button variant="contained" size="small" color="primary" className={classes.button} onClick={this.onEditOverlay}>
                    แก้ไข
                </Button>
                <Button variant="contained" size="small" color="secondary" className={classes.button} onClick={() => onDeleteOverlay(selectedOverlay.overlayIndex)}>
                    ลบ
                </Button>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.isOpen}
                    onClose={this.onToggleOpen}
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

                        />
                        <br />
                        <Button size="small" color="primary" onClick={this.onSubmitEdit}>
                            ตกลง
        </Button>
                        <Button size="small" color="primary" onClick={this.onToggleOpen}>
                            ยกเลิก
        </Button>
                    </div>
                </Modal>
            </div>
        )
    }
    render() {
        const { classes, theme } = this.props;
        const {
            onChangePolyStrokeColor,
            onChangePolyFillColor,
            overlayOptionsType,
            onSetSelectedIcon,
            selectedOverlay,
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
                        <ColorPicker
                            onChangePolyStrokeColor={onChangePolyStrokeColor}
                            onChangePolyFillColor={onChangePolyFillColor}
                        />
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
