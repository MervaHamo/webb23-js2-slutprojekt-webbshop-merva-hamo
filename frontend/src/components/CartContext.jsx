import React from 'react';

function CartItem({ products,item }) {
  const product = products.find((product) => product.id === item.id);
  const originalPrice = product.price;

  return (
    <div className='list-cart' key={item.id}>
      {item.name} x{item.quantity} - {originalPrice} kr
    </div>
  );
}

export default CartItem;
