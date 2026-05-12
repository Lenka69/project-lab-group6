import React, { createContext, useContext, useState } from "react";

const CheckoutContext = createContext();

export function CheckoutProvider({ children }) {
  const [checkoutItems, setCheckoutItems] = useState([]);

  const addToCheckout = (product) => {
    setCheckoutItems((prev) => [
        ...prev,
        {
        ...product,
        checkoutId: Date.now()
        }
    ]);
   };

  const removeFromCheckout = (checkoutId) => {
    setCheckoutItems((prev) =>
        prev.filter((item) => item.checkoutId !== checkoutId)
    );
   };

  const clearCheckout = () => {
    setCheckoutItems([]);
  };

  const totalPrice = checkoutItems.reduce(
    (sum, item) => sum + item.price,
    0
  );

  return (
    <CheckoutContext.Provider
      value={{
        checkoutItems,
        addToCheckout,
        removeFromCheckout,
        clearCheckout,
        totalPrice,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  return useContext(CheckoutContext);
}