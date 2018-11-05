import React from 'react';


class Polygon extends React.PureComponent {
    constructor(props) {
        super(props);
        this.polygon = false
        this.array_ = null
    }
    componentWillUnmount() {
        if (this.polygon !== false) {
            this.polygon.setMap(null)
        }
    }
    redrawPolygon = () => {
        const { overlayCoords } = this.props
        if (this.polygon === false) {
            this.polygon = new window.google.maps.Polygon({
                path: overlayCoords,
                map: window.map,
                suppressUndo: true,
                fillOpacity: 0.1,
                ...this.props

            })
            this.props.addPolygonListener(this.polygon)
            //this.polygon.binder = MVCArrayBinder(this.polygon.getPath())
        }
        else {
            this.polygon.setOptions({
                path: overlayCoords,
                ...this.props
            })
        }
    }
    render() {
        this.redrawPolygon()
        return (null);
    }
}
export default Polygon;
