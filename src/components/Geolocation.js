import React, { Component } from 'react';
import MyLocation from '@material-ui/icons/MyLocation';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

const styles = theme => ({
    LOL: {
        position: 'absolute',
        top : theme.spacing.unit * 21,
        left: theme.spacing.unit * 1.5,
        color: 'rgb(255, 255, 255)',
        background: 'linear-gradient(20deg, rgba(37, 37, 37, 0.85) 40%, rgba(0, 43, 161, 0.9)) 60%',
        boxShadow: '0px 0px 0px 5px rgba(255, 255, 255, 0.60)',
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

                    <Button variant="fab" className={classes.LOL} onClick={this.onGetGeolocation} >

                        <MyLocation />

                    </Button>
                    
                </Tooltip>
            </div>
        )
    }
}
export default withStyles(styles)(GeolocatedMe)