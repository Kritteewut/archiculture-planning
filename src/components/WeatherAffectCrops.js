import React from 'react'
//in C temperature
const rice = {

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

}
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
    render() {
        return (
            <div>

            </div>
        )
    }

}
export default WeatherAffectCrops

function inRange(x, min, max) {
    return ((x - min) * (x - max) <= 0);
}