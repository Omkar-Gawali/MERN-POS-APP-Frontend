import React, { useEffect, useState } from "react";
import LayOut from "../components/LayOut/LayOut";
import axios from "axios";
import { FaRupeeSign } from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL;

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);

  // Fields for editing product
  const [id, setId] = useState("");
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productPhoto, setProductPhoto] = useState(null);

  // Fields for adding new product
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [photo, setPhoto] = useState(null);

  // Fetch all products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/product/get-all-products`
      );
      if (data?.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  // Fetch single product details when id changes
  useEffect(() => {
    if (!id) return;

    const getSingleProduct = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/v1/product/get-single-product/${id}`
        );
        if (data?.success) {
          setProduct(data.product);
          setProductName(data.product.name);
          setProductCategory(data.product.category);
          setProductPrice(data.product.price);
          setProductPhoto(null); // Reset photo to null for editing
        }
      } catch (error) {
        console.error("Error fetching single product:", error);
      }
    };

    getSingleProduct();
  }, [id]);

  // Add new product handler
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("price", price);
      productData.append("category", category);
      if (photo) productData.append("photo", photo);

      const { data } = await axios.post(
        `${API_URL}/api/v1/product/add-product`,
        productData
      );
      if (data?.success) {
        alert("Product Added Successfully");
        setName("");
        setPrice("");
        setCategory("");
        setPhoto(null);
        getAllProducts();
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // Update product handler
  const handleUpdate = async (id) => {
    try {
      const productData = new FormData();
      productData.append("name", productName);
      productData.append("price", productPrice);
      productData.append("category", productCategory);
      // Append photo only if a new file is selected
      if (productPhoto && productPhoto instanceof File) {
        productData.append("photo", productPhoto);
      }

      const { data } = await axios.put(
        `${API_URL}/api/v1/product/update-product/${id}`,
        productData
      );
      if (data?.success) {
        alert("Product Updated Successfully");
        setProductName("");
        setProductPrice("");
        setProductPhoto(null);
        setProductCategory("");
        getAllProducts();

        // Close Bootstrap modal programmatically
        const modalEl = document.getElementById("exampleModal");
        const modal = window.bootstrap?.Modal.getInstance(modalEl);
        if (modal) modal.hide();
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // Delete product handler
  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      const { data } = await axios.delete(
        `${API_URL}/api/v1/product/delete-product/${productId}`
      );
      if (data?.success) {
        alert("Product Deleted Successfully");
        getAllProducts();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <LayOut>
      <div className="container border">
        <div className="d-flex flex-column mb-3 p-3">
          {/* Add New Product Form */}
          <div className="container-fluid w-50 mt-2 mb-3 p-3 border">
            <h4 className="m-1">Add New Product</h4>
            <form onSubmit={handleAddProduct}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Product Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  className="form-control"
                  value={price}
                  placeholder="Enter Product Price"
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="mb-3">
                <select
                  className="form-select"
                  aria-label="Select Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  <option value="Beverages">Beverages</option>
                  <option value="Health & Personal Care">
                    Health & Personal Care
                  </option>
                  <option value="Books & Stationery">Books & Stationery</option>
                  <option value="Fashion & Clothing">Fashion & Clothing</option>
                  <option value="Sports & Fitness">Sports & Fitness</option>
                  <option value="Electronics & Accessories">
                    Electronics & Accessories
                  </option>
                  <option value="Home & Kitchen Appliances">
                    Home & Kitchen Appliances
                  </option>
                  <option value="Beauty & Cosmetics">Beauty & Cosmetics</option>
                  <option value="Toys, Kids & Baby Products">
                    Toys, Kids & Baby Products
                  </option>
                  <option value="Groceries & Essentials">
                    Groceries & Essentials
                  </option>
                </select>
              </div>
              <div className="input-group mb-3">
                <input
                  className="form-control"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files[0])}
                />
              </div>
              <div className="mb-3">
                {photo ? (
                  <div className="p-2">
                    <h6>Image Preview</h6>
                    <img
                      className="border p-2"
                      src={URL.createObjectURL(photo)}
                      height={150}
                      alt="Preview"
                    />
                  </div>
                ) : (
                  <h6>No Image Selected</h6>
                )}
              </div>
              <button className="btn btn-outline-success">Add Product</button>
            </form>
          </div>

          {/* Products Table */}
          <div className="border p-2">
            <div className="table-responsive">
              {products.length > 0 ? (
                <table className="table table-light text-center table-hover">
                  <thead>
                    <tr>
                      <th scope="col">Sr No</th>
                      <th scope="col">Name</th>
                      <th scope="col">Image</th>
                      <th scope="col">Price</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p, i) => (
                      <tr key={p._id}>
                        <th scope="row">{i + 1}</th>
                        <td>{p.name}</td>
                        <td>
                          <img
                            src={`${API_URL}/api/v1/product/get-product-photo/${p._id}`}
                            alt={p.name}
                            height={50}
                          />
                        </td>
                        <td>
                          <FaRupeeSign />
                          {p.price}
                        </td>
                        <td>
                          <button
                            className="btn btn-outline-danger m-2"
                            onClick={() => handleDelete(p._id)}
                          >
                            Delete
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary m-2"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal"
                            onClick={() => setId(p._id)}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <h3 className="text-center">No Products Found</h3>
              )}
            </div>
          </div>
        </div>

        {/* Edit Product Modal */}
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Edit Product
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await handleUpdate(id);
                  }}
                >
                  <div className="mb-3">
                    <input
                      className="form-control"
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <select
                      className="form-select"
                      aria-label="Select Category"
                      value={productCategory}
                      onChange={(e) => setProductCategory(e.target.value)}
                      required
                    >
                      <option value="" disabled>
                        Select Category
                      </option>
                      <option value="Beverages">Beverages</option>
                      <option value="Health & Personal Care">
                        Health & Personal Care
                      </option>
                      <option value="Books & Stationery">
                        Books & Stationery
                      </option>
                      <option value="Fashion & Clothing">
                        Fashion & Clothing
                      </option>
                      <option value="Sports & Fitness">Sports & Fitness</option>
                      <option value="Electronics & Accessories">
                        Electronics & Accessories
                      </option>
                      <option value="Home & Kitchen Appliances">
                        Home & Kitchen Appliances
                      </option>
                      <option value="Beauty & Cosmetics">
                        Beauty & Cosmetics
                      </option>
                      <option value="Toys, Kids & Baby Products">
                        Toys, Kids & Baby Products
                      </option>
                      <option value="Groceries & Essentials">
                        Groceries & Essentials
                      </option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <input
                      className="form-control"
                      type="number"
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      className="form-control"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProductPhoto(e.target.files[0])}
                    />
                  </div>
                  <div className="mb-3 border text-center">
                    {productPhoto ? (
                      <img
                        src={URL.createObjectURL(productPhoto)}
                        alt="product preview"
                        height={100}
                      />
                    ) : product ? (
                      <img
                        src={`${API_URL}/api/v1/product/get-product-photo/${id}`}
                        alt="product"
                        height={100}
                      />
                    ) : (
                      <p>No Image</p>
                    )}
                  </div>
                  <div className="mb-3">
                    <button
                      className="w-100 btn btn-outline-warning"
                      type="submit"
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary w-100"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayOut>
  );
};

export default AdminDashboard;
