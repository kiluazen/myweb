import React, { useState, useEffect } from 'react';
import { commerce } from '../lib/commerce';
import { ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/router';

function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const cart = await commerce.cart.retrieve();
      setCart(cart);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    try {
      if (cart.hosted_checkout_url) {
        router.push(cart.hosted_checkout_url);
      } else {
        console.error('Hosted checkout URL not available');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      {cart && cart.line_items && cart.line_items.length ? (
        <>
          {cart.line_items.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b py-4">
              <div className="flex items-center">
                <img src={item.image.url} alt={item.name} className="w-16 h-16 object-cover mr-4" />
                <div>
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                </div>
              </div>
              <div>
                <p className="text-gray-600">{item.line_total.formatted_with_symbol}</p>
              </div>
            </div>
          ))}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-semibold">Total:</span>
              <span className="text-xl">{cart.subtotal.formatted_with_symbol}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex items-center justify-center"
            >
              <ShoppingBag className="mr-2" />
              Proceed to Checkout
            </button>
          </div>
        </>
      ) : (
        <p>Your cart is empty. <a href="/" className="text-blue-500 hover:underline">Continue shopping</a></p>
      )}
    </div>
  );
}

export default CheckoutPage;