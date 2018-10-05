import React, { } from 'react';

// Material-ui Import
import MyLocation from '@material-ui/icons/MyLocation';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

// CSS Import
import './Geolocation.css';

/*const styles = theme => ({
    LOL: {
        position: 'absolute',
        top: theme.spacing.unit * 21,
        left: theme.spacing.unit * 1.5,
        color: 'rgba(0, 0, 0, 0.8)',
        background: 'linear-gradient(20deg, rgba(255, 255, 255, 0.9) 40%, rgba(255, 255, 255, 0.9)) 30%',
        boxShadow: '0px 0px 0px 3px rgba(255, 255, 255, 0.60)',
    },
})*/

class GeolocatedMe extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isGeoClick: false,
        }
        this.userLocationMarker = false
    }
    onTogleGeoClick = () => {
        this.setState({ isGeoClick: !this.state.isGeoClick })
    }
    onGetGeolocation = () => {
        var self = this
        if (!this.state.isGeoClick) {
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
                            var panelName = `ตำแหน่งของท่านคือ : ${addDress}, ความคาดเคลื่อน : ${accuracy} เมตร`
                            self.props.onSetPanelName(panelName)
                        } else {
                            alert('เกิดข้อผิดพลาดในการหาข้อมูลตำแหน่งสถานที่ของท่าน', status)
                        }
                    }
                })

                self.onTogleGeoClick()
            })
        } else {
            if (self.userLocationMarker !== false) {
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

        const { classes } = this.props;
        return (
            <div>
                <Tooltip
                    title="Your Location"
                    placement="right"
                    disableFocusListener
                    disableTouchListener
                >

                    <Button variant="fab" className="LOL" onClick={this.onGetGeolocation} >

                        <MyLocation />

                    </Button>

                </Tooltip>
            </div>
        )
    }
}
export default (GeolocatedMe)