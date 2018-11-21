import React, { Component } from 'react';
import update from 'immutability-helper';
import shortid from 'shortid'
import { auth, userRef } from './config/firebase'
import {
  overlayRef, user,
  planRef, taskRef,
  planMemberRef,
} from './config/firebase'
// Import location
import Map from './components/Map'
import Marker from './components/Marker';
import Polygon from './components/Polygon';
import Polyline from './components/Polyline';
import SearchBox from './components/searchBox';
import OpenSide from './components/openSideBtn';
import ExampleLine from './components/ExampleLine';
import AddPlan from './components/AddPlan';
import GeolocatedMe from './components/Geolocation';
import IconLabelButtons from './components/DrawingBtn';
import PermanentDrawer from './components/PermanentDrawer';
import OpenSettingMap from './components/OpenSettingMapBtn';
import TransparentMaker from './components/TransparentMaker';
import DetailedExpansionPanel from './components/DetailedExpansionPanel';
import MapCenterFire from './components/MapCenterFire'
import ToggleDevice from './components/ToggleDevice'
// CSS Import
import './App.css'
import './components/SearchBoxStyles.css'
// Logo Import
import icon_point from './components/icons/icon_point.png';
//Value import 
import { SORT_BY_NEWEST, SORT_BY_LATEST, SHOW_ALL, SHOW_COMPLETE, SHOW_ACTIVATE, SHOW_OVERVIEW, SHOW_TODAY } from './staticValue/SaticString'
import moment from 'moment';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      appUser: null,
      areaDetail: "",
      disBtwDetail: "",
      distanceDetail: [],
      drawerPage: "homePage",
      drawingBtnType: null,
      drawingId: null,
      exampleLineCoords: [],
      fillColor: "#ffa500",
      filterTaskType: SHOW_ALL,
      icon: icon_point,
      isDistanceMarkerVisible: true,
      isDrawInDesktopDevice: true,
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
    }
  }
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
    var self = this
    window.addEventListener("beforeunload", function (event) {
      // Cancel the event as stated by the standard.
      event.preventDefault();
      // Chrome requires returnValue to be set.
      //event.returnValue = 'เซฟก่อนไหมพ่อหนุ่ม'
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
    const { isFirstDraw, overlayObject, distanceDetail, selectedPlan, drawingId } = this.state
    if (isFirstDraw === false) {
      const drawingIndex = overlayObject.findIndex(overlay => overlay.overlayId === drawingId)
      const currentOverlay = overlayObject[drawingIndex]
      const coordsLength = currentOverlay.overlayCoords.length
      const overlayType = currentOverlay.overlayType
      if ((overlayType === 'polygon' && coordsLength < 3) || (overlayType === 'polyline' && coordsLength < 2)) {
        let spliceCoords = update(overlayObject, { $splice: [[overlayObject.length - 1, 1]] })
        let spliceDetail = update(distanceDetail, { $splice: [[distanceDetail.length - 1, 1]] })
        if (overlayType === 'polygon') {
          alert('รูปหลายเหลี่ยมที่มีจำนวนจุดมากกว่าสองจุดเท่านั้นจึงจะถูกบันทึกได้')
        }
        if (overlayType === 'polyline') {
          alert('เส้นเชื่อมที่มีจำนวนจุดมากกว่าหนึ่งจุดเท่านั้นจึงจะถูกบันทึกได้')
        }
        this.setState({
          overlayObject: spliceCoords,
          distanceDetail: spliceDetail,
          isFirstDraw: true,
          drawingId: null,
        })
      } else {
        if (selectedPlan) {
          this.onSaveOverlay(currentOverlay)
        } else {
          const updateOverlay = update(overlayObject, { [drawingIndex]: { clickable: { $set: true } } })
          this.setState({ overlayObject: updateOverlay })
        }
        this.setState({ isFirstDraw: true, drawingId: null, }, () => console.log(this.state.overlayObject, 'overlayOb'))
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
      drawingId: id,
    })
    this.onDrawExampleLine(latLng)
  }
  onPushDrawingPolygonCoords = (latLng) => {
    const { overlayObject, drawingId } = this.state
    const lat = latLng.lat()
    const lng = latLng.lng()
    const clickLatLng = { lat, lng }
    const actionIndex = overlayObject.findIndex(overlay => overlay.overlayId === drawingId)
    const pushCoords = update(overlayObject, { [actionIndex]: { overlayCoords: { $push: [clickLatLng] } } })
    const currentOverlay = pushCoords[pushCoords.length - 1]
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
      drawingId: id,
    })
    this.onDrawExampleLine(latLng)

  }
  onPushDrawingPolylineCoords = (latLng) => {
    const { overlayObject, drawingId } = this.state
    const lat = latLng.lat()
    const lng = latLng.lng()
    const clickLatLng = { lat, lng }
    let actionIndex = overlayObject.findIndex(overlay => overlay.overlayId === drawingId)
    let pushCoords = update(overlayObject, { [actionIndex]: { overlayCoords: { $push: [clickLatLng] } } })
    const currentOverlay = pushCoords[pushCoords.length - 1]
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
      drawingId: id,
    }, () => {
      this.onFinishDrawing()
    })
  }
  drawOverlayUsingTouchScreen = () => {
    const { isFirstDraw, drawingBtnType, overlayObject } = this.state
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
      const overlayType = overlayObject[overlayObject.length - 1].overlayType
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
    const { selectedOverlay } = this.state
    if (selectedOverlay) {
      if (selectedOverlay.overlayType === 'polygon' || selectedOverlay.overlayType === 'polyline') {
        selectedOverlay.setOptions({ editable: false, })
      }
      if (selectedOverlay.overlayType === 'marker') {
        //
        selectedOverlay.setOptions({ draggable: false, animation: null })
      }
      this.setState({ selectedOverlay: null })
    }
  }
  addMarkerListener = (marker) => {
    var self = this
    window.google.maps.event.addListener(marker, 'mousedown', function () {
      self.handleDrawerOpen()
      self.onSetMarkerOptions()
      self.onSetSelectedOverlay(marker)
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
        var LatLngString = `lattitude :  ${event.latLng.lat().toFixed(4)}   ,   longtitude : ${event.latLng.lng().toFixed(4)}`
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
        var LatLngString = `lattitude :  ${window.map.getCenter().lat().toFixed(4)}   ,   longtitude : ${window.map.getCenter().lng().toFixed(4)}`
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
      var LatLngString = `lattitude :  ${window.map.getCenter().lat().toFixed(4)}   ,   longtitude : ${window.map.getCenter().lng().toFixed(4)}`
      self.setState({ latLngDetail: LatLngString })
    })
    var LatLngString = `lattitude :  ${window.map.getCenter().lat().toFixed(4)}   ,   longtitude : ${window.map.getCenter().lng().toFixed(4)}`
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
          fillColor, strokeColor, icon, overlaySource, overlayId } = overlay
        const data = { editorId, overlayCoords, overlayType, overlayName, overlayDetail, planId }
        var overlay
        if ((overlayType === 'polygon') && (overlayCoords.length > 2)) {
          overlay = {
            fillColor,
            strokeColor,
            ...data
          }
        }
        if ((overlayType === 'polyline') && (overlayCoords.length > 1)) {
          overlay = {
            strokeColor,
            ...data
          }
        }
        if (overlayType === 'marker') {
          overlay = {
            icon,
            ...data
          }
        }
        if (overlay) {
          if (overlaySource === 'local') {
            overlayRef.add(overlay).then(function (doc) {
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
            overlayRef.doc(overlayId).set(overlay
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
      } else {
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
              self.onSortArrayByCreateDate('planData', SORT_BY_NEWEST, unSortplanData, 'createPlanDate')
            }
          })
        })
      }
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
        self.onSortArrayByCreateDate('planData', SORT_BY_NEWEST, pushPlan, 'createPlanDate')
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
    const { selectedOverlay, selectedPlan, user } = this.state
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
        const { repetitionFinishTimes } = taskRepetition
        const increase = parseInt(repetitionFinishTimes, 10)

        const increaseString = increase + 1
        data = { taskRepetition, ...data }
        data = update(data, { taskRepetition: { repetitionFinishTimes: { $set: increaseString.toString() } } })
      }
    }
    taskRef.doc(taskId).set(data
      , { merge: true }).catch(function (erorr) {
        throw ('whoops!', erorr)
      })
  }
  onCheckToggleAllTaskDone = () => {
    var self = this
    const { selectedPlan } = this.state
    const { lastModifiedDate, planId } = selectedPlan
    const FormatedLastModifiedDate = moment(lastModifiedDate).format().split('T')[0]
    const thisDate = moment().format().split('T')[0]
    //if (!moment(FormatedLastModifiedDate).isSame(thisDate)) {
    taskRef.where('planId', '==', planId).get().then(function (querySnapshot) {
      if (querySnapshot.size > 0) {
        self.setState({ isWaitingForTaskToggle: true })
      }
      querySnapshot.forEach(doc => {
        var { taskRepetition } = doc.data()
        var taskId = doc.id
        var data = { ...taskRepetition, taskId }
        if (taskRepetition) {
          const { repetitionDueType } = taskRepetition
          switch (repetitionDueType) {
            case 'forever':
              self.onChangeTaskDoneAndDoTaskDate(data)
              break;
            case 'untiDate':
              var { taskDueDate } = taskRepetition
              taskDueDate = taskDueDate.toDate()
              var formtedTaskDueDate = moment(taskDueDate).format().split('T')[0]
              if (moment(formtedTaskDueDate).isSameOrBefore(thisDate)) {
                self.onChangeTaskDoneAndDoTaskDate(data)
              }
              break;
            case 'times':
              const { repetitionFinishTimes, repetitionTimes } = taskRepetition
              if (repetitionFinishTimes <= repetitionTimes) {
                self.onChangeTaskDoneAndDoTaskDate(data)
              }
              break;
            default:
              break;
          }
        }
      });
    })
    //}
  }
  onChangeTaskDoneAndDoTaskDate = (taskRepetition) => {
    var { repetitionType, repetitionUnit, doTaskDate, taskId } = taskRepetition
    var thisDate = moment().format().split('T')[0]
    doTaskDate = doTaskDate.toDate()
    var computeUnit
    switch (repetitionType) {
      case 'daily': computeUnit = 'd'
        break;
      case 'weekly': computeUnit = 'w'
        break;
      case 'monthly': computeUnit = 'M'
        break;
      case 'yearly': computeUnit = 'y'
        break;
      default:
        break;
    }
    var computeDate = moment(doTaskDate).add(repetitionUnit, computeUnit).format().split('T')[0]
    if (moment(computeDate).isSame(thisDate)) {
      var format = moment().minute(moment(doTaskDate).minute())
      format = moment(format).hours(moment(doTaskDate).hours()).toDate()
      taskRepetition.doTaskDate = format
      taskRef.doc(taskId).set({ isDone: false, taskRepetition }, { merge: true })
    }
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
  onFilterTask = (filterTaskType = this.state.filterTaskType) => {
    const { overlayTasks, selectedOverlay } = this.state
    //const overlAllFiltertask = this.state.overlAllFiltertask
    if (!selectedOverlay) {
      return;
    }
    if (filterTaskType !== this.state.filterTaskType) {
      this.setState({ filterTaskType })
    }
    // if (overlAllFiltertask !== this.state.overlAllFiltertask) {
    //   this.setState({ overlAllFiltertask })
    // }
    // var overAllFilter
    // if (overlAllFiltertask === SHOW_OVERVIEW) {
    //   overAllFilter = overlayTasks
    // } else {
    //   if (overlAllFiltertask === SHOW_TODAY) {
    //     overAllFilter = overlayTasks
    //   }
    // }
    var filterTask
    switch (filterTaskType) {
      case SHOW_ALL:
        filterTask = overlayTasks.filter(task => task.overlayId === selectedOverlay.overlayId)
        break;
      case SHOW_ACTIVATE:
        filterTask = overlayTasks.filter(task => (task.overlayId === selectedOverlay.overlayId) && task.isDone === false)
        break;
      case SHOW_COMPLETE:
        filterTask = overlayTasks.filter(task => task.overlayId === selectedOverlay.overlayId && task.isDone === true)
        break;
      default: break;
    }
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
          userRef.doc(uid).set(data, { merge: true })
            .then(function () {
              //console.log('เพิ่มผู้ใช้งานเป็นสมาชิกเรียบร้อย')
            }).
            catch(function (error) {
              throw ('whoops!', error)
            })
        }
      })
      .catch(function (error) {
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
    const { selectedOverlay, overlayObject } = this.state
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
    self.setState({ overlayObject: updateOverlay, selectedOverlay: updateSelectedOverlay })
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
    const { overlayId, overlaySource } = overlay
    const deleteIndex = overlayObject.findIndex(overlay => overlay.overlayId === overlayId)
    if (overlaySource === 'server') {
      //delete selected overlay from firestore
      overlayRef.doc(overlayId).delete().catch(function (error) {
        console.error("Error removing document: ", error);
      });
    } else {
      this.onResetSelectedOverlay()
      const deleteObject = update(overlayObject, { $splice: [[deleteIndex, 1]] })
      this.setState({ overlayObject: deleteObject, drawerPage: 'homePage' })
      if (overlay.overlayType !== 'marker') {
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

      if (overlayType !== 'marker') {
        if (isFirstDraw === false) {
          const lastCoords = beforeLastUndoCoords[beforeLastUndoCoords.length - 1]
          const lastCoordsLatLng = new window.google.maps.LatLng(lastCoords)
          const setExampleline = update(exampleLineCoords, { 0: { $set: lastCoords } })
          this.onDrawExampleLine(lastCoordsLatLng)
          this.setState({ exampleLineCoords: setExampleline })
        }
        const currentObject = setUndoCoords[actionIndex]
        const currentCoords = currentObject.overlayCoords
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
      if (overlayType !== 'marker') {
        if (isFirstDraw === false) {
          const lastCoords = lastRedoCoords[lastRedoCoords.length - 1]
          const lastCoordsLatLng = new window.google.maps.LatLng(lastCoords)
          const setExampleline = update(exampleLineCoords, { 0: { $set: lastCoords } })
          this.onDrawExampleLine(lastCoordsLatLng)
          this.setState({ exampleLineCoords: setExampleline })
        }
        const currentObject = setRedoCoords[actionIndex]
        const currentCoords = currentObject.overlayCoords
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
      }
      this.setState({ overlayObject: setIsOverlaySave })
    }
  }
  onUndoDrawingCoords = () => {
    const { overlayObject } = this.state
    const currentObjectLength = overlayObject.length - 1
    const currentObject = overlayObject[currentObjectLength]
    this.onUndoCoords(currentObject)
  }
  onRedoDrawingCoords = () => {
    const { overlayObject } = this.state
    const currentObjectLength = overlayObject.length - 1
    const currentObject = overlayObject[currentObjectLength]
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
    this.setState((state) => {
      return { distanceDetail: temp1, isDistanceMarkerVisible: !state.isDistanceMarkerVisible };
    });
  }
  onAddPlanMember = (data) => {
    const { planId, memberId } = data
    planMemberRef
      .where('planId', '==', planId)
      .where('memberId', '==', memberId)
      .get()
      .then(function (querySnapshot) {
        if (querySnapshot.empty) {
          planMemberRef.add(data)
            .then(function () {
              console.log('เพิ่มผู้ใช้งานเป็นสมาชิกเรียบร้อย')
            }).
            catch(function (error) {
              throw ('whoops!', error)
            })
        } else {
          console.log('ผู้ใช้งานนี้เป็นสมาชิกของแปลงนี้อยู่แล้ว')
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
  }
  onAddRealTimeUpdateListener = () => {
    this.onAddRealTimeOverlayUpdateListener()
    this.onAddRealTimeTaskUpdateListener()
  }
  onAddRealTimeOverlayUpdateListener = () => {
    var self = this
    overlayRef.where("planId", "==", this.state.selectedPlan.planId)
      .onSnapshot(function (snapshot) {
        var queryAmount = snapshot.size
        if (queryAmount === 0) {
          self.setState({ isFirstOverlayQuery: false })
        }
        snapshot.docChanges().forEach(function (change) {
          const { editorId, overlayCoords, overlayType } = change.doc.data()
          const overlayId = change.doc.id
          const actionIndex = self.state.overlayObject.findIndex(overlay => overlay.overlayId === overlayId)
          const data = {
            overlaySource: 'server',
            undoCoords: [overlayCoords],
            redoCoords: [],
            isOverlaySave: true,
            clickable: true,
            overlayId,
            ...change.doc.data(),
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
                self.setState({ selectedOverlay: null, drawerPage: 'homePage' })
                self.onResetSelectedOverlay()
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
    var self = this
    taskRef.where("planId", "==", this.state.selectedPlan.planId)
      .onSnapshot(function (snapshot) {
        snapshot.docChanges().forEach(function (change) {
          var { taskDueDate, taskRepetition } = change.doc.data()
          var addTaskDate = change.doc.data().addTaskDate.toDate();
          var taskId = change.doc.id
          const actionIndex = self.state.overlayTasks.findIndex(task => task.taskId === taskId)
          var data = {
            ...change.doc.data(),
            taskId, addTaskDate
          }
          if (taskDueDate) {
            taskDueDate = taskDueDate.toDate()
            data = { ...data, taskDueDate }
          }
          if (taskRepetition) {
            var { repetitionDueType, taskStartDate } = taskRepetition
            taskStartDate = taskStartDate.toDate()
            data.taskRepetition.taskStartDate = taskStartDate
            switch (repetitionDueType) {
              case 'untilDate':
                var { taskDueDate } = taskRepetition
                var taskDueDate = taskDueDate.toDate()
                data.taskRepetition.taskDueDate = taskDueDate
                break;
              default:
                break;
            }
          }
          //console.log(data, 'q')
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
    planMemberRef.where("planId", "==", selectedPlan.planId)
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
  onRemoveRealTimeUpdateListener = () => {
    this.setState({ isFirstOverlayQuery: true })
    var unsubscribe = overlayRef
      .onSnapshot(function () { });
    var unsubscribe2 = taskRef
      .onSnapshot(function () { });
    unsubscribe();
    unsubscribe2();
    // ...
    // Stop listening to changes
  }
  onRemoveRealTimePlanMember = () => {
    this.setState({ planMember: [], isWaitingForPlanMemberQuery: true })
    var unsubscribe3 = planMemberRef
      .onSnapshot(function () { });
    unsubscribe3();
  }
  onDeletePlanMember = (member) => {
    const { planMemberId } = member
    planMemberRef.doc(planMemberId).delete()
  }
  onSetPlan = (plan) => {
    console.log(plan)
  }
  render() {
    return (
      <div className="AppFrame">
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
          {...this.state}
        />
        <input id="pac-input" className="controls" type="text" placeholder="Find place" />
        <Map
          left={this.state.left}
        >
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
            <AddPlan
              onAddPlan={this.onAddPlan}
              onChangeDrawPage={this.onChangeDrawPage}
              handleDrawerOpen={this.handleDrawerOpen}
              {...this.state}
            />
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
            <IconLabelButtons
              onAddListenerMarkerBtn={this.onAddListenerMarkerBtn}
              onAddListenerPolygonBtn={this.onAddListenerPolygonBtn}
              onAddListenerPolylineBtn={this.onAddListenerPolylineBtn}
              onAddListenerGrabBtn={this.onAddListenerGrabBtn}
            />
            <OpenSide
              handleDrawerOpen={this.handleDrawerOpen}
              handleDrawerClose={this.handleDrawerClose}
              openSide={this.state.openSide}
            />
            <SearchBox
            />
            <GeolocatedMe
              onSetPanelName={this.onSetPanelName}
            />
            <ToggleDevice
              onToggleDeviceMode={this.onToggleDeviceMode}
              {...this.state}
            />
            <OpenSettingMap
            />

          </div>
          <div className="FrameRight">

          </div>
          <SearchBox
          />
          <DetailedExpansionPanel
            {...this.state}
          />
          {/* <MapHeading /> */}
          <div className="FrameCenter">
            <MapCenterFire
              drawOverlayUsingTouchScreen={this.drawOverlayUsingTouchScreen}
              {...this.state}
            />
          </div>
        </Map>
      </div>
    );
  }
}
export default App

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
var my_script = new_script('https://maps.googleapis.com/maps/api/js?&libraries=geometry,drawing,places,visualization&key=&callback=initMap');
