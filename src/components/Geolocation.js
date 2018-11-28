import React, { } from 'react';
import PropTypes from 'prop-types';

// Material-ui Import
import MyLocation from '@material-ui/icons/MyLocation';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';

// CSS Import
import './Geolocation.css';

class GeolocatedMe extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isGeoClick: false,
            isWaitingForGeo: false,
        }
        this.userLocationMarker = false
    }
    onTogleGeoClick = () => {
        this.setState({ isGeoClick: !this.state.isGeoClick })
    }
    onGetGeolocation = () => {
        var self = this
        if (!this.state.isGeoClick) {
            this.setState({ isWaitingForGeo: true, }, () => {
                navigator.geolocation.getCurrentPosition(position => {
                    var accuracy = position.coords.accuracy
                    var positions = { lat: position.coords.latitude, lng: position.coords.longitude }
                    window.map.setCenter(positions)
                    window.map.setZoom(18)
                    window.map.panTo(positions)
                    var geocoder = new window.google.maps.Geocoder();
                    geocoder.geocode({ 'location': positions }, function (results, status) {
                        if (status === 'OK') {
                            if (results[0]) {
                                var addDress = results[0].formatted_address
                                self.userLocationMarker = new window.google.maps.Marker({
                                    position: positions,
                                    map: window.map,
                                    animation: window.google.maps.Animation.BOUNCE,
                                    title: addDress,
                                })
                                self.addUserMarkerListener(self.userLocationMarker)
                                var panelName = `ตำแหน่งของท่านคือ : ${addDress}, ความคลาดเคลื่อน : ${accuracy} เมตร`
                                self.props.onSetPanelName(panelName)
                                self.setState({ isWaitingForGeo: false, })
                            } else {
                                alert('เกิดข้อผิดพลาดในการหาข้อมูลตำแหน่งสถานที่ของท่าน', status)
                            }
                        }
                    })
                    self.onTogleGeoClick()
                })
            })
        } else {
            if (self.userLocationMarker) {
                self.userLocationMarker.setMap(null)
            }
            self.onTogleGeoClick()
            self.props.onSetPanelName('')

        }
    }
    addUserMarkerListener = (marker) => {
        var self = this
        window.google.maps.event.addListener(marker, 'click', function () {
            marker.setMap(null)
            self.onTogleGeoClick()
            self.props.onSetPanelName('')
        })
    }

    render() {
        return (
            <div>

                <Button
                    variant="contained"
                    className="LOL"
                    onClick={this.onGetGeolocation}
                    disabled={this.state.isWaitingForGeo}
                >
                    {this.state.isWaitingForGeo
                        ?
                        <CircularProgress
                        />
                        :
                        <MyLocation />
                    }
                </Button>

            </div>
        )
    }
}

export default GeolocatedMe;