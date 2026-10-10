import React, { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../../api/api";
import ProductCard from "../../components/ProductCard/ProductCard";
import Header from "../../components/Header/Header";
import "./Products.css";
import { Helmet } from "react-helmet-async";

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    let active = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/products");

        if (active) {
          const data = Array.isArray(response.data)
            ? response.data
            : response.data?.content || [];

          setProducts(data);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);

        if (active) {
          setError("Unable to load products. Please try again.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== "All") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    switch (sortBy) {
      case "price-low":
        result.sort(
          (a, b) => Number(a.price || 0) - Number(b.price || 0)
        );
        break;

      case "price-high":
        result.sort(
          (a, b) => Number(b.price || 0) - Number(a.price || 0)
        );
        break;

      case "name":
        result.sort((a, b) =>
          (a.name || "").localeCompare(b.name || "")
        );
        break;

      default:
        break;
    }

    return result;
  }, [products, selectedCategory, sortBy]);

  return (
    <div className="products-page">
        <Helmet>
  <title>
    Buy Sarees Online | Elegant Saree Collections – Sogasari
  </title>

  <meta
    name="description"
    content="Explore sarees online at Sogasari. Discover elegant saree collections, traditional styles, beautiful designs and sarees for special occasions."
  />

  <link
    rel="canonical"
    href="https://sogasari.com/products"
  />

  <meta name="robots" content="index, follow" />

  <meta
    property="og:type"
    content="website"
  />

  <meta
    property="og:title"
    content="Shop Sarees Online | Sogasari"
  />

  <meta
    property="og:description"
    content="Discover elegant sarees and timeless styles at Sogasari."
  />

  <meta
    property="og:url"
    content="https://sogasari.com/products"
  />

  <meta
    property="og:site_name"
    content="Sogasari"
  />

  <meta
    name="twitter:card"
    content="summary_large_image"
  />

  <meta
    name="twitter:title"
    content="Shop Sarees Online | Sogasari"
  />

  <meta
    name="twitter:description"
    content="Explore elegant saree collections at Sogasari."
  />
</Helmet>
      <Header />

      <section className="products-banner">
        <div className="products-banner-content">
          <span className="products-eyebrow">
            THE SOGASARI COLLECTION
          </span>

          <h1>Discover Your Elegance</h1>

          <p>
            Timeless sarees, beautiful craftsmanship, and
            styles made for your special moments.
          </p>

          <button
            className="products-banner-button"
            onClick={() =>
              document
                .getElementById("all-products")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Explore Collection
          </button>
        </div>
      </section>

      <section
        className="products-content"
        id="all-products"
      >
        <div className="products-heading">
          <div>
            <span className="products-eyebrow">
              FIND YOUR STYLE
            </span>

            <h2>All Products</h2>

            <p>
              Explore our complete collection of sarees.
            </p>
          </div>

          <div className="products-count">
            {filteredProducts.length} products
          </div>
        </div>

        <div className="products-toolbar">
          <div className="products-filter-label">
            <SlidersHorizontal size={17} />
            <span>Category</span>
          </div>

          <div className="products-categories">
            {categories.map((category) => (
              <button
                key={category}
                className={
                  selectedCategory === category
                    ? "products-category active"
                    : "products-category"
                }
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <label className="products-sort">
            <ArrowUpDown size={16} />

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              aria-label="Sort products"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </label>
        </div>

        {loading ? (
          <div className="products-message">
            Loading our collection...
          </div>
        ) : error ? (
          <div className="products-message products-error">
            <p>{error}</p>

            <button onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="products-message">
            <h3>No products found</h3>
            <p>Try selecting another category.</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() =>
                  navigate(`/product/${product.slug}`)
                }
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Products;