import React, { Component } from 'react';

class Polyline extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {}
        this.polyline = false
    }
    componentWillUnmount() {
        if (this.polyline !== false) {
            this.polyline.setMap(null)
        }
    }
    redrawPolyline = () => {
        const {
            overlayCoords,
            overlayIndex,
            overlayDrawType,
            strokeColor,
            overlayName,
            overlayDetail,
            overlayType,
            zIndex,
            undoCoords, redoCoords,
        } = this.props
        if (this.polyline === false) {
            this.polyline = new window.google.maps.Polyline({
                path: overlayCoords,
                map: window.map,
                overlayIndex,
                overlayType,
                suppressUndo: true,
                overlayDrawType,
                strokeColor,
                clickable: true,
                overlayName,
                overlayDetail,
                strokeWeight: '5',
                zIndex,
                undoCoords, 
                redoCoords,
            })
            this.props.addPolylineListener(this.polyline)
        }
        else {
            this.polyline.setOptions({
                path: overlayCoords,
                strokeColor,
                overlayName,
                overlayDetail,
                zIndex,
                undoCoords, 
                redoCoords,
            })
        }
    }
    render() {
        this.redrawPolyline()
        return (null);
    }
}

export default Polyline;