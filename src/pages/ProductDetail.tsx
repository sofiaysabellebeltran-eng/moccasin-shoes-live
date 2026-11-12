import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById, formatPHP } from "../shared/catalog";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const product = id ? getProductById(id) : undefined;
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>("");

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-black uppercase">Product not found</h1>
        <Link to="/" className="mt-4 text-sm underline">Back to Collection</Link>
      </div>
    );
  }

  const handleAdd = () => {
    if (!selectedSize) return alert("Please select a size first.");
    addToCart(product, selectedSize);
  };

  return (
    <div className="p-6 md:p-12">
      <Link to="/" className="text-xs font-bold uppercase tracking-[0.15em] mb-8 inline-block hover:opacity-60">← Back</Link>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-square bg-[#e8e4df] overflow-hidden">
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/50 mb-2">{product.series}</p>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-[-0.03em] mb-4">{product.name}</h1>
          <p className="text-xl font-medium mb-8">{formatPHP(product.pricePhp)}</p>
          <p className="text-sm leading-relaxed text-black/70 mb-8">{product.description}</p>
          
          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-[0.1em] mb-4">Select Size</h3>
            <div className="flex flex-wrap gap-2">
              {product.availableSizes.map(size => (
                <button 
                  key={size} 
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 flex items-center justify-center text-sm border transition ${selectedSize === size ? 'border-black bg-black text-white' : 'border-black/20 hover:border-black'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <button onClick={handleAdd} className="bg-black text-white text-xs font-bold uppercase tracking-[0.2em] py-5 px-8 hover:bg-black/80 transition w-full md:w-auto">
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
}
