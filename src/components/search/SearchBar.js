import React from "react";

const SearchBar = ({
  searchText,
  searchTextChange,
  searchByValue,
  classForm = "search-bar",
}) => {
  return (
    <div className={classForm}>
      <input
        className="search-box"
        type="text"
        value={searchText}
        onKeyPress={searchTextChange}
        onChange={searchTextChange}
        placeholder="Search restaurants by name, cuisines etc."
      />
      <button className="btn search-btn" onClick={searchByValue}>
        {" "}
        search
      </button>
    </div>
  );
};

export default SearchBar;
