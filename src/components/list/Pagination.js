import React from 'react';
import Pagination from 'react-bootstrap/Pagination';
import 'bootstrap/dist/css/bootstrap.min.css';

const PaginationCustom = (props) => {
let {currentPage , totalCount, switchPages} = props;
let active = 2;
let perPageCount =50;
let numberOfPages = totalCount/perPageCount;
// alert(numberOfPages);
let items = [];
for (let number = 1; number <= numberOfPages; number++) {
  items.push(
    <Pagination.Item key={number} active={number === currentPage} onClick={() => switchPages(number)}>
      {number}
    </Pagination.Item>,
  );
}

  let { restaurants } = props 

  return (
    <div className="all-restaurants">
      <div>
        <Pagination>{items}</Pagination>
        <br />
      </div>
    </div>
  );
};



export default PaginationCustom;