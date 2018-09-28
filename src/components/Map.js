import React from 'react';
import './Design.css';


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
        // setTimeout(this.test2, 5000)

        // window.google.maps.event.addListener(window.map, 'click', function () {
        //     clearInterval(self.interval)
        // })
        // console.log(this.interval)
    }
    test = () => {
        console.log('hi', Math.random())
    }
    test2 = () => {
        this.interval = setInterval(this.test, 1000)
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