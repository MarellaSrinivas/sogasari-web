 
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminAddProduct.css";

const API_URL = "http://localhost:8080";
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

function AdminAddProduct() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [loadingCategories, setLoadingCategories] =
    useState(false);

    
const [selectedImages, setSelectedImages] = useState([]);
const [uploadingImages, setUploadingImages] = useState(false);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleImageSelect = (e) => {
  const files = Array.from(e.target.files || []);

  if (!files.length) return;

  const newImages = files.map((file) => ({
    file,
    preview: URL.createObjectURL(file),
    primary: false,
  }));

  setSelectedImages((prev) => {
    const updated = [...prev, ...newImages];

    // First image becomes primary automatically
    if (!updated.some((image) => image.primary)) {
      updated[0].primary = true;
    }

    return updated;
  });

  e.target.value = "";
};


const removeImage = (index) => {
  setSelectedImages((prev) => {
    const imageToRemove = prev[index];

    if (imageToRemove?.preview) {
      URL.revokeObjectURL(imageToRemove.preview);
    }

    const updated = prev.filter((_, i) => i !== index);

    if (
      updated.length > 0 &&
      !updated.some((image) => image.primary)
    ) {
      updated[0].primary = true;
    }

    return updated;
  });
};


const setPrimaryImage = (index) => {
  setSelectedImages((prev) =>
    prev.map((image, i) => ({
      ...image,
      primary: i === index,
    }))
  );
};

  const [form, setForm] = useState({
    name: "",
    sku: "",

    categoryId: "",
    subcategoryId: "",

    shortDescription: "",
    description: "",

    price: "",
    originalPrice: "",
    discount: "",

    badge: "",

    stock: "",

    featured: false,
    bestSeller: false,
    newArrival: true,
    active: true,

    variants: [],
  });

  // =========================
  // LOAD CATEGORIES
  // =========================

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/categories`
      );

      if (!response.ok) {
        throw new Error("Unable to load categories");
      }

      const data = await response.json();

      console.log("Categories:", data);

      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Category loading error:", err);

      setError(
        err.message || "Unable to load categories"
      );
    } finally {
      setLoadingCategories(false);
    }
  };

  // =========================
  // GET SELECTED CATEGORY
  // =========================

  const selectedCategory = categories.find(
    (category) =>
      String(category.id) ===
      String(form.categoryId)
  );

  // =========================
  // GET SUBCATEGORIES
  // =========================

  const subcategories =
    selectedCategory?.children || [];

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((prev) => ({
      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // =========================
  // CATEGORY CHANGE
  // =========================

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;

    setForm((prev) => ({
      ...prev,

      categoryId,

      // Reset subcategory when category changes
      subcategoryId: "",
    }));
  };

  // =========================
  // SUBCATEGORY CHANGE
  // =========================

  const handleSubcategoryChange = (e) => {
    const subcategoryId = e.target.value;

    setForm((prev) => ({
      ...prev,

      subcategoryId,
    }));
  };

  // =========================
  // ADD VARIANT
  // =========================

  const addVariant = () => {
    setForm((prev) => ({
      ...prev,

      variants: [
        ...prev.variants,

        {
          colorName: "",
          colorCode: "",
          size: "",
          stock: "",
          additionalPrice: "",
          active: true,
        },
      ],
    }));
  };

  // =========================
  // UPDATE VARIANT
  // =========================

  const updateVariant = (
    index,
    field,
    value
  ) => {
    setForm((prev) => {
      const variants = [
        ...prev.variants,
      ];

      variants[index] = {
        ...variants[index],
        [field]: value,
      };

      return {
        ...prev,
        variants,
      };
    });
  };

  // =========================
  // REMOVE VARIANT
  // =========================

  const removeVariant = (index) => {
    setForm((prev) => ({
      ...prev,

      variants:
        prev.variants.filter(
          (_, i) => i !== index
        ),
    }));
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError(
        "Product name is required."
      );
      return;
    }

    if (!form.sku.trim()) {
      setError(
        "SKU is required."
      );
      return;
    }

    if (!form.categoryId) {
      setError(
        "Please select a category."
      );
      return;
    }

    if (!form.price) {
      setError(
        "Price is required."
      );
      return;
    }

    try {
      setSaving(true);

      const token =
        localStorage.getItem(
          "adminToken"
        );

      /*
       * If a subcategory is selected,
       * use the subcategory as the
       * product's category.
       *
       * Otherwise use the main category.
       */
      const finalCategoryId =
        form.subcategoryId
          ? Number(form.subcategoryId)
          : Number(form.categoryId);

      const payload = {
        name: form.name,

          slug: generateSlug(form.name),

        sku: form.sku,

        categoryId: finalCategoryId,

        shortDescription:
          form.shortDescription,

        description:
          form.description,

        price:
          Number(form.price),

        originalPrice:
          form.originalPrice
            ? Number(form.originalPrice)
            : null,

        discount:
          form.discount
            ? Number(form.discount)
            : null,

        badge:
          form.badge || null,

        stock:
          Number(form.stock || 0),

        featured:
          form.featured,

        bestSeller:
          form.bestSeller,

        newArrival:
          form.newArrival,

        active:
          form.active,

        variants:
          form.variants.map(
            (variant) => ({
              colorName:
                variant.colorName,

              colorCode:
                variant.colorCode,

              size:
                variant.size,

              stock:
                Number(
                  variant.stock || 0
                ),

              additionalPrice:
                variant.additionalPrice
                  ? Number(
                      variant.additionalPrice
                    )
                  : null,

              active:
                variant.active,
            })
          ),
      };

      console.log(
        "Creating product:",
        payload
      );

      const response = await fetch(
        `${API_URL}/api/admin/products`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body:
            JSON.stringify(payload),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Unable to create product."
        );
      }

      setSuccess(
        "Product created successfully."
      );

      const productId = data.id;

console.log("Product created:", data);
console.log("Product ID:", productId);

if (!productId) {
  throw new Error(
    "Product was created, but no product ID was returned."
  );
}

if (selectedImages.length > 0) {
  try {
    setUploadingImages(true);

    const formData = new FormData();

    selectedImages.forEach((image) => {
      formData.append("images", image.file);
    });

    console.log(
      "Uploading images for product:",
      productId
    );

 const imageResponse = await axios.post(
  `${API_URL}/api/admin/products/${productId}/images`,
  formData,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

console.log(
  "Images uploaded successfully:",
  imageResponse.data
);

const imageData = await imageResponse.json();

if (!imageResponse.ok) {
  throw new Error(
    imageData.message || "Unable to upload images."
  );
}

console.log("Images uploaded successfully:", imageData);

  } finally {
    setUploadingImages(false);
  }
}

setSuccess(
  "Product and images created successfully."
);
      setTimeout(() => {
        navigate(
          "/admin/products"
        );
      }, 1000);

    } catch (err) {
      console.error(
        "Product creation error:",
        err
      );

      setError(
        err.message ||
        "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-product-page">

      <div className="admin-product-header">

        <div>
          <h1>
            Upload Product
          </h1>

          <p>
            Add a new product to your
            store catalog.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/admin/products"
            )
          }
        >
          Cancel
        </button>

      </div>

      {error && (
        <div className="admin-form-error">
          {error}
        </div>
      )}

      {success && (
        <div className="admin-form-success">
          {success}
        </div>
      )}

      <form
        className="admin-product-form"
        onSubmit={handleSubmit}
      >

        {/* BASIC INFORMATION */}

        <section className="admin-form-section">

          <h2>
            Basic Information
          </h2>

          <div className="form-grid">

            <div className="form-field">

              <label>
                Product Name *
              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter product name"
              />

            </div>

            <div className="form-field">

              <label>
                SKU *
              </label>

              <input
                name="sku"
                value={form.sku}
                onChange={handleChange}
                placeholder="Example: KAN-001"
              />

            </div>

          </div>

        </section>


        {/* CATEGORY */}

        <section className="admin-form-section">

          <h2>
            Category
          </h2>

          <div className="form-grid">

            {/* CATEGORY */}

            <div className="form-field">

              <label>
                Category *
              </label>

              <select
                name="categoryId"
                value={
                  form.categoryId
                }
                onChange={
                  handleCategoryChange
                }
                disabled={
                  loadingCategories
                }
                required
              >

                <option value="">
                  {loadingCategories
                    ? "Loading categories..."
                    : "Select category"}
                </option>

                {categories.map(
                  (category) => (

                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>

                  )
                )}

              </select>

            </div>


            {/* SUBCATEGORY */}

            <div className="form-field">

              <label>
                Subcategory
              </label>

              <select
                name="subcategoryId"
                value={
                  form.subcategoryId
                }
                onChange={
                  handleSubcategoryChange
                }
                disabled={
                  !form.categoryId ||
                  subcategories.length === 0
                }
              >

                <option value="">

                  {!form.categoryId
                    ? "Select category first"
                    : subcategories.length === 0
                    ? "No subcategories"
                    : "Select subcategory"}

                </option>

                {subcategories.map(
                  (subcategory) => (

                    <option
                      key={
                        subcategory.id
                      }
                      value={
                        subcategory.id
                      }
                    >
                      {
                        subcategory.name
                      }
                    </option>

                  )
                )}

              </select>

            </div>

          </div>

        </section>


        {/* DESCRIPTION */}

        <section className="admin-form-section">

          <h2>
            Description
          </h2>

          <div className="form-field">

            <label>
              Short Description
            </label>

            <input
              name="shortDescription"
              value={
                form.shortDescription
              }
              onChange={
                handleChange
              }
              placeholder="Short product description"
            />

          </div>

          <div className="form-field">

            <label>
              Description
            </label>

            <textarea
              name="description"
              value={
                form.description
              }
              onChange={
                handleChange
              }
              rows={6}
              placeholder="Full product description"
            />

          </div>

        </section>


        {/* PRICE */}

        <section className="admin-form-section">

          <h2>
            Pricing & Inventory
          </h2>

          <div className="form-grid">

            <div className="form-field">

              <label>
                Selling Price *
              </label>

              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                min="0"
                step="0.01"
              />

            </div>

            <div className="form-field">

              <label>
                Original Price
              </label>

              <input
                type="number"
                name="originalPrice"
                value={
                  form.originalPrice
                }
                onChange={
                  handleChange
                }
                min="0"
                step="0.01"
              />

            </div>

            <div className="form-field">

              <label>
                Discount %
              </label>

              <input
                type="number"
                name="discount"
                value={form.discount}
                onChange={handleChange}
                min="0"
                max="100"
              />

            </div>

            <div className="form-field">

              <label>
                Stock
              </label>

              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                min="0"
              />

            </div>

            <div className="form-field">

              <label>
                Badge
              </label>

              <input
                name="badge"
                value={form.badge}
                onChange={handleChange}
                placeholder="New / Sale / Trending"
              />

            </div>

          </div>

        </section>

        <div className="admin-form-section">
  <h3>Product Images</h3>

  <div className="image-upload-box">
    <label htmlFor="product-images">
      <div className="upload-placeholder">
        <span>📷</span>
        <p>Click to upload product images</p>
        <small>
          JPG, JPEG, PNG or WEBP
        </small>
      </div>
    </label>

    <input
      id="product-images"
      type="file"
      accept="image/*"
      multiple
      onChange={handleImageSelect}
      style={{ display: "none" }}
    />
  </div>


  {selectedImages.length > 0 && (
    <div className="image-preview-grid">

      {selectedImages.map((image, index) => (
        <div
          className="image-preview-card"
          key={image.preview}
        >

          <img
            src={image.preview}
            alt={`Product ${index + 1}`}
          />

          {image.primary && (
            <span className="primary-badge">
              Primary
            </span>
          )}

          <div className="image-actions">

            {!image.primary && (
              <button
                type="button"
                onClick={() =>
                  setPrimaryImage(index)
                }
              >
                Set Primary
              </button>
            )}

            <button
              type="button"
              onClick={() =>
                removeImage(index)
              }
            >
              Remove
            </button>

          </div>

        </div>
      ))}

    </div>
  )}
</div>


        {/* FLAGS */}

        <section className="admin-form-section">

          <h2>
            Product Settings
          </h2>

          <div className="checkbox-grid">

            <label>

              <input
                type="checkbox"
                name="featured"
                checked={
                  form.featured
                }
                onChange={
                  handleChange
                }
              />

              Featured

            </label>

            <label>

              <input
                type="checkbox"
                name="bestSeller"
                checked={
                  form.bestSeller
                }
                onChange={
                  handleChange
                }
              />

              Best Seller

            </label>

            <label>

              <input
                type="checkbox"
                name="newArrival"
                checked={
                  form.newArrival
                }
                onChange={
                  handleChange
                }
              />

              New Arrival

            </label>

            <label>

              <input
                type="checkbox"
                name="active"
                checked={
                  form.active
                }
                onChange={
                  handleChange
                }
              />

              Active

            </label>

          </div>

        </section>


        {/* VARIANTS */}

        <section className="admin-form-section">

          <div className="section-header">

            <div>

              <h2>
                Product Variants
              </h2>

              <p>
                Add colors, sizes and
                variant-level stock.
              </p>

            </div>

            <button
              type="button"
              onClick={addVariant}
            >
              + Add Variant
            </button>

          </div>

          {form.variants.length === 0 && (

            <div className="empty-variants">
              No variants added.
            </div>

          )}

          {form.variants.map(
            (variant, index) => (

              <div
                className="variant-row"
                key={index}
              >

                <input
                  placeholder="Color"
                  value={
                    variant.colorName
                  }
                  onChange={(e) =>
                    updateVariant(
                      index,
                      "colorName",
                      e.target.value
                    )
                  }
                />

                <input
                  placeholder="Color Code"
                  value={
                    variant.colorCode
                  }
                  onChange={(e) =>
                    updateVariant(
                      index,
                      "colorCode",
                      e.target.value
                    )
                  }
                />

                <input
                  placeholder="Size"
                  value={
                    variant.size
                  }
                  onChange={(e) =>
                    updateVariant(
                      index,
                      "size",
                      e.target.value
                    )
                  }
                />

                <input
                  type="number"
                  placeholder="Stock"
                  min="0"
                  value={
                    variant.stock
                  }
                  onChange={(e) =>
                    updateVariant(
                      index,
                      "stock",
                      e.target.value
                    )
                  }
                />

                <input
                  type="number"
                  placeholder="Additional Price"
                  min="0"
                  step="0.01"
                  value={
                    variant.additionalPrice
                  }
                  onChange={(e) =>
                    updateVariant(
                      index,
                      "additionalPrice",
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    removeVariant(index)
                  }
                >
                  Remove
                </button>

              </div>

            )
          )}

        </section>


        {/* SUBMIT */}

        <div className="form-actions">

          <button
            type="button"
            onClick={() =>
              navigate("/admin")
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
          >

            {saving
              ? "Creating Product..."
              : "Create Product"}

          </button>

        </div>

      </form>

    </div>
  );
}

export default AdminAddProduct; 