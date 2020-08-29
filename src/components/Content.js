// dependencies
import React, { Component } from 'react';
import axios from 'axios';
import uuidv4 from 'uuid/v4';

// components
import SearchBar from './search/SearchBar'
import RestaurantPanel from './RestaurantPanel'
import Loading from './Loading'
import { SearchProvider, SearchConsumer } from './search/SearchContext'

// constants
import Constants from './Constants'

class Content extends Component {

  constructor(props) {
    super(props);
    this.state = {
      restaurants: [],
      showLoading: false,
      modifyOrig: false,
      responseId: '',
      currentPage: 1,
      totalCount: 0,
    }
    this.searchByValue = this.searchByValue.bind(this)
    this.switchPages = this.switchPages.bind(this)
    this.allConstants = new Constants()
    
  }




  componentDidMount() {
    this.getRestaurants()
  }

  searchByValue(event) {
    const { allConstants } = this
    if (event) {
      event.persist()
      let id = event.target.id
      console.log('Function clicked from COntext', id)

      let searchType = id.substring(0, id.indexOf('-'))
      let searchValue = id.substr(id.indexOf('-') + 1)
      
      // define the data
      let data = {}
      let { searchText } = this.props;
      data['name'] = searchText;

      // define url
      let url = allConstants.getRestaurants.replace('{value}', '')
      
      // API call to the back end
      this.getRestaurants(url, data)

    } else if (this.state.searchText != "") {
      // if ENTER key is pressed
      console.log('ENTER key pressed / SEARCH button clicked...', this.state.searchText)

      // API call to the back end
      this.getRestaurants()
    }
  }

  switchPages(pageNumber) {
    const { allConstants } = this
    let url = allConstants.getRestaurants.replace('{value}', '')
    let data = {}
    data['name'] = this.props.searchText;
    data['page'] = pageNumber;
    this.getRestaurants(url, data, pageNumber)
  }
  // get all the restaurants
  getRestaurants(url, data, pageNumber=1) {
    // set state to show the Loading icon
    this.setState({ showLoading: true })
    const { allConstants } = this

    let searchText = (this.state.searchText && (this.props.searchText !== this.state.searchText)) ? this.state.searchText : this.props.searchText
    let axiosConfig = {
      url: (url) ? url : allConstants.getRestaurants.replace('{value}', searchText),
      method: allConstants.method.POST,
      header: allConstants.header
    }

    if (data) {
      axiosConfig["data"] = data
    }

    axios(axiosConfig)
      .then((res) => {
        console.log('Response from back end', res.data)
        // add the response along with an unique id for each response
        this.setState({ 
          restaurants: [...res.data[0]], 
          showLoading: 
          false, 
          modifyOrig: true, 
          responseId: uuidv4(),
          totalCount: res.data[1],
          currentPage: pageNumber,
        })
      })
      .catch((err) => {
        console.log('unable to get the data', err)
      })
  }

  render() {

    let { restaurants, showLoading, modifyOrig, responseId, totalCount,currentPage } = this.state
    let { searchText, searchTextChange } = this.props;
    // console.log('State in the Content', this.state)

    return (
      <div className="content-div">
        <div className="content-div-search-bar">
          <SearchBar
            searchByValue={this.searchByValue}
            searchTextChange={searchTextChange} 
            searchText={searchText} />
        </div>
        {(showLoading == true) ? <Loading /> : null}
        <SearchProvider value={this.searchByValue}>
          <RestaurantPanel 
            showLoading={showLoading} 
            restaurants={restaurants} 
            modifyOrig={modifyOrig} 
            responseId={responseId} 
            currentPage={currentPage}
            totalCount={totalCount}
            switchPages={this.switchPages}
          />
        </SearchProvider>
      </div>
    );
  }
}

export default Content;