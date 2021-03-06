import React from 'react';
import { CirclePicker } from 'react-color';
import OpenSide from '../components/openSideBtn';

//Material Import
import Button from '@material-ui/core/Button'

//Icon Import
import IconComplete from '@material-ui/icons/Check';

// CSS Import
import './Design.css';

const colorArray = [

    /* Twitter Color set 
    '#000000', '#2E2E2E', '#6E6E6E', '#A4A4A4', '#BDBDBD', '#E6E6E6', '#FFFFFF', //Black
    '#2A0A12', '#610B21', '#B40431', '#FF0040', '#FA5882', '#F5A9BC', '#F8E0E6', //PinkRed
    '#2A0A29', '#610B5E', '#B404AE', '#FF00FF', '#FA58F4', '#F5A9F2', '#F8E0F7', //Pink
    '#1B0A2A', '#380B61', '#5F04B4', '#8000FF', '#AC58FA', '#D0A9F5', '#ECE0F8', //Purple
    '#0A0A2A', '#0404B4', '#0404B4', '#0000FF', '#5858FA', '#A9A9F5', '#E0E0F8', //Blue
    '#0A1B2A', '#0B3861', '#045FB4', '#0080FF', '#58ACFA', '#A9D0F5', '#E0F2F7', //Sky
    '#0A2A29', '#0B615E', '#04B4AE', '#00FFFF', '#58FAF4', '#A9F5F2', '#E0F8F7', //WhiteSky
    '#0A2A22', '#0B614B', '#04B486', '#00FFBF', '#58FAD0', '#A9F5E1', '#E0F8F1', //Mint
    '#0A2A0A', '#0B610B', '#04B404', '#00FF00', '#58FA58', '#A9F5A9', '#E0F8E0', //Green2
    '#222A0A', '#4B610B', '#86B404', '#BFFF00', '#D0FA58', '#D0F5A9', '#ECF6CE', //Green1    
    '#292A0A', '#5E610B', '#AEB404', '#FFFF00', '#F4FA58', '#F2F5A9', '#F7F8E0', //Yellow
    '#29220A', '#5F4C0B', '#B18904', '#FFBF00', '#F7D358', '#F3E2A9', '#F7F2E0', //Gold
    '#2A1B0A', '#61380B', '#B45F04', '#FF8000', '#FAAC58', '#F5D0A9', '#F8ECE0', //Orange
    '#2A0A0A', '#610B0B', '#B40404', '#FF0000', '#F78181', '#F6CECE', '#FBEFEF', //Red
    */

    /* Circle Color Mini set*/

    '#610B0B', '#B40404', '#ff4500', '#F78181', '#F6CECE', '#FBEFEF', //Red
    '#61380B', '#B45F04', '#ffa500', '#FAAC58', '#F5D0A9', '#F8ECE0', //Orange

    '#5E610B', '#AEB404', '#FFFF00', '#F4FA58', '#F2F5A9', '#F7F8E0', //Yellow
    '#0B610B', '#04B404', '#00FF00', '#58FA58', '#A9F5A9', '#E0F8E0', //Green2

    '#0B615E', '#04B4AE', '#00FFFF', '#58FAF4', '#A9F5F2', '#E0F8F7', //WhiteSky
    '#0404B4', '#0404B5', '#0000FF', '#5858FA', '#A9A9F5', '#E0E0F8', //Blue

    '#380B61', '#5F04B4', '#8000FF', '#AC58FA', '#D0A9F5', '#ECE0F8', //Purple
    '#610B5E', '#B404AE', '#FF00FF', '#FA58F4', '#F5A9F2', '#F8E0F7', //Pink

    /* Circle Color set*/
    /*
    '#000000', '#2E2E2E', '#6E6E6E', '#A4A4A4', '#BDBDBD', '#FFFFFF', //Black
    '#610B21', '#B40431', '#FF0040', '#FA5882', '#F5A9BC', '#F8E0E6', //PinkRed
    '#610B5E', '#B404AE', '#FF00FF', '#FA58F4', '#F5A9F2', '#F8E0F7', //Pink
    '#380B61', '#5F04B4', '#8000FF', '#AC58FA', '#D0A9F5', '#ECE0F8', //Purple
    '#0404B4', '#0404B5', '#0000FF', '#5858FA', '#A9A9F5', '#E0E0F8', //Blue
    '#0B3861', '#045FB4', '#0080FF', '#58ACFA', '#A9D0F5', '#E0F2F7', //Sky
    '#0B615E', '#04B4AE', '#00FFFF', '#58FAF4', '#A9F5F2', '#E0F8F7', //WhiteSky
    '#0B614B', '#04B486', '#00FFBF', '#58FAD0', '#A9F5E1', '#E0F8F1', //Mint
    '#0B610B', '#04B404', '#00FF00', '#58FA58', '#A9F5A9', '#E0F8E0', //Green2
    '#4B610B', '#86B404', '#BFFF00', '#D0FA58', '#D0F5A9', '#ECF6CE', //Green1    
    '#5E610B', '#AEB404', '#FFFF00', '#F4FA58', '#F2F5A9', '#F7F8E0', //Yellow
    '#5F4C0B', '#B18904', '#FFBF00', '#F7D358', '#F3E2A9', '#F7F2E0', //Gold
    '#61380B', '#B45F04', '#FF8000', '#FAAC58', '#F5D0A9', '#F8ECE0', //Orange
    '#610B0B', '#B40404', '#FF0000', '#F78181', '#F6CECE', '#FBEFEF', //Red
    */


    /* Circle Color mini 
    '#000000', '#2E2E2E', '#6E6E6E', '#A4A4A4', '#E6E6E6', '#FFFFFF', //Black
    '#FF0000', '#FF00FF', '#8000FF', '#0000FF', '#0080FF', '#00FFFF',
    '#ffa500', '#FFBF00', '#FFFF00', '#BFFF00', '#00FF00', '#00FFBF',
    */
]

class ColorPicker extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = { pickedColor: '#ffa500', btnType: 'strokeColor', };
    }
    handleChangeComplete = (color) => {
        const { btnType } = this.state
        this.setState({ pickedColor: color.hex });
        switch (btnType) {
            case 'strokeColor':
                return this.props.onChangePolyStrokeColor(color.hex)
            case 'fillColor':
                return this.props.onChangePolyFillColor(color.hex)
            default: return;
        }
    };
    handleStrokeColorButtonClick = () => {
        this.setState({ btnType: 'strokeColor', })
    }
    handleFillColorButtonClick = () => {
        this.setState({ btnType: 'fillColor', })
    }
    handleShowSelectedColor = () => {
        const { btnType } = this.state
        const { fillColor, strokeColor, selectedOverlay, } = this.props
        switch (btnType) {
            case ('strokeColor'): return selectedOverlay ? selectedOverlay.strokeColor : strokeColor
            case ('fillColor'): return selectedOverlay ? selectedOverlay.fillColor : fillColor
            default: return;
        }
    }
    render() {
        return (

            <div className="FrameColorsetup">
                {/*<TwitterPicker
                    triangle={'hide'}
                    color={pickedColor}
                    colors={colorArray}
                    onChangeComplete={this.handleChangeComplete}
                />*/}

                <div className="FrameButtoncolor2">
                    <div className="buttonturnoff2">
                        <OpenSide
                            handleDrawerToggle={this.props.handleDrawerToggle}
                        />
                    </div>

                    <Button
                       
                        variant="fab"
                        color="default"
                        className="buttonCompleteInSlide"
                        onClick={this.props.onAddListenerGrabBtn}
                    >
                        <div className="ButtonIconColor">
                            <IconComplete />
                        </div>
                    </Button>
                </div>

                <CirclePicker
                    className="FrameColorsetup"
                    triangle={'hide'}
                    color={this.handleShowSelectedColor()}
                    colors={colorArray}
                    onChangeComplete={this.handleChangeComplete}
                />

                <div className="FrameColorsetupButton">
                    <button
                        onClick={this.handleStrokeColorButtonClick}
                        className="DesignButtonColor"
                    >
                        เปลี่ยนสีเส้น
                    </button>
                    <button
                        onClick={this.handleFillColorButtonClick}
                        className="DesignButtonColor"
                    >
                        เปลี่ยนสีพื้นที่
                    </button>
                </div>
            </div>
        )
    }
}
export default ColorPicker