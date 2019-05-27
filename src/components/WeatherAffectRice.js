import React from 'react'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import WeatherForecastInterface from './WeatherForecastInterface';
import moment from 'moment';
import Sunny from './icons/sunny.png'
import Hot from './icons/hot.png'
import Snowflake from './icons/snowflake.png'
import Snowflakes from './icons/snowflakes.png'
import Storm_thunder from './icons/storm_thunder.png'
import Rain from './icons/rain.png'
import Clouds from './icons/clouds.png'
import Cloud from './icons/cloud.png'
import Warning from './icons/warning.png'
import shortid from 'shortid'
import './WeatherAffect.css';
import './Design.css';
import IconWeather from '@material-ui/icons/WbSunny';

const rice = {
    minGoodGrowth: 25,
    minCanGrowth1: 34,
    minCanGrowth2: 15,
    minStopGrowth: 14,
    maxGoodGrowth: 33,
    maxCanGrowth1: 40,
    maxCanGrowth2: 24,
    maxStopGrowth: 41,
}

class WeatherAffectRice extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isWeatherAffectRiceOpen: false,
            isFetchingWeather: false,
            riceCondition: [],
            plantDate: '',
            weatherForecast: [],
            avgRain: '',
            plantCondition: [],
            rainWarning: '',
        }
    }
    handleToggleWeatherAffectRiceOpen = () => {
        const { overlayPlantDate } = this.props.selectedOverlay
        let plantDate = ''
        if (overlayPlantDate) {
            plantDate = moment(overlayPlantDate).format().split('T')[0]
        }
        this.setState({
            isWeatherAffectRiceOpen: !this.state.isWeatherAffectRiceOpen,
            plantDate,
        })

    }
    handlePlantDateChange = (event) => {
        const plantDate = event.target.value
        this.setState({ plantDate })
    }
    onGetWeatherForecastResult = (result, forecastDays) => {
        if (result) {
            const { forecasts } = result.WeatherForecasts[0]
            let sumRain = 0
            let forecastResult = forecasts.map(forecast => {
                const key = shortid.generate()
                const { tc_max, tc_min, rain } = forecast.data
                let tc_maxR = Math.round(tc_max)
                let tc_minR = Math.round(tc_min)
                sumRain += rain
                return {
                    time: moment(forecast.time).format('dd Do MMM'),
                    tc_max: `${tc_maxR}`,
                    tc_max_cod: this.onCompareRiceCondition(tc_maxR),
                    tc_min: `${tc_minR}`,
                    tc_min_cod: this.onCompareRiceCondition(tc_minR),
                    rain: rain,
                    rain_warning: rain > 0 ? 'อาจมีฝนตก ระวังระดับน้ำในนา' : null,
                    key
                }
            })
            console.log(forecastResult)
            let avgRain = sumRain / forecasts.length
            this.setState({
                weatherForecast: forecastResult,
                avgRain: `ปริมาณน้ำฝนรวม ${forecastDays} วัน ${sumRain.toFixed(2)} มิลลิเมตร เฉลี่ย ${avgRain.toFixed(2)} มิลลิเมตรต่อวัน`,
                isFetchingWeather: false,
            })
        }
    }
    onSetPlantConditionText = (tmax, tmin, rain) => {
        let tmaxR = Math.round(tmax)
        let tminR = Math.round(tmin)
        let plantCondition = [
            {
                temperature: `ที่อุณหภูมิ ${tmaxR} °C`,
                condition: [
                    `${this.onCompareRiceCondition(tmaxR)}`,
                ],
                key: shortid.generate()
            },
            {
                temperature: `ที่อุณหภูมิ ${tminR} °C`,
                condition: [
                    `${this.onCompareRiceCondition(tminR)}`,
                ],
                key: shortid.generate()
            },
        ]
        this.setState({
            plantCondition,
            rainWarning: rain > 0 ? 'วันนี้มีฝนตก โปรดระวังระดับน้ำในนา' : ''
        })
    }
    onSetFetchingWeather = () => {
        this.setState({ isFetchingWeather: true })
    }
    onCompareCond = (cond) => {
        let condText, condPic
        switch (cond) {
            case 1:
                condText = 'ท้องฟ้าแจ่มใส'
                condPic = Sunny
                break;
            case 2:
                condText = 'มีเมฆบางส่วน'
                condPic = Cloud
                break;
            case 3:
                condText = 'มีเมฆเป็นส่วนมาก'
                condPic = Clouds
                break;
            case 4:
                condText = 'มีเมฆมาก'
                condPic = Clouds
                break;
            case 5:
                condText = 'ฝนตกเล็กน้อย'
                condPic = Rain
                break;
            case 6:
                condText = 'ฝนปานกลาง '
                condPic = Rain
                break;
            case 7:
                condText = 'ฝนตกหนัก '
                condPic = Rain
                break;
            case 8:
                condText = 'ฝนฟ้าคะนอง '
                condPic = Storm_thunder
                break;
            case 9:
                condText = 'อากาศหนาวจัด'
                condPic = Snowflakes
                break;
            case 10:
                condText = 'อากาศหนาว'
                condPic = Snowflake
                break;
            case 11:
                condText = 'อากาศเย็น '
                condPic = Snowflake
                break;
            case 12:
                condText = 'อากาศร้อนจัด'
                condPic = Hot
                break;
            default:
                condText = 'ไม่พบสภาพอากาศ'
                condPic = Warning
                break;
        }
        return { condPic, condText }
    }
    onSubmitEditPlantDate = () => {
        const { plantDate } = this.state
        let formatedDate
        if (plantDate === '') {
            formatedDate = ''
        } else {
            formatedDate = moment(plantDate).toDate()
        }
        this.props.onEditOverlayPlantDate(formatedDate)
    }
    onShowOverlayPlantDate = () => {
        const { plantDate } = this.state
        if (plantDate) {
            let diffDate = moment().diff(moment(plantDate), 'd')
            let showText = ''
            if (diffDate >= 0) {
                showText = `ข้าวมีอายุ ${diffDate} วัน`
            } else {
                showText = `ข้าวยังไม่ถูกปลูก`
            }
            return showText
        }
    }
    onGetRiceGuide = () => {
        const { plantDate } = this.state
        if (plantDate) {
            let days = moment().diff(moment(plantDate), 'd')
            if (inRange(days, 7, 14)) {
                return 'ช่วง 7-14 วัน หลังต้นกล้างอกปล่อยน้ำเข้านาไม่ให้ลึกเกิน 5 ซม. จากหน้าดิน'
            }
            if (inRange(days, 30, 59)) {
                return '30 วัน ปล่อยน้ำเข้านาให้สูงขึ้นเป็น 10 ซม. จากหน้าดินแล้วใส่ปุ๋ยเพื่อเร่งให้ข้าวแตกกอ'
            }
            if (inRange(days, 60, 69)) {
                return '60 วัน ระบายน้ำออกให้แห้ง'
            }
            if (inRange(days, 70, 99)) {
                return '70 วัน ปล่อยน้ำเข้านาสูง 10 ซม. สลับกับแห้ง 7 ครั้ง'
            }
            if (inRange(days, 100, 139)) {
                return '100 วัน ปล่อยน้ำเข้านาสูง 10 ซม. ในช่วงนี้แมลงศัตรูพเริ่มระบาด ต้องตรวขสอบแปลงบ่อย'
            }
            if (days >= 140) {
                return '140 วัน ระบายน้ำออกจากแปลงให้แห้ง รอเก็บเกี่ยว หลังจากข้าวออกดอก 30 วันให้เก็บเกี่ยวได้'
            }
        }

    }
    onCompareRiceCondition = (temperature) => {
        const { minStopGrowth, maxStopGrowth, minGoodGrowth,
            maxGoodGrowth, minCanGrowth1, maxCanGrowth1,
            minCanGrowth2, maxCanGrowth2 } = rice
        if (temperature <= minStopGrowth || temperature >= maxStopGrowth) {
            return 'ข้าวอาจเติบโตได้น้อยลง'
        }
        if (inRange(temperature, minGoodGrowth, maxGoodGrowth)) {
            return 'ข้าวเติบโตได้ดี'
        }
        if (inRange(temperature, minCanGrowth1, maxCanGrowth1) || inRange(temperature, minCanGrowth2, maxCanGrowth2)) {
            return 'ข้าวเติบโตได้'
        }
    }
    render() {
        const { isWeatherAffectRiceOpen, isFetchingWeather, plantDate, weatherForecast,
            avgRain, plantCondition, rainWarning } = this.state
        return (
            <div>
                <Button variant="contained" className="buttonWeatherAffect" onClick={this.handleToggleWeatherAffectRiceOpen}>
                    ผลกระทบจากสภาพอากาศ . . .
                    <div className="rightIcon ButtonHowtoIconColor">
                        <IconWeather />
                    </div>
                </Button>
                <Dialog
                    fullWidth
                    open={isWeatherAffectRiceOpen}
                    onClose={this.handleToggleWeatherAffectRiceOpen}
                >
                    <DialogTitle id="alert-dialog-title">{"สภาพอากาศที่มีผลกระต่อข้าว"}</DialogTitle>
                    <DialogContent>
                        <WeatherForecastInterface
                            onGetWeatherForecastResult={this.onGetWeatherForecastResult}
                            onSetFetchingWeather={this.onSetFetchingWeather}
                            isFetchingWeather={this.state.isFetchingWeather}
                        />
                        <TextField
                            onChange={this.handlePlantDateChange}
                            id="date"
                            label="วันที่ปลูก"
                            type="date"
                            value={plantDate}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <div>
                            {
                                this.onShowOverlayPlantDate()
                            }
                        </div>
                        <div>
                            {
                                this.onGetRiceGuide()
                            }
                        </div>
                        {
                            isFetchingWeather ?
                                'กำลังโหลด...'
                                :
                                <div>
                                    {avgRain && <div className="FrameWeatherRain">
                                        {avgRain}
                                    </div>}
                                </div>
                        }

                    </DialogContent>

                    <DialogActions>
                        <Button
                            variant="contained"
                            className="buttonContinueUpdate"
                            onClick={this.onSubmitEditPlantDate}
                        >
                            บันทึกการเปลี่ยนแปลง
                        </Button>
                        <Button
                            variant="contained"
                            className="buttonNopeUpdate"
                            onClick={this.handleToggleWeatherAffectRiceOpen} autoFocus>
                            ยกเลิก
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}
export default WeatherAffectRice

function inRange(x, min, max) {
    return ((x - min) * (x - max) <= 0);
}