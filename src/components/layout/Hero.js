import React, { Component } from 'react';

// components
import SearchBar from '../search/SearchBar'

class Hero extends Component {
  constructor(props) {
    super(props);
    this.searchText = this.props.searchText;
  }

  render() {
    let { searchByValue, searchTextChange, searchText } = this.props
    return (
      <div className="hero-div">
        <div className="find-title">Find the best restaurants, cafés, and bars</div>
        <SearchBar
          searchText={searchText}
          searchTextChange={searchTextChange}
          searchByValue={searchByValue} 
          classForm='search-bar-upper'/>
      </div>
    );
  }
};



export default Hero;