import React from 'react'
import Button from '@material-ui/core/Button';
import PhoneIcon from '@material-ui/icons/PhoneAndroid';
import DestopIcon from '@material-ui/icons/PersonalVideo';
import './DrawingBtn.css';
import MenuItem from '@material-ui/core/MenuItem';

class ToggleDevice extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {}
    }
    render() {
        const { isDrawInDesktopDevice, isFirstDraw, drawingBtnType } = this.props
        return (
            <div>
                <MenuItem
                    variant="contained"
                    color="default"
                    className="buttonToggleDeviceMode"
                    onClick={() => this.props.onToggleDeviceMode()}
                    disabled={drawingBtnType || !isFirstDraw ? true : false}
                >
                    {
                        isDrawInDesktopDevice ?
                            <div className="ButtonIconColor">
                                <DestopIcon className="leftIcon" />
                            </div>
                            :
                            <div className="ButtonIconColor">
                            <PhoneIcon className="leftIcon" />
                            </div>
            }

                    {
                        isDrawInDesktopDevice ?
                            'DESKTOP'
                            :
                            'TOUCH'
                    }
                </MenuItem>
            </div>
        )
    }
}
export default ToggleDevice