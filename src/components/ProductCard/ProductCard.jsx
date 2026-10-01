import React from "react";
import {
  Heart,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  useCart,
} from "../../context/CartContext";
import { getImageUrl } from "../../utils/imageUrl";

import {
  useWishlist,
} from "../../context/WishlistContext";

import "./ProductCard.css";

function ProductCard({ product }) {

    const primaryImage =
  product.images?.find(
    (image) => image.primaryImage
  )?.imageUrl ||
  product.images?.[0]?.imageUrl ||
  product.image;

  const {
    isWishlisted,
    toggleWishlist,
  } = useWishlist();

const {
  addToCart,
  isInCart,
} = useCart();

  const liked =
    isWishlisted(product.id);

const addedToCart =
  isInCart(product.id);

  const handleWishlist = async (
    event
  ) => {

    /*
     * Prevent image/link click
     */
    event.preventDefault();
    event.stopPropagation();

    try {

      await toggleWishlist(
        product.id
      );

    } catch (error) {

      console.error(
        "Wishlist error:",
        error
      );

    }
  };

 const handleAddToCart = async (
  event
) => {

  event.preventDefault();
  event.stopPropagation();

  try {

    await addToCart(
      product,
      null,
      null,
      1
    );

  } catch (error) {

    console.error(
      "Add to cart failed:",
      error
    );

  }
};


  return (
    <div className="product-card">

      <div className="product-image-wrapper">

        <Link
          to={`/product/${product.slug}`}
          className="product-image-link"
        >
         <img
  src={getImageUrl(primaryImage)}
  alt={product.name}
  className="product-image"
/>
        </Link>


        {product.badge && (
          <span className="product-badge">
            {product.badge}
          </span>
        )}


        {/* =========================
            WISHLIST
        ========================= */}

        <button
          className={`product-wishlist ${
            liked
              ? "product-wishlist-active"
              : ""
          }`}
          type="button"
          onClick={handleWishlist}
          aria-label={
            liked
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
        >
          <Heart
            size={18}
            fill={
              liked
                ? "currentColor"
                : "none"
            }
          />
        </button>


        {/* Quick Add */}

        <button
  className={`product-quick-add ${
    addedToCart
      ? "product-quick-add-added"
      : ""
  }`}
  type="button"
  onClick={handleAddToCart}
>
  <ShoppingBag size={16} />

  <span>
    {addedToCart
      ? "Added to Bag"
      : "Add to Bag"}
  </span>
</button>

      </div>


      <div className="product-details">

        <span className="product-category">
          {product.category}
        </span>

        <h3 className="product-name">
          {product.name}
        </h3>

        <div className="product-price">

          <span className="product-current-price">
            ₹
            {product.price.toLocaleString(
              "en-IN"
            )}
          </span>

          {product.originalPrice && (
            <span className="product-original-price">
              ₹
              {product.originalPrice.toLocaleString(
                "en-IN"
              )}
            </span>
          )}

          {product.discount && (
            <span className="product-discount">
              {product.discount}% OFF
            </span>
          )}

        </div>


        <Link
          to={`/product/${product.slug}`}
          className="product-view"
        >
          <span>
            View Product
          </span>

          <ArrowRight size={14} />
        </Link>

      </div>

    </div>
  );
}

export default ProductCard;