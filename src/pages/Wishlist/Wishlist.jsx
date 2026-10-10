
import React, { useCallback, useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import ProductCard from "../../components/ProductCard/ProductCard";
import { getWishlist } from "../../api/wishlistApi";
import "./Wishlist.css";

function Wishlist() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWishlist = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getWishlist();

      setProducts(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Failed to load wishlist:", err);
      setError("Unable to load wishlist.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWishlist();

    const handleWishlistChange = () => loadWishlist();

    window.addEventListener(
      "sogasari-wishlist-changed",
      handleWishlistChange
    );

    return () => {
      window.removeEventListener(
        "sogasari-wishlist-changed",
        handleWishlistChange
      );
    };
  }, [loadWishlist]);

  return (
    <>
      <Header />

      <main className="wishlist-page">
        <div className="wishlist-container">
          <div className="wishlist-header">
            <div>
              <span className="account-eyebrow">
                YOUR COLLECTION
              </span>
              <h1 className="wishlist-title">My Wishlist</h1>
              <p className="wishlist-subtitle">
                Products you have saved for later.
              </p>
            </div>

            {!loading && !error && products.length > 0 && (
              <span className="wishlist-count">
                {products.length}{" "}
                {products.length === 1 ? "item" : "items"}
              </span>
            )}
          </div>

          {loading && (
            <div className="wishlist-loading">
              Loading wishlist...
            </div>
          )}

          {!loading && error && (
            <div className="wishlist-error">{error}</div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="wishlist-empty">
              <div className="wishlist-empty-icon">♡</div>
              <h2>Your wishlist is empty</h2>
              <p>Save products you love and they will appear here.</p>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="wishlist-grid">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    image:
                      product.images?.find(
                        (image) => image.primaryImage
                      )?.imageUrl ||
                      product.images?.[0]?.imageUrl ||
                      product.image ||
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
