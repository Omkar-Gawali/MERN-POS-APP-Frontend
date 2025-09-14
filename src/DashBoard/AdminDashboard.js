import React, { useEffect, useState } from "react";
import LayOut from "../components/LayOut/LayOut";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState([]);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productPhoto, setProductPhoto] = useState("");

  const [id, setId] = useState("");

  //----------
  const [name, setName] = useState("");
  const [price, setPrice] = useState();
  const [category, setCategory] = useState("");
  const [photo, setPhoto] = useState();
  //----------

  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/product/get-all-products`
      );
      if (data?.success) {
        setProducts(data?.products);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllProducts();
  }, []);

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
        setProductPhoto(data.product.photo);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getSingleProduct();
  }, [id]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("photo", photo);

      const { data } = await axios.post(
        `${API_URL}/api/v1/product/add-product`,
        productData
      );
      if (data?.success) {
        alert("Product Added Successfully");
        setName("");
        setPrice("");
        setCategory("");
        setPhoto("");
        getAllProducts();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdate = async (id) => {
    try {
      const productData = new FormData();
      productData.append("name", productName);
      productData.append("price", productPrice);
      productData.append("category", productCategory);
      productData.append("photo", productPhoto);

      const { data } = await axios.put(
        `${API_URL}/api/v1/product/update-product/${id}`,
        productData
      );
      if (data?.success) {
        alert("Product Updated Successfully");
        setProductName("");
        setProductPrice("");
        setProductPhoto("");
        setProductCategory("");
        getAllProducts();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <LayOut>
      <div className="container border">
        <div className="d-flex flex-column mb-3 p-3">
          <div class="container-fluid w-50 mt-2 mb-3 p-3 border">
            <h4 className="m-1">Add New Product</h4>
            <form onSubmit={handleAddProduct}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Product Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  value={price}
                  placeholder="Enter Product Price"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <select
                  className="form-select"
                  aria-label="Default select example"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option selected>Select Category</option>
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
                  <>
                    <div className="p-2">
                      <h6>Image Preview Here</h6>
                      <img
                        className="border p-2"
                        src={URL.createObjectURL(photo)}
                        height={150}
                        alt=""
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <h6>No Image Selected</h6>
                  </>
                )}
              </div>
              <button className="btn btn-outline-success">Add Product</button>
            </form>
          </div>
          <div class="border p-2">
            <div class="table-responsive">
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
                    {products?.map((p, i) => {
                      return (
                        <>
                          <tr>
                            <th scope="row">{i + 1}</th>
                            <td>{p.name}</td>
                            <td>
                              <img
                                src={`${API_URL}/api/v1/product/get-product-photo/${p._id}`}
                                alt=""
                                height={50}
                              />
                            </td>
                            <td>{p.price}</td>
                            <td>
                              <button
                                className="btn btn-outline-danger m-2"
                                onClick={async () => {
                                  const { data } = await axios.delete(
                                    `${API_URL}/api/v1/product/delete-product/${p._id}`
                                  );
                                  if (data?.success) {
                                    alert("Product Deleted Successfully");
                                    getAllProducts();
                                  }
                                }}
                              >
                                Delete
                              </button>
                              <button
                                type="button"
                                className="btn btn-primary m-2"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                                onClick={() => {
                                  setId(p._id);
                                }}
                              >
                                Edit
                              </button>
                              {/* Modal */}
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
                                      <h1
                                        className="modal-title fs-5"
                                        id="exampleModalLabel"
                                      >
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
                                        onSubmit={() => {
                                          handleUpdate(id);
                                        }}
                                      >
                                        <div className="mb-3">
                                          <input
                                            className="form-control"
                                            type="text"
                                            value={productName}
                                            onChange={(e) =>
                                              setProductName(e.target.value)
                                            }
                                          />
                                        </div>
                                        <div className="mb-3">
                                          <select
                                            className="form-select"
                                            aria-label="Default select example"
                                            value={productCategory}
                                            onChange={(e) =>
                                              setProductCategory(e.target.value)
                                            }
                                          >
                                            <option value="Hot Beverages">
                                              Hot Beverages
                                            </option>
                                            <option value="Cold Beverages">
                                              Cold Beverages
                                            </option>
                                            <option value="Match Day Meal">
                                              Match Day Meal
                                            </option>
                                          </select>
                                        </div>
                                        <div className="mb-3">
                                          <input
                                            className="form-control"
                                            type="text"
                                            value={productPrice}
                                            onChange={(e) =>
                                              setProductPrice(e.target.value)
                                            }
                                          />
                                        </div>
                                        <div className="mb-3">
                                          <input
                                            className="form-control"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                              setProductPhoto(e.target.files[0])
                                            }
                                          />
                                        </div>
                                        <div className="mb-3 border">
                                          {productPhoto ? (
                                            <div className="p-2">
                                              <img
                                                src={URL.createObjectURL(
                                                  productPhoto
                                                )}
                                                alt="product photo"
                                                height={"100px"}
                                              />
                                            </div>
                                          ) : (
                                            <div className="p-3">
                                              <img
                                                src={`${API_URL}/api/v1/product/get-product-photo/${id}`}
                                                alt="product photo"
                                                height={100}
                                              />
                                            </div>
                                          )}
                                        </div>
                                        <div className="mb-3">
                                          <button className="w-100 btn btn-outline-warning">
                                            Update
                                          </button>
                                        </div>
                                      </form>
                                    </div>
                                    <div className="modal-footer">
                                      <button
                                        type="button"
                                        className="btn btn-outline-success w-100"
                                        data-bs-dismiss="modal"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <>
                  <h3 className="text-center">No Products Found</h3>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </LayOut>
  );
};

export default AdminDashboard;
