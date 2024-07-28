import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import Head from 'next/head';
import Image from 'next/image';

const products = [
  { id: 1, name: 'Product 1', price: 19.99, image: '/products/calabi-yau.webp' },
  { id: 2, name: 'Product 2', price: 29.99, image: '/products/helix_2.jpeg' },
  { id: 3, name: 'Product 3', price: 39.99, image: '/products/hyperbloid_1.jpg' },
];

export default function ProductList() {
  const [cartItems, setCartItems] = useState({});
  const [addedItems, setAddedItems] = useState({});

  useEffect(() => {
    // Load Snipcart script
    const script = document.createElement('script');
    script.src = 'https://cdn.snipcart.com/themes/v3.3.1/default/snipcart.js';
    script.async = true;
    document.body.appendChild(script);

    // Initialize Snipcart
    const initSnipcart = () => {
      if (window.Snipcart) {
        window.Snipcart.events.on('cart:ready', (state) => {
          updateCartState(state);
        });
        window.Snipcart.events.on('cart:updated', (state) => {
          updateCartState(state);
        });
      }
    };

    script.onload = initSnipcart;

    // Reset addedItems when component mounts (i.e., when returning to the page)
    setAddedItems({});

    return () => {
      // Clean up
      document.body.removeChild(script);
    };
  }, []);

  const updateCartState = (state) => {
    const newCartItems = {};
    state.items.forEach((item) => {
      newCartItems[item.id] = item.quantity;
    });
    setCartItems(newCartItems);
    
    // Update addedItems based on cart contents
    const newAddedItems = {};
    Object.keys(newCartItems).forEach((id) => {
      newAddedItems[id] = true;
    });
    setAddedItems(newAddedItems);
  };

  const getTotalItemsCount = () => {
    return Object.values(cartItems).reduce((sum, quantity) => sum + quantity, 0);
  };

  const toggleCartItem = (product) => {
    if (addedItems[product.id]) {
      // Remove from cart
      if (window.Snipcart) {
        window.Snipcart.api.cart.items.remove(product.id)
          .then(() => {
            console.log('Item removed from cart');
            setAddedItems(prev => ({ ...prev, [product.id]: false }));
          })
          .catch((error) => {
            console.error('Error removing item from cart:', error);
          });
      }
    } else {
      // Add to cart
      if (window.Snipcart) {
        window.Snipcart.api.cart.items.add({
          id: product.id,
          name: product.name,
          price: product.price,
          url: '/products',
          image: product.image
        }).then(() => {
          console.log('Item added to cart');
          setAddedItems(prev => ({ ...prev, [product.id]: true }));
        }).catch((error) => {
          console.error('Error adding item to cart:', error);
        });
      }
    }
  };

  return (
    <div className="container mx-auto px-4">
      <Head>
        <title>Our Products</title>
        <link rel="preconnect" href="https://app.snipcart.com" />
        <link rel="preconnect" href="https://cdn.snipcart.com" />
        <link rel="stylesheet" href="https://cdn.snipcart.com/themes/v3.3.1/default/snipcart.css" />
      </Head>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Our Products</h1>
        <button className="snipcart-checkout flex items-center">
          <ShoppingCart className="h-6 w-6 mr-2" />
          <span className="snipcart-items-count">{getTotalItemsCount()}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 shadow-md">
            <Image src={product.image} alt={product.name} width={300} height={200} className="w-full h-48 object-cover mb-4" />
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-4">${product.price.toFixed(2)}</p>
            <button
              className={`w-full px-4 py-2 rounded ${
                addedItems[product.id] 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white transition-colors duration-300`}
              onClick={() => toggleCartItem(product)}
            >
              {addedItems[product.id] ? 'Added' : 'Add to Cart'}
            </button>
          </div>
        ))}
      </div>

      <div 
        hidden 
        id="snipcart" 
        data-api-key={process.env.PUBLIC_SNIPCART_API_KEY}
        data-config-add-product-behavior="none"
      ></div>
    </div>
  );
}