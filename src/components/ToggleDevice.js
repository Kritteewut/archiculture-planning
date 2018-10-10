import React from 'react'
import Button from '@material-ui/core/Button';
import PhoneIcon from '@material-ui/icons/PhoneAndroid';
import DestopIcon from '@material-ui/icons/PersonalVideo';
import './DrawingBtn.css';

class ToggleDevice extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {}
    }
    render() {
        const { isDrawInDesktopDevice, isFirstDraw, drawingBtnType } = this.props
        return (
            <Button
                variant="contained"
                color="default"
                className="buttonToggleDeviceMode"
                onClick={() => this.props.onToggleDeviceMode()}
                disabled={drawingBtnType || !isFirstDraw ? true : false}
            >
                {
                    isDrawInDesktopDevice ?
                        <DestopIcon className="leftIcon" />
                        :
                        <PhoneIcon className="leftIcon" />
                }

                {
                    isDrawInDesktopDevice ?
                        'DESKTOP'
                        :
                        'TOUCH'
                }
            </Button>
        )
    }
}
export default ToggleDevice