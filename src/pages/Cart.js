import React, { useEffect, useState } from "react";
import LayOut from "../components/LayOut/LayOut";
import { useCart } from "../context/cartContext";
import axios from "axios";
import { useAuth } from "../context/authContext";

const API_URL = process.env.REACT_APP_API_URL;

const Cart = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [updatedCart, setUpdatedCart] = useState([]);
  const [total, setTotal] = useState(0);
  // ------------
  const [customerName, setCustomerName] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");
  const [paymentMode, setPaymentMode] = useState("");

  // ------------

  const handleGenerateBill = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${API_URL}/api/v1/bills/generate-bill`,
        {
          userId: auth?.user?._id,
          cartItems: cart,
          customerName,
          customerNumber,
          paymentMode,
          totalAmount: Number(total) + Number(((total / 100) * 10).toFixed(2)),
          tax: ((total / 100) * 10).toFixed(2),
        }
      );
      if (data?.success) {
        alert("Success");
        setCart([]);
        localStorage.removeItem("cart");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleRemove = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };
  const getTotal = () => {
    try {
      let total = 0;
      cart.map((p) => {
        total += p.cartItem.price * p.quantity;
      });
      setTotal(total);
    } catch (error) {}
  };
  useEffect(() => {
    getTotal();
  });
  useEffect(() => {
    setCustomerName(auth?.user?.name);
    setCustomerNumber(auth?.user?.phone);
  }, [auth]);
  return (
    <LayOut>
      <div className="container p-2">
        <div class="table-responsive">
          {cart.length > 0 ? (
            <table className="table table-light text-center table-hover">
              <thead>
                <tr>
                  <th scope="col">Sr No</th>
                  <th scope="col">Name</th>
                  <th scope="col">Image</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Price</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart?.map((p, i) => {
                  return (
                    <>
                      <tr>
                        <th scope="row">{i + 1}</th>
                        <td>{p.cartItem.name}</td>
                        <td>
                          <img
                            src={`${API_URL}/api/v1/product/get-product-photo/${p.cartItem._id}`}
                            alt=""
                            height={50}
                          />
                        </td>
                        <td>
                          <div className="d-flex justify-content-center">
                            <button
                              className="badge text-bg-success"
                              onClick={() => {
                                // alert(`Increment Button For Product ${i + 1}`);
                                setUpdatedCart([
                                  ...cart,
                                  {
                                    cartItem: p.cartItem,
                                    quantity: (p.quantity += 1),
                                  },
                                ]);
                                localStorage.setItem(
                                  "cart",
                                  JSON.stringify([...cart])
                                );
                              }}
                            >
                              +
                            </button>
                            <button
                              className="badge text-bg-warning mx-2"
                              disabled={true}
                            >
                              {" "}
                              {p.quantity}
                            </button>
                            <button
                              className="badge text-bg-danger"
                              onClick={() => {
                                // alert(`Increment Button For Product ${i + 1}`);
                                setUpdatedCart([
                                  ...cart,
                                  {
                                    cartItem: p.cartItem,
                                    quantity: (p.quantity -= 1),
                                  },
                                ]);
                                localStorage.setItem(
                                  "cart",
                                  JSON.stringify([...cart])
                                );
                              }}
                              disabled={p.quantity === 1}
                            >
                              -
                            </button>
                          </div>
                        </td>
                        <td>{p.cartItem.price * p.quantity}</td>
                        <td>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => {
                              handleRemove(p._id);
                            }}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
              <div className="container d-flex w-100 p-3">
                <button
                  type="button"
                  className="btn btn-outline-warning"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  Generate Invoice
                </button>
                <div
                  class="modal fade"
                  id="exampleModal"
                  tabindex="-1"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div class="modal-dialog">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">
                          Generate Bill
                        </h1>
                        <button
                          type="button"
                          class="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div class="modal-body">
                        <form onSubmit={handleGenerateBill}>
                          <div className="mb-3">
                            <input
                              className="form-control"
                              type="text"
                              placeholder={"Enter Customer Name"}
                              value={customerName}
                              onChange={(e) => setCustomerName(e.target.value)}
                            />
                          </div>
                          <div className="mb-3">
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Customer Contact Number"
                              value={customerNumber}
                              onChange={(e) =>
                                setCustomerNumber(e.target.value)
                              }
                            />
                          </div>
                          <div className="mb-3">
                            <select
                              className="form-select"
                              aria-label="Default select example"
                              value={paymentMode}
                              onChange={(e) => setPaymentMode(e.target.value)}
                            >
                              <option selected>Select Payment Method</option>
                              <option value="UPI">UPI</option>
                              <option value="Cash On Delivery">
                                Cash On Delivery
                              </option>
                            </select>
                            {paymentMode}
                          </div>
                          <div className="m-2">
                            <p>Sub Total : Rs {total}</p>
                            <p>
                              Total Tax: Rs {((total / 100) * 10).toFixed(2)}
                            </p>
                            <p>
                              Grand Total :{" "}
                              {Number(total) +
                                Number(((total / 100) * 10).toFixed(2))}
                            </p>
                          </div>
                          <button
                            type="button"
                            className="btn btn-outline-success w-100"
                            data-bs-dismiss="modal"
                            onClick={handleGenerateBill}
                          >
                            Generate Bill
                          </button>
                        </form>
                      </div>
                      <div class="modal-footer">
                        <button
                          type="button"
                          class="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </table>
          ) : (
            <>
              <h3 className="text-center">Your Cart Is Empty</h3>
            </>
          )}
        </div>
      </div>
    </LayOut>
  );
};

export default Cart;
