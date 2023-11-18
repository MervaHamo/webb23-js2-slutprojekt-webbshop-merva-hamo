import React from 'react';

//only product card

function Product({ addToCart , product}) {
  return (
    <li>
      <img  alt={product.name} src={product.image} />
      <h3>{product.name}</h3>
      <p>Price: {product.price} kr</p>
      <p>Stock: {product.stock}</p>


    
    </li>
  );
}

export default Product;
