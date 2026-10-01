import AppRoutes from "./routes/AppRoutes";
import "./App.css";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

function App() {
  return (
    <CartProvider>

      <WishlistProvider>

        <AppRoutes />

      </WishlistProvider>

    </CartProvider>
  );
}

export default App;