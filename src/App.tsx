import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Layout from "./components/Layout";
import ProductsPage from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/Cart";
import CheckoutPage from "./pages/Checkout";
import SuccessPage from "./pages/Success";
import AdminPage from "./pages/Admin";
import BundlePage from "./pages/Bundle";

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<ProductsPage />} />
            <Route path="products/:id" element={<ProductDetail />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="checkout/success" element={<SuccessPage />} />
            <Route path="admin" element={<AdminPage />} />
            <Route path="bundle" element={<BundlePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
