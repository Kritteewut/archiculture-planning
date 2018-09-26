import React from 'react'
import target_icon from './icons/target_icon.png'

class TargetIcon extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {}
        this.targetIcon = null
    }
    componentWillUnmount() {
        if (this.targetIcon) {
            this.targetIcon.setMap(null)
        }
    }
    renderTargetIcon = () => {
        const { targetIconCoords } = this.props
        if (!this.targetIcon) {
            var targetIcon = {
                url: target_icon,
                // This marker is 20 pixels wide by 32 pixels high.
                //size: new window.google.maps.Size(20, 32),
                // The origin for this image is (0, 0).
                origin: new window.google.maps.Point(0, 0),
                // The anchor for this image is the base of the flagpole at (0, 32).
                anchor: new window.google.maps.Point(40, 40)
            };
            this.targetIcon = new window.google.maps.Marker({
                position: targetIconCoords[0],
                clickable: false,
                map: window.map,
                icon: targetIcon,
            })
        } else {
            this.targetIcon.setOptions({
                position: targetIconCoords[0]
            })
        }
    }
    render() {
        this.renderTargetIcon()
        return (null)
    }
}

export default TargetIcon