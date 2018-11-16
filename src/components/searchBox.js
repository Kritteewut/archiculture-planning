import React from 'react';
import '../components/SearchBoxStyles.css'

class SearchBox extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {}
    this.searchBox = false
    this.markers = []
    this.bounds = false
  }
  componentWillUnmount() {
    if (this.searchBox !== false) {
      this.searchBox = false
    }
  }

  renderSearchBox = () => {
    if (this.searchBox === false) {
      var input = document.getElementById('pac-input');
      this.searchBox = new window.google.maps.places.SearchBox(input);
      // Bias the SearchBox results towards current map's viewport.
      window.map.addListener('bounds_changed', () => {
        this.searchBox.setBounds(window.map.getBounds());
      });

      this.markers = [];
      // Listen for the event fired when the user selects a prediction and retrieve
      // more details for that place.
      this.searchBox.addListener('places_changed', () => {
        var places = this.searchBox.getPlaces();

        if (places.length === 0) {
          return;
        }

        // Clear out the old markers.
        this.markers.forEach((marker) => {
          marker.setMap(null);
        });
        this.markers = [];

        // For each place, get the icon, name and location.
        this.bounds = new window.google.maps.LatLngBounds();
        console.log("place", places);
        places.forEach((place) => {
          if (!place.geometry) {
            console.log("Returned place contains no geometry");
            return;
          }
          // Create a marker for each place.
          this.markers.push(new window.google.maps.Marker({
            map: window.map,
            // icon: icon,
            title: place.name,
            position: place.geometry.location
          }));

          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            this.bounds.union(place.geometry.viewport);
          } else {
            this.bounds.extend(place.geometry.location);
          }
        });
        window.map.fitBounds(this.bounds);
      });
    }
  }

  render() {
    this.renderSearchBox()
    return (null)
  }
}

export default SearchBox