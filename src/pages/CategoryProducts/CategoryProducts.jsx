import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import ProductCard from "../../components/ProductCard/ProductCard";
import api from "../../api/api";
import "./CategoryProducts.css";

const CategoryProducts = () => {
  const { slug } = useParams();

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        setError("");

        // Get products
        const productsResponse = await api.get(
          `/products/category/${slug}`
        );

        setProducts(productsResponse.data || []);

        // Get categories to find current category information
        const categoriesResponse = await api.get(
          "/categories"
        );

        const allCategories = categoriesResponse.data || [];

        let currentCategory = null;

        for (const categoryItem of allCategories) {
          if (categoryItem.slug === slug) {
            currentCategory = categoryItem;
            break;
          }

          const child = categoryItem.children?.find(
            (item) => item.slug === slug
          );

          if (child) {
            currentCategory = child;
            break;
          }
        }

        setCategory(currentCategory);

      } catch (err) {
        console.error(
          "Failed to load category products:",
          err
        );

        setError(
          "Unable to load products. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCategoryProducts();
    }
  }, [slug]);

  if (loading) {
    return (
      <>
        <Header />

        <main className="category-products-page">
          <div className="category-products-loading">
            <div className="loading-spinner"></div>
            <p>Loading products...</p>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />

        <main className="category-products-page">
          <div className="category-products-error">
            <h2>Something went wrong</h2>
            <p>{error}</p>

            <button
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="category-products-page">

        <div className="category-products-container">

          {/* Breadcrumb */}
          <div className="category-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/categories">
              Categories
            </Link>
            <span>/</span>
            <span>
              {category?.name || slug}
            </span>
          </div>

          {/* Category Header */}
          <section className="category-products-header">

            <span className="category-eyebrow">
              COLLECTION
            </span>

            <h1>
              {category?.name || slug}
            </h1>

            {category?.description && (
              <p>{category.description}</p>
            )}

            <div className="category-product-count">
              {products.length}{" "}
              {products.length === 1
                ? "Product"
                : "Products"}
            </div>

          </section>

          {/* Products */}
          {products.length === 0 ? (
            <div className="category-empty">
              <h2>No products found</h2>

              <p>
                There are currently no products in this
                category.
              </p>

              <Link to="/categories">
                Browse Categories
              </Link>
            </div>
          ) : (
            <section className="category-products-grid">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </section>
          )}

        </div>

      </main>
    </>
  );
};

export default CategoryProducts;