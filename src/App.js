import React, { Component } from 'react';
import update from 'immutability-helper';
import shortid from 'shortid'
import { auth } from './config/firebase'
import {
  overlayRef,
  planRef,
  taskRef,
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
import AddPlanBtn from './components/AddPlanBtn';
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
import { SORT_BY_NEWEST, SORT_BY_LATEST, SHOW_ALL, SHOW_COMPLETE, SHOW_ACTIVATE } from './staticValue/SaticString'

function new_script(src) {
  console.log('initial google map api load!', src)
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
//var my_script2 = new_script('https://cdn.rawgit.com/bjornharrtell/jsts/gh-pages/1.0.2/jsts.min.js')

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      drawingBtnType: null,
      overlayObject: [],
      overlayTasks: [],
      overlayTaskShow: [],
      selectedOverlay: null,
      isFirstDraw: true,
      exampleLineCoords: [],
      userLocationCoords: [],
      planData: [],
      colPlans: [],
      selectedPlan: null,
      fillColor: '#ffa500',
      strokeColor: '#ff4500',
      user: null,
      openSide: true,
      openOption: false,
      left: '350px',
      overlayOptionsType: '',
      icon: icon_point,
      panelName: 'จับ',
      latLngDetail: '',
      lengthDetail: '',
      disBtwDetail: '',
      areaDetail: '',
      distanceDetail: [],
      drawerPage: 'homePage',
      isDrawInDesktopDevice: true,
      shouldSave: false,
      isDistanceMarkerVisible: true,
      isWaitingForUserResult: true,
      isWaitingForPlanQuery: true,
      isWaitingForColPlanQuery: true,
      loadingProgress: null,
      filterTaskType: SHOW_ALL,
      tempPlan: null,
      saveAmount: null,
      unSaveOverlay: [],
      isFirstQuery: true,
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
    this.onUtilitiesMethod()
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
  onUtilitiesMethod = () => {
    const { isFirstDraw, overlayObject, distanceDetail, selectedPlan, user } = this.state
    const self = this
    if (isFirstDraw === false) {
      const currentOverlay = overlayObject[overlayObject.length - 1]
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
        })
      } else {
        if (selectedPlan) {
          const planId = selectedPlan.planId
          const editorId = user.uid
          var overlay
          const { overlayCoords, overlayDetail, overlayName,
            overlayType, fillColor, strokeColor, icon, overlayId, } = currentOverlay
          const data = { overlayCoords, overlayDetail, overlayName, overlayType, editorId, planId }
          if (overlayType === 'polygon') {
            overlay = {
              fillColor, strokeColor, ...data
            }
          }
          if (overlayType === 'polyline') {
            overlay = {
              strokeColor, ...data
            }
          }
          if (overlayType === 'marker') {
            overlay = {
              icon, ...data
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
        this.setState({ isFirstDraw: true }, () => console.log(this.state.overlayObject, 'overlayOb'))
      }
    }
    this.onClearExampleLine()
    this.onResetSelectedOverlay()
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
    this.onUtilitiesMethod()
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
    this.onUtilitiesMethod()
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
    this.onUtilitiesMethod()
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
    this.onUtilitiesMethod()
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
        overlayDetail: '-',
        undoCoords: [[clickLatLng]],
        redoCoords: [],
        isOverlaySave: false,
      }]
    })
    this.onPushUnSaveOverlay(id)
    this.setState({
      drawingBtnType: null,
      overlayObject: pushObject,
      shouldSave: true,
      isFirstDraw: false,
    })
    this.onDrawExampleLine(latLng)
  }
  onPushDrawingPolygonCoords = (latLng) => {
    const { overlayObject } = this.state
    const lat = latLng.lat()
    const lng = latLng.lng()
    const clickLatLng = { lat, lng }
    const actionIndex = overlayObject.length - 1
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
        overlayDetail: '-',
        undoCoords: [[clickLatLng]],
        redoCoords: [],
        isOverlaySave: false,
      }]
    })
    this.onPushUnSaveOverlay(id)
    this.setState({
      drawingBtnType: null,
      overlayObject: pushObject,
      isFirstDraw: false,
      shouldSave: true,
    })
    this.onDrawExampleLine(latLng)

  }
  onPushDrawingPolylineCoords = (latLng) => {
    const { overlayObject } = this.state
    const lat = latLng.lat()
    const lng = latLng.lng()
    const clickLatLng = { lat, lng }
    let actionIndex = overlayObject.length - 1
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
        overlayDetail: '-',
        undoCoords: [[clickLatLng]],
        redoCoords: [],
        isOverlaySave: false,
      }]
    })
    this.onPushUnSaveOverlay(id)
    this.setState({
      overlayObject: coordsPush,
      drawingBtnType: 'marker',
      isFirstDraw: false,
      shouldSave: true,
    }, () => {
      this.onUtilitiesMethod()
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
  onPushUnSaveOverlay = (overlayId) => {
    var data = {
      unsaveIndex: overlayId,
      saveIndex: null
    }
    const pushUnSave = update(this.state.unSaveOverlay, { $push: [data] })
    this.setState({ unSaveOverlay: pushUnSave })
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
      const overlayObject = self.state.overlayObject
      const markerIndex = marker.overlayId
      const overlayId = overlayObject.findIndex(overlay => overlay.overlayId === markerIndex)
      const editCoords = [{ lat: marker.getPosition().lat(), lng: marker.getPosition().lng() }]
      const replaceCoords = update(overlayObject, { [overlayId]: { overlayCoords: { $set: editCoords } } })
      const pushUndoCoords = update(replaceCoords, { [overlayId]: { undoCoords: { $push: [editCoords] } } })
      const setRedoCoords = update(pushUndoCoords, { [overlayId]: { redoCoords: { $set: [] } } })
      const setIsOverlaySave = update(setRedoCoords, { [overlayId]: { isOverlaySave: { $set: false } } })
      self.setState({ overlayObject: setIsOverlaySave })
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
    let overlayObject = this.state.overlayObject
    let polyIndex = polygon.overlayId
    let overlayId = overlayObject.findIndex(overlay => overlay.overlayId === polyIndex)
    let editCoords = []
    polygon.getPath().getArray().forEach(element => {
      let lat = element.lat()
      let lng = element.lng()
      editCoords.push({ lat, lng })
    })
    const replaceCoords = update(this.state.overlayObject, { [overlayId]: { overlayCoords: { $set: editCoords } } })
    const pushRedoCoords = update(replaceCoords, { [overlayId]: { undoCoords: { $push: [editCoords] } } })
    const setRedoCoords = update(pushRedoCoords, { [overlayId]: { redoCoords: { $set: [] } } })
    const setIsOverlaySave = (update(setRedoCoords, { [overlayId]: { isOverlaySave: { $set: false } } }))
    this.onPolydistanceBtwCompute(replaceCoords[overlayId])
    this.setState({ overlayObject: setIsOverlaySave, shouldSave: true })
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
  onPolyLengthComputeForCoords = () => {
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
      const updatePlanIndex = this.state.planData.findIndex(plan => plan.planId === planId)
      const updateIsSaving = update(this.state.selectedPlan, { isLoading: { $set: true } })
      const upDateSaveProgressPlan = update(this.state.planData, {
        [updatePlanIndex]: {
          isLoading: { $set: true },
          isPlanOptionsClickable: { $set: false },
          loadingAmount: { $set: saveOverlayAmount },
          loadingProgress: { $set: 0 },
        }
      })
      this.setState({ planData: upDateSaveProgressPlan, selectedPlan: updateIsSaving })
      shouldSaveOverlay.forEach((value) => {
        const overlayCoords = value.overlayCoords
        const overlayType = value.overlayType
        const overlayName = value.overlayName
        const overlayDetail = value.overlayDetail
        const fillColor = value.fillColor
        const strokeColor = value.strokeColor
        const icon = value.icon
        const overlaySource = value.overlaySource
        const overlayId = value.overlayId
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
            overlayRef
              .add(overlay)
              .then(function (doc) {
                const id = doc.id
                self.setState((state) => {
                  const { loadingProgress } = state.planData[updatePlanIndex]
                  const upDateSaveProgressPlan = update(state.planData, {
                    [updatePlanIndex]: {
                      loadingProgress: { $set: loadingProgress + 1 },
                    }
                  })
                  return { planData: upDateSaveProgressPlan }
                }, () => {
                  const { loadingProgress, loadingAmount } = self.state.planData[updatePlanIndex]
                  if (loadingProgress === loadingAmount) {
                    const upDateSaveProgressPlan = update(self.state.planData, {
                      [updatePlanIndex]: {
                        isPlanOptionsClickable: { $set: true },
                        isLoading: { $set: false },
                        loadingProgress: { $set: null },
                      }
                    })
                    self.setState({ planData: upDateSaveProgressPlan })
                  }
                })
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
                self.setState((state) => {
                  const updateOverlayIndex = state.overlayObject.findIndex(overlay => overlay.overlayId === overlayId)
                  const editIsOverlaySave = update(state.overlayObject, { [updateOverlayIndex]: { isOverlaySave: { $set: true } } })
                  return {
                    overlayObject: editIsOverlaySave,
                  };
                }, () => {
                  if (self.state.finishedSaveAmount === self.state.saveAmount) {
                    self.setState({ isSaving: false, loadingProgress: null, shouldSave: false })
                  }
                });
              }).catch(function (error) {
                throw ('there is something went wrong', error)
              });
          };
        };
      });
    };
  }
  onClearOverlayFromMap = () => {
    this.setState({
      overlayObject: [],
      distanceDetail: [],
      unSaveOverlay: [],
      overlayTasks: [],
    })
  }
  onQueryOverlayFromFirestore = () => {
    const { selectedPlan } = this.state
    var self = this
    const planId = selectedPlan.planId

    overlayRef.where('planId', '==', planId).get().then(function (querySnapshot) {
      let overlayObject = []
      querySnapshot.forEach(function (doc) {
        const { overlayCoords, overlayType } = doc.data()
        let overlayId = doc.id
        switch (overlayType) {
          case 'polygon':
            return (
              overlayObject.push({
                overlaySource: 'server',
                undoCoords: [overlayCoords],
                redoCoords: [],
                isOverlaySave: true,
                overlayId,
                ...doc.data(),
              })
            )
          case 'polyline':
            return (
              overlayObject.push({
                overlayId,
                overlaySource: 'server',
                undoCoords: [overlayCoords],
                redoCoords: [],
                isOverlaySave: true,
                ...doc.data(),
              })
            )
          case 'marker':
            return (
              overlayObject.push({
                overlayId,
                overlaySource: 'server',
                undoCoords: [overlayCoords],
                redoCoords: [],
                isOverlaySave: true,
                ...doc.data(),
              })
            )
          default: return null
        }
      })
      overlayObject.forEach(value => {
        if (value.overlayType !== 'marker') {
          self.onPolydistanceBtwCompute(value)
        }
      })
      const pushObject = update(self.state.overlayObject, { $push: overlayObject })
      self.setState({ overlayObject: pushObject, })
      self.onFitBounds(pushObject)
    })
  }
  onQueryPlanFromFirestore = () => {
    // get all plan list from frirestore filter by user ID
    if (!this.state.isWaitingForPlanQuery) {
      this.setState({ isWaitingForPlanQuery: true })
    }
    let unSortplanData = []
    var queryAmount
    var uid = this.state.user.uid
    var self = this
    planMemberRef.where('memberId', '==', uid).get().then(function (querySnapshot) {
      queryAmount = querySnapshot.size
      if (queryAmount === 0) {
        self.setState({ isWaitingForPlanQuery: false, })
      } else {
        querySnapshot.forEach(function (doc) {
          const { planId } = doc.data()
          planRef.doc(planId).get().then(function (doc2) {
            const createPlanDate = doc2.data().createPlanDate.toDate()
            const { planName, planDescription } = doc2.data()
            unSortplanData.push({
              isPlanClickable: true,
              isPlanOptionsClickable: true,
              isLoading: false,
              isSave: true,
              loadingAmount: 0,
              loadingProgress: null,
              unSaveOverlay: [],
              createPlanDate,
              planName,
              planDescription,
              ...doc.data(),

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
  onQueryPlanMemberFromFirestore = () => {
    if (!this.state.user) {
      return;
    }
    if (!this.state.isWaitingForColPlanQuery) {
      this.setState({ isWaitingForColPlanQuery: true })
    }
    let unSortplanData = []
    var uid = this.state.user.uid
    var self = this
    planMemberRef.where('memberId', '==', uid).get().then(function (querySnapshot) {
      var queryAmount = querySnapshot.size
      querySnapshot.forEach(function (doc) {
        const { planId } = doc.data()
        planRef.doc(planId).get().then(function (doc2) {
          unSortplanData.push({
            isPlanClickable: true,
            isPlanOptionsClickable: true,
            isLoading: false,
            isSave: true,
            loadingAmount: 0,
            loadingProgress: null,
            unSaveOverlay: [],
            ...doc.data(),
            ...doc2.data(),
          })
          queryAmount--
          if (queryAmount === 0) {
            self.setState({ isWaitingForColPlanQuery: false, })
            self.onSortArrayByCreateDate('colPlans', SORT_BY_NEWEST, unSortplanData, 'createPlanDate')
          }
        })
      })
      if (queryAmount === 0) {
        self.setState({ isWaitingForColPlanQuery: false, })
      }
    }).catch(function (error) {
      throw ('There is something went wrong', error)
    })
  }
  onAddPlan = (plan) => {
    const { planData, user } = this.state
    const planName = plan.planName
    const planDescription = plan.planDescription
    const createPlanDate = plan.createPlanDate
    const self = this
    const uid = user.uid
    const addPlan = { planName, planDescription, createPlanDate }
    planRef.add(addPlan)
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
            unSaveOverlay: [],
            planId,
            ...addPlan,
            ...data,
          }]
        })
        self.onSortArrayByCreateDate('planData', SORT_BY_NEWEST, pushPlan, 'createPlanDate')
      })
  }
  onSetSelectedPlan = (planData) => {
    this.onResetSelectedPlan()
    const planId = planData.planId
    this.setState((state) => {
      const actionIndex = this.state.planData.findIndex(plan => plan.planId === planId)
      if (actionIndex !== -1) {
        const updatePlanClickable = update(state.planData, { [actionIndex]: { isPlanClickable: { $set: false } } })
        return {
          selectedPlan: planData,
          planData: updatePlanClickable,
        }
      }
    }, () => {
      this.onQueryOverlayFromFirestore()
      this.onQueryOverlayTasksFromFirestore()
      this.onAddRealTimeUpdateListener()
    })
  }
  onResetSelectedPlan = () => {
    if (this.state.selectedPlan) {
      this.onRemoveRealTimeUpdateListener()
      const planId = this.state.selectedPlan.planId
      const actionIndex = this.state.planData.findIndex(plan => plan.planId === planId)
      this.setState((state) => {
        if (actionIndex !== -1) {
          const updatePlanClickable = update(state.planData, { [actionIndex]: { isPlanClickable: { $set: true } } })
          return { selectedPlan: null, planData: updatePlanClickable }
        }
      })
    }
  }
  onQueryOverlayTasksFromFirestore = () => {
    const { selectedPlan } = this.state
    var self = this
    const planId = selectedPlan.planId
    taskRef.where('planId', '==', planId).get().then(function (querySnapshot) {
      var unSortOverlayTasks = []
      querySnapshot.forEach(function (doc) {
        const startAt = doc.data().startAt.toDate();
        const endAt = doc.data().endAt.toDate();
        const isDone = doc.data().isDone
        const content = doc.data().content
        const name = doc.data().name
        const taskId = doc.id
        const overlayId = doc.data().overlayId
        unSortOverlayTasks.push({
          isDone,
          content,
          startAt,
          endAt,
          name,
          taskId,
          overlayId,
          planId,
          taskSource: 'server',
          isTaskSave: true
        })
      });
      self.setState({ overlayTasks: unSortOverlayTasks })
    }).catch(function (error) {
      throw ('There is something went wrong', error)
    })
  }
  onAddTask = (task) => {
    const { overlayTasks } = this.state
    const pushTask = update(overlayTasks, {
      $push: [task]
    })
    this.onUpdateOverlayTasks(pushTask)
  }
  onEditTask = (editTask) => {
    const { overlayTasks } = this.state
    const taskId = editTask.taskId
    const name = editTask.name
    const content = editTask.content
    const startAt = editTask.startAt
    const endAt = editTask.endAt
    const actionIndex = overlayTasks.findIndex(task => task.taskId === taskId)
    const updateTask = update(overlayTasks, {
      [actionIndex]: {
        name: { $set: name },
        content: { $set: content },
        startAt: { $set: startAt },
        endAt: { $set: endAt },
        isTaskSave: { $set: false },
      },
    })
    this.onUpdateOverlayTasks(updateTask)
  }
  onToggleIsTaskDone = (taskId) => {
    const { overlayTasks } = this.state
    const actionIndex = overlayTasks.findIndex(task => task.taskId === taskId)
    const isDone = overlayTasks[actionIndex].isDone
    const updateTask = update(overlayTasks, {
      [actionIndex]: {
        isDone: { $set: !isDone },
        isTaskSave: { $set: false }
      }
    })
    this.onUpdateOverlayTasks(updateTask)
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
    if (!selectedOverlay) {
      return;
    }
    if (filterTaskType !== this.state.filterTaskType) {
      this.setState({ filterTaskType })
    }
    switch (filterTaskType) {
      case SHOW_ALL:
        const showAll = overlayTasks.filter(task => task.overlayId === selectedOverlay.overlayId)
        return (this.onSortArrayByCreateDate('overlayTaskShow', SORT_BY_LATEST, showAll, 'startAt'));
      case SHOW_ACTIVATE:
        const showActivate = overlayTasks.filter(task => (task.overlayId === selectedOverlay.overlayId) && task.isDone === false)
        return (this.onSortArrayByCreateDate('overlayTaskShow', SORT_BY_LATEST, showActivate, 'startAt'));
      case SHOW_COMPLETE:
        const showComplete = overlayTasks.filter(task => task.overlayId === selectedOverlay.overlayId && task.isDone === true)
        return (this.onSortArrayByCreateDate('overlayTaskShow', SORT_BY_LATEST, showComplete, 'startAt'));
      default: return;
    }
  }
  onFitBounds = (overlayObject) => {
    if (overlayObject.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      overlayObject.forEach(value => {
        value.overlayCoords.forEach(value2 => {
          bounds.extend(new window.google.maps.LatLng(value2))
        })
      })
      window.map.fitBounds(bounds)
    }
  }
  getGeolocation = () => {
    var LatLngString = ''
    this.setState({ userLocationCoords: [] })
    navigator.geolocation.getCurrentPosition(position => {
      console.log(position.coords)
      window.map.setCenter({ lat: position.coords.latitude, lng: position.coords.longitude })
      window.map.setZoom(18)
      window.map.panTo({ lat: position.coords.latitude, lng: position.coords.longitude })
      LatLngString = `lattitude : ${position.coords.latitude.toFixed(4)} , longtitude :  ${position.coords.longitude.toFixed(4)}`
      this.setState({
        userLocationCoords: [{
          coords: { lat: position.coords.latitude, lng: position.coords.longitude },
          id: shortid.generate()
        }],
        latLngDetail: LatLngString,
        panelName: 'Your Location'
      })
    })
  }
  addUserMarkerListener = (marker) => {
    var self = this
    window.google.maps.event.addListener(marker, 'click', function () {
      self.setState({ userLocationCoords: [] })
    })
  }

  onChangePolyStrokeColor = (color) => {
    var { selectedOverlay, overlayObject } = this.state
    if (selectedOverlay !== null) {
      let polyIndex = selectedOverlay.overlayId
      let overlayId = overlayObject.findIndex(overlay => overlay.overlayId === polyIndex)
      const changeStrokeColor = update(overlayObject, { [overlayId]: { strokeColor: { $set: color } } })
      const setIsOverlaySave = update(changeStrokeColor, { [overlayId]: { isOverlaySave: { $set: false } } })
      this.setState({ overlayObject: setIsOverlaySave, shouldSave: true })
    }
    this.setState({ strokeColor: color })
  }
  onChangePolyFillColor = (color) => {
    var { selectedOverlay, overlayObject } = this.state
    if (selectedOverlay) {
      let polyIndex = selectedOverlay.overlayId
      let overlayId = overlayObject.findIndex(overlay => overlay.overlayId === polyIndex)
      var changeFillColor = update(overlayObject, { [overlayId]: { fillColor: { $set: color } } })
      const setIsOverlaySave = update(changeFillColor, { [overlayId]: { isOverlaySave: { $set: false } } })
      this.setState({ overlayObject: setIsOverlaySave, shouldSave: true })
    }
    this.setState({ fillColor: color })
  }
  onSetUser = (user) => {
    this.setState({ user: user }, () => {
      this.onQueryPlanFromFirestore()
      this.onQueryPlanMemberFromFirestore()
    })
  }
  onSetUserNull = () => {
    this.setState({
      user: null,
      planData: [],
      unSaveOverlay: [],
      colPlans: [],
      selectedOverlay: null,
      selectedPlan: null,
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
      let markerIndex = selectedOverlay.overlayId
      let overlayId = overlayObject.findIndex(overlay => overlay.overlayId === markerIndex)
      const changeIcon = update(overlayObject, { [overlayId]: { icon: { $set: icon } } })
      const setIsOverlaySave = update(changeIcon, { [overlayId]: { isOverlaySave: { $set: false } } })
      this.setState({ overlayObject: setIsOverlaySave, shouldSave: true })
    }
    this.setState({ icon: icon })
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
  handleDetailEdit = (name, detail) => {
    const { selectedOverlay, overlayObject } = this.state
    const overlayId = selectedOverlay.overlayId
    const editIndex = overlayObject.findIndex(overlay => overlay.overlayId === overlayId)
    const updateOverlay = update(overlayObject, {
      [editIndex]: {
        overlayName: { $set: name },
        overlayDetail: { $set: detail },
        isOverlaySave: { $set: false }
      }
    })
    selectedOverlay.setOptions({
      overlayName: name,
      overlayDetail: detail,
    })
    this.setState({ overlayObject: updateOverlay })
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
      this.onDeleteAllOverlay(planId)
      this.onDeleleteAllTask('planId', planId)
    }
    this.setState((state) => {
      const setClickable = update(state.planData, { [actionIndex]: { isPlanClickable: { $set: false } } })
      const setOptionsClickable = update(setClickable, { [actionIndex]: { isPlanOptionsClickable: { $set: false } } })
      return { planData: setOptionsClickable }
    })
  }
  onDeleteOverlay = (overlay) => {
    const { overlayObject, distanceDetail } = this.state
    const overlayId = overlay.overlayId
    const overlaySource = overlay.overlaySource
    const deleteIndex = overlayObject.findIndex(data => data.overlayId === overlayId)
    const deleteObject = update(overlayObject, { $splice: [[deleteIndex, 1]] })
    if (overlaySource === 'server') {
      //delete selected overlay from firestore
      overlayRef.doc(overlayId).delete().then(function () {
        console.log("Document successfully deleted!");
      }).catch(function (error) {
        console.error("Error removing document: ", error);
      });

    }
    this.onDeleleteAllTask('overlayId', overlayId)
    if (overlay.overlayType !== 'marker') {
      const detailIndex = distanceDetail.findIndex(detail => detail.overlayId === overlayId)
      const deleteDetail = update(distanceDetail, { $splice: [[detailIndex, 1]] })
      this.setState({ distanceDetail: deleteDetail, })
    }
    this.onResetSelectedOverlay()
    this.setState({ overlayObject: deleteObject, drawerPage: 'homePage' })
  }
  onDeleteAllOverlay = (planId) => {
    overlayRef.where('planId', '==', planId).get().then(function (querySnapshot) {
      var deleteAmount = querySnapshot.docs.length
      if (deleteAmount > 0) {
        // self.setState({
        //   isDeleting: true,
        //   deleteAmount,
        //   loadingProgress: 0,
        //   finishedDeleteAmount: 0,
        // })
      }
      querySnapshot.forEach(function (doc) {
        doc.ref.delete()
          .then(function () {
            // self.setState((state) => {
            //   return {
            //     loadingProgress: ((state.finishedDeleteAmount + 1) / self.state.deleteAmount) * 100,
            //     finishedDeleteAmount: (state.finishedDeleteAmount + 1),
            //   };
            // }, () => {
            //   if (self.state.finishedDeleteAmount === self.state.deleteAmount) {
            //     self.setState({
            //       isDeleting: false,
            //       loadingProgress: null,
            //       planData: updatePlan
            //     })
            //   }
            // });
          })
          .catch(function (error) {
            throw ("Error removing document: ", error);
          });
      })

    })
  }
  onDeleleteAllTask = (fieldProp, id) => {
    const { overlayTasks } = this.state
    const filterTask = overlayTasks.filter(task => task[fieldProp] !== id)
    taskRef.where(fieldProp, '==', id).get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        doc.ref.delete()
          .then(function () {
            console.log('delete complete')
          })
          .catch(function (error) {
            throw ('erorr', error)
          })
      })
    })
    this.setState({ overlayTasks: filterTask }, () => {
      console.log(this.state.overlayTasks)
    })
  }
  onDeleteTask = (task) => {
    const { overlayTasks } = this.state
    const taskId = task.taskId
    const taskSource = task.taskSource
    const deleteIndex = overlayTasks.findIndex(task => task.taskId === taskId)
    const deleteTask = update(overlayTasks, { $splice: [[deleteIndex, 1]] })
    if (taskSource === 'server') {
      taskRef.doc(taskId).delete().then(function () {
        console.log("Document successfully deleted!");
      }).catch(function (error) {
        console.error("Error removing document: ", error);
      });
    }
    this.onUpdateOverlayTasks(deleteTask)
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
    const { planData } = this.state
    const planName = plan.planName
    const planId = plan.planId
    const planDescription = plan.planDescription
    const editIndex = planData.findIndex(data => data.planId === planId)
    const updatePlan = update(planData, {
      [editIndex]: {
        planName: {
          $set: planName
        },
        planDescription: {
          $set: planDescription
        }
      }
    })
    this.setState({ planData: updatePlan })
    //update edited name and description on firestore
    planRef.doc(planId).update({
      planName,
      planDescription,
    })
      .then(function () {
        console.log("Document successfully updated!");
      })
      .catch(function (error) {
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
    } else {
      return;
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
    } else {
      return;
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
    // this.onResetSelectedOverlay()
    // this.onResetSelectedPlan() 
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
      return { distanceDetail: temp2, isDistanceMarkerVisible: !state.isDistanceMarkerVisible };
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
          console.log("mai meee");
          planMemberRef.add(data)
            .then(function (doc) {
              console.log('added!')
            }).
            catch(function (error) {
              throw ('whoops!', error)
            })
        } else {
          alert('ผู้ใช้งานนี้เป็นสมาชิกของแปลงนี้อยู่แล้ว')
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
  }
  onAddRealTimeUpdateListener = () => {
    var self = this
    overlayRef.where("planId", "==", this.state.selectedPlan.planId)
      .onSnapshot(function (snapshot) {
        snapshot.docChanges().forEach(function (change) {
          const { editorId, overlayCoords } = change.doc.data()
          const overlayId = change.doc.id
          const actionIndex = self.state.overlayObject.findIndex(overlay => overlay.overlayId === overlayId)
          const data = {
            overlaySource: 'server',
            undoCoords: [overlayCoords],
            redoCoords: [],
            isOverlaySave: true,
            overlayId,
            ...change.doc.data(),
          }
          if (change.type === "added") {
            if (self.state.isFirstQuery) {
              self.setState({ isFirstQuery: false })
            } else {
              if (editorId !== self.state.user.uid) {
                const pushOverlay = update(self.state.overlayObject, { $push: [data] })
                self.setState({ overlayObject: pushOverlay })
              }
            }
          }
          if (change.type === "modified") {
            if (editorId !== self.state.user.uid) {
              const pushOverlay = update(self.state.overlayObject, { [actionIndex]: { $set: data } })
              self.setState({ overlayObject: pushOverlay })
            }
          }
          if (change.type === "removed") {
            if (editorId !== self.state.user.uid) {
              const pushOverlay = update(self.state.overlayObject, { $splice: [[actionIndex, 1]] })
              self.setState({ overlayObject: pushOverlay })
            }
          }
        });
      }, function (error) {
        throw ('whoops!', error)
      });
  }
  onRemoveRealTimeUpdateListener = () => {
    this.setState({ isFirstQuery: true })
    var unsubscribe = overlayRef
      .onSnapshot(function () { });
    // ...
    // Stop listening to changes
    unsubscribe();

  }
  render() {
    return (

      <div className="AppFrame">
        <PermanentDrawer
          onSaveToFirestore={this.onSaveToFirestore}
          onSetSelectedPlan={this.onSetSelectedPlan}
          onSetUser={this.onSetUser}
          onQueryPlanFromFirestore={this.onQueryPlanFromFirestore}
          onChangePolyStrokeColor={this.onChangePolyStrokeColor}
          onChangePolyFillColor={this.onChangePolyFillColor}
          onSetSelectedIcon={this.onSetSelectedIcon}
          handleDetailEdit={this.handleDetailEdit}
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
          {...this.state}
        />

        <input id="pac-input" className="controls" type="text" placeholder="Find place" />

        <Map
          left={this.state.left}
        >

          {this.state.overlayObject.map((value, index) => {
            const overlayType = value.overlayType
            const overlayId = value.overlayId
            switch (overlayType) {
              case 'polygon':
                return (
                  <Polygon
                    key={overlayId}
                    zIndex={index}
                    {...value}
                    addPolygonListener={this.addPolygonListener}
                    isFirstDraw={this.state.isFirstDraw}

                  />
                )
              case 'polyline':
                return (
                  <Polyline
                    key={overlayId}
                    zIndex={index}
                    {...value}
                    isFirstDraw={this.state.isFirstDraw}
                    addPolylineListener={this.addPolylineListener}

                  />
                )
              case 'marker':
                return (
                  <Marker
                    key={overlayId}
                    {...value}
                    zIndex={index}
                    isFirstDraw={this.state.isFirstDraw}
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

            <AddPlanBtn
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

          </div>

          <div className="FrameRight">

            <OpenSettingMap

            />

          </div>



          <SearchBox

          />

          <DetailedExpansionPanel
            {...this.state}
          />


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

export default App;