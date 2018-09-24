import React, { Component } from 'react';
import update from 'immutability-helper';
import Map from './components/Map'
import Marker from './components/Marker';
import Polygon from './components/Polygon';
import Polyline from './components/Polyline';
import SearchBox from './components/searchBox';
import ExampleLine from './components/ExampleLine';
import AddPlanBtn from './components/AddPlanBtn';
import GeolocatedMe from './components/Geolocation';
import IconLabelButtons from './components/DrawingBtn';
import PermanentDrawer from './components/PermanentDrawer'
import { db } from './config/firebase'
import OpenSide from './components/openSideBtn';
import OpenSettingMap from './components/OpenSettingMapBtn';
import icon_point from './components/icons/icon_point.png';
import DetailedExpansionPanel from './components/DetailedExpansionPanel'
import TransparentMaker from './components/TransparentMaker';
import shortid from 'shortid'
import { auth } from './config/firebase'
import LoadingCircle from './components/LoadingCircle';
import './components/SearchBoxStyles.css'
import { DISPLAY_STRING } from './language/Language'

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
      selectedColor: '',
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
      isLoading: null,
      isDrawInDestopDevice: true,
      shouldSave: false,
    }
  }
  componentWillMount() {
    var self = this
    auth.onAuthStateChanged((user) => {
      if (user) { self.setState({ user }, () => self.onQueryPlanFromFirestore()) }
    });
    this.onAddBeforeUnloadListener()

  }
  componentDidMount() {


  }
  componentWillUnmount() {
  }
  onAddBeforeUnloadListener() {
    window.addEventListener("beforeunload", function (event) {
      // Cancel the event as stated by the standard.
      event.preventDefault();
      // Chrome requires returnValue to be set.
      event.returnValue = '5555';
    });
  }
  onDrawingBtnTypeChange = (type) => {
    this.setState({ drawingBtnType: type, panelName: type })
  }
  onToggleDeviceMode = () => {
    this.setState({ isDrawInDestopDevice: !this.state.isDrawInDestopDevice })
  }
  onExampleLineReset = () => {
    this.setState({ exampleLineCoords: [] })
  }
  onClearSomeMapEventListener = () => {
    window.google.maps.event.clearListeners(window.map, 'click')
    window.google.maps.event.clearListeners(window.map, 'mousemove')
    window.google.maps.event.clearListeners(window.map, 'center_change')
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
    this.onExampleLineReset()
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
  onAddListenerMarkerBtn = () => {
    this.onUtilitiesMethod()
    this.onDrawingBtnTypeChange('marker')
    this.onSetDrawingUI()
    this.onSetMarkerOptions()
    this.drawMarker()
  }
  onAddListenerPolygonBtn = () => {
    this.onUtilitiesMethod()
    this.onDrawingBtnTypeChange('polygon')
    this.onSetDrawingUI()
    this.onSetPolyOptions()
    this.drawPolygon()

  }
  onAddListenerPolylineBtn = () => {
    this.onUtilitiesMethod()
    this.onDrawingBtnTypeChange('polyline')
    this.onSetDrawingUI()
    this.onSetPolyOptions()
    this.drawPolyline()
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
  onSetDrawingUI() {
    this.handleDrawerOpen()
    this.onClearSomeMapEventListener()
    this.addMouseMoveOnMap()
    this.onSetDrawingCursor()
  }
  drawMarker = () => {
    var self = this
    window.google.maps.event.addListener(window.map, 'click', function (event) {
      const { isFirstDraw, overlayObject, icon } = self.state
      const lat = event.latLng.lat()
      const lng = event.latLng.lng()
      const clickLatLng = { lat, lng }
      if (isFirstDraw === true) {
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
          }]
        })
      }
      self.setState({
        overlayObject: coordsPush,
        drawingBtnType: null,
        isFirstDraw: false,
        shouldSave: true,
      }, () => {
        self.onUtilitiesMethod()
      })
    })
  }
  drawPolyline = () => {
    var self = this
    window.google.maps.event.addListener(window.map, 'click', function (event) {
      const lat = event.latLng.lat()
      const lng = event.latLng.lng()
      const clickLatLng = { lat, lng }
      if (self.state.isFirstDraw === true) {
        const { fillColor, strokeColor } = self.state
        let pushObject = update(self.state.overlayObject, {
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
          }]
        })
        self.setState({
          drawingBtnType: null,
          overlayObject: pushObject,
          isFirstDraw: false,
          shouldSave: true,
        })
        self.onDrawExampleLine(event.latLng)
      } else {
        let actionIndex = self.state.overlayObject.length - 1
        let pushCoords = update(self.state.overlayObject, { [actionIndex]: { overlayCoords: { $push: [clickLatLng] } } })
        const currentOverlay = pushCoords[pushCoords.length - 1]
        const currentCoords = currentOverlay.overlayCoords
        const pushUndoCoords = update(pushCoords, { [actionIndex]: { undoCoords: { $push: [currentCoords] } } })
        const setRedoCoords = update(pushUndoCoords, { [actionIndex]: { redoCoords: { $set: [] } } })
        const polyline = new window.google.maps.Polyline({
          path: currentCoords,
          overlayType: 'polyline'
        })
        self.onPolyLengthCompute(polyline)
        self.onPolydistanceBtwCompute(setRedoCoords[actionIndex])
        self.setState({ overlayObject: setRedoCoords })
        self.onDrawExampleLine(event.latLng)
      }
    })
  }
  drawPolygon = () => {
    var self = this
    window.google.maps.event.addListener(window.map, 'click', function (event) {
      console.log(event.latLng)
      const lat = event.latLng.lat()
      const lng = event.latLng.lng()
      const clickLatLng = { lat, lng }
      const { fillColor, strokeColor, overlayObject, isFirstDraw } = self.state
      if (isFirstDraw) {
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
          }]
        })
        self.setState({
          drawingBtnType: null,
          overlayObject: pushObject,
          isFirstDraw: false,
          shouldSave: true,
        })
        self.onDrawExampleLine(event.latLng)
      } else {

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
        self.onPolydistanceBtwCompute(setRedoCoords[actionIndex])
        self.onPolyLengthCompute(poylgon)
        self.onSquereMetersTrans(poylgon)
        self.setState({ overlayObject: setRedoCoords })
        self.onDrawExampleLine(event.latLng)
      }
    })
  }
  drawOverlayUsing = () => {

  }
  onSetSelectOverlay = (overlay) => {
    this.onResetSelectedOverlay()
    if (overlay.overlayType === 'polygon' || overlay.overlayType === 'polyline') {
      overlay.setOptions({ editable: true, })
      this.setState({ selectedOverlay: overlay, })
    }
    if (overlay.overlayType === 'marker') {
      overlay.setOptions({ draggable: true, })
      this.setState({ selectedOverlay: overlay })
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
        selectedOverlay.setOptions({ draggable: false, })
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
      console.log(marker, 'poly')
    })
    window.google.maps.event.addListener(marker, 'dragend', function () {
      const overlayObject = self.state.overlayObject
      const markerIndex = marker.overlayIndex
      const overlayIndex = overlayObject.findIndex(overlay => overlay.overlayIndex === markerIndex)
      const editCoords = [{ lat: marker.getPosition().lat(), lng: marker.getPosition().lng() }]
      const replaceCoords = update(overlayObject, { [overlayIndex]: { overlayCoords: { $set: editCoords } } })
      const pushUndoCoords = update(replaceCoords, { [overlayIndex]: { undoCoords: { $push: [editCoords] } } })
      const setRedoCoords = update(pushUndoCoords, { [overlayIndex]: { redoCoords: { $set: [] } } })
      self.setState({ overlayObject: setRedoCoords }, () => console.log(self.state.overlayObject, 'edit'))
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
      console.log(polygon, 'poly')
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
    const { isDrawInDestopDevice } = this.state
    var self = this
    if (isDrawInDestopDevice) {
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
        let mousemoveLatLng = window.getCenter()
        self.setState({
          exampleLineCoords: [clickEvent, mousemoveLatLng],
          disBtwDetail: window.google.maps.geometry.spherical.computeDistanceBetween(clickEvent, mousemoveLatLng).toFixed(3),
        })
      })

    }

  }
  onPolyCoordsEdit = (polygon) => {
    let overlayObject = this.state.overlayObject
    let polyIndex = polygon.overlayIndex
    let overlayIndex = overlayObject.findIndex(overlay => overlay.overlayIndex === polyIndex)
    let editCoords = []
    polygon.getPath().getArray().forEach(element => {
      console.log(element)
      let lat = element.lat()
      let lng = element.lng()
      editCoords.push({ lat, lng })
    })
    const replaceCoords = update(this.state.overlayObject, { [overlayIndex]: { overlayCoords: { $set: editCoords } } })
    const pushRedoCoords = update(replaceCoords, { [overlayIndex]: { undoCoords: { $push: [editCoords] } } })
    const setRedoCoords = update(pushRedoCoords, { [overlayIndex]: { redoCoords: { $set: [] } } })
    this.onPolydistanceBtwCompute(setRedoCoords[overlayIndex])
    this.setState({ overlayObject: setRedoCoords })
  }
  onSetDrawingCursor = () => {
    window.map.setOptions({ draggableCursor: 'crosshair' })
  }
  onSetDragMapCursor = () => {
    window.map.setOptions({ draggableCursor: null, draggingCursor: null })
  }
  onPolydistanceBtwCompute = (overlayObject) => {
    const { distanceDetail } = this.state
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
        id: shortid.generate()
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
        id: shortid.generate()
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
    const { overlayObject, selectedPlan, distanceDetail } = this.state
    let self = this
    var planId = selectedPlan.planId
    overlayObject.map((value, key) => {
      let overlayCoords = value.overlayCoords
      let overlayType = value.overlayType
      let overlayName = value.overlayName
      let overlayDetail = value.overlayDetail
      let fillColor = value.fillColor
      let strokeColor = value.strokeColor
      let icon = value.icon
      if (value.overlayDrawType === 'draw') {
        if ((value.overlayType === 'polygon') && (overlayCoords.length > 3)) {
          shapesRef.add({
            overlayCoords,
            overlayType,
            planId,
            overlayName,
            overlayDetail,
            fillColor,
            strokeColor,
          }).then(function (doc) {
            const overlayIndex = value.overlayIndex
            const detailIndex = distanceDetail.findIndex(detail => detail.overlayIndex === overlayIndex)
            const updateDetailIndex = update(distanceDetail, { [detailIndex]: { overlayIndex: { $set: doc.id } } })
            const editOverlayIndex = update(overlayObject, { [key]: { overlayIndex: { $set: doc.id } } })
            self.setState({ overlayObject: editOverlayIndex, distanceDetail: updateDetailIndex })
          }).catch(function (error) {
            alert('there is some thing went wrong', error)
          })
        }
        if ((value.overlayType === 'polyline') && (overlayCoords.length > 2)) {
          shapesRef.add({
            overlayCoords,
            overlayType,
            planId,
            overlayName,
            overlayDetail,
            strokeColor,
          }).then(function (doc) {
            const overlayIndex = value.overlayIndex
            const detailIndex = distanceDetail.findIndex(detail => detail.overlayIndex === overlayIndex)
            const updateDetailIndex = update(distanceDetail, { [detailIndex]: { overlayIndex: { $set: doc.id } } })
            const editOverlayIndex = update(overlayObject, { [key]: { overlayIndex: { $set: doc.id } } })
            self.setState({ overlayObject: editOverlayIndex, distanceDetail: updateDetailIndex })
          }).catch(function (error) {
            alert('there is some thing went wrong', error)
          })
        }
        if (value.overlayType === 'marker') {
          shapesRef.add({
            overlayCoords,
            overlayType,
            planId,
            overlayName,
            overlayDetail,
            icon,
          }).then(function (doc) {
            var editOverlayIndex = update(overlayObject, { [key]: { overlayIndex: { $set: doc.id } } })
            self.setState({ overlayObject: editOverlayIndex })
          }).catch(function (error) {
            alert('there is some thing went wrong', error)
          })
        }
      } else {
        if (value.overlayType === 'polygon') {
          shapesRef.doc(value.overlayIndex).set({
            overlayCoords,
            overlayType,
            overlayName,
            overlayDetail,
            strokeColor,
            fillColor,
          }, { merge: true });
        }
        if (value.overlayType === 'polyline') {
          shapesRef.doc(value.overlayIndex).set({
            overlayCoords,
            overlayType,
            overlayName,
            overlayDetail,
            strokeColor,
          }, { merge: true });
        }
        if (value.overlayType === 'marker') {
          shapesRef.doc(value.overlayIndex).set({
            overlayCoords,
            overlayType,
            overlayName,
            overlayDetail,
            icon,
          }, { merge: true });
        }

      }
      return null;
    })
  }
  onClearOverlayFromMap = () => {
    this.setState({ overlayObject: [], distanceDetail: [] })
  }
  onOverlayRedraw = () => {
    const { selectedPlan, overlayObject } = this.state
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
      }
      self.onFitBounds(self.state.overlayObject)
    })
  }
  onQueryPlanFromFirestore = () => {
    // get all plan list from frirestore filter by user ID
    if (this.state.user) {
      let planData = []
      var uid = this.state.user.uid
      var self = this
      planRef.where('uid', '==', uid).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          planData.push({
            planName: doc.data().planName,
            planId: doc.id,
          })
        })
        self.setState({
          planData: planData,
          isLoading: 'none',
        })
      })
    }
  }
  onAddPlan = (planName) => {
    const { planData, user } = this.state
    const self = this
    const uid = user.uid
    planRef.add({ planName, uid })
      .then(function (docRef) {
        const planId = docRef.id
        const pushPlan = update(planData, { $push: [{ planName: planName, planId: planId }] })
        self.setState({ planData: pushPlan })
      })

  }
  onSetSelectedPlan = (planData) => {
    this.setState({
      selectedPlan: planData,
    }, () => this.onOverlayRedraw())
  }
  onResetSelectedPlan = () => {
    this.setState({ selectedPlan: null })
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
      var changeStrokeColor = update(overlayObject, { [overlayIndex]: { strokeColor: { $set: color } } })
      this.setState({ overlayObject: changeStrokeColor })
    }
    this.setState({ strokeColor: color })
  }
  onChangePolyFillColor = (color) => {
    var { selectedOverlay, overlayObject } = this.state
    if (selectedOverlay) {
      let polyIndex = selectedOverlay.overlayIndex
      let overlayIndex = overlayObject.findIndex(overlay => overlay.overlayIndex === polyIndex)
      var changeFillColor = update(overlayObject, { [overlayIndex]: { fillColor: { $set: color } } })
      this.setState({ overlayObject: changeFillColor })
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
      var changeIcon = update(overlayObject, { [overlayIndex]: { icon: { $set: icon } } })
      this.setState({ overlayObject: changeIcon })
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
    var editedDetail = update(overlayObject, { [editIndex]: { overlayName: { $set: name } } })
    editedDetail[editIndex].overlayDetail = detail
    selectedOverlay.setOptions({
      overlayName: name,
      overlayDetail: detail,
    })

    this.setState({ overlayObject: editedDetail })
  }
  onChangeDrawPage = (page) => {
    this.setState({ drawPage: page })
  }
  onDeletePlan = (planId) => {
    const { planData, selectedPlan } = this.state
    const deleteIndex = planData.findIndex(data => data.planId === planId)
    const updatePlan = update(planData, { $splice: [[deleteIndex, 1]] })
    //delete selected plan
    planRef.doc(planId).delete().then(function () {
      console.log("Document successfully deleted!");
    }).catch(function (error) {
      console.error("Error removing document: ", error);
    });
    //delete overlay with its planId 
    shapesRef.where('planId', '==', planId).get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        doc.ref.delete().then(function () {
          console.log("Document successfully deleted!");
        }).catch(function (error) {
          console.error("Error removing document: ", error);
        });
      })
    })
    if (selectedPlan) {
      this.onClearOverlayFromMap()
      this.onResetSelectedPlan()
    }
    this.setState({ planData: updatePlan })
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
  onEditPlanName = (plan, planName) => {
    const { planData } = this.state
    const planId = plan.planId
    const editIndex = planData.findIndex(data => data.planId === planId)
    const updatePlan = update(planData, { [editIndex]: { planName: { $set: planName } } })
    this.setState({ planData: updatePlan })
    //change edited name on firestore
    planRef.doc(planId).update({
      planName: planName
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

      if (overlayType !== 'marker') {
        if (isFirstDraw === false) {
          const lastCoords = beforeLastUndoCoords[beforeLastUndoCoords.length - 1]
          const lastCoordsLatLng = new window.google.maps.LatLng(lastCoords)
          const setExampleline = update(exampleLineCoords, { 0: { $set: lastCoords } })
          this.onDrawExampleLine(lastCoordsLatLng)
          this.setState({ exampleLineCoords: setExampleline })
        }
        this.onPolydistanceBtwCompute(popUndoCoords[actionIndex])
      }
      this.setState({ overlayObject: popUndoCoords }, () => console.log(this.state.overlayObject, 'undo'))
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
      if (overlayType !== 'marker') {
        if (isFirstDraw === false) {
          const lastCoords = lastRedoCoords[lastRedoCoords.length - 1]
          const lastCoordsLatLng = new window.google.maps.LatLng(lastCoords)
          const setExampleline = update(exampleLineCoords, { 0: { $set: lastCoords } })
          this.onDrawExampleLine(lastCoordsLatLng)
          this.setState({ exampleLineCoords: setExampleline })
        }
        this.onPolydistanceBtwCompute(popRedoCoords[actionIndex])
      }
      this.setState({ overlayObject: popRedoCoords }, () => console.log(this.state.overlayObject, 'redo'))
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
  }
  //this is rederrrrr
  render() {
    return (

      <div
        style={{
          height: '100%',
          width: '100%',
          overflow: 'hidden',
          //position: 'relative',
          display: 'flex',

        }}
      >

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

          <AddPlanBtn
            onAddPlan={this.onAddPlan}
            user={this.state.user}
            onChangeDrawPage={this.onChangeDrawPage}
            handleDrawerOpen={this.handleDrawerOpen}
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
            onSaveToFirestore={this.onSaveToFirestore}
            onToggleDeviceMode={this.onToggleDeviceMode}
            //drawingBtnType={this.state.drawingBtnType}
            {...this.state}
          />
          <DetailedExpansionPanel
            {...this.state}
          />
          <OpenSide
            handleDrawerOpen={this.handleDrawerOpen}
            handleDrawerClose={this.handleDrawerClose}
            openSide={this.state.openSide}
          />

          <OpenSettingMap

          />

          <SearchBox

          />

          <GeolocatedMe

          />

        </Map>
      </div>
    );
  }
}

export default App;