import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Login from './Login';
import Avatar from '@material-ui/core/Avatar';
import classNames from 'classnames';
import Pic from './Picture/Ling logo.png';
import firebase, { auth, provider, provider2 } from '../config/firebase';
import '../App.css';
import IconButton from '@material-ui/core/IconButton';
import OverlayOptions from './OverlayOptions';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import './Design.css';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import OpenWith from '@material-ui/icons/OpenWith';
import List from '@material-ui/core/List';
import TextField from '@material-ui/core/TextField';

import grey from '@material-ui/core/colors/grey';
import red from '@material-ui/core/colors/red';


const drawerWidth = '350px'

const styles = theme => ({

    drawerPaper: {
        //position: 'relative',
        width: drawerWidth,
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

    buttonmargin: {
        margin: theme.spacing.unit,
    },

    buttonsave: {
        color: theme.palette.getContrastText(grey[300]),
        backgroundColor: grey[200],
        '&:hover': {
            backgroundColor: grey[400],
        },
    },

    buttonlogout: {
        color: theme.palette.getContrastText(red[500]),
        backgroundColor: red[500],
        '&:hover': {
            backgroundColor: red[700],
        },
    },

    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },

});

class PermanentDrawer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            planData: null,
            isDeletePlanOpen: false,
            isMergeOverlayOpen: false,
            isEditPlanOpen: false,
            selectedPlanIndex: '',
            planName: '',
        }
    }
    logout = () => {
        firebase.auth().signOut();
        this.props.onSetUserNull()
    }
    handlePlanClick = (planData, index) => {
        const { selectedPlan, overlayObject } = this.props
        if ((!selectedPlan) && overlayObject.length > 0) {
            this.setState({ planData: planData, selectedPlanIndex: index })
            this.onToggleMergeOverlayModal()
        }
        else {
            if (selectedPlan !== planData) {
                this.setState({ selectedPlanIndex: index })
                this.props.onSetSelectedPlan(planData)
                this.props.onClearOverlayFromMap()
            }
        }

    }
    handleAccecptToMergeOverlay = () => {
        this.props.onSetSelectedPlan(this.state.planData)
        this.onToggleMergeOverlayModal()

    }
    handleDiscardToMergeOverlay = () => {
        this.props.onSetSelectedPlan(this.state.planData)
        this.props.onClearOverlayFromMap()
        this.onToggleMergeOverlayModal()
    }
    onToggleMergeOverlayModal = () => {
        this.setState({ isMergeOverlayOpen: !this.state.isMergeOverlayOpen })
    }
    renderMergeOverlayModal = () => {
        const { planData } = this.state
        return (
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.state.isMergeOverlayOpen}
                onClose={this.onToggleMergeOverlayModal}
            >
                <div className={this.props.classes.paper}>
                    <div>
                        แปลงที่จะเลือก : {planData ? this.state.planData.planName : ''}
                    </div>
                    <div>
                        ยังมีรูปร่างที่วาดไว้อยู่ หากต้องการรวมรูปร่างที่วาดไว้กับแปลงที่เลือกให้กดปุ่ม ตกลง หากต้องการละทิ้งรูปร่างที่วาดไว้ให้กดปุ่ม ละทิ้ง
                    </div>
                    <Button size="small" color="primary" onClick={this.handleAccecptToMergeOverlay}>
                        ตกลง
                    </Button>
                    <Button size="small" color="secondary" onClick={this.handleDiscardToMergeOverlay}>
                        ละทิ้ง
                    </Button>
                    <Button size="small" onClick={this.onToggleMergeOverlayModal}>
                        ยกเลิก
                    </Button>
                </div>
            </Modal>
        )
    }
    handleDeletePlanClick = (planData) => {
        this.setState({ planData: planData })
        this.onToggleDeletePlanModal()
    }
    handleEditPlanClick = (planData) => {
        this.setState({ planData: planData, planName: planData.planName })
        this.onToggleEditPlanOpen()
    }
    onToggleDeletePlanModal = () => {
        this.setState({ isDeletePlanOpen: !this.state.isDeletePlanOpen })
    }
    handleAcceptToDeletePlan = () => {
        this.props.onDeletePlan(this.state.planData.planId)
        this.onToggleDeletePlanModal()
    }
    renderDeletePlanModal = () => {
        const { planData } = this.state
        return (
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.state.isDeletePlanOpen}
                onClose={this.onToggleDeletePlanModal}
            >
                <div className={this.props.classes.paper}>
                    <div>
                        แปลงที่จะลบ : {planData ? this.state.planData.planName : ''}
                    </div>
                    <div>
                        หากท่านลบแปลงที่เลือก ข้อมูลทั้งหมดที่ถูกบันทึกไว้จะถูกลบและไม่สามารถกู้คืนได้
                    </div>
                    <Button size="small" color="primary" onClick={this.handleAcceptToDeletePlan}>
                        ตกลง
                    </Button>
                    <Button size="small" onClick={this.onToggleDeletePlanModal}>
                        ยกเลิก
                    </Button>
                </div>
            </Modal>
        )
    }
    onToggleEditPlanOpen = () => {
        this.setState({ isEditPlanOpen: !this.state.isEditPlanOpen })
    }
    renderEditPlanModal = () => {
        const { classes } = this.props
        return (
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.state.isEditPlanOpen}
                onClose={this.onToggleEditPlanOpen}
            >
                <div className={classes.paper}>
                    แก้ไขชื่อแปลง
                    <br />
                    <TextField
                        id="with-placeholder"
                        label="ชื่อแปลง"
                        className={classes.textField}
                        margin="normal"
                        onChange={this.handleChange}
                        name="planName"
                        value={this.state.planName}
                    />
                    <br />
                    <Button size="small" color="primary" onClick={this.onSubmitEditPlan}>
                        ตกลง
                    </Button>
                    <Button size="small" color="primary" onClick={this.onToggleEditPlanOpen}>
                        ยกเลิก
                    </Button>
                </div>
            </Modal>
        )
    }
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    onSubmitEditPlan = () => {
        this.props.onEditPlanName(this.state.planData, this.state.planName)
        this.onToggleEditPlanOpen()
    }
    renderDrawer = () => {
        const { classes, user, onSetUser, selectedPlan, onCallFitBounds } = this.props;
        return (
            user ?
                <div>
                    <List>
                        <ListItem>
                            <Avatar
                                alt={user.email}
                                src={user.photoURL || Pic}
                                className={classNames(classes.bigAvatar)}
                            />
                            <ListItemText primary={user.email} secondary={user.displayName} />
                        </ListItem>
                    </List>
                    <div>
                        <Divider />
                        <List>
                            <ListItem>
                                แปลงที่เลือก : {selectedPlan ? selectedPlan.planName : 'ยังไม่มีแปลงที่เลือก'}
                                <ListItemSecondaryAction>
                                    <IconButton aria-label="Delete"
                                        disabled={selectedPlan ? false : true}
                                        onClick={onCallFitBounds}
                                    >
                                        <OpenWith />
                                    </IconButton>
                                </ListItemSecondaryAction>

                            </ListItem>
                        </List>
                        <Divider />
                        <List>
                            {this.props.planData.map((plan, index) => {
                                return (
                                    <ListItem
                                        role={undefined}
                                        button
                                        key={plan.planId}
                                        onClick={() => this.handlePlanClick(plan, index)}
                                        selected={this.state.selectedPlanIndex === index}
                                    >
                                        <ListItemText primary={plan.planName} />
                                        <ListItemSecondaryAction>
                                            <IconButton aria-label="Edit"
                                                onClick={() => this.handleEditPlanClick(plan, index)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton aria-label="Delete"
                                                onClick={() => this.handleDeletePlanClick(plan, index)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>

                                    </ListItem>
                                )

                            })}
                        </List>
                        <Divider />

                        <Button variant="contained" color="primary" className={classNames(classes.buttonmargin, classes.buttonlogout)} onClick={this.logout}>
                            logout
</Button>

                        <Button variant="contained" color="primary" className={classNames(classes.buttonmargin, classes.buttonsave)} disabled={selectedPlan ? false : true} onClick={this.props.onSaveToFirestore}>
                            บันทึก
</Button>

                        {this.renderMergeOverlayModal()}
                        {this.renderDeletePlanModal()}
                        {this.renderEditPlanModal()}
                    </div>
                </div>
                :
                <Login
                    onSetUser={onSetUser}
                    onQueryPlanFromFirestore={this.props.onQueryPlanFromFirestore}
                />

        )
    }
    drawerPageRender = () => {
        const { 
            drawerPage,
            selectedOverlay,
            onChangePolyStrokeColor,
            onChangePolyFillColor,
            onSetSelectedIcon,
            overlayOptionsType,
            handleDetailEdit,
            onDeleteOverlay,
            onUndoCoords,
            isFirstDraw,
            onUndoDrawingCoords,
            onRedoCoords,
            onRedoDrawingCoords,
        } = this.props;

        switch (drawerPage) {
            case 'homePage':
                return (
                    this.renderDrawer()
                )
            case 'option':
                return (
                    <OverlayOptions
                        selectedOverlay={selectedOverlay}
                        onChangePolyStrokeColor={onChangePolyStrokeColor}
                        onChangePolyFillColor={onChangePolyFillColor}
                        onSetSelectedIcon={onSetSelectedIcon}
                        overlayOptionsType={overlayOptionsType}
                        handleDetailEdit={handleDetailEdit}
                        onDeleteOverlay={onDeleteOverlay}
                        isFirstDraw={isFirstDraw}
                        onUndoDrawingCoords={onUndoDrawingCoords}
                        onRedoDrawingCoords={onRedoDrawingCoords}
                        onRedoCoords={onRedoCoords}
                        onUndoCoords={onUndoCoords}
                        
                    />
                )
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <Drawer
                variant="persistent"
                anchor='left'
                open={this.props.openSide}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                {this.drawerPageRender()}
            </Drawer>
        );
    }
}

PermanentDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PermanentDrawer);


