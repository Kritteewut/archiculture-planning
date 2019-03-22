import React from 'react'
import WheatherForecastLatLng from './WeatherForecastLatLng'
import WheatherForecastPlace from './WeatherForecastPlace'

class WeatherForecastDisplay extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            wheatherForecast: null
        }
    }
    onSetWheatherForecast(wheatherForecast) {
        this.setState({ wheatherForecast })
    }
    render() {
        return (
            <div>
                <WheatherForecastLatLng />
                <WheatherForecastPlace />
            </div>
        )
    }
}
export default WeatherForecastDisplay