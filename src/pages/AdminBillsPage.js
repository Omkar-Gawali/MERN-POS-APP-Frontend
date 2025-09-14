import React, { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import LayOut from "../components/LayOut/LayOut";
import { FaEye } from "react-icons/fa6";
import { Modal } from "antd";
import axios from "axios";
import logo from "../images/logo.png";
import { FaRupeeSign } from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL;

const AdminBillsPage = () => {
  const componentRef = useRef();
  const [bills, setBills] = useState([]);
  const [bill, setBill] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState();

  // ------------------------------ //
  // Single Order Details
  const [cartItems, setCartItems] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");

  const [tax, setTax] = useState("");
  const [date, setDate] = useState("");

  const [totalAmount, setTotalAmount] = useState("");

  // ------------------------------ //

  // -------------
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // -------------

  const getAllBills = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/auth/get-all-bills`);
      if (data?.success) {
        setBills(data.bills);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllBills();
  }, []);

  const getUserData = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/auth/get-user/${userId}`
      );
      if (data.success) {
        setUserData(data.user);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUserData();
  }, [userId]);

  const getSingleBill = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/bills/get-single-bill/${orderId}`
      );
      if (data?.success) {
        setBill(data.bill);
        setCartItems(data.bill.cartItems);
        setTax(data.bill.tax);
        setTotalAmount(data.bill.totalAmount);
        setCustomerName(data.bill.customerName);
        setCustomerNumber(data.bill.customerNumber);
        setDate(new Date(data.bill.date).toLocaleDateString());
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getSingleBill();
  }, [orderId]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <LayOut>
      <h3 className="text-center">Admin All Bills</h3>
      <div className="container">
        <div class="table-responsive">
          {bills.length > 0 ? (
            <table className="table table-light text-center table-hover">
              <thead>
                <tr>
                  <th scope="col">Order ID</th>
                  <th scope="col">Customer Name</th>
                  <th scope="col">Customer Number</th>
                  <th scope="col">Sub Total</th>
                  <th scope="col">Tax Amount</th>
                  <th scope="col">Grand Total</th>
                  <th scope="col">Date</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bills?.map((b) => {
                  return (
                    <>
                      <tr>
                        <td>{b._id}</td>
                        <td>{b.customerName}</td>
                        <td>{b.customerNumber}</td>
                        <td>
                          <FaRupeeSign /> {b.totalAmount - b.tax}
                        </td>

                        <td>
                          <FaRupeeSign /> {Number(b.tax).toFixed(2)}
                        </td>
                        <td>
                          <FaRupeeSign /> {Number(b.totalAmount).toFixed(2)}
                        </td>
                        <td> {new Date(b.date).toLocaleDateString()}</td>
                        <td>
                          <FaEye
                            onClick={() => {
                              showModal();
                              setOrderId(b._id);
                              setUserId(b.userId);
                            }}
                          />
                        </td>
                        <Modal
                          title="Basic Modal"
                          open={isModalOpen}
                          onOk={handleOk}
                          onCancel={handleCancel}
                        >
                          <div
                            ref={componentRef}
                            className="invoice container p-2"
                          >
                            <div className="container">
                              <div className="row">
                                <div className="col-md-6 d-flex justify-content-center">
                                  <img
                                    className="img-fluid"
                                    src={logo}
                                    alt="LOGO"
                                  />
                                </div>
                                <div className="col-md-6 d-flex align-items-center">
                                  <h3 className="fw-bold">INVOICE</h3>
                                </div>
                              </div>
                            </div>
                            <div className="container border p-2">
                              <div className="row">
                                <div className=" col-md-6">
                                  <div className="d-flex flex-column">
                                    <div>Billed To,</div>
                                    <div>{customerName},</div>
                                    <div>
                                      <b>Contact</b> : {customerNumber},
                                    </div>
                                    <div>
                                      <b>Address</b> : {userData?.address},
                                    </div>
                                    <div>
                                      <b> EmailId</b> : {userData?.email}
                                    </div>
                                  </div>
                                </div>
                                <div className=" col-md-6">
                                  <div>
                                    <b>Invoice Number</b> : {orderId}
                                  </div>
                                  <p>
                                    <b>Date</b> : {date}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="table-reponsive">
                              <table class="table table-info text-center">
                                <thead>
                                  <tr>
                                    <th scope="col">Sr No</th>
                                    <th scope="col">Product</th>
                                    <th scope="col">Qty</th>
                                    <th scope="col">Unit Price</th>
                                    <th scope="col">Total</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {cartItems?.map((c, i) => {
                                    return (
                                      <>
                                        <tr>
                                          <th scope="row">{i + 1}</th>
                                          <td>{c.cartItem.name}</td>
                                          <td>{c.quantity}</td>
                                          <td>
                                            {/* <FaRupeeSign /> */}
                                            {c.cartItem.price}
                                          </td>
                                          <td>
                                            {/* <FaRupeeSign /> */}
                                            {c.cartItem.price * c.quantity}
                                          </td>
                                        </tr>
                                      </>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                            <div className="container-fluid border">
                              <p style={{ textAlign: "right" }}>
                                <span className="mx-2">Sub Total </span>
                                <span className="mx-2">
                                  <FaRupeeSign />
                                  {Number(totalAmount).toFixed(2) -
                                    Number(tax).toFixed(2)}
                                </span>
                              </p>
                              <p style={{ textAlign: "right" }}>
                                <span className="mx-2">Total Tax </span>
                                <span className="mx-2">
                                  <FaRupeeSign />
                                  {Number(tax).toFixed(2)}
                                </span>
                              </p>
                              <p style={{ textAlign: "right" }}>
                                <span className="mx-2">Grand Total </span>
                                <span className="mx-2">
                                  <FaRupeeSign />
                                  {Number(totalAmount).toFixed(2)}
                                </span>
                              </p>
                            </div>
                            <div className="container border p-2">
                              <h5>
                                <b>Thank you for your order!</b>{" "}
                              </h5>
                              <p>
                                10% GST is applied on your tota bill amount.
                                Please note that amount is totally
                                non-refundable. For any assistance please react
                                out to us at <b> help@omkart.com</b>
                              </p>
                            </div>
                          </div>
                          <button
                            className="mt-2 w-100 btn btn-outline-success"
                            onClick={handlePrint}
                          >
                            Print{" "}
                          </button>
                        </Modal>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <>
              <h3 className="text-center">No Bills Found</h3>
            </>
          )}
        </div>
      </div>
    </LayOut>
  );
};

export default AdminBillsPage;
