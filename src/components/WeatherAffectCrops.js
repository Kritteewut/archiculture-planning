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

        }
    }
    onCompareRiceCondition = () => {
        const { wheatherForecast } = this.props
        const { tc_max, tc_min } = wheatherForecast[0]
        if (tc_max > rice.maxStopGrowth || tc_min < rice.minStopGrowth) {
            return 'ข้าวหยุดการเจริญเติบโต'
        }
      
    }
    onSetRiceText = () => {

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
    onCompareCassavaCondition = () => {

    }
    onCompareCornCondition = () => {

    }
    onCompareSugarcaneCondition = () => {

    }
    render() {
        return (
            <div>
                <div>
                    w
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