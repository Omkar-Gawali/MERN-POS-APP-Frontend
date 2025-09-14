import React, { useState } from "react";
import LayOut from "../components/LayOut/LayOut";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    // alert("User Registered Successfully");
    try {
      const { data } = await axios.post(`${API_URL}/api/v1/auth/register`, {
        name,
        email,
        password,
        phone,
        address,
      });
      if (data?.success) {
        alert("User Registered Successfully");
        setName("");
        setEmail("");
        setPassword("");
        setPhone("");
        setAddress("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <LayOut>
      <div className="mt-4 container-fluid w-50 border p-4 text-center">
        <h3 className="pt-0 p-4">Register Here</h3>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Your Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Enter Your Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Enter Your Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Your Phone Number"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <textarea
              type="text"
              className="form-control"
              placeholder="Enter Your Address"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <button className="btn btn-outline-success w-100">Register</button>
        </form>
      </div>
    </LayOut>
  );
};

export default RegisterPage;
