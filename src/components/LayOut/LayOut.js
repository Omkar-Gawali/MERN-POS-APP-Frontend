import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const LayOut = (props) => {
  const { children } = props;
  return (
    <>
      <Header />
      <main style={{ minHeight: "100vh" }}>{children}</main>
      <Footer />
    </>
  );
};

export default LayOut;
