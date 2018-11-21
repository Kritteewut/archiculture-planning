import React from 'react';

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
        const { overlayCoords, } = this.props
        if (this.polyline === false) {
            this.polyline = new window.google.maps.Polyline({
                path: overlayCoords,
                map: window.map,
                suppressUndo: true,
                strokeWeight: '5',
                ...this.props,
            })
            this.props.addPolylineListener(this.polyline)
        }
        else {
            this.polyline.setOptions({
                path: overlayCoords,
                ...this.props,
            })
        }
    }
    render() {
        this.redrawPolyline()
        return (null);
    }
}

export default Polyline;