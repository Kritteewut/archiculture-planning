import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Login from './Login';
import Avatar from '@material-ui/core/Avatar';
import classNames from 'classnames';
import Pic from './Picture/Ling logo.png';
import firebase, { auth, provider, provider2 } from '../config/firebase';
import '../App.css';
import ColorPicker from './ColorPicker';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import OverlayOptions from './OverlayOptions';
import DeleteIcon from '@material-ui/icons/Delete';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import './Design.css';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';

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
});

class PermanentDrawer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            planData: null,
            isDeletePlanOpen: false,
            isMergeOverlayOpen: false,
        }
    }
    componentDidMount() {
        console.log()
    }
    logout = () => {
        firebase.auth().signOut();
        this.props.onSetUserNull()
    }
    handlePlanClick = (planData) => {
        const { selectedPlan, overlayObject } = this.props
        if ((!selectedPlan) && overlayObject.length > 0) {
            this.setState({ planData: planData })
            this.onToggleMergeOverlayModal()
        }
        else {
            if (selectedPlan !== planData) {
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
    renderDrawer = () => {
        const { classes, user, onSetUser, selectedPlan } = this.props;
        return (
            user ?
                <div>
                    <ListItem>
                        <Avatar
                            alt={user.email}
                            src={user.photoURL || Pic}
                            className={classNames(classes.bigAvatar)}
                        />
                        <ListItemText primary={user.email} secondary={user.displayName} />
                    </ListItem>
                    <div>
                        <Divider />
                        <ListItem>
                            แปลงที่เลือก : {selectedPlan ? selectedPlan.planName : 'ยังไม่มีแปลงที่เลือก'}
                        </ListItem>
                        <Divider />
                        {this.props.planData.map(value => {
                            return (
                                <ListItem
                                    role={undefined}
                                    button
                                    key={value.planId}
                                    onClick={() => this.handlePlanClick(value)}>
                                    <ListItemText primary={value.planName} />
                                    <ListItemSecondaryAction>
                                        <IconButton aria-label="Delete"
                                            onClick={() => this.handleDeletePlanClick(value)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>

                                </ListItem>
                            )
                        })}
                        <Divider />
                        <button className="DesignButtonSave" onClick={this.props.onSaveToFirestore}>
                            บันทึก
                        </button>
                        <button className="DesignButtonLogout" onClick={this.logout}>
                            logout
                        </button>
                        {this.renderMergeOverlayModal()}
                        {this.renderDeletePlanModal()}
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
        const { drawerPage,
            selectedOverlay,
            onChangePolyStrokeColor,
            onChangePolyFillColor,
            onSetSelectedIcon,
            overlayOptionsType,
            handleDetailEdit,
            onDeleteOverlay
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
