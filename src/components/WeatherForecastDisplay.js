import React from 'react'
import Button from '@material-ui/core/Button';
import moment from 'moment';
import shortid from 'shortid'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import './WheatherForecaseDisplay.css'
import Sunny from './icons/sunny.png'
import Hot from './icons/hot.png'
import Snowflake from './icons/snowflake.png'
import Snowflakes from './icons/snowflakes.png'
import Storm_thunder from './icons/storm_thunder.png'
import Rain from './icons/rain.png'
import Clouds from './icons/clouds.png'
import Cloud from './icons/cloud.png'
import Warning from './icons/warning.png'
import './PermanentDrawer.css';
import './Design.css';
import IconWeather from '@material-ui/icons/WbSunny';
import WeatherForecastInterface from './WeatherForecastInterface';

const maxForecastDay = 126
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
const corn = {
    minStopGrowth: 20,
    minGoodGrowth: 21,
    minCanGrowth: 28,
    maxStopGrowth: 36,
    maxGoodGrowth: 27,
    maxCanGrowth: 35,

}
const sugarcane = {
    minGoodGrowth: 18,
    minStopGrowth: 17,
    maxGoodGrowth: 35,
    maxStopGrowth: 36,
}
//มันสำปะหลัง
const cassava = {
    minStopGrowth: 15,
    minGoodGrowth: 25,
    minCanGrowth1: 16,
    minCanGrowth2: 30,
    maxStopGrowth: 40,
    maxGoodGrowth: 29,
    maxCanGrowth1: 24,
    maxCanGrowth2: 39,
}

//ความชื้น 80-85 % จะช่วยให้อ้อย ยืดโตอย่างรวดเร็ว และ ความชื้นระดับปานกลาง 45-65 % ที่ควบคู่กับการจัดการน้ำเป็นอย่างดี ช่วยให้ อ้อยในระยะอ้อยเติบโตเต็ม (อ้อยสุก) สร้างน้ำตาลได้ดี
//มันสำ ดี 50-60%
class WeatherForecastDisplay extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            weatherForecast: [],
            forecastDays: 7,
            avgRain: null,
            isWeaterOpen: false,
            isFetchingWeather: false,
            plantCondition: [],
        }
    }
    onGetWeatherForecastResult = (result, forecastDays) => {
        if (result) {
            const { forecasts } = result.WeatherForecasts[0]
            let sumRain = 0
            let forecastResult = forecasts.map(forecast => {
                const key = shortid.generate()
                const { tc_max, tc_min, rh, rain, cond } = forecast.data
                let tc_maxR = Math.round(tc_max)
                let tc_minR = Math.round(tc_min)
                let rhR = Math.round(rh)
                sumRain += rain
                return {
                    tc_max: `${tc_maxR}`,
                    tc_min: `${tc_minR}`,
                    rh: `ความชื้นสัมพัทธเฉลี่ย ${rhR}%`,
                    rain: `ปริมาณฝน ${rain} มม.`,
                    cond: this.onCompareCond(cond),
                    time: moment(forecast.time).format('dd Do MMM'),
                    key
                }
            })
            const { tc_max, tc_min } = forecasts[0].data
            let tc_maxR = tc_max
            let tc_minR = tc_min
            this.onSetPlantConditionText(tc_maxR, tc_minR)
            let avgRain = sumRain / forecasts.length
            this.setState({
                weatherForecast: forecastResult,
                avgRain: `ปริมาณน้ำฝนรวม ${forecastDays} วัน ${sumRain.toFixed(2)} มิลลิเมตร เฉลี่ย ${avgRain.toFixed(2)} มิลลิเมตรต่อวัน`,
                isFetchingWeather: false
            })
        } else {

        }
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
    handleToggleWeaterDialog = () => {
        const { isWeaterOpen } = this.state
        this.setState({ isWeaterOpen: !isWeaterOpen })
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
    onCompareCassavaCondition = (temperature) => {
        const { minStopGrowth, maxStopGrowth, minGoodGrowth,
            maxGoodGrowth, minCanGrowth1, maxCanGrowth1,
            minCanGrowth2, maxCanGrowth2 } = cassava
        if (temperature <= minStopGrowth || temperature >= maxStopGrowth) {
            return 'มันสำปะหลังอาจเติบโตได้น้อยลง'
        }
        if (inRange(temperature, minGoodGrowth, maxGoodGrowth)) {
            return 'มันสำปะหลังเติบโตได้ดี'
        }
        if (inRange(temperature, minCanGrowth1, maxCanGrowth1) || inRange(temperature, minCanGrowth2, maxCanGrowth2)) {
            return 'มันสำปะหลังเติบโตได้'
        }
    }
    onCompareCornCondition = (temperature) => {
        const { minStopGrowth, maxStopGrowth, minGoodGrowth,
            maxGoodGrowth, minCanGrowth, maxCanGrowth, } = corn

        if (temperature <= minStopGrowth || temperature >= maxStopGrowth) {
            return 'ข้าวโพดอาจเติบโตได้น้อยลง'
        }
        if (inRange(temperature, minGoodGrowth, maxGoodGrowth)) {
            return 'ข้าวโพดเติบโตได้ดี'
        }
        if (inRange(temperature, minCanGrowth, maxCanGrowth)) {
            return 'ข้าวโพดเติบโตได้'
        }
    }
    onCompareSugarcaneCondition = (temperature) => {
        const { minStopGrowth, maxStopGrowth, minGoodGrowth, maxGoodGrowth } = sugarcane
        if (temperature <= minStopGrowth || temperature >= maxStopGrowth) {
            return 'อ้อยอาจเติบโตได้น้อยลง'
        }
        if (inRange(temperature, minGoodGrowth, maxGoodGrowth)) {
            return 'อ้อยเติบโตได้ดี'
        }
    }
    onSetPlantConditionText = (tmax, tmin) => {
        let tmaxR = Math.round(tmax)
        let tminR = Math.round(tmin)
        let plantCondition = [
            {
                temperature: `ที่อุณหภูมิ ${tmaxR} °C`,
                condition: [
                    `${this.onCompareRiceCondition(tmaxR)}`,
                    `${this.onCompareCassavaCondition(tmaxR)}`,
                    `${this.onCompareSugarcaneCondition(tmaxR)}`,
                    `${this.onCompareCornCondition(tmaxR)}`,
                ],
                key: shortid.generate()
            },
            {
                temperature: `ที่อุณหภูมิ ${tminR} °C`,
                condition: [
                    `${this.onCompareRiceCondition(tminR)}`,
                    `${this.onCompareCassavaCondition(tminR)}`,
                    `${this.onCompareSugarcaneCondition(tminR)}`,
                    `${this.onCompareCornCondition(tminR)}`,
                ],
                key: shortid.generate()
            },
        ]
        this.setState({ plantCondition })
    }
    onSetFetchingWeather = () => {
        this.setState({ isFetchingWeather: true })
    }
    onSetFinishFetchWeather = () => {
        this.setState({ isFetchingWeather: false })
    }
    render() {
        const { weatherForecast, avgRain, isWeaterOpen, isFetchingWeather, plantCondition } = this.state
        return (

            <div>

                <Button variant="contained" className="buttonWeather" onClick={this.handleToggleWeaterDialog}>
                    <div className="leftIcon ButtonHowtoIconColor">
                        <IconWeather />
                    </div>


                    <div className="TextLargeSize">
                        พยากรณ์อากาศ
                    </div>
                </Button>

                <Dialog
                    fullWidth
                    //maxWidth='xl'
                    open={isWeaterOpen}
                    onClose={this.handleToggleWeaterDialog}

                >
                    <DialogTitle>{"พยากรณ์อากาศ"}</DialogTitle>
                    <DialogContent >
                        <div>
                            <WeatherForecastInterface
                                onGetWeatherForecastResult={this.onGetWeatherForecastResult}
                                onSetFetchingWeather={this.onSetFetchingWeather}
                                isFetchingWeather={this.state.isFetchingWeather}
                            />
                            {
                                isFetchingWeather ?
                                    'กำลังโหลด...' :
                                    <div>
                                        {
                                            plantCondition.map(data => {
                                                const { key, temperature, condition } = data
                                                return (
                                                    <div className="FrameWeatherData"
                                                        key={key}
                                                    >
                                                        <div >
                                                            {temperature}
                                                        </div>
                                                        {condition.map((cond, index) => {
                                                            return (
                                                                <div key={index}>
                                                                    {cond}
                                                                </div>
                                                            )
                                                        })}

                                                    </div>
                                                )
                                            })
                                        }
                                        {avgRain && <div className="FrameWeatherRain">
                                            {avgRain}
                                        </div>}
                                        <div>
                                            {
                                                weatherForecast.map(forecast => {
                                                    const { cond, rain, time, tc_max, tc_min, rh, key } = forecast
                                                    const { condPic, condText } = cond
                                                    return (
                                                        <div
                                                            key={key}
                                                            className="FrameCardWeather"
                                                            onClick={() => this.onSetPlantConditionText(tc_max, tc_min)}
                                                        >
                                                            <div>{time}</div>
                                                            <img src={condPic} alt='condition' />
                                                            <div>{condText}</div>
                                                            <div>สูงสุด {tc_max} °C</div>
                                                            <div>ต่ำสุด {tc_min} °C</div>
                                                            <div>{rain}</div>
                                                            <div>{rh}</div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                            }
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" className="buttonCloseWeather" onClick={this.handleToggleWeaterDialog} autoFocus>
                            ปิด
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}
export default WeatherForecastDisplay


function inRange(x, min, max) {
    return ((x - min) * (x - max) <= 0);
}