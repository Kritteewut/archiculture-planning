import React, { Component } from 'react';
import MyLocation from '@material-ui/icons/MyLocation';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

const styles = theme => ({
    LOL: {
        position: 'absolute',
        bottom: theme.spacing.unit * 5,
        left: theme.spacing.unit,
        color: 'white',
        background: 'linear-gradient(45deg, blue 30%, blue 90%)',

    },
})

class GeolocatedMe extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { isGeoClick: false }
        this.userLocationMarker = false
    }
    onGetGeolocation = () => {
        var self = this
        if (this.state.isGeoClick) { this.setState({ isGeoCLick: true }) }
        !(this.state.isGeoClick) ?
            navigator.geolocation.getCurrentPosition(position => {
                var positions = { lat: position.coords.latitude, lng: position.coords.longitude }
                window.map.setCenter(positions)
                window.map.setZoom(18)
                window.map.panTo(positions)
                if (self.userLocationMarker !== false) {
                    self.userLocationMarker.setMap(null)
                }
                var geocoder = new window.google.maps.Geocoder();
                geocoder.geocode({ 'location': positions }, function (results, status) {
                    if (status === 'OK') {
                        if (results[0]) {
                            self.userLocationMarker = new window.google.maps.Marker({
                                position: positions,
                                map: window.map,
                                animation: window.google.maps.Animation.BOUNCE,
                                title: results[0].formatted_address,
                            })
                            self.addUserMarkerListener(self.userLocationMarker)
                        }
                    }
                })
                self.setState({ isGeoClick: false })
            })
            :
            null
    }
    addUserMarkerListener = (marker) => {
        var self = this
        window.google.maps.event.addListener(marker, 'click', function () {
            marker.setMap(null)
        })
    }

    render() {

        const { classes } = this.props;
        return (
            <div>
                <Tooltip title="Your Location" placement="right">
                    <IconButton className={classes.LOL} onClick={this.onGetGeolocation} >
                        <MyLocation />
                    </IconButton>
                </Tooltip>
            </div>
        )
    }
}
export default withStyles(styles)(GeolocatedMe)