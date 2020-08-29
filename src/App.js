import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';

// components 
import Header from './components/layout/Header';
import Content from './components/Content';
import Hero from './components/layout/Hero'


// css
import './css/style.css'


class App extends Component {
  // static propTypes = {
  //   className: PropTypes.string,
  // };

  constructor(props) {
    super(props);

    this.state = {
      showContent: false,
      searchText: ''
    }
    this.searchByValue = this.searchByValue.bind(this)
    this.searchTextChange = this.searchTextChange.bind(this)
  }

  searchByValue() {
    console.log('Search text is now', searchText)
    let { searchText } = this.state;
    this.setState({ showContent: true, searchText })
  }

  searchTextChange (event)  {
    event.persist()
    // change the state with the value typed in the search box
    this.setState({ searchText: event.target.value })

    if (event.keyCode == 13 || event.which == 13) {
      this.searchByValue()
    }
  }


  render() {
    let { showContent, userInfo, searchByValue, searchText } = this.state;
    return (
      <BrowserRouter>
        <div className="container" style={{minWidth : "100%"}} >
          { /* including the Title and other components */}
          <Header />
          {
          (showContent == false)
            ? <Hero searchByValue={this.searchByValue} classFomr="" searchText={searchText}  searchTextChange={this.searchTextChange} />
            : <Content searchText={searchText} userInfo={userInfo} searchTextChange={this.searchTextChange} />
            }

        </div>
      </BrowserRouter>
    );
  }
}

export default App;