import { Component } from 'react';

class ExamplePolygon extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {}
        this.examplePolygon = false
    }
    redrawExamplePolygon=()=> {
        const { examplePolygonCoords } = this.props
        if (this.examplePolygon === false) {
            this.examplePolygon = new window.google.maps.Polygon({
                path: examplePolygonCoords,
                map: window.map,
                clickable: false,
                strokeOpacity: 0.5,
                overlayType: 'examplePolygon',
                strokeColor: '#aa0011',
                fillColor: '#1122aa',
                strokeWeight: '10',
            })
        }
        else {
            this.examplePolygon.setOptions({
                paths: examplePolygonCoords
            })
        }
    }

    render() {
        this.redrawExamplePolygon()
        return (null);
    }
}

export default ExamplePolygon;
