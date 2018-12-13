import React from 'react';
import '../components/SearchBoxStyles.css'
import TextField from '@material-ui/core/TextField'
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Cancel from '@material-ui/icons/Cancel';


const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing.unit,
  },
  withoutLabel: {
    marginTop: theme.spacing.unit * 3,
  },
  textField: {
    flexBasis: 200,
  },

});

class SearchBox extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchText: ''
    }
    this.searchBox = null
    this.markers = []
    this.bounds = false
    this.inputBox = null
  }
  componentDidMount() {
    this.renderSearchBox()
  }
  renderSearchBox = () => {
    var self = this
    this.inputBox = document.getElementById('pac-input');
    if (!this.searchBox) {
      this.searchBox = new window.google.maps.places.SearchBox(this.inputBox);
      // Bias the SearchBox results towards current map's viewport.
      window.google.maps.event.addListener(window.map, 'bounds_changed', function () {
        self.searchBox.setBounds(window.map.getBounds());
      })
      this.markers = [];
      // Listen for the event fired when the user selects a prediction and retrieve
      // more details for that place.
      window.google.maps.event.addListener(this.searchBox, 'places_changed', function () {
        var places = self.searchBox.getPlaces();
        if (places.length === 0) {
          return;
        }
        // Clear out the old markers.
        self.markers.forEach((marker) => {
          marker.setMap(null);
        });
        self.markers = [];

        // For each place, get the icon, name and location.
        self.bounds = new window.google.maps.LatLngBounds();
        places.forEach((place) => {
          if (!place.geometry) {
            console.log("Returned place contains no geometry");
            return;
          }
          // Create a marker for each place.
          self.markers.push(new window.google.maps.Marker({
            map: window.map,
            // icon: icon,
            title: place.name + ' ' + place.formatted_address,
            position: place.geometry.location
          }));

          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            self.bounds.union(place.geometry.viewport);
          } else {
            self.bounds.extend(place.geometry.location);
          }
        });
        window.map.fitBounds(self.bounds);
      })
    }
  }
  onClearPlaceMarker = () => {
    this.markers.forEach(marker => {
      marker.setMap(null)
    })
    this.setState({ searchText: '' })
  }
  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  render() {
    const { classes } = this.props
    return (
      <TextField
        id="pac-input"
        className={classNames(classes.margin, classes.textField)}
        //className={classes.margin}
        type="text"
        variant="outlined"
        placeholder="ค้นหาสถานที่"
        value={this.state.searchText}
        onChange={this.onChange}
        name='searchText'
        margin="normal"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end" className="Setsearchcancel">

              <IconButton
                aria-label="Toggle password visibility"
                onClick={this.onClearPlaceMarker}

              >
                <Cancel />
              </IconButton>

            </InputAdornment>
          ),
        }}
      />
    )
  }
}
export default withStyles(styles)(SearchBox)