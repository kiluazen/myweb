import React, { useState, useEffect } from 'react';
import { commerce } from '../lib/commerce';
import { ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/router';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [localCart, setLocalCart] = useState({});
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await commerce.products.list();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addToCart = (productId) => {
    setLocalCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const removeFromCart = (productId) => {
    setLocalCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      // Create a new cart in Commerce.js
      const cart = await commerce.cart.refresh();

      // Add items from local cart to Commerce.js cart one by one
      for (const [productId, quantity] of Object.entries(localCart)) {
        const response = await commerce.cart.add(productId, quantity);
        console.log(`Added product ${productId} to cart:`, response);
      }

      // Retrieve the updated cart
      const updatedCart = await commerce.cart.retrieve();
      console.log('Retrieved cart:', updatedCart);
      
      if (updatedCart.hosted_checkout_url) {
        router.push(updatedCart.hosted_checkout_url);
      } else {
        console.error('Hosted checkout URL not available');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      if (error.data) {
        console.error('Error details:', error.data);
      }
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleShoppingCart = async () => {
    setIsCheckingOut(true);
    try {
      // Create a new cart in Commerce.js
      const cart = await commerce.cart.refresh();

      // Add items from local cart to Commerce.js cart
      for (const [productId, quantity] of Object.entries(localCart)) {
        await commerce.cart.add(productId, quantity);
      }

      // Navigate to the checkout page
      router.push('/checkout');
    } catch (error) {
      console.error('Error updating cart:', error);
    } finally {
      setIsCheckingOut(false);
    }
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Our Products</h1>
        <div className="relative">
          <button onClick={() => handleShoppingCart()}>
            <ShoppingCart className="h-6 w-6" />
            {Object.keys(localCart).length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                {Object.values(localCart).reduce((total, quantity) => total + quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 shadow-md">
            {product.image && (
              <img src={product.image.url} alt={product.name} className="w-full h-48 object-cover mb-4" />
            )}
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-4">{product.price.formatted_with_symbol}</p>
            <button
              onClick={() => addToCart(product.id)}
              className={`px-4 py-2 rounded ${
                localCart[product.id] ? 'bg-green-500 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {localCart[product.id] ? 'Added' : 'Add to Cart'}
            </button>
            {localCart[product.id] && (
              <>
                <button
                  onClick={() => removeFromCart(product.id)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 ml-2"
                >
                  -
                </button>
                <span className="mx-2">{localCart[product.id]}</span>
                <button
                  onClick={() => addToCart(product.id)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  +
                </button>
              </>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={handleCheckout}
        disabled={isCheckingOut}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex items-center justify-center mt-8"
      >
        {isCheckingOut ? (
          <>
            <span className="mr-2">Processing</span>
            <span className="animate-pulse">...</span>
          </>
        ) : (
          'Proceed to Checkout'
        )}
      </button>
    </div>
  );
}

export default ProductList;