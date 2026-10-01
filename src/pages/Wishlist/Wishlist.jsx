 
import React, {
  useEffect,
  useState,
} from "react";

import Header from "../../components/Header/Header";

import ProductCard from "../../components/ProductCard/ProductCard";

import {
  getWishlist,
} from "../../api/wishlistApi";

import "./Wishlist.css";


function Wishlist() {

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  useEffect(() => {

    const loadWishlist = async () => {

      try {

        setLoading(true);
        setError("");

        const wishlistProducts =
          await getWishlist();

        setProducts(
          Array.isArray(wishlistProducts)
            ? wishlistProducts
            : []
        );

      } catch (error) {

        console.error(
          "Failed to load wishlist:",
          error
        );

        setError(
          "Unable to load wishlist."
        );

        setProducts([]);

      } finally {

        setLoading(false);

      }

    };


    loadWishlist();

  }, []);


  return (
    <>
      <Header />

      <main className="wishlist-page">

        <div className="wishlist-container">

          {/* =========================
              HEADER
          ========================= */}

          <div className="wishlist-header">

            <div>
              <span className="account-eyebrow">
                YOUR COLLECTION
              </span>

              <h1 className="wishlist-title">
                My Wishlist
              </h1>

              <p className="wishlist-subtitle">
                Products you have saved for later.
              </p>
            </div>

            {!loading &&
              !error &&
              products.length > 0 && (

                <span className="wishlist-count">
                  {products.length}{" "}
                  {products.length === 1
                    ? "item"
                    : "items"}
                </span>

              )}

          </div>


          {/* =========================
              LOADING
          ========================= */}

          {loading && (

            <div className="wishlist-loading">
              Loading wishlist...
            </div>

          )}


          {/* =========================
              ERROR
          ========================= */}

          {!loading && error && (

            <div className="wishlist-error">
              {error}
            </div>

          )}


          {/* =========================
              EMPTY
          ========================= */}

          {!loading &&
            !error &&
            products.length === 0 && (

              <div className="wishlist-empty">

                <div className="wishlist-empty-icon">

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"
                    />
                  </svg>

                </div>

                <h2>
                  Your wishlist is empty
                </h2>

                <p>
                  Save products you love and
                  they will appear here.
                </p>

              </div>

            )}


          {/* =========================
              PRODUCTS
          ========================= */}

          {!loading &&
            !error &&
            products.length > 0 && (

              <div className="wishlist-grid">

                {products.map((product) => (

                  <ProductCard
                    key={product.id}
                    product={{
                      ...product,

                      image:
                        product.images?.find(
                          (image) =>
                            image.primaryImage
                        )?.imageUrl ||
                        product.images?.[0]
                          ?.imageUrl ||
                        "",
                    }}
                  />

                ))}

              </div>

            )}

        </div>

      </main>
    </>
  );
}


export default Wishlist; 