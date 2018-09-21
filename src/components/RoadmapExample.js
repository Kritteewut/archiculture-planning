import React from 'react'
import { Divider } from '@material-ui/core';

class RoadmapExample extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentWillMount() {
        window.initMap = this.initExampleMap
    }
    initExampleMap = () => {
        const mapCenter = window.map.getCenter()
        const mapTypeId = window.map.getMapTypeId()
        const mapZoom = window.map.getZoom()
        window.Roadmap = new window.google.maps.Map(document.getElementById('RoadmapExample'), {
            center: { lat: 10, lng: 13 },
            zoom: 15,
            disableDefaultUI: true,
            mapTypeId: 'hybrid',
            //hybrid sat with detail
            //roadmap raod
            //satellite sat
            //terrain raod wtih terrain
        })
        
    }
    render() {
        console.log(window.Roadmap)
        return (
            <div
                style={{
                    height: "100px",
                    width: "100px",
                }}
                id="RoadmapExample"
            >
                {this.props.children}
            </div>
        )
    }
}
export default RoadmapExample

