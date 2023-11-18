import React from 'react';


function Navbar({ cartItemCount ,setMainPage}) {
  return (
    <nav>
      
      <ul>
        <li>
          <button onClick={() => setMainPage('products')}>Products</button>
        </li>
        <li>
          <button onClick={() => setMainPage('cart')}
          disabled={ cartItemCount === 0}>
            Shopping cart ({cartItemCount})
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
