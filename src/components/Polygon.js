import React, { Component } from 'react';

const radix = 10

class Polygon extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {}
        this.polygon = false
        this.polyVertex = []
        //this. = this..bind(this)
    }

    componentWillUnmount() {
        if (this.polygon !== false) {
            this.polygon.setMap(null)
        }
    }
    onClearPolyVextex = () => {
        this.polyVertex.map(marker => {
            marker.setMap(null)
            return null
        })
    }
    redrawVertex = () => {
        if (this.polyVertex.length > 0) {
            this.onClearPolyVextex()
        }
        var marker
        var self = this
        this.polygon.getPath().getArray().map((coords, key) => {
            marker = new window.google.maps.Marker({
                position: coords,
                map: window.map,
                draggable: false,
                clickable: false,
            })
            self.polyVertex.push(marker)
            // marker.bindTo('position', self.polygon, (key).toString());
        })

    }
    redrawPolygon = () => {
        const {
            overlayCoords, overlayIndex, overlayDrawType,
            fillColor, strokeColor, overlayName,
            overlayDetail, overlayType,
        } = this.props

        if (this.polygon === false) {
            this.polygon = new window.google.maps.Polygon({
                path: overlayCoords,
                map: window.map, 
                suppressUndo: true,
                clickable: true,
                overlayIndex,
                overlayType,
                overlayDrawType,
                strokeColor,
                fillColor,
                overlayName,
                overlayDetail,
                fillOpacity: 0.1,
            })
            this.props.addPolygonListener(this.polygon)
            //this.polygon.binder = new MVCArrayBinder(this.polygon.getPath())
            //this.redrawVertex()
        }
        else {
            this.polygon.setOptions({
                path: overlayCoords,
                strokeColor,
                fillColor,
                overlayName,
                overlayDetail,
            })
        }
    }
    render() {
        this.redrawPolygon()
        return (null);
    }
}

export default Polygon;
function MVCArrayBinder(mvcArray) {
    this.array_ = mvcArray;
}
// MVCArrayBinder.prototype = new window.google.maps.MVCObject();
// MVCArrayBinder.prototype.get = function (key) {
//     if (!isNaN(parseInt(key,radix))) {
//         return this.array_.getAt(parseInt(key,radix));
//     } else {
//         this.array_.get(key);
//     }
// }
// MVCArrayBinder.prototype.set = function (key, val) {
//     if (!isNaN(parseInt(key,radix))) {
//         this.array_.setAt(parseInt(key,radix), val);
//     } else {
//         this.array_.set(key, val);
//     }
// }