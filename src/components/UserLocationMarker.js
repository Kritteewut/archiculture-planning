import React, { Component } from 'react';

class UserLocationMarker extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {}
        this.userLocationMarker = false
        this.redrawUserLocationMarker = this.redrawUserLocationMarker.bind(this)
        //this. = this..bind(this)
    }
    componentWillUnmount() {
        if (this.userLocationMarker !== false) {
            this.userLocationMarker.setMap(null)
        }
    }
    redrawUserLocationMarker() {
        var { userLocationCoords, address } = this.props
        if (this.userLocationMarker === false) {
            this.userLocationMarker = new window.google.maps.Marker({
                position: userLocationCoords,
                map: window.map,
                animation: window.google.maps.Animation.BOUNCE,
                title: address,
            })
            this.addUserMarkerListener(this.userLocationMarker)
        }
    }
    addUserMarkerListener(marker) {
        window.google.maps.event.addListener(marker, 'click', function () {
            marker.setMap(null)
        })
    }

    render() {
        this.redrawUserLocationMarker()
        return (null);
    }
}
export default UserLocationMarker;
