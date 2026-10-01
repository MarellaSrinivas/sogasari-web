import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import Cart from "../pages/Cart/Cart";
import Checkout from "../pages/Checkout/Checkout";
import OrderSuccess from "../pages/OrderSuccess/OrderSuccess";
import Account from "../pages/Account/Account";
import Orders from "../pages/Account/Orders";
import Wishlist from "../pages/Wishlist/Wishlist";
import ProductCategories from "../pages/ProductCategories/ProductCategories";
import CategoryProducts from "../pages/CategoryProducts/CategoryProducts";




import AdminLogin from "../admin/pages/AdminLogin";
import AdminHome from "../admin/pages/AdminHome"; 
import AddProducts from "../admin/pages/AdminAddProduct";
import ProtectedAdminRoute from "../admin/routes/ProtectedAdminRoute";
import AdminLayout from "../admin/components/AdminLayout";



function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>


            <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/product/:slug"
          element={<ProductDetails />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />
  <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
  path="/order-success"
  element={<OrderSuccess />}
/>

<Route
          path="/account"
          element={<Account />}
        />


          <Route
          path="/account/orders"
          element={<Orders />}
        />


          <Route
          path="/wishlist"
          element={<Wishlist />}
        />

        <Route
          path="/sarees"
          element={<div>Sarees</div>}
        />

        <Route
          path="/wishlist"
          element={<div>Wishlist</div>}
        /> 

                  <Route
  path="/categories"
  element={<ProductCategories />}
/>

<Route
  path="/category/:slug"
  element={<CategoryProducts />}
/>


            {/* Admin Routes */}
              <Route element={<ProtectedAdminRoute />}>

          <Route element={<AdminLayout />}>

            <Route
              path="/admin"
              element={<AdminHome />}
            />

            <Route
              path="/admin/products/add"
              element={<AddProducts />}
            />

  
{/* 
            <Route
              path="/admin/products/add"
              element={<AddProduct />}
            /> */}

          </Route>

        </Route>



        

      

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;