import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import firebase from '../config/firebase';

// Material-ui Import
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import OverlayOptions from './OverlayOptions';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Button from '@material-ui/core/Button';
import OpenWith from '@material-ui/icons/OpenWith';
import List from '@material-ui/core/List';

// Import Group
import Login from './Login';
import EditPlan from './EditPlan';
import DeletePlan from './DeletePlan';
import MergeOverlay from './MergeOverlay';

// Icon Group
import Pic from './Picture/Ling logo.png';

// CSS Import
import '../App.css';
import './Design.css';
import './PermanentDrawer.css';


const drawerWidth = '350px'

/*const styles = theme => ({

    drawerPaper: {
        //position: 'relative',
        width: drawerWidth,
        // position: 'absolute',
        // //width: theme.spacing.unit * 50,
        // backgroundColor: theme.palette.background.paper,
        // boxShadow: theme.shadows[5],
        // padding: theme.spacing.unit * 4,
        // top: '50%',
        // left: '50%',
        // transform: 'translate(-50%, -50%)',
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
    bootstrapRoot: {
        boxShadow: 'none',
        textTransform: 'none',
        fontSize: 16,
        padding: '6px 12px',
        border: '1px solid',
        backgroundColor: '#007bff',
        borderColor: '#007bff',
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:hover': {
            backgroundColor: '#0069d9',
            borderColor: '#0062cc',
        },
        '&:active': {
            boxShadow: 'none',
            backgroundColor: '#0062cc',
            borderColor: '#005cbf',
        },
        '&:focus': {
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
        },
    },

});*/

class PermanentDrawer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            planData: null,
            isDeletePlanOpen: false,
            isMergeOverlayOpen: false,
            isEditPlanOpen: false,
        }
    }
    logout = () => {
        firebase.auth().signOut();
        this.props.onSetUserNull()
    }
    handlePlanClick = (planData) => {
        const { selectedPlan, overlayObject } = this.props
        if ((!selectedPlan) && overlayObject.length > 0) {
            this.setState({ planData: planData, })
            this.onToggleMergeOverlayModal()
        }
        else {
            if (selectedPlan !== planData) {
                this.props.onSetSelectedPlan(planData)
                this.props.onClearOverlayFromMap()
            }
        }
    }
    onToggleMergeOverlayModal = () => {
        this.setState({ isMergeOverlayOpen: !this.state.isMergeOverlayOpen })
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
    handleDeleteClick = () => {
        this.props.onDeleteOverlay(this.state.planData)
        this.props.onToggleDeleteOverlayOpen()
    }
    handleDeletePlanClick = (planData) => {
        this.setState({ planData: planData })
        this.onToggleDeletePlanModal()
    }
    handleEditPlanClick = (planData) => {
        this.setState({ planData: planData })
        this.onToggleEditPlanOpen()
    }
    onToggleDeletePlanModal = () => {
        this.setState({ isDeletePlanOpen: !this.state.isDeletePlanOpen })
    }
    onToggleEditPlanOpen = () => {
        this.setState({ isEditPlanOpen: !this.state.isEditPlanOpen })
    }
    handleAcceptToDeletePlan = (planId) => {
        this.props.onDeletePlan(planId)
        this.onToggleDeletePlanModal()
    }
    renderDrawer = () => {
        const { user, onSetUser, selectedPlan, onCallFitBounds,
            onEditPlanName, isSaving, onToggleDistanceMarker, isDistanceMarkerVisible
        } = this.props;
        return (
            user ?
                <div>
                    <List>
                        <ListItem>
                            <Avatar
                                alt={user.email}
                                src={user.photoURL || Pic}
                                className="bigAvatar"
                            />
                            <ListItemText primary={user.email} secondary={user.displayName} />
                        </ListItem>
                    </List>

                    <Button variant="contained" className="buttonmargin buttonlogout" onClick={this.logout}>
                        logout
                        </Button>

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

                        <Button variant="contained" className="buttonshow" onClick={onToggleDistanceMarker}>
                            {isDistanceMarkerVisible ? 'ปิดระยะ' : 'แสดงระยะ'}
                        </Button>

                        <Button
                            variant="contained"
                            className=" buttonsave"
                            disabled={(selectedPlan || isSaving) ? false : true}
                            onClick={() => this.props.onSaveToFirestore(selectedPlan)}
                        >
                            บันทึก
                        </Button>

                        <Divider />
                        <List>
                            {
                                this.props.isWaitingForPlanQuery ?
                                    <div>
                                        กำลังโหลด....
                                    </div>
                                    :
                                    this.props.planData.length > 0 ?
                                        this.props.planData.map((plan) => {
                                            return (
                                                <ListItem
                                                    button
                                                    key={plan.planId}
                                                    onClick={() => this.handlePlanClick(plan)}
                                                    disabled={!plan.isPlanClickable}
                                                >
                                                    <ListItemText primary={plan.planName} />

                                                    <ListItemSecondaryAction>
                                                        {/*
                                                        <IconButton aria-label="Save"
                                                            onClick={() => this.props.onSaveToFirestore(plan)}
                                                        //disabled={!plan.isLoading || plan.isSave}

                                                        >
                                                            
                                                                !plan.isLoading ?
                                                                    <SaveIcon />
                                                                    :
                                                                    <CircularProgress
                                                                        variant="static"
                                                                        value={plan.isLoading}
                                                                    />
                                                            
                                                        </IconButton>
                                                         */}
                                                        <IconButton aria-label="Edit"
                                                            onClick={() => this.handleEditPlanClick(plan)}
                                                            disabled={!plan.isPlanOptionsClickable}
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                        <IconButton aria-label="Delete"
                                                            onClick={() => this.handleDeletePlanClick(plan)}
                                                            disabled={!plan.isPlanOptionsClickable}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            )
                                        })
                                        :
                                        'ยังไม่มีแปลงที่สร้าง'
                            }
                        </List>
                        <MergeOverlay
                            isMergeOverlayOpen={this.state.isMergeOverlayOpen}
                            onToggleMergeOverlayModal={this.onToggleMergeOverlayModal}
                            planData={this.state.planData}
                            onClearOverlayFromMap={this.props.onClearOverlayFromMap}
                            onSetSelectedPlan={this.props.onSetSelectedPlan}
                            handleAccecptToMergeOverlay={this.handleAccecptToMergeOverlay}
                            handleDiscardToMergeOverlay={this.handleDiscardToMergeOverlay}
                        />
                        <EditPlan
                            onToggleEditPlanOpen={this.onToggleEditPlanOpen}
                            isEditPlanOpen={this.state.isEditPlanOpen}
                            planData={this.state.planData}
                            onEditPlanName={onEditPlanName}
                        />
                        <DeletePlan
                            isDeletePlanOpen={this.state.isDeletePlanOpen}
                            onToggleDeletePlanModal={this.onToggleDeletePlanModal}
                            planData={this.state.planData}
                            handleAcceptToDeletePlan={this.handleAcceptToDeletePlan}
                        />
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
        const { drawerPage, } = this.props;

        switch (drawerPage) {
            case 'homePage':
                return (this.renderDrawer())
            case 'option':
                return (
                    <OverlayOptions
                        selectedOverlay={this.props.selectedOverlay}
                        onChangePolyStrokeColor={this.props.onChangePolyStrokeColor}
                        onChangePolyFillColor={this.props.onChangePolyFillColor}
                        onSetSelectedIcon={this.props.onSetSelectedIcon}
                        overlayOptionsType={this.props.overlayOptionsType}
                        handleDetailEdit={this.props.handleDetailEdit}
                        onDeleteOverlay={this.props.onDeleteOverlay}
                        isFirstDraw={this.props.isFirstDraw}
                        onUndoDrawingCoords={this.props.onUndoDrawingCoords}
                        onRedoDrawingCoords={this.props.onRedoDrawingCoords}
                        onRedoCoords={this.props.onRedoCoords}
                        onUndoCoords={this.props.onUndoCoords}
                        fillColor={this.props.fillColor}
                        strokeColor={this.props.strokeColor}
                        onAddTask={this.props.onAddTask}
                        overlayTaskShow={this.props.overlayTaskShow}
                        onToggleIsTaskDone={this.props.onToggleIsTaskDone}
                        onFilterTask={this.props.onFilterTask}
                        filterTaskType={this.props.filterTaskType}
                        onEditTask={this.props.onEditTask}
                        onDeleteTask={this.props.onDeleteTask}
                    />
                )
            default: return;
        }
    }

    render() {
        const { isWaitingForUserResult } = this.props;
        return (
            <Drawer
                variant="persistent"
                anchor='left'
                open={this.props.openSide}
                classes={{
                    paper: "drawerPaper",
                }}
            // className={classes.drawerPaper}
            >
                {isWaitingForUserResult ?
                    'กำลังโหลด....'
                    :
                    this.drawerPageRender()
                }

            </Drawer>
        );
    }
}

PermanentDrawer.propTypes = {

};

export default (PermanentDrawer);


