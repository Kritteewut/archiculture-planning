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
import ListSubheader from '@material-ui/core/ListSubheader'
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import MyPlan from '@material-ui/icons/Person';
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Collapse from '@material-ui/core/Collapse'
import ColPlan from '@material-ui/icons/Group';
import CircularProgress from '@material-ui/core/CircularProgress'

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

class PermanentDrawer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            planData: null,
            isDeletePlanOpen: false,
            isMergeOverlayOpen: false,
            isEditPlanOpen: false,
            isMyPlanOpen: true,
            isColPlanOpen: true,
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
    onToggleMyplan = () => {
        this.setState({ isMyPlanOpen: !this.state.isMyPlanOpen })
    }
    onToggleColPlan = () => {
        this.setState({ isColPlanOpen: !this.state.isColPlanOpen })
    }
    renderDrawer = () => {
        const { user, onSetUser, selectedPlan, onCallFitBounds,
            onEditPlanName, onToggleDistanceMarker, isDistanceMarkerVisible
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
                            <ListItemText primary={user.email}
                                secondary={user.uid}
                            />
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
                            className="buttonsave"
                            disabled={(selectedPlan) ? selectedPlan.isLoading : true}
                            onClick={() => this.props.onSaveToFirestore(selectedPlan)}
                        >
                            บันทึก
                        </Button>

                        <Divider />
                        <List
                            component="nav"
                            subheader={<ListSubheader component="div">รายการแปลง</ListSubheader>}
                        >
                            <ListItem
                                button
                                onClick={this.onToggleMyplan}
                            >
                                <ListItemIcon>
                                    <MyPlan />
                                </ListItemIcon>
                                <ListItemText inset primary="แปลงของฉัน" />
                                {this.state.isMyPlanOpen ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>
                            <Collapse in={this.state.isMyPlanOpen} timeout="auto" unmountOnExit>
                                {
                                    this.props.isWaitingForPlanQuery ?
                                        <div>
                                            กำลังโหลด....
                                        </div>
                                        :
                                        <List component="div" disablePadding>

                                            {this.props.planData.length > 0 ?
                                                this.props.planData.map((plan) => {
                                                    return (
                                                        <ListItem
                                                            button
                                                            key={plan.planId}
                                                            onClick={() => this.handlePlanClick(plan)}
                                                            disabled={!plan.isPlanClickable || plan.isLoading}
                                                        >
                                                            <ListItemText primary={plan.planName} />
                                                            <ListItemSecondaryAction>
                                                                {
                                                                    plan.loadingProgress ? <CircularProgress variant="static" value={(plan.loadingProgress / plan.loadingAmount) * 100} /> : null
                                                                }
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
                                                'ยังไม่มีแปลงที่สร้าง'}
                                        </List>
                                }
                            </Collapse>
                            <Divider />
                            <ListItem
                                button
                                onClick={this.onToggleColPlan}
                            >
                                <ListItemIcon>
                                    <ColPlan />
                                </ListItemIcon>
                                <ListItemText inset primary="แปลงของผู้อื่น" />
                                {this.state.isColPlanOpen ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>
                            <Collapse in={this.state.isColPlanOpen} timeout="auto" unmountOnExit>
                                {
                                    this.props.isWaitingForColPlanQuery ?
                                        <div>
                                            กำลังโหลด....
                                        </div>
                                        :
                                        <List component="div" disablePadding>

                                            {
                                                this.props.colPlans.length > 0 ?
                                                    this.props.colPlans.map((plan) => {
                                                        return (
                                                            <ListItem
                                                                button
                                                                key={plan.planId}
                                                                onClick={() => this.handlePlanClick(plan)}
                                                                disabled={!plan.isPlanClickable}
                                                            >
                                                                <ListItemText primary={plan.planName} />
                                                            </ListItem>
                                                        )
                                                    })
                                                    :
                                                    'ยังไม่มีแปลงของผู้อื่น'

                                            }
                                        </List>
                                }
                            </Collapse>
                            <Divider />

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
                            onAddPlanMember={this.props.onAddPlanMember}
                            user={user}

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


