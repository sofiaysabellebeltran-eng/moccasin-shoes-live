import { createContext, useContext, useState, ReactNode } from "react";
import { StoreProduct } from "../shared/catalog";

export type CartItem = { product: StoreProduct; size: string; quantity: number };

type CartContextType = {
  items: CartItem[];
  addToCart: (product: StoreProduct, size: string) => void;
  removeFromCart: (productId: string, size: string) => void;
  clearCart: () => void;
  total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: StoreProduct, size: string) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.size === size);
      if (existing) {
        return prev.map(i => (i.product.id === product.id && i.size === size) ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { product, size, quantity: 1 }];
    });
    alert("Added to bag!");
  };

  const removeFromCart = (productId: string, size: string) => {
    setItems(prev => prev.filter(i => !(i.product.id === productId && i.size === size)));
  };

  const clearCart = () => setItems([]);
  const total = items.reduce((sum, item) => sum + item.product.pricePhp * item.quantity, 0);

  return <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, total }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
