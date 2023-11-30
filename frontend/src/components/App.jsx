import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import ProductList from './ProductList';
import Cart from './Cart';

import '../css/Store.css';

function App() {
  const [mainPage, setMainPage] = useState('products');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [message, setMessage] = useState('');
  const [ProductsRedirected, setProductsRedirected] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/api/productscom')
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error('Error', error);
      });
  }, []);

  const updateProductList = () => {
    fetch('http://localhost:3000/api/purchaseindex')
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error('Error', error);
      });
  };

  const addToCart = (product) => {
    if (product.stock > 0) {
      const updatedCart = [...cart];
      const itemInCart = updatedCart.find((item) => item.id === product.id);

      if (itemInCart) {
        itemInCart.quantity += 1;
      } else {
        updatedCart.push({ ...product, quantity: 1 });
      }

      setCart(updatedCart);

      const updatedProducts = products.map((p) => {
        if (p.id === product.id) {
          return { ...p, stock: p.stock - 1 };
        }
        return p;
      });

      setProducts(updatedProducts);

      const totalCount = updatedCart.reduce((total, item) => total + item.quantity, 0);
      setCartItemCount(totalCount);
    }
  };

  const checkout = async () => {
    try {
      // Define your purchase data here
      const purchaseData = {
        items: cart.map((item) => ({ id: item.id, quantity: item.quantity })),
        // Add any other details specific to your server's purchase data structure
      };
  
      const response = await fetch('http://localhost:3000/api/purchaseindex', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(purchaseData),
      });
  
      console.log('Full HTTP response:', response);
  
      if (response.ok) {
        const data = await response.json();
  
        if (data.message === ' ! ') {
          setCartItemCount(0);
          setCart([]);
          setMessage('Sorry to see you cancelled your payment!');
  
          setTimeout(() => {
            setMessage('');
            setMainPage('products');
          }, 3000);
        } else {
          // Update product stock
          const updatedProducts = products.map((p) => {
            const itemInCart = cart.find((item) => item.id === p.id);
            if (itemInCart) {
              return { ...p, stock: p.stock - itemInCart.quantity };
            }
            return p;
          });
  
          setProducts(updatedProducts);
          setCartItemCount(0);
          setCart([]);
          setMessage('Thank you for the purchase!');
        }
      } else {
        throw new Error('HTTP response not OK');
      }
    } catch (error) {
      console.error('Error during purchase:', error.message);
      setMessage('Error during purchase: ' + error.message);
    }
  };
  
  

  const emptyTheCart = () => {
    const productsAndUpdateStock = products.map((product) => {
      const itemInCart = cart.find((item) => item.id === product.id);
      if (itemInCart) {
        return { ...product, stock: product.stock + itemInCart.quantity };
      }
      return product;
    });

    setCart([]);
    setProductsRedirected(true);
    setProducts(productsAndUpdateStock);
    setCartItemCount(0);

    setMessage('Back to the webbshop');

    setTimeout(() => {
      updateProductList();
      setMainPage('products');
      setMessage('');
    }, 3000);
  };

  return (
    <div>
      <Navbar setMainPage={setMainPage} cartItemCount={cartItemCount} />
      <br />

      {ProductsRedirected}
      <br />
      {message && <p className='theMassage'>{message}</p>}

      {message === '' && (mainPage === 'products' ? (
        <ProductList products={products} addToCart={addToCart} />
      ) : mainPage === 'cart' ? (
        <Cart cart={cart} checkout={checkout} emptyTheCart={emptyTheCart} products={products} />
      ) : null)}
    </div>
  );
}

export default App;

