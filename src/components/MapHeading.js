import React from 'react';
import Button from '@material-ui/core/Button';
import Compass from './icons/compass.png'

class MapHeading extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            //0 degree angle is heading to north
            mapHeading: 0
        }
    }
    componentWillMount() {
        window.google.maps.event.addListener(window.map, 'heading_changed', this.onGetMapHeading)
    }
    onGetMapHeading = () => {
        this.setState({ mapHeading: window.map.getHeading() })

    }
    onSetMapHeadingToNorth = () => {
        window.map.setHeading(180)
    }
    render() {
        return (
            <Button
                onClick={() => this.onSetMapHeadingToNorth()}
                style={{
                    transform: `rotate(${this.state.mapHeading}deg)`
                }}
                variant="fab"
            >
                <img
                    src={Compass}
                    alt='Compass'
                />
            </Button>
        )
    }
}
export default MapHeading
