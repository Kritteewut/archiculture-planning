import React from 'react'
import Button from '@material-ui/core/Button';

class WeatherForecastLatLng extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    onForecastWheaterFromLatLng = () => {
        const { onFetchWheatherForecast, forecastDays } = this.props
        navigator.geolocation.getCurrentPosition(position => {
            let positions = { lat: position.coords.latitude, lng: position.coords.longitude }
            let url = `https://data.tmd.go.th/nwpapi/v1/forecast/location/daily/at?lat=${positions.lat}&lon=${positions.lng}&fields=tc_min,tc_max,rh,cond,rain,rh&duration=${forecastDays}`
            onFetchWheatherForecast(url)
        })
    }
    render() {
        return (
            <Button onClick={this.onForecastWheaterFromLatLng}>อิงจากตำแหน่ง</Button>
        )
    }
}
export default WeatherForecastLatLng