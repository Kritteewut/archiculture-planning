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
        const { overlayCoords, overlayId, overlayDrawType, icon, overlayName, overlayDetail, overlayType,
            zIndex, undoCoords, redoCoords, overlaySource,
        } = this.props
        var image = {
            url: icon,
            //size: new window.google.maps.Size(71, 71),
            //origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(15, 15),
            //scaledSize: new window.google.maps.Size(25, 25)
        };
        if (this.marker === false) {
            this.marker = new window.google.maps.Marker({
                position: overlayCoords[0],
                overlayId,
                map: window.map,
                overlayType,
                overlayDrawType,
                icon: image,
                draggable: false,
                overlayName,
                overlayDetail,
                zIndex,
                undoCoords,
                redoCoords,
                overlaySource,
            })
            this.props.addMarkerListener(this.marker)
        } else {
            this.marker.setOptions({
                position: overlayCoords[0],
                icon: image,
                overlayName,
                overlayDetail,
                zIndex,
                undoCoords,
                redoCoords,
                overlaySource,
            })
        }
    }

    render() {
        this.redrawMarker()
        return (null);
    }
}
export default Marker;