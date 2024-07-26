import React, { useState, useEffect } from 'react';
import { commerce } from '../lib/commerce';
import { ShoppingCart } from 'lucide-react';

function ProductList({ products: initialProducts }) {
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const cart = await commerce.cart.retrieve();
      setCart(cart);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const handleAddToCart = async (productId) => {
    console.log('Add to Cart clicked')
    try {
      const { cart } = await commerce.cart.add(productId, 1);
      setCart(cart);
      
      setProducts(products.map(product => 
        product.id === productId ? { ...product, inCart: true } : product
      ));
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Our Products</h1>
        <div className="relative">
          <ShoppingCart className="h-6 w-6" />
          {cart && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
              {cart.total_items}
            </span>
          )}
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
              onClick={() => handleAddToCart(product.id)}
              className={`px-4 py-2 rounded ${
                product.inCart
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
              disabled={product.inCart}
            >
              {product.inCart ? 'Added' : 'Add to Cart'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  try {
    const { data: products } = await commerce.products.list();
    return {
      props: {
        products,
      },
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      props: {
        products: [],
      },
    };
  }
}

export default ProductList;