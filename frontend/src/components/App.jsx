import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';

import '../css/Store.css';
import ProductList from './ProductList';
import Cart from './Cart';


function App() {
  const [ mainPage , setMainPage]= useState( 'products');
  const [ products , setProducts ] = useState ([]);
  const [ cart, setCart ]= useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [message, setMessage] = useState('');
  const [ProductsRedirected, setProductsRedirected] = useState(false);


  useEffect(() => { fetch('http://localhost:3000/api/productscom')
      .then((response) => response.json())
      .then((d) => {
        setProducts(d);
      })
      .catch((error) => {
        console.error('Error', error);
      });
  }, []);

  const updateProductList = () => {
 fetch('http://localhost:3000/api/productscom')
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error('Error', error);
      });
  };

  const addToCart = (product) => {
    if (0 < product.stock) {
      const updatedToCart = [...cart];

      const itemInCart = updatedToCart.find((item) => item.id === product.id);

      if (itemInCart) {
        itemInCart.quantity += 1;
      } else {
        updatedToCart.push({ ...product, quantity: 1 });
      }

      setCart(updatedToCart);

      const totalCount = updatedToCart.reduce((total, item) => total + item.quantity, 0);
      setCartItemCount(totalCount);

      setProducts((prevProducts) =>
        prevProducts.map((p) => {
          if (p.id === product.id) {
            return { ...p, stock: p.stock - 1 };
          }
          return p;
        })
      );
    }
  };

  const checkout = () => {
  const updatedToCart = [...cart];
  let purchaseSuccessful = true;

  updatedToCart.forEach((item) => {
    const productIndex = products.findIndex((product) => product.id === item.id);
    if (productIndex !== -1) {
      if (products[productIndex].stock >= item.quantity) {
        products[productIndex].stock -= item.quantity;
      } else {
        purchaseSuccessful = false;
      }
    }
  });

  if (purchaseSuccessful) {
    // Update product list immediately
    updateProductList();
  }

  const purchaseData = {
    items: updatedToCart.map((item) => {
      return {
        id: item.id,
        quantity: item.quantity,
      };
    }),
    totalPrice: updatedToCart.reduce((total, item) => total + item.price * item.quantity, 0),
  };

  fetch('http://localhost:3000/api/purchase', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(purchaseData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === ' ! ') {
        setCartItemCount(0);
        setCart([]);
        setMessage('Sorry to see you cancelled your payment!');

        setTimeout(() => {
          setMessage('');
          setMainPage('products');
        }, 3000);
      } else {
        setMessage('Thank you for the purchase!');
      }
    })
    .catch((error) => {
      console.error('Error', error);
      setMessage('Error during purchase');
    });
};


  const emptyTheCart = () => {
    const productsAndUpdateStock = products.map((product) => {
      const itemsCart = cart.find((item) => item.id === product.id);
      if (itemsCart) {
        return { ...product, stock: product.stock + itemsCart.quantity };
      }
      return product;
    });

    setCart([]);
    setProductsRedirected(true);
    setProducts(productsAndUpdateStock);
    setCartItemCount(0);
  
    setMessage(' Back to the webbshop ')
    

    
    setTimeout(() => {
      updateProductList();
      setMainPage('products'); 
      setMessage('');
      
      
    }, 3000);
  };

  return (
    <div>
      <Navbar setMainPage={setMainPage} cartItemCount={cartItemCount} />
      <br/>
      

     
      {ProductsRedirected}
      <br/>
      {message && <p className='theMassage'>{message}</p>}

        {message === '' && (  mainPage === 'products' ? (

            <ProductList products={products} addToCart={addToCart} /> 

          ) : mainPage === 'cart' ? (

            <Cart cart={cart} checkout={checkout}   emptyTheCart={emptyTheCart} products={products} />
          ) : null
        )
      
        }
        
    </div>
  );
}

export default App;
