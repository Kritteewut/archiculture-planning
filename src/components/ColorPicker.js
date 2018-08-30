import React, { Component } from 'react';
import { TwitterPicker } from 'react-color';

const colorArray = ['#ff6900', '#ffa100', '#00ffe7', '#0dff00', '#8ed1fc', '#0693E3', '#abb8C3', '#ff0004',
    '#9900ef', '#ff007e']

class ColorPicker extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = { pickedColor: '#ffffff', btnType: 'strokeColor', };
    }
    handleChangeComplete = (color) => {
        const { btnType } = this.state
        this.setState({ pickedColor: color.hex });
        switch (btnType) {
            case 'strokeColor':
                return this.props.onChangePolyStrokeColor(color.hex)
            case 'fillColor':
                return this.props.onChangePolyFillColor(color.hex)
            default: return null
        }
    };
    handleStrokeColorButtonClick = () => {
        this.setState({ btnType: 'strokeColor', })
    }
    handleFillColorButtonClick = () => {
        this.setState({ btnType: 'fillColor', })
    }
    render() {
        const { pickedColor } = this.state
        return (

            <div>
                <button
                    onClick={this.handleStrokeColorButtonClick}
                >
                    เปลี่ยนสีเส้น
                    </button>
                <button
                    onClick={this.handleFillColorButtonClick}
                >
                    เปลี่ยนสีพื้นที่
                    </button>

                <TwitterPicker
                    triangle={'hide'}
                    color={pickedColor}
                    colors={colorArray}
                    onChangeComplete={this.handleChangeComplete}
                />
            </div>
        )
    }
}
export default ColorPicker