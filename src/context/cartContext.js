import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  useEffect(() => {
    const data = localStorage.getItem("cart");
    if (data) {
      const parsedData = JSON.parse(data);
      setCart(parsedData);
    }
  }, []);
  return (
    <CartContext.Provider value={[cart, setCart]}>
      {children}
    </CartContext.Provider>
  );
};

//Hook

const useCart = () => useContext(CartContext);

export { useCart, CartProvider };
