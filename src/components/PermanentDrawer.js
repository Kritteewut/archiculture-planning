import React from 'react';
import firebase from '../config/firebase';

// Material-ui Import
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
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
import ListSubheader from '@material-ui/core/ListSubheader'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import CircularProgress from '@material-ui/core/CircularProgress'
import ViewOnly from '@material-ui/icons/Visibility'

// Import Group
import Login from './Login';
import EditPlan from './EditPlan';
import DeletePlan from './DeletePlan';
import MergeOverlay from './MergeOverlay';
import AddPlan from './AddPlan';

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
            this.props.onSetSelectedPlan(planData)
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
        this.onToggleMergeOverlayModal()
    }
    handleDeletePlanClick = (planData) => {
        this.setState({ planData: planData })
        this.onToggleDeletePlanModal()
    }
    handleEditPlanClick = (planData) => {
        this.props.onAddRealTimePlanMemberUpdateListener(planData)
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
            onToggleDistanceMarker, isDistanceMarkerVisible, overlayObject
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
                            <ListItemText
                                primary={user.displayName}
                            >
                            </ListItemText>
                        </ListItem>
                        <CopyToClipboard text={user.uid}
                            onCopy={() => alert('coppied to clip baord')}>
                            <span>ID ผู้ใช้ {user.uid}</span>
                        </CopyToClipboard>
                    </List>
                    <Button variant="contained" className="buttonmargin buttonlogout" onClick={this.logout}>
                        ออกจากระบบ
                    </Button>

                    <div>
                        <Divider />
                        <List>
                            <ListItem>
                                แปลงที่เลือก : {selectedPlan ? selectedPlan.planName : 'ยังไม่มีแปลงที่เลือก'}
                                <ListItemSecondaryAction>
                                    <IconButton aria-label="Delete"
                                        disabled={overlayObject.length > 0 ? false : true}
                                        onClick={onCallFitBounds}
                                    >
                                        <OpenWith />
                                    </IconButton>
                                </ListItemSecondaryAction>

                            </ListItem>
                        </List>
                        <Divider />
                        <AddPlan
                            onAddPlan={this.props.onAddPlan}
                            onChangeDrawPage={this.props.onChangeDrawPage}
                            handleDrawerOpen={this.props.handleDrawerOpen}
                            {...this.props}
                        />
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
                            component="div"
                            disablePadding
                            subheader={<ListSubheader component="div">รายการแปลง</ListSubheader>}
                        >
                            {this.props.isWaitingForPlanQuery ?
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
                                                disabled={!plan.isPlanClickable || plan.isLoading}
                                            >
                                                <ListItemText primary={plan.planName} />
                                                {
                                                    plan.memberRole === 'editor' ?
                                                        <ListItemSecondaryAction>
                                                            {plan.loadingProgress ? <CircularProgress variant="static" value={(plan.loadingProgress / plan.loadingAmount) * 100} /> : null}
                                                            < IconButton aria-label="Edit"
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
                                                        :
                                                        <ListItemSecondaryAction>
                                                            <IconButton
                                                                aria-label="ViewOnly"
                                                                disabled={true}
                                                            >
                                                                <ViewOnly />
                                                            </IconButton>

                                                        </ListItemSecondaryAction>
                                                }



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
                            onSetSelectedPlan={this.props.onSetSelectedPlan}
                            handleAccecptToMergeOverlay={this.handleAccecptToMergeOverlay}
                            handleDiscardToMergeOverlay={this.handleDiscardToMergeOverlay}
                        />
                        <EditPlan
                            onToggleEditPlanOpen={this.onToggleEditPlanOpen}
                            isEditPlanOpen={this.state.isEditPlanOpen}
                            planData={this.state.planData}
                            onEditPlanName={this.props.onEditPlanName}
                            onAddPlanMember={this.props.onAddPlanMember}
                            user={this.props.user}
                            planMember={this.props.planMember}
                            isWaitingForPlanMemberQuery={this.props.isWaitingForPlanMemberQuery}
                            onDeletePlanMember={this.props.onDeletePlanMember}
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
                        selectedPlan={this.props.selectedPlan}
                        selectedOverlay={this.props.selectedOverlay}
                        onChangePolyStrokeColor={this.props.onChangePolyStrokeColor}
                        onChangePolyFillColor={this.props.onChangePolyFillColor}
                        onSetSelectedIcon={this.props.onSetSelectedIcon}
                        overlayOptionsType={this.props.overlayOptionsType}
                        onEditOverlayDetail={this.props.onEditOverlayDetail}
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
                        isWaitingForTaskToggle={this.props.isWaitingForTaskToggle}
                        overlAllFiltertask={this.props.overlAllFiltertask}
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
                classes={{ paper: "drawerPaper", }}
            //className={classes.drawerPaper}
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


