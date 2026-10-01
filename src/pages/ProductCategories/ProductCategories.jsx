import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import api from "../../api/api";
import { getImageUrl } from "../../utils/imageUrl";
import "./ProductCategories.css";

const ProductCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/categories");

        setCategories(response.data || []);
      } catch (err) {
        console.error("Failed to load categories:", err);
        setError("Unable to load categories. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <>
        <Header />

        <main className="categories-page">
          <div className="categories-container">
            <div className="categories-loading">
              <div className="loading-spinner"></div>
              <p>Loading categories...</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />

        <main className="categories-page">
          <div className="categories-container">
            <div className="categories-error">
              <h2>Something went wrong</h2>
              <p>{error}</p>

              <button
                type="button"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="categories-page">
        <div className="categories-container">

          {/* Page Header */}
          <section className="categories-header">
            <span className="categories-eyebrow">
              EXPLORE OUR COLLECTION
            </span>

            <h1>Shop by Category</h1>

            <p>
              Discover our beautiful collection of sarees,
              thoughtfully selected for every occasion.
            </p>
          </section>

          {/* Categories */}
          {categories.length === 0 ? (
            <div className="empty-categories">
              <h2>No categories available</h2>
              <p>Please check back soon.</p>
            </div>
          ) : (
            <section className="categories-grid">
              {categories.map((category) => (
                <div
                  className="category-card"
                  key={category.id}
                >
                  <Link
                    to={`/category/${category.slug}`}
                    className="category-image-link"
                  >
                    <div className="category-image-wrapper">
                      {category.image ? (
                        <img
                          src={getImageUrl(category.image)}
                          alt={category.name}
                          className="category-image"
                        />
                      ) : (
                        <div className="category-image-placeholder">
                          <span>{category.name.charAt(0)}</span>
                        </div>
                      )}

                      <div className="category-overlay">
                        <span>View Collection</span>
                      </div>
                    </div>
                  </Link>

                  <div className="category-content">
                    <Link
                      to={`/category/${category.slug}`}
                      className="category-title"
                    >
                      {category.name}
                    </Link>

                    {category.description && (
                      <p className="category-description">
                        {category.description}
                      </p>
                    )}

                    {category.children &&
                      category.children.length > 0 && (
                        <div className="subcategory-list">
                          {category.children.map((subcategory) => (
                            <Link
                              key={subcategory.id}
                              to={`/category/${subcategory.slug}`}
                              className="subcategory-link"
                            >
                              {subcategory.name}
                            </Link>
                          ))}
                        </div>
                      )}

                    <Link
                      to={`/category/${category.slug}`}
                      className="category-shop-link"
                    >
                      Shop Now →
                    </Link>
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
      </main>
    </>
  );
};

export default ProductCategories;