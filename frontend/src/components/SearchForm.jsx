import React, { useState } from 'react';

function SearchForm({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    onSearch(searchTerm);
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Search for a product"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      
    </div>
  );
}

export default SearchForm;
