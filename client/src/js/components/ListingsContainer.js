import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import scriptLoader from 'react-async-script-loader';

import { refresh, query } from '../actions/location';
import { loadListings } from '../actions/listings';

import Search from './Search';
import Listings from './Listings';
import Map from './Map';

class ListingsContainer extends Component {
  componentDidMount () {
    const { latitude, longitude, refreshLocation, loadListings } = this.props;
    
    refreshLocation();
    
    if(latitude && longitude) {
      loadListings(latitude, longitude, 1);
    }
  }

  componentWillReceiveProps(newProps) {
    const { isScriptLoaded, isScriptLoadSucceed, locationLoaded, latitude, longitude, loadListings } = newProps;

    if(this.props.longitude !== longitude || this.props.latitude !== latitude) {
      loadListings(latitude, longitude, 1);
    }
  }

  // TODO: handle linking between sidebar and map (when clicking sidebar it opens info window on map view)

  render() {
    const { latitude, longitude, listings, query, refreshLocation } = this.props;

    return (
      <div className="container">
        <div className="sidebar">
          <Search query={query} refreshLocation={refreshLocation} />
          <Listings listings={listings} />
        </div>
        <div className="main">
          <Map latitude={latitude} longitude={longitude} listings={listings} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, routerProps) => {
  return {
    locationLoaded: state.location.loaded,
    latitude: state.location.latitude,
    longitude: state.location.longitude,
    listings: state.listings
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    refreshLocation: bindActionCreators(refresh, dispatch),
    query: bindActionCreators(query, dispatch),
    loadListings: bindActionCreators(loadListings, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListingsContainer);