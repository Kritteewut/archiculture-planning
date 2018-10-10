import React, { Component } from 'react';
import update from 'immutability-helper';
import shortid from 'shortid'
import { auth } from './config/firebase'
import { db, serverTimestamp } from './config/firebase'

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
import LinearLoadingProgress from './components/LinearLoadingProgress';
import DetailedExpansionPanel from './components/DetailedExpansionPanel';
import MapCenterFire from './components/MapCenterFire'
import ToggleDevice from './components/ToggleDevice'

// CSS Import
import './App.css'
import './components/SearchBoxStyles.css'

// Logo Import
import icon_point from './components/icons/icon_point.png';

const shapesRef = db.collection('shapes')
const planRef = db.collection('plan')
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
      status: 'start',
      drawingBtnType: null,
      overlayObject: [],
      selectedOverlay: null,
      isFirstDraw: true,
      exampleLineCoords: [],
      userLocationCoords: [],
      planData: [],
      selectedPlan: null,
      fillColor: '#ffa500',
      strokeColor: '#ff4500',
      user: null,
      openSide: true,
      openOption: false,
      left: '350px',
      isOverlayOptionsOpen: false,
      overlayOptionsType: '',
      icon: icon_point,
      panelName: 'จับ',
      latLngDetail: '',
      lengthDetail: '',
      disBtwDetail: '',
      areaDetail: '',
      distanceDetail: [],
      drawerPage: 'homePage',
      isSaving: false,
      isDeleting: false,
      isDrawInDesktopDevice: true,
      shouldSave: false,
      isDistanceMarkerVisible: true,
      isWaitingForUserResult: true,
      isWaitingForPlanQuery: true,
      loadingProgress: null,
      saveAmount: 0,
      finishedSaveAmount: 0,
      deleteAmount: 0,
      finishedDeleteAmount: 0,
    }
  }
  componentWillMount() {
    var self = this
    auth.onAuthStateChanged((user) => {
      if (user) { self.setState({ user }, () => self.onQueryPlanFromFirestore()) }
      this.setState({ isWaitingForUserResult: false })
    })


  }
  componentDidMount() {
    this.onAddBeforeUnloadListener()
  }
  componentWillUnmount() {
  }
  onAddBeforeUnloadListener() {
    var self = this
    window.addEventListener("beforeunload", function (event) {
      // Cancel the event as stated by the standard.
      event.preventDefault();
      // Chrome requires returnValue to be set.
      event.returnValue = 'เซฟก่อนไหมพ่อหนุ่ม'
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
    const { isFirstDraw, overlayObject, distanceDetail } = this.state
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
        })

      }
      this.setState({ isFirstDraw: true }, () => console.log(this.state.overlayObject, 'overlayOb'))

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
    let pushObject = update(overlayObject, {
      $push: [{
        overlayCoords: [clickLatLng],
        overlayIndex: shortid.generate(),
        overlayType: 'polygon',
        overlayDrawType: 'draw',
        fillColor: fillColor,
        strokeColor: strokeColor,
        overlayName: 'Polygon',
        overlayDetail: '-',
        undoCoords: [[clickLatLng]],
        redoCoords: [],
        isOverlaySave: false,
      }]
    })
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
    let pushObject = update(overlayObject, {
      $push: [{
        overlayCoords: [clickLatLng],
        overlayIndex: shortid.generate(),
        overlayType: 'polyline',
        overlayDrawType: 'draw',
        fillColor: fillColor,
        strokeColor: strokeColor,
        overlayName: 'Polyline',
        overlayDetail: '-',
        undoCoords: [[clickLatLng]],
        redoCoords: [],
        isOverlaySave: false,
      }]
    })
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
    var coordsPush = update(overlayObject, {
      $push: [{
        overlayCoords: [clickLatLng],
        overlayIndex: shortid.generate(),
        overlayType: 'marker',
        overlayDrawType: 'draw',
        icon: icon,
        overlayName: 'Marker',
        overlayDetail: '-',
        undoCoords: [[clickLatLng]],
        redoCoords: [],
        isOverlaySave: false,
      }]
    })
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
  onSetSelectOverlay = (overlay) => {
    this.onResetSelectedOverlay()
    if (overlay.overlayType === 'polygon' || overlay.overlayType === 'polyline') {
      overlay.setOptions({ editable: true, })
      this.setState({ selectedOverlay: overlay, })
    }
    if (overlay.overlayType === 'marker') {
      overlay.setOptions({ draggable: true, animation: window.google.maps.Animation.BOUNCE })
      this.setState({ selectedOverlay: overlay, })
    }
  }
  onResetSelectedOverlay = () => {
    this.onResetDetail()
    const { selectedOverlay } = this.state
    if (selectedOverlay) {
      if (selectedOverlay.overlayType === 'polygon' || selectedOverlay.overlayType === 'polyline') {
        selectedOverlay.setOptions({ editable: false, })
        this.setState({ selectedOverlay: null })
      }
      if (selectedOverlay.overlayType === 'marker') {
        //
        selectedOverlay.setOptions({ draggable: false, animation: null })
        this.setState({ selectedOverlay: null })
      }
    }
  }
  addMarkerListener = (marker) => {
    var self = this
    window.google.maps.event.addListener(marker, 'mousedown', function () {
      self.handleDrawerOpen()
      self.onSetMarkerOptions()
      self.onSetSelectOverlay(marker)
    })
    window.google.maps.event.addListener(marker, 'dragend', function () {
      const overlayObject = self.state.overlayObject
      const markerIndex = marker.overlayIndex
      const overlayIndex = overlayObject.findIndex(overlay => overlay.overlayIndex === markerIndex)
      const editCoords = [{ lat: marker.getPosition().lat(), lng: marker.getPosition().lng() }]
      const replaceCoords = update(overlayObject, { [overlayIndex]: { overlayCoords: { $set: editCoords } } })
      const pushUndoCoords = update(replaceCoords, { [overlayIndex]: { undoCoords: { $push: [editCoords] } } })
      const setRedoCoords = update(pushUndoCoords, { [overlayIndex]: { redoCoords: { $set: [] } } })
      const setIsOverlaySave = update(setRedoCoords, { [overlayIndex]: { isOverlaySave: { $set: false } } })
      self.setState({ overlayObject: setIsOverlaySave })
    })
  }
  addPolygonListener = (polygon) => {
    var self = this
    window.google.maps.event.addListener(polygon, 'click', function () {
      self.handleDrawerOpen()
      self.onSetPolyOptions()
      self.onSetSelectOverlay(polygon)
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
      self.onSetSelectOverlay(polyline)
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
        self.setState({
          exampleLineCoords: [clickEvent, mousemoveLatLng],
          disBtwDetail: window.google.maps.geometry.spherical.computeDistanceBetween(clickEvent, mousemoveLatLng).toFixed(3),
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
    let polyIndex = polygon.overlayIndex
    let overlayIndex = overlayObject.findIndex(overlay => overlay.overlayIndex === polyIndex)
    let editCoords = []
    polygon.getPath().getArray().forEach(element => {
      let lat = element.lat()
      let lng = element.lng()
      editCoords.push({ lat, lng })
    })
    const replaceCoords = update(this.state.overlayObject, { [overlayIndex]: { overlayCoords: { $set: editCoords } } })
    const pushRedoCoords = update(replaceCoords, { [overlayIndex]: { undoCoords: { $push: [editCoords] } } })
    const setRedoCoords = update(pushRedoCoords, { [overlayIndex]: { redoCoords: { $set: [] } } })
    const setIsOverlaySave = (update(setRedoCoords, { [overlayIndex]: { isOverlaySave: { $set: false } } }))
    this.onPolydistanceBtwCompute(replaceCoords[overlayIndex])
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
    const overlayIndex = overlayObject.overlayIndex
    let replaceDetail = []
    var detailIndex = distanceDetail.findIndex(detail => detail.overlayIndex === overlayIndex)
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
      editedDetail = update(distanceDetail, { $push: [{ detail: replaceDetail, overlayIndex: overlayIndex }] })
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
    var overlayIndex = overlayObject[overlayObject.length - 1].overlayIndex
    if (isFirstDraw === true) {
      const pushDetial = update(distanceDetail, { $push: [{ detail: [], overlayIndex: overlayIndex }] })
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
  onSaveToFirestore = () => {

    const { selectedPlan, } = this.state
    var self = this
    var planId = selectedPlan.planId
    const shouldSaveOverlay = self.state.overlayObject.filter(overlay => overlay.isOverlaySave === false)
    var saveAmount = shouldSaveOverlay.length
    if (saveAmount > 0) {
      this.setState({ isSaving: true, loadingProgress: 0, saveAmount, finishedSaveAmount: 0 })

      shouldSaveOverlay.forEach((value) => {
        const overlayCoords = value.overlayCoords
        const overlayType = value.overlayType
        const overlayName = value.overlayName
        const overlayDetail = value.overlayDetail
        const fillColor = value.fillColor
        const strokeColor = value.strokeColor
        const icon = value.icon
        const overlayDrawType = value.overlayDrawType
        const overlayIndex = value.overlayIndex

        var overlay
        if ((overlayType === 'polygon') && (overlayCoords.length > 3)) {
          overlay = {
            overlayCoords,
            overlayType,
            planId,
            overlayName,
            overlayDetail,
            fillColor,
            strokeColor,
          }
        }
        if ((overlayType === 'polyline') && (overlayCoords.length > 2)) {
          overlay = {
            overlayCoords,
            overlayType,
            planId,
            overlayName,
            overlayDetail,
            strokeColor,
          }
        }
        if (overlayType === 'marker') {
          overlay = {
            overlayCoords,
            overlayType,
            planId,
            overlayName,
            overlayDetail,
            icon,
          }
        }
        if (overlay) {
          if (overlayDrawType === 'draw') {
            shapesRef
              .add(overlay)
              .then(function (doc) {
                self.setState((state) => {
                  const updateOverlayIndex = state.overlayObject.findIndex(overlay => overlay.overlayIndex === overlayIndex)
                  const editOverlayIndex = update(state.overlayObject, { [updateOverlayIndex]: { overlayIndex: { $set: doc.id } } })
                  const editIsOverlaySave = update(editOverlayIndex, { [updateOverlayIndex]: { isOverlaySave: { $set: true } } })
                  const editOverlayDrawType = update(editIsOverlaySave, { [updateOverlayIndex]: { overlayDrawType: { $set: 'redraw' } } })
                  return {
                    overlayObject: editOverlayDrawType,
                    loadingProgress: ((state.finishedSaveAmount + 1) / state.saveAmount) * 100,
                    finishedSaveAmount: (state.finishedSaveAmount + 1),
                  };
                }, () => {
                  console.log('finsh', self.state.finishedSaveAmount, '\n', 'save amount', self.state.saveAmount, '\n', 'load fisg', self.state.loadingProgress)
                  if (self.state.finishedSaveAmount === self.state.saveAmount) {
                    self.setState({ isSaving: false, loadingProgress: null, shouldSave: false })
                  }
                });
                if (overlayType === 'polygon' || overlayType === 'polyline') {
                  self.setState((state) => {
                    const detailIndex = state.distanceDetail.findIndex(detail => detail.overlayIndex === overlayIndex)
                    const updateDetailIndex = update(state.distanceDetail, { [detailIndex]: { overlayIndex: { $set: doc.id } } })
                    return { distanceDetail: updateDetailIndex }
                  })
                }
              })
              .catch(function (error) {
                throw ('there is something went wrong', error)
              })
          } else {
            shapesRef.doc(overlayIndex).set(overlay
              , { merge: true }).then(function () {
                self.setState((state) => {
                  const updateOverlayIndex = state.overlayObject.findIndex(overlay => overlay.overlayIndex === overlayIndex)
                  const editIsOverlaySave = update(state.overlayObject, { [updateOverlayIndex]: { isOverlaySave: { $set: true } } })
                  return {
                    overlayObject: editIsOverlaySave,
                    loadingProgress: ((state.finishedSaveAmount + 1) / state.saveAmount) * 100,
                    finishedSaveAmount: (state.finishedSaveAmount + 1)
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
    this.setState({ overlayObject: [], distanceDetail: [] })
  }
  onOverlayRedraw = () => {
    const { selectedPlan } = this.state
    let self = this
    const planId = selectedPlan.planId

    shapesRef.where('planId', '==', planId).get().then(function (querySnapshot) {
      let overlayObject = []
      querySnapshot.forEach(function (doc) {
        let overlayCoords = doc.data().overlayCoords
        let overlayIndex = doc.id
        let overlayType = doc.data().overlayType
        let overlayName = doc.data().overlayName
        let overlayDetail = doc.data().overlayDetail
        let fillColor = doc.data().fillColor
        let strokeColor = doc.data().strokeColor
        let icon = doc.data().icon
        switch (overlayType) {
          case 'polygon':
            return (
              overlayObject.push({
                overlayCoords,
                overlayIndex,
                overlayType,
                overlayDrawType: 'redraw',
                planId,
                fillColor,
                strokeColor,
                overlayName,
                overlayDetail,
                undoCoords: [overlayCoords],
                redoCoords: [],
                isOverlaySave: true,
              })
            )
          case 'polyline':
            return (
              overlayObject.push({
                overlayCoords,
                overlayIndex,
                overlayType,
                overlayDrawType: 'redraw',
                planId,
                strokeColor,
                overlayName,
                overlayDetail,
                undoCoords: [overlayCoords],
                redoCoords: [],
                isOverlaySave: true,
              })
            )
          case 'marker':
            return (
              overlayObject.push({
                overlayCoords,
                overlayIndex,
                overlayType,
                overlayDrawType: 'redraw',
                planId,
                icon,
                overlayName,
                overlayDetail,
                undoCoords: [overlayCoords],
                redoCoords: [],
                isOverlaySave: true,
              })
            )
          default: return null
        }
      })
      if (overlayObject.length > 0) {
        overlayObject.map(value => {
          if (value.overlayType !== 'marker') {
            self.onPolydistanceBtwCompute(value)
          }
          return null;
        })
        const pushObject = update(self.state.overlayObject, { $push: overlayObject })
        self.setState({ overlayObject: pushObject, }, () => console.log(overlayObject))
        self.onFitBounds(self.state.overlayObject)
      }
    })
  }
  onQueryPlanFromFirestore = () => {
    // get all plan list from frirestore filter by user ID
    if (this.state.user) {
      if (!this.state.isWaitingForPlanQuery) {
        this.setState({ isWaitingForPlanQuery: true })
      }
      let unSortplanData = []
      var uid = this.state.user.uid
      var self = this
      planRef.where('uid', '==', uid).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          const createPlanDate = doc.data().createPlanDate.toDate()
          const planId = doc.id
          const planName = doc.data().planName
          const planDescription = doc.data().planDescription
          unSortplanData.push({
            planId,
            planName,
            planDescription,
            createPlanDate,
            isPlanClickable: true,
            isPlanOptionsClickable: true
          })
        })
        self.onSortArrayByCreateDate(unSortplanData)
        self.setState({ isWaitingForPlanQuery: false, })
      })
    }
  }
  onSortArrayByCreateDate = (dataArray) => {
    console.log('before sort', dataArray)
    const sortedByCreateDate = dataArray.sort(function (a, b) {
      return b.createPlanDate - a.createPlanDate
    })
    this.setState({
      planData: sortedByCreateDate
    })
  }
  onAddPlan = (plan) => {
    const { planData, user } = this.state
    const planName = plan.planName
    const planDescription = plan.planDescription
    const self = this
    const uid = user.uid
    planRef.add({ planName, planDescription, uid, createPlanDate: serverTimestamp })
      .then(function (docRef) {
        const planId = docRef.id
        //const createPlanDate = docRef.data().createPlanDate
        docRef.get().then(function (doc) {
          const createPlanDate = doc.data().createPlanDate.toDate()
          const pushPlan = update(planData, {
            $push: [{
              planId,
              planName,
              planDescription,
              createPlanDate,
              isPlanClickable: true,
              isPlanOptionsClickable: true,
            }]
          })
          self.onSortArrayByCreateDate(pushPlan)
        })
      })
  }
  onSetSelectedPlan = (planData) => {
    this.onResetSelectedPlan()
    const planId = planData.planId
    const actionIndex = this.state.planData.findIndex(plan => plan.planId === planId)
    this.setState((state) => {
      const updatePlanClickable = update(state.planData, { [actionIndex]: { isPlanClickable: { $set: false } } })
      return {
        selectedPlan: planData,
        planData: updatePlanClickable,
      }
    }, () => {
      this.onOverlayRedraw()
    })
  }
  onResetSelectedPlan = () => {
    if (this.state.selectedPlan) {
      const planId = this.state.selectedPlan.planId
      const actionIndex = this.state.planData.findIndex(plan => plan.planId === planId)
      this.setState((state) => {
        const updatePlanClickable = update(state.planData, { [actionIndex]: { isPlanClickable: { $set: true } } })
        return { selectedPlan: null, planData: updatePlanClickable }
      })
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
      let polyIndex = selectedOverlay.overlayIndex
      let overlayIndex = overlayObject.findIndex(overlay => overlay.overlayIndex === polyIndex)
      const changeStrokeColor = update(overlayObject, { [overlayIndex]: { strokeColor: { $set: color } } })
      const setIsOverlaySave = update(changeStrokeColor, { [overlayIndex]: { isOverlaySave: { $set: false } } })
      this.setState({ overlayObject: setIsOverlaySave, shouldSave: true })
    }
    this.setState({ strokeColor: color })
  }
  onChangePolyFillColor = (color) => {
    var { selectedOverlay, overlayObject } = this.state
    if (selectedOverlay) {
      let polyIndex = selectedOverlay.overlayIndex
      let overlayIndex = overlayObject.findIndex(overlay => overlay.overlayIndex === polyIndex)
      var changeFillColor = update(overlayObject, { [overlayIndex]: { fillColor: { $set: color } } })
      const setIsOverlaySave = update(changeFillColor, { [overlayIndex]: { isOverlaySave: { $set: false } } })
      this.setState({ overlayObject: setIsOverlaySave, shouldSave: true })
    }
    this.setState({ fillColor: color })
  }
  onSetUser = (user) => {
    this.setState({ user: user, })
  }
  onSetUserNull = () => {
    this.setState({ user: null })
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
      let markerIndex = selectedOverlay.overlayIndex
      let overlayIndex = overlayObject.findIndex(overlay => overlay.overlayIndex === markerIndex)
      const changeIcon = update(overlayObject, { [overlayIndex]: { icon: { $set: icon } } })
      const setIsOverlaySave = update(changeIcon, { [overlayIndex]: { isOverlaySave: { $set: false } } })
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
    const overlayIndex = selectedOverlay.overlayIndex
    const editIndex = overlayObject.findIndex(overlay => overlay.overlayIndex === overlayIndex)
    var editedName = update(overlayObject, { [editIndex]: { overlayName: { $set: name } } })
    var editedDetail = update(editedName, { [editIndex]: { overlayDetail: { $set: detail } } })
    selectedOverlay.setOptions({
      overlayName: name,
      overlayDetail: detail,
    })
    this.setState({ overlayObject: editedDetail })
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
        console.log("Document successfully deleted!");
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
    //delete overlay with its planId from firestore
    shapesRef.where('planId', '==', planId).get().then(function (querySnapshot) {
      var deleteAmount = querySnapshot.docs.length
      if (deleteAmount > 0) {
        self.setState({
          isDeleting: true,
          deleteAmount,
          loadingProgress: 0,
          finishedDeleteAmount: 0,
        })
        querySnapshot.forEach(function (doc) {
          doc.ref.delete()
            .then(function () {
              self.setState((state) => {
                return {
                  loadingProgress: ((state.finishedDeleteAmount + 1) / self.state.deleteAmount) * 100,
                  finishedDeleteAmount: (state.finishedDeleteAmount + 1),
                };
              }, () => {
                if (self.state.finishedDeleteAmount === self.state.deleteAmount) {
                  self.setState({
                    isDeleting: false,
                    loadingProgress: null,
                    planData: updatePlan
                  })
                }
              });
            })
            .catch(function (error) {
              throw ("Error removing document: ", error);
            });
        })
      } else {
        self.setState({ planData: updatePlan })
      }
    })
    if (selectedPlan) {
      if (selectedPlan.planId === planId) {
        this.onClearOverlayFromMap()
        this.onResetSelectedPlan()
      }
    }
    this.setState((state) => {
      const setClickable = update(state.planData, { [actionIndex]: { isPlanClickable: { $set: false } } })
      const setOptionsClickable = update(setClickable, { [actionIndex]: { isPlanOptionsClickable: { $set: false } } })
      return { planData: setOptionsClickable }
    })
  }
  onDeleteOverlay = (overlay) => {
    const { overlayObject, distanceDetail } = this.state
    const overlayIndex = overlay.overlayIndex
    const deleteIndex = overlayObject.findIndex(data => data.overlayIndex === overlayIndex)
    const deleteObject = update(overlayObject, { $splice: [[deleteIndex, 1]] })
    if (overlayObject[deleteIndex].overlayDrawType === 'redraw') {
      //delete selected overlay from firestore
      shapesRef.doc(overlayIndex).delete().then(function () {
        console.log("Document successfully deleted!");
      }).catch(function (error) {
        console.error("Error removing document: ", error);
      });
    }
    if (overlay.overlayType !== 'marker') {
      const detailIndex = distanceDetail.findIndex(detail => detail.overlayIndex === overlayIndex)
      const deleteDetail = update(distanceDetail, { $splice: [[detailIndex, 1]] })
      this.setState({ distanceDetail: deleteDetail, })
    }
    this.onResetSelectedOverlay()
    this.setState({ overlayObject: deleteObject, drawerPage: 'homePage' })
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
    const updatePlan = update(planData, { [editIndex]: { planName: { $set: planName, planDescription } } })
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
      const overlayIndex = overlay.overlayIndex
      const overlayType = overlay.overlayType
      const actionIndex = overlayObject.findIndex(overlay => overlay.overlayIndex === overlayIndex)
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
      const overlayIndex = overlay.overlayIndex
      const overlayType = overlay.overlayType
      const actionIndex = overlayObject.findIndex(overlay => overlay.overlayIndex === overlayIndex)
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
    this.onResetSelectedOverlay()
    this.onResetSelectedPlan()
    this.onClearOverlayFromMap()
    this.setState({ planData: [] })
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
          //update visible depend on temp1, distanceDetail remain the same
          temp2 = update(temp1, { [index]: { detail: { [index2]: { visible: { $set: !isDistanceMarkerVisible } } } } })
          //swicth value for use in next round of loop
          temp1 = temp2
        }
      });
    });
    //muted state
    this.setState((state) => {
      return { distanceDetail: temp2, isDistanceMarkerVisible: !state.isDistanceMarkerVisible };
    });
  }

  render() {
    return (

      <div className="AppFrame">
        <LinearLoadingProgress
          loadingProgress={this.state.loadingProgress}
        />

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
          {...this.state}
        />

        <input id="pac-input" className="controls" type="text" placeholder="Find place" />

        <Map
          left={this.state.left}
        >

          {this.state.overlayObject.map((value, index) => {
            const overlayType = value.overlayType
            const overlayIndex = value.overlayIndex
            switch (overlayType) {
              case 'polygon':
                return (
                  <Polygon
                    key={overlayIndex}
                    zIndex={index}
                    {...value}
                    addPolygonListener={this.addPolygonListener}
                    isFirstDraw={this.state.isFirstDraw}

                  />
                )
              case 'polyline':
                return (
                  <Polyline
                    key={overlayIndex}
                    zIndex={index}
                    {...value}
                    isFirstDraw={this.state.isFirstDraw}
                    addPolylineListener={this.addPolylineListener}

                  />
                )
              case 'marker':
                return (
                  <Marker
                    key={overlayIndex}
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