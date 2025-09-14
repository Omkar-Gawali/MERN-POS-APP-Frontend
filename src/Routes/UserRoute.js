import React, { useEffect, useState } from "react";
import Spinner from "../Spinner";
import axios from "axios";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";

const API_URL = process.env.REACT_APP_API_URL;

const UserRoute = () => {
  const [auth] = useAuth();
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const authCheck = async () => {
      const { data } = await axios.get(`${API_URL}/api/v1/auth/verify-user`);
      if (data?.ok) {
        setOk(true);
      } else {
        setOk(false);
      }
    };
    if (auth?.token) {
      authCheck();
    }
  }, [auth?.token]);
  return ok ? <Outlet /> : <Spinner />;
};

export default UserRoute;
