import React from 'react';
import PropTypes from 'prop-types';

// Material-ui Import

import ButtonBase from '@material-ui/core/ButtonBase';

// Icon Group
import icon_airport from './icons/icon_airplane.png'
import icon_alert from './icons/icon_alert.png'
import icon_bamboo from './icons/icon_bamboo.png'
import icon_bonsai from './icons/icon_bonsai.png'
import icon_clock from './icons/icon_clock.png'
import icon_home from './icons/icon_home.png'
import icon_location from './icons/icon_location.png'
import icon_point from './icons/icon_point.png'
import icon_rain from './icons/icon_rain.png'
import icon_sakura1 from './icons/icon_sakura1.png'
import icon_sakura2 from './icons/icon_sakura2.png'
import icon_sale from './icons/icon_sale.png'
import icon_snow from './icons/icon_snow.png'
import icon_star from './icons/icon_star.png'
import icon_tool1 from './icons/icon_tool1.png'
import icon_tool2 from './icons/icon_tool2.png'
import light_bulb_icon from './icons/light_bulb_icon.png'

// CSS Import
import './IconPicker.css';

/*const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        minWidth: 300,
        width: '50%',
        minHeigth: 200,

    },
    image: {
        position: 'relative',
        height: '8.7vw',
        [theme.breakpoints.down('xs')]: {
            width: '100% !important', // Overrides inline-style
            height: 100,
        },
        '&:hover, &$focusVisible': {
            zIndex: 1,
            '& $imageBackdrop': {
                opacity: 0.15,
            },
            '& $imageMarked': {
                opacity: 0,
            },
            '& $imageTitle': {
                border: '4px solid currentColor',
            },
        },
    },
    focusVisible: {},
    imageButton: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.palette.common.white,
    },
    imageSrc: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: '8.7vw',
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
    },
    imageBackdrop: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: theme.palette.common.black,
        opacity: 0.4,
        transition: theme.transitions.create('opacity'),
    },
    imageTitle: {
        position: 'relative',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 4}px ${theme.spacing.unit + 6}px`,
    },
    imageMarked: {
        height: 3,
        width: 18,
        backgroundColor: theme.palette.common.white,
        position: 'absolute',
        bottom: -2,
        left: 'calc(50% - 9px)',
        transition: theme.transitions.create('opacity'),
    },
});*/

const images = [
    {
        src: icon_point,
        title: 'จุด',
        width: '5%',
        height: '5%',
    },
    {
        src: light_bulb_icon,
        title: 'หลอดไฟ',
        width: '5%',
        height: '5%',
    },
    {
        src: icon_airport,
        title: 'สนามบิน',
        width: '5%',
        height: '5%',
    },
    {
        src: icon_alert,
        title: 'เตือนภัย',
        width: '5%',
        height: '5%',
    },
    {
        src: icon_bamboo,
        title: 'เขตป่าไม้',
        width: '5%',
        height: '5%',
    },
    {
        src: icon_bonsai,
        title: 'เขตสวน',
        width: '5%',
        height: '5%',
    },
    {
        src: icon_clock,
        title: 'เตือนเวลา',
        width: '5%',
        height: '5%',
    },
    {
        src: icon_home,
        title: 'บ้าน',
        width: '5%',
        height: '5%',
    },
    {
        src: icon_location,
        title: 'จุดตำแหน่ง',
        width: '5%',
        height: '5%',
    },
    {
        src: icon_rain,
        title: 'สภาพอากาศฝนตก',
        width: '5%',
        height: '5%',
    },
    {
        src: icon_sakura1,
        title: 'ดอกไม้1',
        width: '5%',
        height: '5%',
    },
    {
        src: icon_sakura2,
        title: 'ดอกไม้2',
        width: '5%',
        height: '5%',
    },
    {
        src: icon_sale,
        title: 'ขาย',
        width: '5%',
        height: '5%',
    },
    {
        src: icon_snow,
        title: 'สภาพอากาศหนาว',
        width: '5%',
        height: '5%',
    },
    {
        src: icon_star,
        title: 'จุดสำคัญ',
        width: '5%',
        height: '5%',
    },
    {
        src: icon_tool1,
        title: 'จุดแก้ไข1',
        width: '5%',
        height: '5%',
    },
    {
        src: icon_tool2,
        title: 'จุดแก้ไข2',
        width: '5%',
        height: '5%',
    },
];

class IconPicker extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {}

        //this.onIconSelect = this.onIconSelect.bind(this)
    }
    render() {
        const {  } = this.props;

        return (
            <div>
                {images.map(image => (
                    <ButtonBase
                        focusRipple
                        key={image.title}
                        className="image"
                        focusVisibleClassName="focusVisible"
                        style={{
                            width: '8.7vw',
                        }}
                        onClick={() => this.props.onSetSelectedIcon(image.src)}
                    >

                        <span
                            className="imageSrc"
                            style={{
                                backgroundImage: `url(${image.src})`,
                            }}
                        />
                        <span className="imageButton">
                        </span>
                    </ButtonBase>
                ))}
            </div>
        );
    }
}


IconPicker.propTypes = {
    
};

export default (IconPicker);
