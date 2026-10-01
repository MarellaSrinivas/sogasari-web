import React, { useEffect, useState } from "react";

import ProductCard from "../ProductCard/ProductCard";

import { getNewArrivals } from "../../api/productApi";

import "./NewArrivals.css";

function NewArrivals() {

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {

    const loadProducts = async () => {

      try {

        setLoading(true);

        const data = await getNewArrivals();

        setProducts(data || []);

      } catch (error) {

        console.error(
          "Failed to load new arrivals:",
          error
        );

        setError(
          "Unable to load new arrivals."
        );

      } finally {

        setLoading(false);
      }
    };

    loadProducts();

  }, []);

  return (
    <section className="new-arrivals">

      {/* <div className="section-heading">

          <span className="section-eyebrow">
           DISCOVER
        </span>

         <h2>
           New Arrivals
         </h2>

        <p>
          Discover our latest collection of
          timeless Indian fashion.
        </p>

      </div>   */}

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

                // Backend returns images[]
                // ProductCard currently expects image
                image:
                  product.images?.find(
                    (image) =>
                      image.primaryImage
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

export default NewArrivals;