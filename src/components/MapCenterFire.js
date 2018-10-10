import React from 'react'
import Button from '@material-ui/core/Button';
import TargetIcon from '@material-ui/icons/Flare';
import target_icon from './icons/target_icon.png'

import './DrawingBtn.css';

class MapCenterFire extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {}
    }
    render() {
        const { isDrawInDesktopDevice, drawingBtnType, isFirstDraw } = this.props
        return (
            isDrawInDesktopDevice ?
                null
                :
                <div>
                    <Button
                        variant="fab"
                        className="buttonTarget"
                        onClick={() => this.props.drawOverlayUsingTouchScreen()}
                        disabled={(drawingBtnType || !isFirstDraw) ? false : true}
                    >
                        <TargetIcon />

                    </Button>
                    {(drawingBtnType || !isFirstDraw) ?
                        <Button
                            className="targetIcon"
                            disabled={true}
                        >
                            <img
                                src={target_icon}
                                alt='Target'
                            />
                        </Button>
                        :
                        null
                    }
                </div>

        )
    }
}
export default MapCenterFire