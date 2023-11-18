import React, { useState } from 'react';

function ProductList({ products, addToCart }) {
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const sortedProducts = [...products];

  if (sortOrder === 'asc') {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else {
    sortedProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="product-list">
      <div className="search-form">
        <input
          type="text"
          className="search-input"
          placeholder="Search for a product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => setSortOrder('asc')} className="search-button">
          Sort Ascending
        </button>
        <button onClick={() => setSortOrder('desc')} className="search-button">
          Sort Descending
        </button>
      </div>

      {sortedProducts
        .filter((product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((product) => (
          <div className="product-item" key={product.id}>
            <h2 className="product-name">{product.title}</h2>
            <div className="product-image-container">
              <img className="product-image" src={product.image} alt={product.title} />
            </div>
            <p className="product-price">Price: {product.price} kr</p>
            <p className="product-stock">Inventory balance: {product.stock}</p>

            {product.stock > 0 ? (
              <button className="add-to-cart-button" onClick={() => addToCart(product)}>
                Add to cart
              </button>
            ) : (
              <p className='slut-text'>Out of stock</p>
            )}
          </div>
        ))}
    </div>
  );
}

export default ProductList;
