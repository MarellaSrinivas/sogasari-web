import React, { useState } from "react";
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/logo.png";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

import "./Header.css";

function Header() {
  const navigate = useNavigate();

  const { cartCount } = useCart();

  const {
    wishlistIds,
  } = useWishlist();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [openMobileCategory, setOpenMobileCategory] =
    useState(null);

  const [search, setSearch] = useState("");

  /*
   * ==============================
   * NAVIGATION
   * ==============================
   */
const navigation = [
  {
    name: "Kalamkari",
    slug: "/category/Kalamkari",
    children: [
      {
        name: "Kalamkari Sarees",
        slug: "/category/Kalamkari-sarees",
      },
      {
        name: "Kalamkari Dresses",
        slug: "/category/Kalamkari-dresses",
      },
      {
        name: "Kalamkari Sets",
        slug: "/category/Kalamkari-sets",
      },
      {
        name: "Kalamkari Dupattas",
        slug: "/category/Kalamkari-dupattas",
      },
      {
        name: "Kalamkari Collections",
        slug: "/category/Kalamkari-collections",
      },
    ],
  },

  

  {
    name: "Sarees",
    slug: "/category/sarees",
    children: [
      {
        name: "Kalamkari Sarees",
        slug: "/category/Kalamkari-sarees",
      },
      {
        name: "Silk Sarees",
        slug: "/category/silk-sarees",
      },
      {
        name: "Banaras Sarees",
        slug: "/category/banaras-sarees",
      },
      {
        name: "Designer Sarees",
        slug: "/category/designer-sarees",
      },
      
    ],
  },

  {
    name: "Weaves & Crafts",
    slug: "/category/weaves-crafts",
    children: [
      {
        name: "Handloom Sarees",
        slug: "/category/handloom-sarees",
      },
      {
        name: "Cotton Sarees",
        slug: "/category/cotton-sarees",
      },
      {
        name: "Linen Sarees",
        slug: "/category/linen-sarees",
      },
    ],
  },

  {
    name: "Salwar Sets",
    slug: "/category/salwar-sets",
    children: [],
  },

  {
    name: "Lehenga",
    slug: "/category/lehenga",
    children: [],
  },

  {
    name: "Fusion Wear",
    slug: "/category/fusion-wear",
    children: [],
  },

  {
    name: "Mens",
    slug: "/category/mens",
    children: [],
  },
];

  /*
   * ==============================
   * SEARCH
   * ==============================
   */

  const handleSearch = (event) => {
    event.preventDefault();

    const value = search.trim();

    if (!value) {
      return;
    }

    navigate(
      `/search?search=${encodeURIComponent(value)}`
    );

    setSearch("");
    setMobileMenuOpen(false);
  };

  /*
   * ==============================
   * MOBILE MENU
   * ==============================
   */

  const toggleMobileCategory = (index) => {
    setOpenMobileCategory(
      openMobileCategory === index
        ? null
        : index
    );
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setOpenMobileCategory(null);
  };

  return (
    <>
      {/* =========================================
          HEADER
      ========================================= */}

      <header className="site-header">

        {/* =====================================
            TOP HEADER
        ===================================== */}

        <div className="header-main">

          <div className="header-inner">

            {/* LOGO */}

            <Link
              to="/"
              className="header-logo"
              onClick={closeMobileMenu}
            >
              <img
                src={Logo}
                alt="Sogasari"
              />
            </Link>


            {/* DESKTOP SEARCH */}

            <form
              className="header-search"
              onSubmit={handleSearch}
            >
              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search for products..."
              />

              <button type="submit">
                <Search size={20} />
                <span>Search</span>
              </button>
            </form>


            {/* HEADER ACTIONS */}

            <div className="header-actions">

              {/* ACCOUNT */}

              <Link
                to="/account"
                className="header-action"
              >
                <User size={27} />

                <span>
                  Account
                </span>
              </Link>


              {/* WISHLIST */}

              <Link
                to="/wishlist"
                className="header-action"
              >
                <div className="header-icon-wrapper">

                  <Heart size={28} />

                  {wishlistIds?.length > 0 && (
                    <span className="header-count">
                      {wishlistIds.length}
                    </span>
                  )}

                </div>

                <span>
                  Wishlist
                </span>
              </Link>


              {/* CART */}

              <Link
                to="/cart"
                className="header-action"
              >
                <div className="header-icon-wrapper">

                  <ShoppingBag size={28} />

                  {cartCount > 0 && (
                    <span className="header-count">
                      {cartCount}
                    </span>
                  )}

                </div>

                <span>
                  Cart
                </span>
              </Link>

            </div>


            {/* MOBILE MENU BUTTON */}

            <button
              type="button"
              className="mobile-menu-button"
              onClick={() =>
                setMobileMenuOpen(true)
              }
              aria-label="Open menu"
            >
              <Menu size={28} />
            </button>

          </div>

        </div>


        {/* =====================================
            DESKTOP NAVIGATION
        ===================================== */}

        <nav className="desktop-navigation">

          <div className="navigation-inner">

            {navigation.map(
              (item, index) => (

                <div
                  className="nav-item"
                  key={item.name}
                >

                  <Link
                    to={item.slug}
                    className="nav-link"
                  >
                    {item.name}

                    {item.children?.length > 0 && (
                      <ChevronDown
                        size={14}
                        className="nav-arrow"
                      />
                    )}
                  </Link>


                  {/* DESKTOP DROPDOWN */}

                  {item.children?.length > 0 && (
                    <div className="nav-dropdown">

                      {item.children.map(
                        (child) => (

                          <Link
                            key={child.name}
                            to={child.slug}
                            className="nav-dropdown-link"
                          >
                            {child.name}
                          </Link>

                        )
                      )}

                    </div>
                  )}

                </div>

              )
            )}

          </div>

        </nav>

      </header>


      {/* =========================================
          MOBILE MENU OVERLAY
      ========================================= */}

      {mobileMenuOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={closeMobileMenu}
        />
      )}


      {/* =========================================
          MOBILE MENU
      ========================================= */}

      <aside
        className={`mobile-navigation ${
          mobileMenuOpen
            ? "mobile-navigation-open"
            : ""
        }`}
      >

        {/* MOBILE MENU HEADER */}

        <div className="mobile-navigation-header">

          <span>
            Shop
          </span>

          <button
            type="button"
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            <X size={25} />
          </button>

        </div>


        {/* MOBILE SEARCH */}

        <form
          className="mobile-search"
          onSubmit={handleSearch}
        >

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search for products..."
          />

          <button type="submit">
            <Search size={19} />
          </button>

        </form>


        {/* MOBILE QUICK LINKS */}

        <div className="mobile-quick-links">

          <Link
            to="/account"
            onClick={closeMobileMenu}
          >
            <User size={20} />
            <span>Account</span>
          </Link>


          <Link
            to="/wishlist"
            onClick={closeMobileMenu}
          >
            <Heart size={20} />

            <span>
              Wishlist
            </span>

            {wishlistIds?.length > 0 && (
              <small>
                {wishlistIds.length}
              </small>
            )}
          </Link>


          <Link
            to="/cart"
            onClick={closeMobileMenu}
          >
            <ShoppingBag size={20} />

            <span>
              Cart
            </span>

            {cartCount > 0 && (
              <small>
                {cartCount}
              </small>
            )}
          </Link>

        </div>


        {/* MOBILE NAVIGATION */}

        <div className="mobile-navigation-list">

          {navigation.map(
            (item, index) => {

              const hasChildren =
                item.children &&
                item.children.length > 0;

              const isOpen =
                openMobileCategory === index;

              return (
                <div
                  className={`mobile-nav-item ${
                    isOpen
                      ? "mobile-nav-item-open"
                      : ""
                  }`}
                  key={item.name}
                >

                  {/* CATEGORY */}

                  <div className="mobile-category-header">

                    <Link
                      to={item.slug}
                      onClick={closeMobileMenu}
                      className="mobile-category-link"
                    >
                      {item.name}
                    </Link>


                    {hasChildren && (
                      <button
                        type="button"
                        className="mobile-category-toggle"
                        onClick={() =>
                          toggleMobileCategory(
                            index
                          )
                        }
                        aria-label={`Toggle ${item.name}`}
                      >
                        {isOpen ? (
                          <ChevronDown size={20} />
                        ) : (
                          <ChevronRight size={20} />
                        )}
                      </button>
                    )}

                  </div>


                  {/* SUBCATEGORIES */}

                  {hasChildren && isOpen && (

                    <div className="mobile-subcategories">

                      {item.children.map(
                        (child) => (

                          <Link
                            key={child.name}
                            to={child.slug}
                            onClick={closeMobileMenu}
                          >
                            {child.name}
                          </Link>

                        )
                      )}

                    </div>

                  )}

                </div>
              );
            }
          )}

        </div>


        {/* MOBILE MENU FOOTER */}

        <div className="mobile-navigation-footer">

          <Link
            to="/"
            onClick={closeMobileMenu}
          >
            Home
          </Link>

        </div>

      </aside>
    </>
  );
}

export default Header;