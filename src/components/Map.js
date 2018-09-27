import React from 'react';
import './Design.css';
import update from 'immutability-helper';

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
        window.map = new window.google.maps.Map(document.getElementById("map"), {
            center: this.state.center,
            zoom: this.state.zoom,
            clickableIcons: false,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            mapTypeId: 'satellite',
            //hybrid sat with detail
            //roadmap raod
            //satellite sat
            //terrain raod wtih terrain
        })
        this.setState({
            isLoad: true
        })
    }


    render() {
        var childrenOutput = null;
        if (this.state.isLoad === true) {
            childrenOutput = this.props.children;
        }
        return (
            <div style={{
                left: this.props.left,

            }}
                className="Map"
                id="map" >
                {childrenOutput}
            </div>
        );
    }
}
export default Map;