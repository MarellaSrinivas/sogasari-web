import React, { useEffect, useState } from "react";
import ProductCard from "../ProductCard/ProductCard";
import { getBestSellers } from "../../api/productApi";
import "./BestSellers.css";

function BestSellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);

        const data = await getBestSellers();

        setProducts(data || []);
      } catch (error) {
        console.error("Failed to load best sellers:", error);
        setError("Unable to load best sellers.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <section className="best-sellers">
      <div className="section-heading">
        <span className="section-eyebrow">MOST LOVED</span>

        <h2>Best Sellers</h2>

        <p>
          Explore the pieces our customers love the most.
        </p>
      </div>

      {loading && (
        <div className="products-loading">
          Loading products...
        </div>
      )}

      {error && (
        <div className="products-error">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                ...product,

                // Backend sends categoryName
                category: product.categoryName,

                // Get primary product image
                image:
                  product.images?.find(
                    (image) => image.primaryImage
                  )?.imageUrl ||
                  product.images?.[0]?.imageUrl ||
                  "",
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default BestSellers;