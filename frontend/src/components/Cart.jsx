import React from 'react';
import CartItem from './CartContext';

function Cart({ cart, checkout, emptyTheCart, products }) {
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className='cart-view'>
      <h2>Shopping Cart</h2>
      <ul>
        {cart.map((item) => (
          <CartItem key={item.id} item={item} products={products} />
        ))}
      </ul>
      <p>Total: {totalPrice} kr</p>
      <div className='pay-button'>
      <button onClick={checkout}>Pay</button>
      <br /><br />
      <button onClick={emptyTheCart}>Empty the cart</button>
      </div>
    </div>
  );
}

export default Cart;
