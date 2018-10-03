import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import firebase, { auth, provider, provider2 } from '../config/firebase';

// Material-ui Import
import { withStyles } from '@material-ui/core/styles';
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
import Modal from '@material-ui/core/Modal';
import OpenWith from '@material-ui/icons/OpenWith';
import List from '@material-ui/core/List';
import grey from '@material-ui/core/colors/grey';
import red from '@material-ui/core/colors/red';

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

});*/

class PermanentDrawer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            planData: null,
            isDeletePlanOpen: false,
            isMergeOverlayOpen: false,
            isEditPlanOpen: false,
            selectedPlanIndex: null,
            willSelectIndex: null,
        }
    }
    logout = () => {
        firebase.auth().signOut();
        this.props.onSetUserNull()
    }
    handlePlanClick = (planData, index) => {
        const { selectedPlan, overlayObject } = this.props
        if ((!selectedPlan) && overlayObject.length > 0) {
            this.setState({ planData: planData, willSelectIndex: index })
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
    onToggleMergeOverlayModal = () => {
        this.setState({ isMergeOverlayOpen: !this.state.isMergeOverlayOpen })
    }
    handleAccecptToMergeOverlay = () => {
        this.props.onSetSelectedPlan(this.state.planData)
        this.setState({ selectedPlanIndex: this.state.selectedPlanIndex })
        this.onToggleMergeOverlayModal()

    }
    handleDiscardToMergeOverlay = () => {
        this.props.onSetSelectedPlan(this.state.planData)
        this.setState({ selectedPlanIndex: this.state.selectedPlanIndex })
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
        const { selectedPlan } = this.props
        this.props.onDeletePlan(planId)
        if (selectedPlan) {
            if (selectedPlan.planId === planId) {
                this.setState({ selectedPlanIndex: null })
            }
        }


        this.onToggleDeletePlanModal()
    }
    renderDrawer = () => {
        const { classes, user, onSetUser, selectedPlan, onCallFitBounds,
            onEditPlanName, isSaving
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
                        <Button variant="contained" color="primary" className="buttonmargin buttonlogout" onClick={this.logout}>
                            logout
                        </Button>

                        <Button
                            variant="contained"
                            color="primary"
                            className={classNames(classes.buttonmargin, classes.buttonsave)}
                            disabled={(selectedPlan && !isSaving) ? false : true}
                            onClick={this.props.onSaveToFirestore}>
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
                                        this.props.planData.map((plan, index) => {
                                            return (
                                                <ListItem
                                                    button
                                                    key={plan.planId}
                                                    onClick={() => this.handlePlanClick(plan, index)}
                                                    //selected={this.state.selectedPlanIndex === index}
                                                    disabled={this.state.selectedPlanIndex === index}

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
                                        })
                                        :
                                        ''
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
            isLoading
        } = this.props;

        switch (drawerPage) {
            case 'homePage':
                return (this.renderDrawer())
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
            default: return;
        }
    }

    render() {
        const { classes, isWaitingForUserResult } = this.props;
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
    classes: PropTypes.object.isRequired,
};

export default (PermanentDrawer);


