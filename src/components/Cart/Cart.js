import classes from "./Cart.module.css";
import Modal from "../UI/Modal";
import React, { useContext, useState, useEffect } from "react";
import CartContext from "../../store/cart-context";
import CartItem from "./CartItem";
import Checkout from "./Checkout";
import { useAuthContext } from "@asgardeo/auth-react";
import { sendOrder } from "../API";

const Cart = (props) => {
  const cartCtx = useContext(CartContext);
  const [isCheckout, setIsCheckout] = useState(false);
  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);
  const [isSubmitError, setIsSubmitError] = useState(false);
  const [submitErrorMsg, setSubmitErrorMsg] = useState("");
  const { state, signIn, signOut, getBasicUserInfo, getIDToken } = useAuthContext();
  const [ token, setToken ] = useState(null);
  const [ userInfo, setUserInfo ] = useState(null);
  
  useEffect(() => {
      getIDToken().then((idToken) => {
        setToken(idToken);
      }).catch((error) => {
        console.log(error);
      })
  }, [state.isAuthenticated]);

  useEffect(() => {
    getBasicUserInfo().then((data) => {
      setUserInfo(data);
      console.log(data);
    }).catch((error) => {
      console.log(error);
    })
  }, [state.isAuthenticated]);

  const cartHandlerRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem({ ...item, amount: 1 });
  };

  const orderHandler = () => {
    setIsCheckout(true);
  };

  const submitOrderHandler = async (userData) => {
    setIsSubmiting(true);

    const orderData = {
      "customerName": userData.name,
      "delivered": false,
      "address": userData.address,
      "pizzaType": cartCtx.items[0].name,
      "creditCardNumber": "xxxx xxxx xxxx xxxx",
      "quantity": cartCtx.items[0].amount,
    };
  
    const orderResponse = await sendOrder(token, JSON.stringify(orderData));

    if (orderResponse.description) {
      setIsSubmiting(false);
      setDidSubmit(true);
      setIsSubmitError(true);
      setSubmitErrorMsg(orderResponse.description)
    } else {
      setIsSubmiting(false);
      setDidSubmit(true);
      setIsSubmitError(false);
      cartCtx.clearCart();
    }
  };

  const cartItems = (
    <ul className={classes["cart-items"]}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartHandlerRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );

  const modalActions = (
    <div className={classes.actions}>
      <button className={classes["button--alt"]} onClick={props.onClick}>
        Close
      </button>
      { hasItems && (
        <button onClick={orderHandler} className={classes.button}>
          Checkout
        </button>
      )}
    </div>
  );

  const cartModalContent = (
    <React.Fragment>
      {cartItems}
      <div className={classes.total}>
        <span>Total: </span>
        <span>{totalAmount}</span>
      </div>
      {isCheckout && (
        <Checkout onConfirm={submitOrderHandler} onCancel={props.onClick} auth={{ state, signIn, signOut}} userInfo={userInfo}/>
      )}
      {!isCheckout && modalActions}
    </React.Fragment>
  );

  const isSubmitingModalContent = <p>Sending order data...</p>;

  const didSubmitModalContent = (
    <React.Fragment>
      { isSubmitError && (
        <div>
          <p>Something went wrong with placing your order!</p>
          <p style={{'color': 'red'}}>{ submitErrorMsg }</p>
        </div>
      ) }
      { !isSubmitError && (
        <p>Your order was placed!</p>
      )}

      <div className={classes.actions}>
        <button className={classes["button--alt"]} onClick={props.onClick}>
          Close
        </button>
      </div>
    </React.Fragment>
  );

  return (
    <Modal onClick={props.onClick}>
      {!isSubmiting && !didSubmit && cartModalContent}
      {isSubmiting && isSubmitingModalContent}
      {!isSubmiting && didSubmit && didSubmitModalContent}
    </Modal>
  );
};

export default Cart;
