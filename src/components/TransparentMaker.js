import React, { Component } from 'react';
import transparent_icon from './icons/transparent_icon.png';


class TransparentMaker extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {}
        this.transparentMaker = false
    }
    componentWillUnmount() {
        if (this.transparentMaker !== false) {
            this.transparentMaker.setMap(null)
        }
    }
    redrawTransparentMaker = () => {
        const { midpoint, disBtw } = this.props
        if (this.transparentMaker === false) {
            this.transparentMaker = new window.google.maps.Marker({
                position: midpoint,
                map: window.map,
                icon: transparent_icon,
                clickable: false,
                label: {
                    text: disBtw.toFixed(3) + ' m',
                    //color: 'black',
                    fontFamily: 'Vast Shadow',
                    fontSize: '20px',
                    //fontWeight: '',
                },
            })
        }
    }
    render() {
        this.redrawTransparentMaker()
        return (null)
    }
}
export default TransparentMaker