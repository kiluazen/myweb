const Products = () => {
  const products = [
    { name: "Interlocking Cone", images: ["cone/cone_kushal.jpeg", "cone/cone_hand.jpeg", "cone/cone_rain.jpeg"] },
    { name: "Interlocking Heart", images: ["heart/heart_open.jpeg", "heart/heart_closed.jpeg", "heart/heart_open.jpeg"] },
    { name: "Product3", images: ["calabi/calabi-yau.webp", "calabi/yellow.jpeg", "calabi/yellow_hole.jpeg"] },
  ];

  return (
    <div className="md:px-[6rem] lg:px-[15rem]">
      {products.map((product, productIndex) => (
        <div key={productIndex} className="mb-8">
          <h2 className="text-xl font-bold mb-4">{product.name}</h2>
          <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-4 pb-4 md:pb-0">
            {product.images.map((img, imgIndex) => (
              <div key={imgIndex} className="w-[350px] h-[300px] flex-shrink-0 overflow-hidden rounded-lg">
                <img
                  src={`/products/${img}`}
                  alt={`${product.name} ${imgIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Products;