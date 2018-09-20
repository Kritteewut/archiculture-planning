import React, { Component } from 'react';
import icon_point from './icons/icon_point.png';

class Marker extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {}
        this.marker = false
    }
    componentWillUnmount() {
        if (this.marker !== false) {
            this.marker.setMap(null)
        }
    }

    redrawMarker = () => {
        const { overlayCoords, overlayIndex, overlayDrawType, icon, overlayName, overlayDetail, overlayType,
            zIndex, undoCoords, redoCoords,
        } = this.props
        if (this.marker === false) {
            this.marker = new window.google.maps.Marker({
                position: overlayCoords[0],
                overlayIndex,
                map: window.map,
                overlayType,
                overlayDrawType,
                icon,
                draggable: false,
                overlayName,
                overlayDetail,
                zIndex,
                undoCoords,
                redoCoords,
            })
            this.props.addMarkerListener(this.marker)
        } else {
            this.marker.setOptions({
                position: overlayCoords[0],
                icon,
                overlayName,
                overlayDetail,
                zIndex,
                undoCoords,
                redoCoords,
            })
        }
    }

    render() {
        this.redrawMarker()
        return (null);
    }
}
export default Marker;