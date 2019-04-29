import React from 'react';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import { withStyles } from '@material-ui/core/styles';
import Map from './components/Map'
import PermanentDrawer from './components/PermanentDrawer'
import { SORT_BY_NEWEST, SORT_BY_LATEST, SHOW_ALL, SHOW_COMPLETE, SHOW_ACTIVATE, SHOW_OVERVIEW, SHOW_TODAY } from './StaticValue/StaticString'
import moment from 'moment';
import {
    overlayRef,
    planRef, taskRef,
    planMemberRef,
} from './config/firebase'
import icon_point from './components/icons/icon_point.png';
import update from 'immutability-helper';
import shortid from 'shortid'
import { auth, userRef } from './config/firebase'
import SearchBox from './components/SearchBox';
import Marker from './components/Marker';
import Polygon from './components/Polygon';
import Polyline from './components/Polyline';
import OpenSide from './components/openSideBtn';
import ExampleLine from './components/ExampleLine';
import FunctionBtn from './components/FunctionBtn'
import IconLabelButtons from './components/DrawingBtn';
import TransparentMaker from './components/TransparentMaker';
// import DetailedExpansionPanel from './components/DetailedExpansionPanel';
import OverlayDetail from './components/OverlayDetail'
import MapCenterFire from './components/MapCenterFire'
import { isMobile } from 'react-device-detect';
import './App.css'
import './components/SearchBoxStyles.css'
import './components/PermanentDrawer.css';

const drawerWidth = 320;

const styles = theme => ({
    root: {
        display: 'flex',
        width: '100%',
        height: '100%',
        margin: 0,
        padding: 0,
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        marginLeft: drawerWidth,
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
        },
    },
    menuButton: {
        marginRight: 20,
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        width: '100%',
        height: '100%',
        //padding: theme.spacing.unit * 3,
    },
});

class ResponsiveDrawer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mobileOpen: false,
            areaDetail: "",
            disBtwDetail: "",
            distanceDetail: [],
            drawerPage: "homePage",
            drawingBtnType: null,
            drawingOverlayId: null,
            exampleLineCoords: [],
            fillColor: "#ffa500",
            filterTaskType: SHOW_ALL,
            icon: icon_point,
            isDistanceMarkerVisible: true,
            isDrawInDesktopDevice: !isMobile,
            isFirstDraw: true,
            isFirstOverlayQuery: true,
            isWaitingForPlanMemberQuery: true,
            isWaitingForPlanQuery: true,
            isWaitingForUserResult: true,
            isWaitingForTaskToggle: false,
            latLngDetail: "",
            left: "350px",
            lengthDetail: "",
            openSide: true,
            overlAllFiltertask: SHOW_OVERVIEW,
            overlayObject: [],
            overlayOptionsType: "",
            overlayTaskShow: [],
            overlayTasks: [],
            panelName: "จับ",
            planData: [],
            planMember: [],
            selectedOverlay: null,
            selectedPlan: null,
            strokeColor: "#ff4500",
            user: null,

        };
        this.overlayRealTimeUpdateRef = null
        this.overlayTaskRealTimeUpdateRef = null
        this.planMemberRealtimeUpdateRef = null
    }

    handleDrawerToggle = () => {
        this.setState(state => ({ mobileOpen: !state.mobileOpen }));
    };
    componentWillMount() {
        var self = this
        auth.onAuthStateChanged((user) => {
            if (user) { self.onSetUser(user) }
            self.setState({ isWaitingForUserResult: false })
        })
    }
    componentDidMount() {
        // this.onAddBeforeUnloadListener()
    }
    componentWillUnmount() {
    }
    onAddBeforeUnloadListener() {
        window.addEventListener("beforeunload", function (event) {
            // Cancel the event as stated by the standard.
            event.preventDefault();
            // Chrome requires returnValue to be set.
            //event.returnValue = 'เซฟก่อนไหมพ่อหนุ่ม'.
        });
    }
    onDrawingBtnTypeChange = (type) => {
        this.setState({ drawingBtnType: type, panelName: type })
    }
    onToggleDeviceMode = () => {
        const { isDrawInDesktopDevice } = this.state
        this.setState({ isDrawInDesktopDevice: !isDrawInDesktopDevice })
        this.onClearSomeMapEventListener()
    }
    onClearExampleLine = () => {
        this.setState({ exampleLineCoords: [] })
    }
    onClearSomeMapEventListener = () => {
        window.google.maps.event.clearListeners(window.map, 'click')
        window.google.maps.event.clearListeners(window.map, 'mousemove')
        window.google.maps.event.clearListeners(window.map, 'center_changed')
    }
    addMouseMoveOnMap = () => {
        var self = this
        window.google.maps.event.addListener(window.map, 'mousemove', function (event) {
            var LatLngString = `lattitude :  ${event.latLng.lat().toFixed(4)}   ,   longtitude : ${event.latLng.lng().toFixed(4)}`
            self.setState({ latLngDetail: LatLngString })
        })
    }
    onFinishDrawing = () => {
        const { isFirstDraw, overlayObject, distanceDetail, selectedPlan, drawingOverlayId } = this.state
        if (isFirstDraw === false) {
            const drawingIndex = overlayObject.findIndex(overlay => overlay.overlayId === drawingOverlayId)
            const detailIndex = distanceDetail.findIndex(detail => detail.overlayId === drawingOverlayId)
            const currentOverlay = overlayObject[drawingIndex]
            const coordsLength = currentOverlay.overlayCoords.length
            const overlayType = currentOverlay.overlayType
            if ((overlayType === 'polygon' && coordsLength <= 2) || (overlayType === 'polyline' && coordsLength <= 1)) {
                let spliceOverlay = update(overlayObject, { $splice: [[drawingIndex, 1]] })
                let spliceDetail = update(distanceDetail, { $splice: [[detailIndex, 1]] })
                if (overlayType === 'polygon') {
                    alert('รูปหลายเหลี่ยมที่มีจำนวนจุดมากกว่าสองจุดเท่านั้นจึงจะถูกบันทึกได้')
                }
                if (overlayType === 'polyline') {
                    alert('เส้นเชื่อมที่มีจำนวนจุดมากกว่าหนึ่งจุดเท่านั้นจึงจะถูกบันทึกได้')
                }
                this.setState({
                    overlayObject: spliceOverlay,
                    distanceDetail: spliceDetail,
                    isFirstDraw: true,
                    drawingOverlayId: null,
                })
            } else {
                if (selectedPlan) {
                    this.onSaveOverlay(currentOverlay)
                } else {
                    const updateOverlay = update(overlayObject, { [drawingIndex]: { clickable: { $set: true } } })
                    this.setState({ overlayObject: updateOverlay })
                }
                this.setState({ isFirstDraw: true, drawingOverlayId: null, }, () => console.log(this.state.overlayObject, 'overlayOb'))
            }
        }
        this.onClearExampleLine()
        this.onResetSelectedOverlay()
    }
    onSaveOverlay = (saveOverlay) => {
        var self = this
        const { selectedPlan, user } = this.state
        const planId = selectedPlan.planId
        const editorId = user.uid
        var overlay
        const { overlayCoords, overlayDetail, overlayName,
            overlayType, fillColor, strokeColor, icon, overlayId, } = saveOverlay
        const overlayData = { overlayCoords, overlayDetail, overlayName, overlayType, editorId, planId }
        if (overlayType === 'polygon') {
            overlay = {
                fillColor, strokeColor, ...overlayData
            }
        }
        if (overlayType === 'polyline') {
            overlay = {
                strokeColor, ...overlayData
            }
        }
        if (overlayType === 'marker') {
            overlay = {
                icon, ...overlayData
            }
        }
        overlayRef.add(overlay).then(function (doc) {
            if (self.state.selectedPlan.planId === planId) {
                const actionIndex = self.state.overlayObject.findIndex(overlay => overlay.overlayId === overlayId)
                const updateOverlay = update(self.state.overlayObject, {
                    [actionIndex]: {
                        overlayId: { $set: doc.id },
                        overlaySource: { $set: 'server' },
                        isOverlaySave: { $set: true },
                        editorId: { $set: editorId },
                        planId: { $set: planId },
                        clickable: { $set: true },
                    }
                })
                if (overlayType === 'polygon' || overlayType === 'polyline') {
                    const detailIndex = self.state.distanceDetail.findIndex(detail => detail.overlayId === overlayId)
                    const updateDetailIndex = update(self.state.distanceDetail, { [detailIndex]: { overlayId: { $set: doc.id } } })
                    self.setState({ distanceDetail: updateDetailIndex })
                }
                self.setState({ overlayObject: updateOverlay })
            }
        })
    }
    onSetPlanToLoading = (planId, loadingAmount) => {
        const updatePlanIndex = this.state.planData.findIndex(plan => plan.planId === planId)
        const updateIsSaving = update(this.state.selectedPlan, { isLoading: { $set: true } })
        const upDateSaveProgressPlan = update(this.state.planData, {
            [updatePlanIndex]: {
                isLoading: { $set: true },
                isPlanOptionsClickable: { $set: false },
                loadingAmount: { $set: loadingAmount },
                loadingProgress: { $set: 0 },
            }
        })
        this.setState({ planData: upDateSaveProgressPlan, selectedPlan: updateIsSaving })
    }
    onResetDetail = () => {
        this.setState({
            latLngDetail: '',
            lengthDetail: '',
            disBtwDetail: '',
            areaDetail: '',
        })
    }
    onSetPanelName = (panelName) => {
        this.setState({ panelName })
    }
    onAddListenerMarkerBtn = () => {
        this.onFinishDrawing()
        this.onClearSomeMapEventListener()
        this.onDrawingBtnTypeChange('marker')
        this.onSetMarkerOptions()
        this.handleDrawerOpen()
        if (this.state.isDrawInDesktopDevice) {
            this.onSetDrawingCursor()
            this.addMouseMoveOnMap()
            this.drawMarker()
        } else {
            this.addMapCenterOnMap()
        }
    }
    onAddListenerPolygonBtn = () => {
        this.onFinishDrawing()
        this.onClearSomeMapEventListener()
        this.onDrawingBtnTypeChange('polygon')
        this.handleDrawerOpen()
        this.onSetPolyOptions()
        if (this.state.isDrawInDesktopDevice) {
            this.onSetDrawingCursor()
            this.addMouseMoveOnMap()
            this.drawPolygon()
        } else {
            this.addMapCenterOnMap()
        }
    }
    onAddListenerPolylineBtn = () => {
        this.onFinishDrawing()
        this.onClearSomeMapEventListener()
        this.onDrawingBtnTypeChange('polyline')
        this.handleDrawerOpen()
        this.onSetPolyOptions()
        if (this.state.isDrawInDesktopDevice) {
            this.onSetDrawingCursor()
            this.addMouseMoveOnMap()
            this.drawPolyline()
        } else {
            this.addMapCenterOnMap()
        }
    }
    onAddListenerGrabBtn = () => {
        this.onFinishDrawing()
        this.onClearSomeMapEventListener()
        this.onSetDragMapCursor()
        this.setState({
            drawingBtnType: null,
            panelName: 'จับ',
            drawerPage: 'homePage',
        })
    }
    drawMarker = () => {
        var self = this
        window.google.maps.event.addListener(window.map, 'click', function (event) {
            if (self.state.isFirstDraw) {
                self.onPushNewMarker(event.latLng)
            }
        })
    }
    drawPolyline = () => {
        var self = this
        window.google.maps.event.addListener(window.map, 'click', function (event) {
            const latLng = event.latLng
            if (self.state.isFirstDraw) {
                self.onPushNewPolyline(latLng)
            } else {
                self.onPushDrawingPolylineCoords(latLng)
            }
        })
    }
    drawPolygon = () => {
        var self = this
        window.google.maps.event.addListener(window.map, 'click', function (event) {
            const { isFirstDraw } = self.state
            const latLng = event.latLng
            if (isFirstDraw) {
                self.onPushNewPolygon(latLng)
            } else {
                self.onPushDrawingPolygonCoords(latLng)
            }
        })
    }
    onPushNewPolygon = (latLng) => {
        const lat = latLng.lat()
        const lng = latLng.lng()
        const clickLatLng = { lat, lng }
        const { fillColor, strokeColor, overlayObject } = this.state
        const id = shortid.generate()
        let pushObject = update(overlayObject, {
            $push: [{
                overlayCoords: [clickLatLng],
                overlayId: id,
                overlayType: 'polygon',
                overlaySource: 'local',
                fillColor: fillColor,
                strokeColor: strokeColor,
                overlayName: 'Polygon',
                overlayDetail: '',
                undoCoords: [[clickLatLng]],
                redoCoords: [],
                isOverlaySave: false,
                clickable: false,
            }]
        })
        this.setState({
            drawingBtnType: null,
            overlayObject: pushObject,
            isFirstDraw: false,
            drawingOverlayId: id,
        })
        this.onDrawExampleLine(latLng)
    }
    onPushDrawingPolygonCoords = (latLng) => {
        const { overlayObject, drawingOverlayId } = this.state
        const lat = latLng.lat()
        const lng = latLng.lng()
        const clickLatLng = { lat, lng }
        const actionIndex = overlayObject.findIndex(overlay => overlay.overlayId === drawingOverlayId)
        const pushCoords = update(overlayObject, { [actionIndex]: { overlayCoords: { $push: [clickLatLng] } } })
        const currentOverlay = pushCoords[actionIndex]
        const currentCoords = currentOverlay.overlayCoords
        const pushUndoCoords = update(pushCoords, { [actionIndex]: { undoCoords: { $push: [currentCoords] } } })
        const setRedoCoords = update(pushUndoCoords, { [actionIndex]: { redoCoords: { $set: [] } } })
        const poylgon = new window.google.maps.Polygon({
            path: currentCoords,
            overlayType: 'polygon'
        })
        this.onPolydistanceBtwCompute(setRedoCoords[actionIndex])
        this.onPolyLengthCompute(poylgon)
        this.onSquereMetersTrans(poylgon)
        this.setState({ overlayObject: setRedoCoords })
        this.onDrawExampleLine(latLng)
    }
    onPushNewPolyline = (latLng) => {
        const lat = latLng.lat()
        const lng = latLng.lng()
        const clickLatLng = { lat, lng }
        const { fillColor, strokeColor, overlayObject } = this.state
        const id = shortid.generate()
        let pushObject = update(overlayObject, {
            $push: [{
                overlayCoords: [clickLatLng],
                overlayId: id,
                overlayType: 'polyline',
                overlaySource: 'local',
                fillColor: fillColor,
                strokeColor: strokeColor,
                overlayName: 'Polyline',
                overlayDetail: '',
                undoCoords: [[clickLatLng]],
                redoCoords: [],
                isOverlaySave: false,
                clickable: false,
            }]
        })
        this.setState({
            drawingBtnType: null,
            overlayObject: pushObject,
            isFirstDraw: false,
            drawingOverlayId: id,
        })
        this.onDrawExampleLine(latLng)
    }
    onPushDrawingPolylineCoords = (latLng) => {
        const { overlayObject, drawingOverlayId } = this.state
        const lat = latLng.lat()
        const lng = latLng.lng()
        const clickLatLng = { lat, lng }
        let actionIndex = overlayObject.findIndex(overlay => overlay.overlayId === drawingOverlayId)
        let pushCoords = update(overlayObject, { [actionIndex]: { overlayCoords: { $push: [clickLatLng] } } })
        const currentOverlay = pushCoords[actionIndex]
        const currentCoords = currentOverlay.overlayCoords
        const pushUndoCoords = update(pushCoords, { [actionIndex]: { undoCoords: { $push: [currentCoords] } } })
        const setRedoCoords = update(pushUndoCoords, { [actionIndex]: { redoCoords: { $set: [] } } })
        const polyline = new window.google.maps.Polyline({
            path: currentCoords,
            overlayType: 'polyline'
        })
        this.onPolyLengthCompute(polyline)
        this.onPolydistanceBtwCompute(setRedoCoords[actionIndex])
        this.setState({ overlayObject: setRedoCoords })
        this.onDrawExampleLine(latLng)
    }
    onPushNewMarker = (latLng) => {
        const { overlayObject, icon } = this.state
        const lat = latLng.lat()
        const lng = latLng.lng()
        const clickLatLng = { lat, lng }
        const id = shortid.generate()
        var coordsPush = update(overlayObject, {
            $push: [{
                overlayCoords: [clickLatLng],
                overlayId: id,
                overlayType: 'marker',
                overlaySource: 'local',
                icon: icon,
                overlayName: 'Marker',
                overlayDetail: '',
                undoCoords: [[clickLatLng]],
                redoCoords: [],
                isOverlaySave: false,
            }]
        })
        this.setState({
            overlayObject: coordsPush,
            drawingBtnType: 'marker',
            isFirstDraw: false,
            drawingOverlayId: id,
        }, () => {
            this.onFinishDrawing()
        })
    }
    drawOverlayUsingTouchScreen = () => {
        const { isFirstDraw, drawingBtnType, overlayObject, drawingOverlayId } = this.state
        const clickLatLng = window.map.getCenter()
        if (isFirstDraw) {
            if (drawingBtnType === 'polygon') {
                this.onPushNewPolygon(clickLatLng)
            }
            if (drawingBtnType === 'polyline') {
                this.onPushNewPolyline(clickLatLng)
            }
            if (drawingBtnType === 'marker') {
                this.onPushNewMarker(clickLatLng)
            }
        } else {
            const actionIndex = overlayObject.findIndex(overlay => overlay.overlayId === drawingOverlayId)
            const overlayType = overlayObject[actionIndex].overlayType
            if (overlayType === 'polygon') {
                this.onPushDrawingPolygonCoords(clickLatLng)
            }
            if (overlayType === 'polyline') {
                this.onPushDrawingPolylineCoords(clickLatLng)
            }
        }
    }
    onSetSelectedOverlay = (overlay) => {
        this.onResetSelectedOverlay()
        if (overlay.overlayType === 'polygon' || overlay.overlayType === 'polyline') {
            overlay.setOptions({ editable: true, })
        }
        if (overlay.overlayType === 'marker') {
            overlay.setOptions({
                draggable: true,
                //animation: window.google.maps.Animation.BOUNCE
            })
        }
        this.setState({ selectedOverlay: overlay, }, () => {
            this.onFilterTask()
        })
    }
    onResetSelectedOverlay = () => {
        this.onResetDetail()
        this.setState((state) => {
            const { selectedOverlay } = state
            if (selectedOverlay) {
                if (selectedOverlay.overlayType === 'polygon' || selectedOverlay.overlayType === 'polyline') {
                    selectedOverlay.setOptions({ editable: false, })
                }
                if (selectedOverlay.overlayType === 'marker') {
                    //
                    selectedOverlay.setOptions({ draggable: false, animation: null })
                }
                //this.setState({ selectedOverlay: null })
                return { selectedOverlay: null }
            }
        })

    }
    addMarkerListener = (marker) => {
        var self = this
        window.google.maps.event.addListener(marker, 'mousedown', function () {
            self.handleDrawerOpen()
            self.onSetMarkerOptions()
            self.onSetSelectedOverlay(marker)
            var latLngDetail = `lattitude :  ${marker.getPosition().lat().toFixed(4)} , longtitude : ${marker.getPosition().lng().toFixed(4)}`
            self.setState({ latLngDetail })
        })
        window.google.maps.event.addListener(marker, 'dragend', function () {
            const { overlayObject } = self.state
            const overlayId = marker.overlayId
            const actionIndex = overlayObject.findIndex(overlay => overlay.overlayId === overlayId)
            const editCoords = [{ lat: marker.getPosition().lat(), lng: marker.getPosition().lng() }]
            const updateOverlay = update(overlayObject, {
                [actionIndex]: {
                    overlayCoords: { $set: editCoords },
                    undoCoords: { $push: [editCoords] },
                    redoCoords: { $set: [] },
                    isOverlaySave: { $set: false },
                }
            })
            self.setState({ overlayObject: updateOverlay })
        })
        window.google.maps.event.addListener(marker, 'drag', function () {
            var latLngDetail = `lattitude :  ${marker.getPosition().lat().toFixed(4)} , longtitude : ${marker.getPosition().lng().toFixed(4)}`
            self.setState({ latLngDetail })
        })
    }
    addPolygonListener = (polygon) => {
        var self = this
        window.google.maps.event.addListener(polygon, 'click', function () {
            self.handleDrawerOpen()
            self.onSetPolyOptions()
            self.onSetSelectedOverlay(polygon)
            self.onPolyLengthCompute(polygon)
            self.onSquereMetersTrans(polygon)
        })
        window.google.maps.event.addListener(polygon, 'mouseup', function (event) {
            if (event.vertex !== undefined || event.edge !== undefined) {
                self.onPolyCoordsEdit(polygon)
                self.onPolyLengthCompute(polygon)
                self.onSquereMetersTrans(polygon)
            }
        })
    }
    addPolylineListener = (polyline) => {
        var self = this
        window.google.maps.event.addListener(polyline, 'click', function () {
            self.handleDrawerOpen()
            self.onSetPolyOptions()
            self.onSetSelectedOverlay(polyline)
            self.onPolyLengthCompute(polyline)
            console.log(polyline, 'poly')
        })
        window.google.maps.event.addListener(polyline, 'mouseup', function (event) {
            if (event.vertex !== undefined || event.edge !== undefined) {
                self.onPolyCoordsEdit(polyline)
                self.onPolyLengthCompute(polyline)
            }
        })
    }
    onDrawExampleLine = (clickEvent) => {
        const { isDrawInDesktopDevice } = this.state
        var self = this
        this.onClearExampleLine()
        if (isDrawInDesktopDevice) {
            window.google.maps.event.clearListeners(window.map, 'mousemove')
            window.google.maps.event.addListener(window.map, 'mousemove', function (event) {
                let mousemoveLatLng = event.latLng
                var LatLngString = `lattitude :  ${event.latLng.lat().toFixed(4)} , longtitude : ${event.latLng.lng().toFixed(4)}`
                self.setState({
                    exampleLineCoords: [clickEvent, mousemoveLatLng],
                    disBtwDetail: window.google.maps.geometry.spherical.computeDistanceBetween(clickEvent, mousemoveLatLng).toFixed(3),
                    latLngDetail: LatLngString,
                })
            })
        } else {
            window.google.maps.event.clearListeners(window.map, 'center_changed')
            window.google.maps.event.addListener(window.map, 'center_changed', function () {
                let mousemoveLatLng = window.map.getCenter()
                var LatLngString = `lattitude :  ${window.map.getCenter().lat().toFixed(4)} , longtitude : ${window.map.getCenter().lng().toFixed(4)}`
                self.setState({
                    exampleLineCoords: [clickEvent, mousemoveLatLng],
                    latLngDetail: LatLngString,
                    disBtwDetail: window.google.maps.geometry.spherical.computeDistanceBetween(clickEvent, mousemoveLatLng).toFixed(3),
                })
            })
        }
    }
    addMapCenterOnMap = () => {
        var self = this
        window.google.maps.event.addListener(window.map, 'center_changed', function () {
            var LatLngString = `lattitude :  ${window.map.getCenter().lat().toFixed(4)} , longtitude : ${window.map.getCenter().lng().toFixed(4)}`
            self.setState({ latLngDetail: LatLngString })
        })
        var LatLngString = `lattitude :  ${window.map.getCenter().lat().toFixed(4)} , longtitude : ${window.map.getCenter().lng().toFixed(4)}`
        self.setState({ latLngDetail: LatLngString })
    }
    onPolyCoordsEdit = (polygon) => {
        const { overlayObject } = this.state
        let overlayId = polygon.overlayId
        let actionIndex = overlayObject.findIndex(overlay => overlay.overlayId === overlayId)
        let editCoords = []
        polygon.getPath().getArray().forEach(element => {
            let lat = element.lat()
            let lng = element.lng()
            editCoords.push({ lat, lng })
        })
        const updateOverlay = update(this.state.overlayObject, {
            [actionIndex]: {
                overlayCoords: { $set: editCoords },
                undoCoords: { $push: [editCoords] },
                redoCoords: { $set: [] },
                isOverlaySave: { $set: false },
            }
        })
        this.onPolydistanceBtwCompute(updateOverlay[actionIndex])
        this.setState({ overlayObject: updateOverlay, })
    }
    onSetDrawingCursor = () => {
        window.map.setOptions({ draggableCursor: 'crosshair' })
    }
    onSetDragMapCursor = () => {
        window.map.setOptions({ draggableCursor: null, draggingCursor: null })
    }
    onPolydistanceBtwCompute = (overlayObject) => {
        const { distanceDetail, isDistanceMarkerVisible } = this.state
        const overlayType = overlayObject.overlayType
        const overlayCoords = overlayObject.overlayCoords
        const overlayId = overlayObject.overlayId
        let replaceDetail = []
        var detailIndex = distanceDetail.findIndex(detail => detail.overlayId === overlayId)
        var editedDetail = []
        for (var i = 1; i < overlayCoords.length; i++) {
            let endPoint = overlayCoords[i]
            let prevEndPoint = overlayCoords[i - 1]
            let endLatLng = new window.google.maps.LatLng(endPoint);
            let prevEndLatLng = new window.google.maps.LatLng(prevEndPoint);
            replaceDetail.push({
                midpoint: { lat: (endPoint.lat + prevEndPoint.lat) / 2, lng: (endPoint.lng + prevEndPoint.lng) / 2 },
                disBtw: window.google.maps.geometry.spherical.computeDistanceBetween(endLatLng, prevEndLatLng),
                id: shortid.generate(),
                visible: isDistanceMarkerVisible,
            })
        }
        if (overlayType === 'polygon' && overlayCoords.length > 2) {
            let endPoint = overlayCoords[overlayCoords.length - 1]
            let startPoint = overlayCoords[0]
            let endLatLng = new window.google.maps.LatLng(endPoint);
            let startLatLng = new window.google.maps.LatLng(startPoint);
            replaceDetail.push({
                midpoint: { lat: (endPoint.lat + startPoint.lat) / 2, lng: (endPoint.lng + startPoint.lng) / 2 },
                disBtw: window.google.maps.geometry.spherical.computeDistanceBetween(endLatLng, startLatLng),
                id: shortid.generate(),
                visible: isDistanceMarkerVisible,
            })
        }
        if (detailIndex !== -1) {//new detail or has previus detail
            editedDetail = update(distanceDetail, { [detailIndex]: { detail: { $set: replaceDetail } } })
        } else {
            editedDetail = update(distanceDetail, { $push: [{ detail: replaceDetail, overlayId }] })
        }
        this.setState({ distanceDetail: editedDetail })
    }
    onEditPolyVertex = () => {
        var { overlayObject } = this.state
        var currentObject = overlayObject[overlayObject.length - 1]
        var currentCoords = currentObject.coords
        var endPoint = currentCoords[currentCoords.length - 1]
        var startPoint = currentCoords[0]

        var endLatLng = new window.google.maps.LatLng(endPoint);
        var startLatLng = new window.google.maps.LatLng(startPoint);

        var polyCom = new window.google.maps.Polyline({ path: currentCoords })
        var sumLength = window.google.maps.geometry.spherical.computeLength(polyCom.getPath())

        if (currentObject.overlayType === 'polygon' && currentCoords.length > 2) {
            let endTostartDis = window.google.maps.geometry.spherical.computeDistanceBetween(endLatLng, startLatLng)
            sumLength += endTostartDis
        }
        this.setState({ lengthDetail: sumLength.toFixed(3) })
    }
    onPolydistanceBtwComputeForCoords = () => {
        var { distanceDetail, overlayObject, isFirstDraw, } = this.state
        var currentCoords = overlayObject[overlayObject.length - 1].overlayCoords
        var overlayId = overlayObject[overlayObject.length - 1].overlayId
        if (isFirstDraw === true) {
            const pushDetial = update(distanceDetail, { $push: [{ detail: [], overlayId }] })
            this.setState({ distanceDetail: pushDetial, isFirstDraw: false, })
        } else {
            var currentIndex = distanceDetail.length - 1

            let endPoint = currentCoords[currentCoords.length - 1]
            let prevEndPoint = currentCoords[currentCoords.length - 2]
            let startPoint = currentCoords[0]
            let endLatLng = new window.google.maps.LatLng(endPoint);
            let prevEndLatLng = new window.google.maps.LatLng(prevEndPoint);
            let startLatLng = new window.google.maps.LatLng(startPoint);

            var pushDetial = update(distanceDetail, {
                [currentIndex]: {
                    detail: {
                        $push: [{
                            midpoint: { lat: (endPoint.lat + prevEndPoint.lat) / 2, lng: (endPoint.lng + prevEndPoint.lng) / 2 },
                            disBtw: window.google.maps.geometry.spherical.computeDistanceBetween(endLatLng, prevEndLatLng),
                            id: shortid.generate(),
                        }]
                    }
                }
            })

            if (overlayObject[overlayObject.length - 1].overlayType === 'polygon' && currentCoords.length > 2) {
                var currentDetail = pushDetial[pushDetial.length - 1]
                if (currentCoords.length > 3) {
                    var id = currentDetail.detail[currentDetail.detail.length - 2].id
                    var index = currentDetail.detail.findIndex(detail => detail.id === id);
                    currentDetail.detail.splice(index, 1)
                }
                currentDetail.detail.push({
                    midpoint: { lat: (endPoint.lat + startPoint.lat) / 2, lng: (endPoint.lng + startPoint.lng) / 2 },
                    disBtw: window.google.maps.geometry.spherical.computeDistanceBetween(endLatLng, startLatLng),
                    id: shortid.generate(),
                })
            }
            this.setState({ distanceDetail: pushDetial })
        }
    }

    onPolyLengthCompute = (poly) => {
        let sumLength = window.google.maps.geometry.spherical.computeLength(poly.getPath())
        if ((poly.overlayType === 'polygon') && (poly.getPath().getLength() > 2)) {
            let end = poly.getPath().getAt(poly.getPath().getLength() - 1)
            let start = poly.getPath().getAt(0)
            let endTostartDis = window.google.maps.geometry.spherical.computeDistanceBetween(start, end)
            sumLength += endTostartDis
        }
        this.setState({ lengthDetail: sumLength.toFixed(3) })
    }
    onSquereMetersTrans = (polygon) => {

        var area = window.google.maps.geometry.spherical.computeArea(polygon.getPath())
        //area x 0.00024710538146717 = acre
        let rnwString = ''
        var rai, ngan, wa, raiFraction, nganFraction

        rai = Math.floor(area / 1600)
        raiFraction = area % 1600
        ngan = Math.floor(raiFraction / 400)
        nganFraction = raiFraction % 400
        wa = parseFloat((nganFraction / 4).toFixed(3), 10)

        if (rai > 0) { rnwString = rnwString + rai + ' ไร่ ' }
        if (ngan > 0) { rnwString = rnwString + ngan + ' งาน ' }
        if (wa > 0) { rnwString = rnwString + wa + ' ตารางวา ' }
        else { rnwString = '0 ตารางวา' }
        this.setState({ areaDetail: rnwString })
    }
    onSaveToFirestore = (plan) => {
        var self = this
        var planId = plan.planId
        var editorId = this.state.user.uid
        const shouldSaveOverlay = self.state.overlayObject.filter(overlay => overlay.isOverlaySave === false)
        var saveOverlayAmount = shouldSaveOverlay.length
        console.log(shouldSaveOverlay, 'save')
        if (saveOverlayAmount > 0) {
            this.onSetPlanToLoading(planId, saveOverlayAmount)
            const updatePlanIndex = this.state.planData.findIndex(plan => plan.planId === planId)
            shouldSaveOverlay.forEach((overlay) => {
                const { overlayCoords, overlayType, overlayName, overlayDetail,
                    fillColor, strokeColor, icon, overlaySource, overlayId, overlayPlantDate
                } = overlay
                const overlayProps = {
                    editorId, overlayCoords, overlayType, overlayName, overlayDetail, planId,
                    overlayPlantDate,
                }
                var saveProps
                if ((overlayType === 'polygon') && (overlayCoords.length > 2)) {
                    saveProps = {
                        fillColor,
                        strokeColor,
                        ...overlayProps
                    }
                }
                if ((overlayType === 'polyline') && (overlayCoords.length > 1)) {
                    saveProps = {
                        strokeColor,
                        ...overlayProps
                    }
                }
                if (overlayType === 'marker') {
                    saveProps = {
                        icon,
                        ...overlayProps
                    }
                }
                if (saveProps.overlayPlantDate === undefined) {
                    delete saveProps.overlayPlantDate
                }
                if (saveProps) {
                    if (overlaySource === 'local') {
                        overlayRef.add(saveProps).then(function (doc) {
                            const id = doc.id
                            self.onUpdatePlanLoadingProgress(updatePlanIndex)
                            if (self.state.selectedPlan.planId === planId) {
                                const updateOverlayIndex = self.state.overlayObject.findIndex(overlay => overlay.overlayId === overlayId)
                                const editOverlayIndex = update(self.state.overlayObject, {
                                    [updateOverlayIndex]:
                                    {
                                        overlayIndex: { $set: id },
                                        isOverlaySave: { $set: true },
                                        overlaySource: { $set: 'server' }
                                    }
                                })
                                if (overlayType === 'polygon' || overlayType === 'polyline') {
                                    const detailIndex = self.state.distanceDetail.findIndex(detail => detail.overlayId === overlayId)
                                    const updateDetailIndex = update(self.state.distanceDetail, { [detailIndex]: { overlayId: { $set: doc.id } } })
                                    self.setState({ distanceDetail: updateDetailIndex })
                                }
                                self.setState({ overlayObject: editOverlayIndex, });
                            }
                        })
                            .catch(function (error) {
                                throw ('there is something went wrong', error)
                            })
                    } else {
                        overlayRef.doc(overlayId).set(saveProps
                            , { merge: true }).then(function () {
                                self.onUpdatePlanLoadingProgress(updatePlanIndex)
                                if (self.state.selectedPlan.planId === planId) {
                                    const updateOverlayIndex = self.state.overlayObject.findIndex(overlay => overlay.overlayId === overlayId)
                                    const editOverlayIndex = update(self.state.overlayObject, {
                                        [updateOverlayIndex]: { isOverlaySave: { $set: true }, }
                                    })
                                    self.setState({ overlayObject: editOverlayIndex, });
                                }
                            }).catch(function (error) {
                                throw ('there is something went wrong', error)
                            });
                    };
                };
            });
        };
    }
    onUpdatePlanLoadingProgress = (updatePlanIndex) => {
        var self = this
        self.setState((state) => {
            const { loadingProgress } = state.planData[updatePlanIndex]
            const upDateSaveProgressPlan = update(state.planData, {
                [updatePlanIndex]: {
                    loadingProgress: { $set: loadingProgress + 1 },
                }
            })
            return { planData: upDateSaveProgressPlan }
        }, () => {
            const { loadingProgress, loadingAmount, planId } = self.state.planData[updatePlanIndex]
            if (loadingProgress === loadingAmount) {
                const upDateSaveProgressPlan = update(self.state.planData, {
                    [updatePlanIndex]: {
                        isPlanOptionsClickable: { $set: true },
                        isLoading: { $set: false },
                        loadingProgress: { $set: null },
                        loadingAmount: { $set: 0 },
                    }
                })
                self.setState({ planData: upDateSaveProgressPlan })
                if (this.state.selectedPlan.planId === planId) {
                    const selectedPlan = update(this.state.selectedPlan, { isLoading: { $set: false } })
                    self.setState({ selectedPlan })
                }
            }
        })
    }
    onClearOverlayFromMap = () => {
        this.setState({
            overlayObject: [],
            distanceDetail: [],
            overlayTasks: [],
        })
    }
    onQueryPlanFromFirestore = () => {
        // get all plan list from frirestore filter by user ID
        if (!this.state.isWaitingForPlanQuery) {
            this.setState({ isWaitingForPlanQuery: true })
        }
        let unSortplanData = []
        var uid = this.state.user.uid
        var self = this
        planMemberRef.where('memberId', '==', uid).get().then(function (querySnapshot) {
            var queryAmount = querySnapshot.size
            if (queryAmount === 0) {
                self.setState({ isWaitingForPlanQuery: false, })
            }
            querySnapshot.forEach(function (doc) {
                const { planId } = doc.data()
                planRef.doc(planId).get().then(function (doc2) {
                    const createPlanDate = doc2.data().createPlanDate.toDate()
                    const lastModifiedDate = doc2.data().lastModifiedDate.toDate()
                    unSortplanData.push({
                        isPlanClickable: true,
                        isPlanOptionsClickable: true,
                        isLoading: false,
                        isSave: true,
                        loadingAmount: 0,
                        loadingProgress: null,
                        ...doc.data(),
                        ...doc2.data(),
                        createPlanDate,
                        lastModifiedDate,
                    })
                    queryAmount--
                    if (queryAmount === 0) {
                        self.setState({ isWaitingForPlanQuery: false, })
                        self.onSortArrayByCreateDate('planData', SORT_BY_NEWEST, unSortplanData, 'lastModifiedDate')
                    }
                })
            })

        }).catch(function (error) {
            throw ('There is something went wrong', error)
        })
    }
    onAddPlan = (plan) => {
        const { planData, user } = this.state
        const self = this
        const uid = user.uid
        planRef.add(plan)
            .then(function (docRef) {
                const planId = docRef.id
                const data = { planId, memberId: uid, memberRole: 'editor' }
                self.onAddPlanMember(data)
                const pushPlan = update(planData, {
                    $push: [{
                        isPlanClickable: true,
                        isPlanOptionsClickable: true,
                        isLoading: false,
                        isSave: true,
                        loadingAmount: 0,
                        loadingProgress: null,
                        planId,
                        ...plan,
                        ...data,
                    }]
                })
                self.onSortArrayByCreateDate('planData', SORT_BY_NEWEST, pushPlan, 'lastModifiedDate')
            })
    }
    onSetSelectedPlan = (planData) => {
        this.onResetSelectedPlan()
        const { planId } = planData
        this.setState((state) => {
            const actionIndex = state.planData.findIndex(plan => plan.planId === planId)
            const updatePlanClickable = update(state.planData, { [actionIndex]: { isPlanClickable: { $set: false } } })
            return {
                selectedPlan: planData,
                planData: updatePlanClickable,
            }
        }, () => {
            this.onAddRealTimeUpdateListener()
            this.onCheckToggleAllTaskDone()
        })
    }
    onResetSelectedPlan = () => {
        if (this.state.selectedPlan) {
            this.onClearOverlayFromMap()
            this.onRemoveRealTimeUpdateListener()
            const planId = this.state.selectedPlan.planId
            const actionIndex = this.state.planData.findIndex(plan => plan.planId === planId)
            this.setState((state) => {
                const updatePlanClickable = update(state.planData, { [actionIndex]: { isPlanClickable: { $set: true } } })
                return { selectedPlan: null, planData: updatePlanClickable, planMember: [] }
            })
        }
    }
    onAddTask = (task) => {
        const { selectedOverlay, selectedPlan } = this.state
        const { overlayId } = selectedOverlay
        const { planId } = selectedPlan
        const data = { overlayId, planId, ...task }
        taskRef.add(data).catch(function (erorr) {
            throw ('whoops!', erorr)
        })
    }
    onEditTask = (taskId, editTask) => {
        taskRef.doc(taskId).set(editTask
            , { merge: true }).catch(function (erorr) {
                throw ('whoops!', erorr)
            })
    }
    onToggleIsTaskDone = (task) => {
        const { isDone, taskId, taskRepetition } = task
        var data = { isDone: !isDone }
        if (taskRepetition) {
            const { repetitionDueType } = taskRepetition
            if (repetitionDueType === 'times' && !isDone) {
                const { repetitionFinishTimes, repetitionTimes, repetitionType, repetitionUnit, taskStartDate } = taskRepetition
                data = update(data, {
                    taskRepetition: {
                        $set: {
                            repetitionFinishTimes: repetitionFinishTimes + 1,
                            repetitionTimes,
                            repetitionType,
                            repetitionUnit,
                            taskStartDate,
                        }
                    }
                })
            }
        }
        taskRef.doc(taskId).set(data
            , { merge: true }).catch(function (erorr) {
                throw ('whoops!', erorr)
            })
    }
    onSortArrayByCreateDate = (targetState, sortType, dataArray, sortProp) => {
        var sortedByCreateDate = []
        if (sortType === SORT_BY_NEWEST) {
            sortedByCreateDate = dataArray.sort(function (a, b) {
                return b[sortProp] - a[sortProp]
            })
        }
        if (sortType === SORT_BY_LATEST) {
            sortedByCreateDate = dataArray.sort(function (a, b) {
                return a[sortProp] - b[sortProp]
            })
        }
        this.setState({
            [targetState]: sortedByCreateDate
        })
    }
    onFilterTask = (filterTaskType = this.state.filterTaskType, overlAllFiltertask = this.state.overlAllFiltertask) => {
        const { overlayTasks, selectedOverlay } = this.state
        var overAllFilter
        switch (overlAllFiltertask) {
            case SHOW_OVERVIEW:
                overAllFilter = overlayTasks
                break;
            case SHOW_TODAY:
                const thisDate = moment().format().split('T')[0]
                overAllFilter = overlayTasks.filter(task => {
                    const { taskRepetition } = task
                    if (taskRepetition && taskRepetition.doTaskDate) {
                        const doTaskDate = moment(task.taskRepetition.doTaskDate).format().split('T')[0]
                        return moment(doTaskDate).isSame(thisDate)
                    } else {
                        return;
                    }

                })
                break;
            default: break;
        }
        var filterTask
        switch (filterTaskType) {
            case SHOW_ALL:
                filterTask = overAllFilter.filter(task => task.overlayId === selectedOverlay.overlayId)
                break;
            case SHOW_ACTIVATE:
                filterTask = overAllFilter.filter(task => (task.overlayId === selectedOverlay.overlayId) && task.isDone === false)
                break;
            case SHOW_COMPLETE:
                filterTask = overAllFilter.filter(task => task.overlayId === selectedOverlay.overlayId && task.isDone === true)
                break;
            default: break;
        }
        this.setState({ overlAllFiltertask, filterTaskType })
        this.onSortArrayByCreateDate('overlayTaskShow', SORT_BY_LATEST, filterTask, 'addTaskDate')
    }
    onFitBounds = (overlayObject) => {
        const bounds = new window.google.maps.LatLngBounds();
        overlayObject.forEach(overlay => {
            overlay.overlayCoords.forEach(coords => {
                bounds.extend(new window.google.maps.LatLng(coords))
            })
        })
        window.map.fitBounds(bounds)
    }
    onChangePolyStrokeColor = (color) => {
        var { selectedOverlay, overlayObject } = this.state
        if (selectedOverlay) {
            const overlayId = selectedOverlay.overlayId
            const actionindex = overlayObject.findIndex(overlay => overlay.overlayId === overlayId)
            const changeStrokeColor = update(overlayObject, {
                [actionindex]: {
                    strokeColor: { $set: color },
                    isOverlaySave: { $set: false },
                }
            })
            this.setState({ overlayObject: changeStrokeColor })
        }
        this.setState({ strokeColor: color })
    }
    onChangePolyFillColor = (color) => {
        var { selectedOverlay, overlayObject } = this.state
        if (selectedOverlay) {
            const overlayIndex = selectedOverlay.overlayId
            const actionIndex = overlayObject.findIndex(overlay => overlay.overlayId === overlayIndex)
            const changeFillColor = update(overlayObject, {
                [actionIndex]: {
                    fillColor: { $set: color },
                    isOverlaySave: { $set: false }
                }
            })
            this.setState({ overlayObject: changeFillColor })
        }
        this.setState({ fillColor: color })
    }
    onSetUser = (user) => {
        this.setState({ user }, () => {
            this.onQueryPlanFromFirestore()
            this.onCheckUser(user)
        })

    }
    onCheckUser = (user) => {
        var self = this
        const { uid, email } = user
        userRef
            .doc(uid)
            .get()
            .then(function (querySnapshot) {
                if (!querySnapshot.exists) {
                    var displayName
                    if (user.displayName) {
                        displayName = user.displayName
                    } else {
                        displayName = email
                        self.onSetUerInfo(email)
                    }
                    const data = { displayName, email }
                    userRef.doc(uid).set(data, { merge: true }).then(function () {
                        //console.log('เพิ่มผู้ใช้งานเป็นสมาชิกเรียบร้อย')
                    }).catch(function (error) {
                        throw ('whoops!', error)
                    })
                }
            }).catch(function (error) {
                console.log("Error getting document:", error);
            });
    }
    onSetUerInfo = (info) => {
        this.state.user.updateProfile({
            displayName: info,
            //photoURL: "https://example.com/jane-q-user/profile.jpg"
        }).then(function () {
            // Profile updated successfully!
            // "Jane Q. User"
            //var displayName = user.displayName;
            // "https://example.com/jane-q-user/profile.jpg"
            //var photoURL = user.photoURL;
        }, function (error) {
            // An error happened.
        });
    }
    onSetUserNull = () => {
        this.setState({
            user: null,
            planData: [],
            selectedOverlay: null,
            selectedPlan: null,
            isFirstOverlayQuery: true,
        })
        this.onClearEverthing()
    }
    onSetMarkerOptions = () => {
        this.setState({
            drawerPage: 'option',
            overlayOptionsType: 'marker'
        })
    }
    onSetPolyOptions = () => {
        this.setState({
            overlayOptionsType: 'poly',
            drawerPage: 'option',
        })
    }
    onSetSelectedIcon = (icon) => {
        const { selectedOverlay, overlayObject } = this.state
        if (selectedOverlay) {
            const overlayId = selectedOverlay.overlayId
            const actionIndex = overlayObject.findIndex(overlay => overlay.overlayId === overlayId)
            const updateOverlay = update(overlayObject, {
                [actionIndex]: {
                    icon: { $set: icon },
                    isOverlaySave: { $set: false },
                }
            })
            this.setState({ overlayObject: updateOverlay })
        }
        this.setState({ icon })
    }

    handleDrawerOpen = () => {
        this.setState({
            openSide: true,
            left: '350px',
        });
    };

    handleDrawerClose = () => {
        this.setState({
            openSide: false,
            left: '0vw',
        });
    };
    onEditOverlayDetail = (editData) => {
        var self = this
        const { selectedOverlay, overlayObject, selectedPlan } = this.state
        const { overlayId } = selectedOverlay
        const { overlayName, overlayDetail } = editData
        const editIndex = overlayObject.findIndex(overlay => overlay.overlayId === overlayId)
        const updateOverlay = update(overlayObject, {
            [editIndex]: {
                overlayName: { $set: overlayName },
                overlayDetail: { $set: overlayDetail },
                isOverlaySave: { $set: false }
            }
        })
        const updateSelectedOverlay = update(selectedOverlay, {
            overlayName: { $set: overlayName },
            overlayDetail: { $set: overlayDetail },
        })
        self.setState({ overlayObject: updateOverlay, selectedOverlay: updateSelectedOverlay }, () => {
            this.onSaveToFirestore(selectedPlan)
        })

    }
    onEditOverlayPlantDate = (plantDate) => {
        let self = this
        const { selectedOverlay, overlayObject, selectedPlan } = this.state
        const { overlayId } = selectedOverlay
        const editIndex = overlayObject.findIndex(overlay => overlay.overlayId === overlayId)
        const updateOverlay = update(overlayObject, {
            [editIndex]: {
                overlayPlantDate: { $set: plantDate },
                isOverlaySave: { $set: false }
            }
        })
        self.setState({ overlayObject: updateOverlay, },
            () => {
                this.onSaveToFirestore(selectedPlan)
            })

    }
    onChangeDrawPage = (page) => {
        this.setState({ drawerPage: page })
    }
    onDeletePlan = (planId) => {
        var self = this
        const { planData, selectedPlan } = this.state
        const actionIndex = planData.findIndex(data => data.planId === planId)
        const updatePlan = update(planData, { $splice: [[actionIndex, 1]] })
        //delete selected plan from firestore
        planRef.doc(planId).delete()
            .then(function () {
                self.setState({ planData: updatePlan })
            })
            .catch(function (error) {
                console.error("Error removing document: ", error);
            });
        //delete overlay with its planId from firestore
        if (selectedPlan) {
            if (selectedPlan.planId === planId) {
                this.onClearOverlayFromMap()
                this.onResetSelectedPlan()
            }
        }
        this.onDeleteAllPlanMember(planId)
        this.onDeleteAllOverlay(planId)
        this.onDeleleteAllTask('planId', planId)
        this.setState((state) => {
            const setClickable = update(state.planData, { [actionIndex]: { isPlanClickable: { $set: false } } })
            const setOptionsClickable = update(setClickable, { [actionIndex]: { isPlanOptionsClickable: { $set: false } } })
            return { planData: setOptionsClickable }
        })
    }
    onDeleteAllPlanMember = (planId) => {
        planMemberRef.where('planId', '==', planId).get().then(function (querySnapshot) {
            querySnapshot.forEach(doc => {
                doc.ref.delete()
            })
        })
    }
    onDeleteOverlay = (overlay) => {
        const { overlayObject, distanceDetail } = this.state
        const { overlayId, overlaySource, overlayType } = overlay
        const deleteIndex = overlayObject.findIndex(overlay => overlay.overlayId === overlayId)
        if (overlaySource === 'server') {
            //delete selected overlay from firestore
            overlayRef.doc(overlayId).delete().catch(function (error) {
                console.error("Error removing document: ", error);
            });
        } else {
            const deleteObject = update(overlayObject, { $splice: [[deleteIndex, 1]] })
            this.setState({ overlayObject: deleteObject, drawerPage: 'homePage' })
            this.onResetDetail()
            if (overlayType === 'polyline' || overlayType === 'polygon') {
                const detailIndex = distanceDetail.findIndex(detail => detail.overlayId === overlayId)
                const deleteDetail = update(distanceDetail, { $splice: [[detailIndex, 1]] })
                this.setState({ distanceDetail: deleteDetail, })
            }
        }
    }
    onDeleteAllOverlay = (planId) => {
        overlayRef.where('planId', '==', planId).get().then(function (querySnapshot) {
            var deleteAmount = querySnapshot.docs.length
            if (deleteAmount > 0) {
            }
            querySnapshot.forEach(function (doc) {
                doc.ref.delete()
                    .then(function () {
                    })
                    .catch(function (error) {
                        throw ("Error removing document: ", error);
                    });
            })

        })
    }
    onDeleleteAllTask = (fieldProp, id) => {
        taskRef.where(fieldProp, '==', id).get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                doc.ref.delete().catch(function (error) {
                    throw ('erorr', error)
                })
            })
        })
    }
    onDeleteTask = (task) => {
        const taskId = task.taskId
        taskRef.doc(taskId).delete().catch(function (error) {
            throw ('erorr', error)
        });
    }
    onUpdateOverlayTasks = (updateTasks) => {
        this.setState({ overlayTasks: updateTasks }, () => {
            this.onFilterTask()
        })
    }
    onCallFitBounds = () => {
        this.onFitBounds(this.state.overlayObject)
    }
    onEditPlanName = (plan) => {
        var self = this
        const { planData } = this.state
        const { planName, planId, planDescription } = plan
        const actionIndex = planData.findIndex(plan => plan.planId === planId)
        //update edited name and description on firestore
        planRef.doc(planId).update({
            planName,
            planDescription,
        }).then(function () {
            const updatePlan = update(planData, {
                [actionIndex]: {
                    planName: { $set: planName },
                    planDescription: { $set: planDescription }
                }
            })
            self.setState({ planData: updatePlan })
        }).catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
    }
    onUndoCoords = (overlay) => {
        if (overlay.undoCoords.length > 1) {
            const { overlayObject, isFirstDraw, exampleLineCoords } = this.state
            const overlayId = overlay.overlayId
            const overlayType = overlay.overlayType
            const actionIndex = overlayObject.findIndex(overlay => overlay.overlayId === overlayId)
            const undoCoords = overlay.undoCoords
            const undoCoordsLength = undoCoords.length - 1
            const lastUndoCoords = undoCoords[undoCoordsLength]
            const beforeLastUndoCoords = undoCoords[undoCoordsLength - 1]
            const setUndoCoords = update(overlayObject, { [actionIndex]: { overlayCoords: { $set: beforeLastUndoCoords } } })
            const pushRedoCoods = update(setUndoCoords, { [actionIndex]: { redoCoords: { $push: [lastUndoCoords] } } })
            const popUndoCoords = update(pushRedoCoods, { [actionIndex]: { undoCoords: { $splice: [[undoCoordsLength, 1]] } } })
            const setIsOverlaySave = update(popUndoCoords, { [actionIndex]: { isOverlaySave: { $set: false } } })
            const currentObject = setUndoCoords[actionIndex]
            const currentCoords = currentObject.overlayCoords
            if (overlayType !== 'marker') {
                if (isFirstDraw === false) {
                    const lastCoords = beforeLastUndoCoords[beforeLastUndoCoords.length - 1]
                    const lastCoordsLatLng = new window.google.maps.LatLng(lastCoords)
                    const setExampleline = update(exampleLineCoords, { 0: { $set: lastCoords } })
                    this.onDrawExampleLine(lastCoordsLatLng)
                    this.setState({ exampleLineCoords: setExampleline })
                }
                var poly
                if (overlayType === 'polygon') {
                    poly = new window.google.maps.Polygon({
                        path: currentCoords,
                        overlayType: 'polygon'
                    })
                    this.onSquereMetersTrans(poly)
                } else {
                    poly = new window.google.maps.Polyline({
                        path: currentCoords,
                        overlayType: 'polyline'
                    })
                }
                this.onPolyLengthCompute(poly)
                this.onPolydistanceBtwCompute(currentObject)
            } else {
                var latLngDetail = `lattitude :  ${currentCoords[0].lat.toFixed(4)} , longtitude : ${currentCoords[0].lng.toFixed(4)}`
                this.setState({ latLngDetail })
            }
            this.setState({ overlayObject: setIsOverlaySave })
        }
    }
    onRedoCoords = (overlay) => {
        if (overlay.redoCoords.length > 0) {
            const { overlayObject, exampleLineCoords, isFirstDraw } = this.state
            const overlayId = overlay.overlayId
            const overlayType = overlay.overlayType
            const actionIndex = overlayObject.findIndex(overlay => overlay.overlayId === overlayId)
            const redoCoords = overlay.redoCoords
            const redoCoordsLength = redoCoords.length - 1
            const lastRedoCoords = redoCoords[redoCoordsLength]
            const setRedoCoords = update(overlayObject, { [actionIndex]: { overlayCoords: { $set: lastRedoCoords } } })
            const pushUndoCoords = update(setRedoCoords, { [actionIndex]: { undoCoords: { $push: [lastRedoCoords] } } })
            const popRedoCoords = update(pushUndoCoords, { [actionIndex]: { redoCoords: { $splice: [[redoCoordsLength, 1]] } } })
            const setIsOverlaySave = update(popRedoCoords, { [actionIndex]: { isOverlaySave: { $set: false } } })
            const currentObject = setRedoCoords[actionIndex]
            const currentCoords = currentObject.overlayCoords
            if (overlayType !== 'marker') {
                if (isFirstDraw === false) {
                    const lastCoords = lastRedoCoords[lastRedoCoords.length - 1]
                    const lastCoordsLatLng = new window.google.maps.LatLng(lastCoords)
                    const setExampleline = update(exampleLineCoords, { 0: { $set: lastCoords } })
                    this.onDrawExampleLine(lastCoordsLatLng)
                    this.setState({ exampleLineCoords: setExampleline })
                }
                var poly
                if (overlayType === 'polygon') {
                    poly = new window.google.maps.Polygon({
                        path: currentCoords,
                        overlayType: 'polygon'
                    })
                    this.onSquereMetersTrans(poly)
                } else {
                    poly = new window.google.maps.Polyline({
                        path: currentCoords,
                        overlayType: 'polyline'
                    })
                }
                this.onPolyLengthCompute(poly)
                this.onPolydistanceBtwCompute(currentObject)
            } else {
                var latLngDetail = `lattitude :  ${currentCoords[0].lat.toFixed(4)} , longtitude : ${currentCoords[0].lng.toFixed(4)}`
                this.setState({ latLngDetail })
            }
            this.setState({ overlayObject: setIsOverlaySave })
        }
    }
    onUndoDrawingCoords = () => {
        const { overlayObject, drawingOverlayId } = this.state
        const actionIndex = overlayObject.findIndex(overlay => overlay.overlayId === drawingOverlayId)
        const currentObject = overlayObject[actionIndex]
        this.onUndoCoords(currentObject)
    }
    onRedoDrawingCoords = () => {
        const { overlayObject, drawingOverlayId } = this.state
        const actionIndex = overlayObject.findIndex(overlay => overlay.overlayId === drawingOverlayId)
        const currentObject = overlayObject[actionIndex]
        this.onRedoCoords(currentObject)
    }
    onClearEverthing = () => {
        this.onResetDetail()
        this.onClearOverlayFromMap()
        this.onClearSomeMapEventListener()
    }

    //toggle entire visible of distance between vertex of polygon and polyline
    onToggleDistanceMarker = () => {
        const { isDistanceMarkerVisible, distanceDetail } = this.state
        var temp1 = []
        var temp2 = []
        //loop entire array
        distanceDetail.forEach((varlue, index) => {
            //loop for each marker
            varlue.detail.forEach((marker, index2) => {
                if (index === 0 && index2 === 0) {
                    //update visible depend on state
                    temp1 = update(distanceDetail, { [index]: { detail: { [index2]: { visible: { $set: !isDistanceMarkerVisible } } } } })
                }
                else {
                    //update visible depend on temp1, this.state.distanceDetail  remain the same
                    temp2 = update(temp1, { [index]: { detail: { [index2]: { visible: { $set: !isDistanceMarkerVisible } } } } })
                    //swicth value for use in next round of loop
                    temp1 = temp2
                }
            });
        });
        this.setState((state) => { return { distanceDetail: temp1, isDistanceMarkerVisible: !state.isDistanceMarkerVisible }; });
    }
    onAddPlanMember = (data) => {
        const { planId, memberId } = data
        planMemberRef.where('planId', '==', planId).where('memberId', '==', memberId).get().then(function (querySnapshot) {
            if (querySnapshot.empty) {
                planMemberRef.add(data).then(function () {
                    console.log('เพิ่มผู้ใช้งานเป็นสมาชิกเรียบร้อย')
                }).catch(function (error) {
                    throw ('whoops!', error)
                })
            } else {
                console.log('ผู้ใช้งานนี้เป็นสมาชิกของแปลงนี้อยู่แล้ว')
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
    }
    onAddRealTimeUpdateListener = () => {
        this.onAddRealTimeOverlayUpdateListener()
        this.onAddRealTimeTaskUpdateListener()
    }
    onAddRealTimeOverlayUpdateListener = () => {
        this.onRemoveRealTimeOverlay()
        var self = this
        this.overlayRealTimeUpdateRef = overlayRef.where("planId", "==", this.state.selectedPlan.planId)
            .onSnapshot(function (snapshot) {
                var queryAmount = snapshot.size
                if (queryAmount === 0) {
                    self.setState({ isFirstOverlayQuery: false })
                }
                snapshot.docChanges().forEach(function (change) {
                    const { editorId, overlayCoords, overlayType, overlayPlantDate } = change.doc.data()
                    const overlayId = change.doc.id
                    const actionIndex = self.state.overlayObject.findIndex(overlay => overlay.overlayId === overlayId)
                    let data = {
                        overlaySource: 'server',
                        undoCoords: [overlayCoords],
                        redoCoords: [],
                        isOverlaySave: true,
                        clickable: true,
                        overlayId,
                        ...change.doc.data(),
                    }
                    if (overlayPlantDate && overlayPlantDate != '') {
                        data = { ...data, overlayPlantDate: overlayPlantDate.toDate() }
                    }
                    if (change.type === "added") {
                        if (self.state.isFirstOverlayQuery) {
                            queryAmount--
                            const pushOverlay = update(self.state.overlayObject, { $push: [data] })
                            if (overlayType !== 'marker') {
                                self.onPolydistanceBtwCompute(data)
                            }
                            self.setState({ overlayObject: pushOverlay }, () => {
                                if (queryAmount === 0) {
                                    self.setState({ isFirstOverlayQuery: false })
                                    self.onFitBounds(self.state.overlayObject)
                                }
                            })
                        } else {
                            if (editorId !== self.state.user.uid) {
                                const pushOverlay = update(self.state.overlayObject, { $push: [data] })
                                if (overlayType !== 'marker') {
                                    self.onPolydistanceBtwCompute(data)
                                }
                                self.setState({ overlayObject: pushOverlay }, () => { console.log(self.state.overlayObject) })
                            }
                        }
                    }
                    if (change.type === "modified") {
                        if (editorId !== self.state.user.uid) {
                            if (self.state.selectedOverlay) {
                                if (self.state.selectedOverlay.overlayId === overlayId) {
                                    const updateSelectedOverlay = update(self.state.selectedOverlay, {
                                        overlayName: { $set: change.doc.data().overlayname },
                                        overlayDetail: { $set: change.doc.data().overlayDetail },
                                    })
                                    self.setState({ selectedOverlay: updateSelectedOverlay })
                                }
                            }
                            if (overlayType !== 'marker') {
                                self.onPolydistanceBtwCompute(data)
                            }
                            const pushOverlay = update(self.state.overlayObject, { [actionIndex]: { $set: data } })
                            self.setState({ overlayObject: pushOverlay })
                        }
                    }
                    if (change.type === "removed") {
                        if (self.state.selectedOverlay) {
                            if (self.state.selectedOverlay.overlayId === overlayId) {
                                self.setState({ drawerPage: 'homePage' })
                                self.onResetDetail()
                            }
                        }
                        if (overlayType !== 'marker') {
                            const detailIndex = self.state.distanceDetail.findIndex(detail => detail.overlayId === overlayId)
                            const deleteDetail = update(self.state.distanceDetail, { $splice: [[detailIndex, 1]] })
                            self.setState({ distanceDetail: deleteDetail, })
                        }
                        self.onDeleleteAllTask('overlayId', overlayId)
                        const pushOverlay = update(self.state.overlayObject, { $splice: [[actionIndex, 1]] })
                        self.setState({ overlayObject: pushOverlay })
                    }
                });
            }, function (error) {
                throw ('whoops!', error)
            });
    }
    onAddRealTimeTaskUpdateListener = () => {
        this.onRemoveRealTimeOverlayTask()
        var self = this
        this.overlayTaskRealTimeUpdateRef = taskRef.where("planId", "==", this.state.selectedPlan.planId)
            .onSnapshot(function (snapshot) {
                snapshot.docChanges().forEach(function (change) {
                    const { taskDueDate, taskRepetition } = change.doc.data()
                    const addTaskDate = change.doc.data().addTaskDate.toDate();
                    const taskId = change.doc.id
                    const actionIndex = self.state.overlayTasks.findIndex(task => task.taskId === taskId)
                    var data = {
                        ...change.doc.data(),
                        taskId, addTaskDate,
                    }
                    if (taskDueDate) {
                        data = { ...data, taskDueDate: taskDueDate.toDate(), }
                    }
                    if (taskRepetition) {
                        const { taskStartDate, repetitionDueType, repetitionDueDate } = taskRepetition
                        if (repetitionDueType === 'untilDate') {
                            data.taskRepetition.repetitionDueDate = repetitionDueDate.toDate()
                        }
                        data.taskRepetition.taskStartDate = taskStartDate.toDate()
                        var doTaskDate = self.onCheckDoTaskDate(taskRepetition)
                        if (doTaskDate) {
                            data.taskRepetition.doTaskDate = doTaskDate
                        }
                    }
                    //console.log(data)
                    var updateTask
                    switch (change.type) {
                        case 'added': updateTask = update(self.state.overlayTasks, { $push: [data] }); break;
                        case 'modified': updateTask = update(self.state.overlayTasks, { [actionIndex]: { $set: data } }); break;
                        case 'removed': updateTask = update(self.state.overlayTasks, { $splice: [[actionIndex, 1]] }); break;
                        default: break;
                    }
                    if (self.state.selectedOverlay) {
                        self.onUpdateOverlayTasks(updateTask)
                    } else {
                        self.setState({ overlayTasks: updateTask })
                    }
                });
            }, function (error) {
                throw ('whoops!', error)
            });
    }
    onAddRealTimePlanMemberUpdateListener = (selectedPlan) => {
        this.onRemoveRealTimePlanMember()
        var self = this
        this.planMemberRealtimeUpdateRef = planMemberRef.where("planId", "==", selectedPlan.planId)
            .onSnapshot(function (snapshot) {
                var queryAmount = snapshot.size
                snapshot.docChanges().forEach(function (change) {
                    const { memberId, memberRole } = change.doc.data()
                    const planMemberId = change.doc.id
                    const actionIndex = self.state.planMember.findIndex(member => member.memberId === memberId)
                    var updatePlanMember
                    if (change.type === "added") {
                        userRef.doc(memberId).get().then(function (doc) {
                            queryAmount--
                            if (queryAmount === 0) {
                                self.setState({ isWaitingForPlanMemberQuery: false })
                            }
                            if (doc.exists) {
                                const data2 = { ...doc.data(), ...change.doc.data(), planMemberId }
                                updatePlanMember = update(self.state.planMember, { $push: [data2] })
                                self.setState({ planMember: updatePlanMember })
                            }
                        })
                    }
                    if (change.type === "modified") {
                        updatePlanMember = update(self.state.planMember, { [actionIndex]: { memberRole: { $set: memberRole } } })
                        self.setState({ planMember: updatePlanMember })
                    }
                    if (change.type === "removed") {
                        updatePlanMember = update(self.state.planMember, { $splice: [[actionIndex, 1]] })
                        self.setState({ planMember: updatePlanMember })
                    }

                });
            }, function (error) {
                throw ('whoops!', error)
            });
    }
    onCheckToggleAllTaskDone = () => {
        var self = this
        const { selectedPlan } = this.state
        const { lastModifiedDate, planId } = selectedPlan
        const FormatedLastModifiedDate = moment(lastModifiedDate).format().split('T')[0]
        const thisDate = moment().format().split('T')[0]
        if (!moment(FormatedLastModifiedDate).isSame(thisDate)) {
            taskRef.where('planId', '==', planId).get().then(function (querySnapshot) {
                var taskAmount = querySnapshot.size
                if (taskAmount === 0) {
                    self.onUpdatePlanLastModifiedDate(taskAmount, planId)
                } else {
                    self.setState({ isWaitingForTaskToggle: true })
                }
                querySnapshot.forEach(doc => {
                    const { taskRepetition } = doc.data()
                    const taskId = doc.id
                    var doTaskDate = null
                    if (taskRepetition) {
                        doTaskDate = self.onCheckDoTaskDate(taskRepetition)
                    }
                    if (doTaskDate) {
                        const doDate = moment(doTaskDate).format().split('T')[0]
                        if (moment(doDate).isSame(thisDate)) {
                            taskRef.doc(taskId).set({ isDone: false }, { merge: true }).then(function () {
                                taskAmount--
                                self.onUpdatePlanLastModifiedDate(taskAmount, planId)
                            })
                        } else {
                            taskAmount--
                            self.onUpdatePlanLastModifiedDate(taskAmount, planId)
                        }
                    } else {
                        taskAmount--
                        self.onUpdatePlanLastModifiedDate(taskAmount, planId)
                    }
                })
            })
        }
    }
    onUpdatePlanLastModifiedDate = (taskAmount, planId) => {
        const { planData } = this.state
        if (taskAmount === 0) {
            const actionIndex = planData.findIndex(plan => plan.planId === planId)
            const updatePlan = update(planData, { [actionIndex]: { lastModifiedDate: new Date() } })
            planRef.doc(planId).set({ lastModifiedDate: new Date() }, { merge: true })
            this.setState({ isWaitingForTaskToggle: false, planData: updatePlan })
        }
    }
    onCheckDoTaskDate = (taskRepetition) => {
        const { repetitionDueType } = taskRepetition
        var result = null
        switch (repetitionDueType) {
            case 'forever':
                result = this.onComputeDoTaskDate(taskRepetition)
                break;
            case 'untilDate':
                const { repetitionDueDate } = taskRepetition
                const thisDate = moment().format().split('T')[0]
                const formatedTaskDueDate = moment(repetitionDueDate.toDate()).format().split('T')[0]
                if (moment(thisDate).isSameOrBefore(formatedTaskDueDate)) {
                    result = this.onComputeDoTaskDate(taskRepetition)
                }
                break;
            case 'times':
                const { repetitionFinishTimes, repetitionTimes } = taskRepetition
                if (repetitionFinishTimes < repetitionTimes) {
                    result = this.onComputeDoTaskDate(taskRepetition)
                }
                break;
            default:
                break;
        }
        return result
    }
    onComputeDoTaskDate = (taskRepetition) => {
        const { taskStartDate, repetitionType, repetitionUnit, repetitionDayInWeek } = taskRepetition
        const thisDate = moment().format().split('T')[0]
        const startDate = moment(taskStartDate.toDate()).format().split('T')[0]
        if (moment(startDate).isSameOrAfter(thisDate)) {
            return taskStartDate.toDate()
        } else {
            var returnDate
            switch (repetitionType) {
                case 'daily':
                    var addDay
                    const diffDate = moment().diff(startDate, 'd')
                    if (diffDate < repetitionUnit) {
                        addDay = repetitionUnit - diffDate
                    } else {
                        addDay = diffDate % repetitionUnit
                    }
                    returnDate = moment().add(addDay, 'd')
                    break;
                case 'weekly':
                    const dayNum = parseInt(moment().format('d'), 10)
                    var shouldChangeWeek = true
                    var dayIndex
                    var addDayInweek
                    repetitionDayInWeek.forEach((day, key) => {
                        if (shouldChangeWeek && (dayNum <= day)) {
                            dayIndex = key
                            shouldChangeWeek = false
                        }
                    });
                    if (shouldChangeWeek) {
                        addDayInweek = (repetitionDayInWeek[0] - dayNum) + 7
                    } else {
                        addDayInweek = repetitionDayInWeek[dayIndex] - dayNum
                    }
                    returnDate = moment().add(addDayInweek, 'd')
                    returnDate = moment(returnDate).add(repetitionUnit - 1, 'w')
                    break;
                case 'monthly':
                    returnDate = moment(startDate)
                    while (returnDate.isSameOrBefore(thisDate)) {
                        returnDate = returnDate.add(repetitionUnit, 'M')
                    }
                    break;
                case 'yearly':
                    returnDate = moment(startDate)
                    while (returnDate.isSameOrBefore(thisDate)) {
                        returnDate = returnDate.add(repetitionUnit, 'y')
                    }
                    break;
                default: break;
            }
            var format = moment(returnDate).minute(moment(taskStartDate.toDate()).minute())
            format = moment(format).hours(moment(taskStartDate.toDate()).hours()).toDate()
            return format
        }
    }
    onRemoveRealTimeUpdateListener = () => {
        this.setState({ isFirstOverlayQuery: true })
        this.onRemoveRealTimeOverlay()
        this.onRemoveRealTimeOverlayTask()
        // ...
        // Stop listening to changes
    }
    onRemoveRealTimePlanMember = () => {
        this.setState({ planMember: [], isWaitingForPlanMemberQuery: true, isWaitingForTaskToggle: false })
        if (this.planMemberRealtimeUpdateRef) {
            this.planMemberRealtimeUpdateRef()
            // Stop listening to changes
        }
    }
    onRemoveRealTimeOverlay = () => {
        if (this.overlayRealTimeUpdateRef) {
            this.overlayRealTimeUpdateRef()
        }
    }
    onRemoveRealTimeOverlayTask = () => {
        if (this.overlayTaskRealTimeUpdateRef) {
            this.overlayTaskRealTimeUpdateRef()
        }
    }
    onDeletePlanMember = (member) => {
        const { planMemberId } = member
        planMemberRef.doc(planMemberId).delete()
    }
    onSetPlan = (plan) => {
        console.log(plan)
    }
    render() {
        const { classes, theme } = this.props;
        const drawer = (
            <div>
                <PermanentDrawer
                    onAddRealTimePlanMemberUpdateListener={this.onAddRealTimePlanMemberUpdateListener}
                    onSaveToFirestore={this.onSaveToFirestore}
                    onSetSelectedPlan={this.onSetSelectedPlan}
                    onSetUser={this.onSetUser}
                    onQueryPlanFromFirestore={this.onQueryPlanFromFirestore}
                    onChangePolyStrokeColor={this.onChangePolyStrokeColor}
                    onChangePolyFillColor={this.onChangePolyFillColor}
                    onSetSelectedIcon={this.onSetSelectedIcon}
                    onEditOverlayDetail={this.onEditOverlayDetail}
                    onSetUserNull={this.onSetUserNull}
                    onDeletePlan={this.onDeletePlan}
                    onDeleteOverlay={this.onDeleteOverlay}
                    onClearOverlayFromMap={this.onClearOverlayFromMap}
                    onCallFitBounds={this.onCallFitBounds}
                    onEditPlanName={this.onEditPlanName}
                    onUndoCoords={this.onUndoCoords}
                    onUndoDrawingCoords={this.onUndoDrawingCoords}
                    onRedoDrawingCoords={this.onRedoDrawingCoords}
                    onRedoCoords={this.onRedoCoords}
                    onToggleDistanceMarker={this.onToggleDistanceMarker}
                    onAddTask={this.onAddTask}
                    onToggleIsTaskDone={this.onToggleIsTaskDone}
                    onFilterTask={this.onFilterTask}
                    onEditTask={this.onEditTask}
                    onDeleteTask={this.onDeleteTask}
                    onAddPlanMember={this.onAddPlanMember}
                    onDeletePlanMember={this.onDeletePlanMember}
                    onAddPlan={this.onAddPlan}
                    onChangeDrawPage={this.onChangeDrawPage}
                    handleDrawerOpen={this.handleDrawerOpen}
                    handleDrawerToggle={this.handleDrawerToggle}
                    onAddListenerGrabBtn={this.onAddListenerGrabBtn}
                    onEditOverlayPlantDate={this.onEditOverlayPlantDate}
                    {...this.state}
                />
            </div>
        );

        return (
            <div className={classes.root}>
                <CssBaseline />
                <nav className={classes.drawer}>
                    {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                    <Hidden smUp implementation="css">
                        <Drawer
                            container={this.props.container}
                            variant="temporary"
                            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                            open={this.state.mobileOpen}
                            onClose={this.handleDrawerToggle}
                            classes={{
                                //paper: "drawerPaper",
                                paper: classes.drawerPaper,
                            }}
                            ModalProps={{
                                keepMounted: true,
                                // Better open performance on mobile. 
                            }}
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                    <Hidden xsDown implementation="css">
                        <Drawer
                            classes={{
                                //paper: "drawerPaper",
                                paper: classes.drawerPaper,
                            }}
                            variant="permanent"
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                </nav>
                <main className={classes.content}>
                    <Map>
                        {this.state.overlayObject.map((value) => {
                            const overlayType = value.overlayType
                            const overlayId = value.overlayId
                            switch (overlayType) {
                                case 'polygon':
                                    return (
                                        <Polygon
                                            key={overlayId}
                                            {...value}
                                            addPolygonListener={this.addPolygonListener}
                                        />
                                    )
                                case 'polyline':
                                    return (
                                        <Polyline
                                            key={overlayId}
                                            {...value}
                                            addPolylineListener={this.addPolylineListener}
                                        />
                                    )
                                case 'marker':
                                    return (
                                        <Marker
                                            key={overlayId}
                                            {...value}
                                            addMarkerListener={this.addMarkerListener}
                                        />
                                    )
                                default: return null
                            }
                        })
                        }
                        <ExampleLine
                            exampleLineCoords={this.state.exampleLineCoords}
                            strokeColor={this.state.strokeColor}
                        />

                        <div className="FrameLeft">

                            {
                                this.state.distanceDetail.map(value => {
                                    return (
                                        value.detail.map(value2 => {
                                            return (
                                                <TransparentMaker
                                                    key={value2.id}
                                                    midpoint={value2.midpoint}
                                                    disBtw={value2.disBtw}
                                                    visible={value2.visible}
                                                />
                                            )
                                        })
                                    )
                                })
                            }


                            <SearchBox />
                            <OpenSide
                                handleDrawerToggle={this.handleDrawerToggle}
                            />

                            <FunctionBtn
                                //Geolocation
                                onSetPanelName={this.onSetPanelName}

                                //ToggleDevice
                                onToggleDeviceMode={this.onToggleDeviceMode}
                                {...this.state}

                            //OpensettingMap
                            />

                            <IconLabelButtons
                                onAddListenerGrabBtn={this.onAddListenerGrabBtn}

                                onAddListenerMarkerBtn={this.onAddListenerMarkerBtn}
                                onAddListenerPolygonBtn={this.onAddListenerPolygonBtn}
                                onAddListenerPolylineBtn={this.onAddListenerPolylineBtn}
                            />



                        </div>
                        <div className="FrameRight">

                        </div>
                        {/* <DetailedExpansionPanel
                            {...this.state}

                        /> */}

                        {/* <MapHeading /> */}
                        <div className="FrameCenter">
                            <MapCenterFire
                                drawOverlayUsingTouchScreen={this.drawOverlayUsingTouchScreen}
                                {...this.state}
                            />

                        </div>

                        <div className="FrameSnackbar">
                            <OverlayDetail
                                {...this.state}
                            />
                        </div>

                    </Map>
                </main>
            </div>
        );
    }
}

ResponsiveDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
    container: PropTypes.object,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(ResponsiveDrawer);
function new_script(src) {
    return new Promise(function (resolve, reject) {
        var script = document.createElement('script');
        script.src = src;
        script.addEventListener('load', function () {
            resolve();
        });
        script.addEventListener('error', function (e) {
            reject(e);
        });
        document.body.appendChild(script);
    })
};
// Promise Interface can ensure load the script only once
new_script('https://maps.googleapis.com/maps/api/js?&libraries=geometry,drawing,places,visualization&key=&callback=initMap');
//AIzaSyDsVFar03bgXY8xkPmzQ-NxqcEzzscdLnc
