import React, { Component } from 'react';


class Map extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isLoad: false,
            zoom: 15,
            center: { lat: 13.7648, lng: 100.5381 },
        }
    }
    componentWillMount() {
        window.initMap = this.initMap
    }
    initMap = () => {
        var self = this
        window.map = new window.google.maps.Map(document.getElementById('map'), {
            center: this.state.center,
            zoom: this.state.zoom,
            clickableIcons: false,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            mapTypeId: 'satellite',
            tilt: 45,
        })
        this.setState({
            isLoad: true
        })
        // window.google.maps.event.addListener(window.map, 'click', function (event) {
        //     console.log('version is', window.google.maps.version)
        // })
    }

    render() {
        var childrenOutput = null;
        if (this.state.isLoad === true) {
            childrenOutput = this.props.children;
        }
        return (
            <div style={{
                position: 'absolute',
                top: 0,
                left: this.props.left,
                right: 0,
                bottom: this.props.bottom,
                justifyContent: 'flex-end',
                transition: '350ms cubic-bezier(0.23, 1, 0.32, 1)',
            }}
                className="Map" id="map" >
                {childrenOutput}
            </div>
        );
    }
}
export default Map;