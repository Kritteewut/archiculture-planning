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
import ListSubheader from '@material-ui/core/ListSubheader'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid';

// Import Group
import Login from './Login';
import EditPlan from './EditPlan';
import DeletePlan from './DeletePlan';
import MergeOverlay from './MergeOverlay';
import AddPlan from './AddPlan';
import OpenSide from '../components/openSideBtn'

// Icon Group
import Pic from './Picture/User.png';
import IconBook from '@material-ui/icons/Book';
import IconLogout from '@material-ui/icons/PhonelinkErase';
import IconForward from '@material-ui/icons/ArrowBack';
import ViewOnly from '@material-ui/icons/Visibility'
import OpenWith from '@material-ui/icons/LocationOn';
import CoppiedIcon from '@material-ui/icons/LibraryBooks'
//Picture Group
import Picbackground from './Picture/Profile Background.jpg';

// CSS Import
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
        this.props.onClearOverlayFromMap()
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

                    <div>
                        <List>
                            <ListItem>

                                <Avatar
                                    alt={user.email}
                                    src={user.photoURL || Pic}
                                    className="bigAvatar"
                                />

                                <ListItemText
                                    primary={user.displayName ? user.displayName : user.email}
                                >
                                </ListItemText>

                            </ListItem>


                            <CopyToClipboard
                                text={user.uid}
                                className="FrameTextID"
                                onCopy={() => alert('coppied to clip baord')}>

                                <span className="TextSmallSizeset"> ID ผู้ใช้งาน : {user.uid}</span>

                            </CopyToClipboard>
                            <CopyToClipboard
                                onCopy={() => alert('coppied to clip baord')}
                                text={user.uid}
                            >

                                <Button
                                    variant="contained"
                                    aria-label="Delete"
                                    className="buttonCopy">

                                    <div className="leftIcon ButtonIconColor">
                                        <CoppiedIcon />
                                    </div>

                                    <div>
                                        Copy ID ผู้ใช้งาน
                            </div>

                                </Button>

                            </CopyToClipboard>

                        </List>

                        <Button variant="fab" className="buttonlogout" onClick={this.logout}>
                            <div className="ButtonLogoutIconColor">
                                <IconLogout />
                            </div>
                        </Button>

                        {/* <Button variant="fab" className="buttonturnoff" onClick={this.props.handleDrawerToggle}>
                            <div className="ButtonIconColor">
                                <IconForward />
                            </div>
                        </Button> */}
                        <OpenSide
                            handleDrawerToggle={this.props.handleDrawerToggle}
                        />

                        <div className="Framelinearcolor1">
                        </div>

                        <div className="FrameButtoncolor">
                        </div>

                    </div>


                    <div>

                        <Divider />

                        <Button
                            variant="contained"
                            color="default"
                            className="buttonHowtoUse"
                        >

                            <div className="leftIcon ButtonHowtoIconColor">
                                <IconBook />
                            </div>

                            <div className="TextLargeSize">
                                คู่มือการใช้งาน
                            </div>

                        </Button>

                        <div
                        //className="container"
                        >
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

                            {/* <Button
                            variant="contained"
                            className="AddButton"
                        > */}

                            <AddPlan
                                onAddPlan={this.props.onAddPlan}
                                onChangeDrawPage={this.props.onChangeDrawPage}
                                user={this.props.user}
                                handleDrawerOpen={this.props.handleDrawerOpen}
                            />
                            {/* </Button> */}


                        </div>

                        <Divider />

                        <List>
                            <ListItem>

                                แปลงที่เลือก : {selectedPlan ? selectedPlan.planName : 'ยังไม่มีแปลงที่เลือก'}

                                <ListItemSecondaryAction>
                                    <IconButton
                                        aria-label="Delete"
                                        disabled={overlayObject.length > 0 ? false : true}
                                        onClick={onCallFitBounds}
                                    >
                                        <div className="ButtonIconColor">
                                            <OpenWith />
                                        </div>
                                    </IconButton>
                                </ListItemSecondaryAction>

                            </ListItem>
                        </List>

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
                                                            < IconButton
                                                                variant="fab"
                                                                aria-label="Edit"
                                                                onClick={() => this.handleEditPlanClick(plan)}
                                                                disabled={!plan.isPlanOptionsClickable}
                                                            >
                                                                <div
                                                                    className="ButtonIconColor"
                                                                    variant="fab">
                                                                    <EditIcon />
                                                                </div>
                                                            </IconButton>
                                                            <IconButton
                                                                variant="fab"
                                                                aria-label="Delete"
                                                                onClick={() => this.handleDeletePlanClick(plan)}
                                                                disabled={!plan.isPlanOptionsClickable}
                                                            >
                                                                <div className="ButtonIconColor"
                                                                    variant="fab">
                                                                    <DeleteIcon />
                                                                </div>

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
            // <Drawer
            //     variant="persistent"
            //     anchor='left'
            //     open={this.props.openSide}
            //     classes={{ paper: "drawerPaper", }}
            // //className={classes.drawerPaper}
            // >
            <div
                style={{
                    width: '100%'
                }}
            >
                {
                    isWaitingForUserResult ?
                        <div
                            style={{ alignContent: 'center' }}
                        >
                            กำลังโหลด....
                        </div>
                        :
                        this.drawerPageRender()
                }
            </div>
            // </Drawer>

        );
    }
}

export default (PermanentDrawer);
