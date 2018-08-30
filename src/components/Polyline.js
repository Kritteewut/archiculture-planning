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
    componentDidMount() {
        if (this.polyline !== false && this.props.isFirstDraw === false) {
            this.polyline.setOptions({ clickable: false })
        }
    }

    redrawPolyline = () => {
        var {
            overlayCoords,
            overlayIndex,
            overlayDrawType,
            strokeColor,
            overlayName,
            overlayDetail,
            overlayType
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
                strokeWeight: '5'

            })
            this.props.addPolylineListener(this.polyline)
        }
        else {
            this.polyline.setOptions({
                path: overlayCoords,
                strokeColor,
                overlayName,
                overlayDetail,
            })
        }
    }
    render() {
        this.redrawPolyline()
        return (null);
    }
}

export default Polyline;