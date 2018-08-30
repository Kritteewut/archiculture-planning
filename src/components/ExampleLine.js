import React from 'react';


class ExampleLine extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {}
        this.exampleLine = false
    }
    componentWillUnmount() {
        if (this.exampleLine !== false) {
            this.exampleLine.setMap(null)
        }
    }

    redrawExampleLine = () => {
        var { exampleLineCoords, strokeColor } = this.props
        if (this.exampleLine === false) {
            this.exampleLine = new window.google.maps.Polyline({
                path: exampleLineCoords,
                map: window.map,
                clickable: false,
                strokeOpacity: 0.5,
                strokeColor: strokeColor,
                //strokeWeight: '1',
            })
        } else {
            this.exampleLine.setOptions({
                path: exampleLineCoords,
                strokeColor: strokeColor,
            })
        }

    }
    render() {
        this.redrawExampleLine()
        return (null);
    }
}

export default ExampleLine;
