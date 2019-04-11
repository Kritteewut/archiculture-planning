import React from 'react'
//in C temperature
const rice = {
    minGoodGrowth: 25,
    maxGoodGrowth: 33,
    minCanGrowth1: 34,
    maxCanGrowth1: 40,
    minCanGrowth2: 15,
    maxCanGrowth2: 24,
    minStopGrowth: 14,
    maxStopGrowth: 41,
}
const corn = {
    minStopGrowth: 20,
    maxStopGrowth: 36,
    minGoodGrowth: 21,
    maxGoodGrowth: 27,
    minCanGrowth: 28,
    maxCanGrowth: 35,
}
const sugarcane = {
    minGoodGrowth: 18,
    maxGoodGrowth: 35,
    minStopGrowth: 17,
    maxStopGrowth: 36,
}
//มันสำปะหลัง
const cassava = {
    minStopGrowth: 15,
    maxStopGrowth: 37,
    minGoodGrowth: 25,
    maxGoodGrowth: 29,
    minCanGrowth1: 16,
    maxCanGrowth1: 24,
    minCanGrowth2: 30,
    maxCanGrowth2: 39,
}
class WeatherAffectCrops extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            riceMinCond: '',
        }
    }
    onSetRiceText = () => {
        const { wheatherForecast } = this.props

        const { tc_max, tc_min } = wheatherForecast[0]
        this.onCompareRiceCondition(tc_max)

    }
    onSetSugarcaneText = () => {
        const { wheatherForecast } = this.props
        const { tc_max, tc_min } = wheatherForecast[0]
    }
    onSetCornText = () => {
        const { wheatherForecast } = this.props
        const { tc_max, tc_min } = wheatherForecast[0]
    }
    onSetCassavaText = () => {
        const { wheatherForecast } = this.props
        const { tc_max, tc_min } = wheatherForecast[0]
    }
    onCompareRiceCondition = (temperature) => {
        const { minStopGrowth, maxStopGrowth, minGoodGrowth,
            maxGoodGrowth, minCanGrowth1, maxCanGrowth1,
            minCanGrowth2, maxCanGrowth2 } = rice
        if (temperature < minStopGrowth || temperature > maxStopGrowth) {
            return 'ข้าวอาจหยุดการเจริญเติบโต'
        }
        if (inRange(temperature, minGoodGrowth, maxGoodGrowth)) {
            return 'ข้าวเจริญเติบโตได้ดี'
        }
        if (inRange(temperature, minCanGrowth1, maxCanGrowth1) || inRange(temperature, minCanGrowth2, maxCanGrowth2)) {
            return 'ข้าวสามารถเติบโตได้'
        }
    }
    onCompareCassavaCondition = (temperature) => {
        const { minStopGrowth, maxStopGrowth, minGoodGrowth,
            maxGoodGrowth, minCanGrowth1, maxCanGrowth1,
            minCanGrowth2, maxCanGrowth2 } = cassava
        if (temperature < minStopGrowth || temperature > maxStopGrowth) {
            return 'มันสำปะหลังอาจหยุดการเจริญเติบโต'
        }
        if (inRange(temperature, minGoodGrowth, maxGoodGrowth)) {
            return 'มันสำปะหลังเจริญเติบโตได้ดี'
        }
        if (inRange(temperature, minCanGrowth1, maxCanGrowth1) || inRange(temperature, minCanGrowth2, maxCanGrowth2)) {
            return 'มันสำปะหลังสามารถเติบโตได้'
        }
    }
    onCompareCornCondition = (temperature) => {
        const { minStopGrowth, maxStopGrowth, minGoodGrowth,
            maxGoodGrowth, minCanGrowth, maxCanGrowth, } = corn

        if (temperature < minStopGrowth || temperature > maxStopGrowth) {
            return 'ข้าวโพดอาจหยุดการเจริญเติบโต'
        }
        if (inRange(temperature, minGoodGrowth, maxGoodGrowth)) {
            return 'ข้าวโพดหลังเจริญเติบโตได้ดี'
        }
        if (inRange(temperature, minCanGrowth, maxCanGrowth)) {
            return 'ข้าวโพดหลังสามารถเติบโตได้'
        }
    }
    onCompareSugarcaneCondition = (temperature) => {
        const { minStopGrowth, maxStopGrowth, minGoodGrowth, maxGoodGrowth } = cassava
        if (temperature < minStopGrowth || temperature > maxStopGrowth) {
            return 'อ้อยอาจหยุดการเจริญเติบโต'
        }
        if (inRange(temperature, minGoodGrowth, maxGoodGrowth)) {
            return 'อ้อยเจริญเติบโตได้ดีได้'
        }
    }
    render() {
        return (
            <div>
                <div>
                    {this.onSetRiceText()}
                </div>
                <div>
                    a
                </div>
                <div>
                    it
                </div>
            </div>
        )
    }

}
export default WeatherAffectCrops

function inRange(x, min, max) {
    return ((x - min) * (x - max) <= 0);
}