import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";

import Header from "../../components/Header/Header";
import { useCart } from "../../context/CartContext";
import { getProductBySlug } from "../../api/productApi";
import { getImageUrl } from "../../utils/imageUrl";
import "./ProductDetails.css";

function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [openSection, setOpenSection] = useState("description");

  /* =========================
     LOAD PRODUCT
  ========================= */

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProductBySlug(slug);

        setProduct(data);

        /*
         * Select first active variant
         */
        const activeVariants =
          data?.variants?.filter(
            (variant) => variant.active
          ) || [];

        if (activeVariants.length > 0) {
          const firstVariant = activeVariants[0];

          setSelectedColor(
            firstVariant.colorName || ""
          );

          setSelectedSize(
            firstVariant.size || ""
          );
        }
      } catch (error) {
        console.error(
          "Failed to load product:",
          error
        );

        setError(
          "Unable to load this product."
        );
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadProduct();
    }
  }, [slug]);

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="product-details-page">
        <Header />

        <div className="product-loading">
          Loading product...
        </div>
      </div>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (error || !product) {
    return (
      <div className="product-details-page">
        <Header />

        <div className="product-error">
          <h2>
            {error || "Product not found"}
          </h2>

          <button
            type="button"
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  /* =========================
     PRODUCT DATA
  ========================= */

  const images =
  product.images?.length > 0
    ? [...product.images]
        .sort(
          (a, b) =>
            (a.displayOrder ?? 0) -
            (b.displayOrder ?? 0)
        )
        .map((image) =>
          getImageUrl(image.imageUrl)
        )
    : [];

  const variants =
    product.variants?.filter(
      (variant) => variant.active
    ) || [];

  /*
   * Unique colors
   */
  const colors = variants
    .filter((variant) => variant.colorName)
    .reduce((result, variant) => {
      const exists = result.find(
        (color) =>
          color.name === variant.colorName
      );

      if (!exists) {
        result.push({
          name: variant.colorName,
          value:
            variant.colorCode || "#7d1d2b",
        });
      }

      return result;
    }, []);

  /*
   * Unique sizes
   */
  const sizes = [
    ...new Set(
      variants
        .map((variant) => variant.size)
        .filter(Boolean)
    ),
  ];

  /*
   * If product has no variants,
   * don't leave the UI empty.
   */
  const displayColors =
    colors.length > 0
      ? colors
      : [
          {
            name: "Default",
            value: "#7d1d2b",
          },
        ];

  const displaySizes =
    sizes.length > 0
      ? sizes
      : ["Free Size"];

  /* =========================
     FIND SELECTED VARIANT
  ========================= */

  const selectedVariant =
    variants.find(
      (variant) =>
        variant.colorName === selectedColor &&
        variant.size === selectedSize
    ) || null;

  /* =========================
     PRICE
  ========================= */

  const currentPrice =
    selectedVariant?.additionalPrice
      ? Number(product.price) +
        Number(
          selectedVariant.additionalPrice
        )
      : Number(product.price);

  /* =========================
     ACTIONS
  ========================= */

  const handleAddToBag = () => {
    addToCart(
      {
        ...product,

        /*
         * Cart currently expects image,
         * category and frontend-friendly data.
         */
        image: images[0] || "",
        category: product.categoryName,
        price: currentPrice,
      },
      selectedColor,
      selectedSize,
      quantity
    );

    navigate("/cart");
  };

  const handleBuyNow = () => {
    addToCart(
      {
        ...product,
        image: images[0] || "",
        category: product.categoryName,
        price: currentPrice,
      },
      selectedColor,
      selectedSize,
      quantity
    );

    navigate("/checkout");
  };

  const increaseQuantity = () => {
    /*
     * Don't allow quantity above available stock.
     */
    if (
      product.stock &&
      quantity >= product.stock
    ) {
      return;
    }

    setQuantity(
      (current) => current + 1
    );
  };

  const decreaseQuantity = () => {
    setQuantity((current) =>
      current > 1 ? current - 1 : 1
    );
  };

  const toggleSection = (section) => {
    setOpenSection((current) =>
      current === section ? "" : section
    );
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="product-details-page">

      <Header />

      {/* Breadcrumb */}
      <div className="product-breadcrumb">
        <div className="product-container">
          Home / {product.categoryName} /{" "}
          {product.name}
        </div>
      </div>

      <main className="product-details-container">

        {/* =========================
            LEFT - PRODUCT IMAGES
        ========================= */}

        <div className="product-gallery">

          <div className="product-thumbnails">

            {images.map((image, index) => (
              <button
                key={index}
                type="button"
                className={`product-thumbnail ${
                  selectedImage === index
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setSelectedImage(index)
                }
              >
                <img
                  src={image}
                  alt={`${product.name} ${
                    index + 1
                  }`}
                />
              </button>
            ))}

          </div>

          <div className="product-main-image">

            {images.length > 0 && (
              <img
                src={images[selectedImage]}
                alt={product.name}
              />
            )}

            <button
              className="product-detail-wishlist"
              type="button"
              aria-label="Add to wishlist"
            >
              <Heart size={21} />
            </button>

          </div>

        </div>

        {/* =========================
            RIGHT - PRODUCT INFO
        ========================= */}

        <div className="product-information">

          <span className="product-info-category">
            {product.categoryName}
          </span>

          <h1>{product.name}</h1>

          {/* Rating - temporary until reviews API */}
          <div className="product-rating">
            <span>★★★★★</span>
            <span>4.8</span>
            <span>(24 Reviews)</span>
          </div>

          {/* Price */}
          <div className="product-info-price">

            <span className="current-price">
              ₹{currentPrice.toLocaleString("en-IN")}
            </span>

            {product.originalPrice && (
              <span className="old-price">
                ₹
                {Number(
                  product.originalPrice
                ).toLocaleString("en-IN")}
              </span>
            )}

            {product.discount && (
              <span className="discount">
                {product.discount}% OFF
              </span>
            )}

          </div>

          <p className="tax-note">
            Inclusive of all taxes
          </p>

          <div className="product-offer">
            <strong>Special Offer</strong>

            <span>
              Get extra 10% off on orders above
              ₹10,000
            </span>
          </div>

          {/* =========================
              COLOR
          ========================= */}

          <div className="product-option">

            <div className="option-title">
              <strong>Color</strong>

              <span>
                {selectedColor}
              </span>
            </div>

            <div className="color-options">

              {displayColors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  className={`color-option ${
                    selectedColor ===
                    color.name
                      ? "selected"
                      : ""
                  }`}
                  style={{
                    backgroundColor:
                      color.value,
                  }}
                  title={color.name}
                  onClick={() => {
                    setSelectedColor(
                      color.name
                    );

                    /*
                     * Find a matching size
                     * for this color.
                     */
                    const matchingVariant =
                      variants.find(
                        (variant) =>
                          variant.colorName ===
                            color.name &&
                          variant.size
                      );

                    if (
                      matchingVariant?.size
                    ) {
                      setSelectedSize(
                        matchingVariant.size
                      );
                    }
                  }}
                />
              ))}

            </div>

          </div>

          {/* =========================
              SIZE
          ========================= */}

          <div className="product-option">

            <div className="option-title">
              <strong>Size</strong>
            </div>

            <div className="size-options">

              {displaySizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`size-option ${
                    selectedSize === size
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedSize(size)
                  }
                >
                  {size}
                </button>
              ))}

            </div>

          </div>

          {/* =========================
              QUANTITY
          ========================= */}

          <div className="product-option">

            <div className="option-title">
              <strong>Quantity</strong>
            </div>

            <div className="quantity-selector">

              <button
                type="button"
                onClick={
                  decreaseQuantity
                }
              >
                <Minus size={16} />
              </button>

              <span>{quantity}</span>

              <button
                type="button"
                onClick={
                  increaseQuantity
                }
              >
                <Plus size={16} />
              </button>

            </div>

            {product.stock > 0 && (
              <small>
                {product.stock} available
              </small>
            )}

          </div>

          {/* =========================
              BUTTONS
          ========================= */}

          <div className="product-actions">

            <button
              type="button"
              className="add-to-bag-button"
              onClick={handleAddToBag}
            >
              <ShoppingBag size={18} />
              Add to Bag
            </button>

            <button
              type="button"
              className="buy-now-button"
              onClick={handleBuyNow}
            >
              Buy Now
            </button>

          </div>

          {/* Benefits */}
          <div className="product-benefits">

            <div className="benefit-item">
              <Truck size={20} />

              <div>
                <strong>
                  Free Shipping
                </strong>

                <span>
                  On orders above ₹999
                </span>
              </div>
            </div>

            <div className="benefit-item">
              <RotateCcw size={20} />

              <div>
                <strong>
                  Easy Returns
                </strong>

                <span>
                  7 day return policy
                </span>
              </div>
            </div>

            <div className="benefit-item">
              <ShieldCheck size={20} />

              <div>
                <strong>
                  Authentic Products
                </strong>

                <span>
                  100% genuine products
                </span>
              </div>
            </div>

          </div>

          {/* =========================
              ACCORDIONS
          ========================= */}

          <div className="product-accordions">

            {/* Description */}

            <div className="product-accordion">

              <button
                type="button"
                onClick={() =>
                  toggleSection(
                    "description"
                  )
                }
              >
                <span>
                  Description
                </span>

                <ChevronDown
                  size={18}
                  className={
                    openSection ===
                    "description"
                      ? "rotate"
                      : ""
                  }
                />
              </button>

              {openSection ===
                "description" && (
                <div className="accordion-content">
                  <p>
                    {product.description}
                  </p>
                </div>
              )}

            </div>

            {/* Product Details */}

            <div className="product-accordion">

              <button
                type="button"
                onClick={() =>
                  toggleSection(
                    "details"
                  )
                }
              >
                <span>
                  Product Details
                </span>

                <ChevronDown
                  size={18}
                  className={
                    openSection ===
                    "details"
                      ? "rotate"
                      : ""
                  }
                />
              </button>

              {openSection ===
                "details" && (
                <div className="accordion-content">

                  <ul>
                    <li>
                      SKU: {product.sku}
                    </li>

                    <li>
                      Category:{" "}
                      {product.categoryName}
                    </li>

                    <li>
                      Stock:{" "}
                      {product.stock}
                    </li>

                    {product.shortDescription && (
                      <li>
                        {
                          product.shortDescription
                        }
                      </li>
                    )}
                  </ul>

                </div>
              )}

            </div>

            {/* Shipping */}

            <div className="product-accordion">

              <button
                type="button"
                onClick={() =>
                  toggleSection(
                    "shipping"
                  )
                }
              >
                <span>
                  Shipping & Returns
                </span>

                <ChevronDown
                  size={18}
                  className={
                    openSection ===
                    "shipping"
                      ? "rotate"
                      : ""
                  }
                />
              </button>

              {openSection ===
                "shipping" && (
                <div className="accordion-content">

                  <p>
                    Orders are dispatched
                    within 2–4 business
                    days. Delivery usually
                    takes 5–7 business days
                    depending on the
                    location.
                  </p>

                </div>
              )}

            </div>

          </div>

          <div className="product-sku">
            SKU: {product.sku}
          </div>

        </div>

      </main>
    </div>
  );
}

export default ProductDetails;