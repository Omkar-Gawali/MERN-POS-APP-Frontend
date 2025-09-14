import React, { useEffect, useState } from "react";
import LayOut from "../components/LayOut/LayOut";
import axios from "axios";
import { useCart } from "../context/cartContext";

const API_URL = process.env.REACT_APP_API_URL;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useCart();
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
  return (
    <>
      <LayOut>
        <div className="container text-center">
          <h3 className="mt-3">{products.length} Products Found</h3>
          <div className="d-flex flex-row justify-content-center mb-3 flex-wrap">
            {products?.length > 0 ? (
              products?.map((p) => {
                return (
                  <>
                    <div classname="col-md-3 border">
                      <div className="card m-3" style={{ width: "18rem" }}>
                        <div className="container">
                          <img
                            src={`${API_URL}/api/v1/product/get-product-photo/${p._id}`}
                            className="card-img-top p-3 border mx-auto m-2"
                            height={"250px"}
                            alt="..."
                          />
                        </div>
                        <div className="card-body">
                          <p className="card-text">{p.name}</p>
                          <button
                            class="btn btn-outline-warning w-100"
                            onClick={() => {
                              // ----
                              const index = cart.findIndex(
                                (item) => item.cartItem._id === p._id
                              );
                              // ----
                              if (index === -1) {
                                setCart([
                                  ...cart,
                                  {
                                    cartItem: p,
                                    quantity: 1,
                                  },
                                ]);
                                localStorage.setItem(
                                  "cart",
                                  JSON.stringify([
                                    ...cart,
                                    {
                                      cartItem: p,
                                      quantity: 1,
                                    },
                                  ])
                                );
                                alert("Added To Cart");
                              } else {
                                alert("Already Added");
                              }
                            }}
                          >
                            <span>Add To Cart</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })
            ) : (
              <>
                <h3>No Products Found</h3>
              </>
            )}
          </div>
        </div>
        <hr />
      </LayOut>
    </>
  );
};

export default Products;
