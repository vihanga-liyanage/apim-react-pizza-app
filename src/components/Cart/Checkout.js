import { logDOM } from "@testing-library/react";
import classes from "./Checkout.module.css";
import { useRef, useState } from "react";

const isEmpty = (value) => value.trim().length === 0;

const Checkout = (props) => {

  const [formInputsValidity, setFormInputsValidity] = useState({
    name: true,
    address: true,
    mobile: true,
    email: true,
  });
  const nameInputRef = useRef();
  const addressInputRef = useRef();
  const emailInputRef = useRef();
  const mobileInputRef = useRef();

  const confirmHandler = (event) => {
    event.preventDefault();

    const enteredName = nameInputRef.current.value;
    const enteredaddress = addressInputRef.current.value;
    const enteredEmail = emailInputRef.current.value;
    const enteredmobile = mobileInputRef.current.value;

    const enteredNameIsValid = !isEmpty(enteredName);
    const enteredaddressIsValid = !isEmpty(enteredaddress);
    const enteredmobileIsValid = !isEmpty(enteredmobile);
    const enteredEmailCodeIsValid = !isEmpty(enteredEmail);

    setFormInputsValidity({
      name: enteredNameIsValid,
      address: enteredaddressIsValid,
      mobile: enteredmobileIsValid,
      email: enteredEmailCodeIsValid,
    });

    const formIsValid =
      enteredNameIsValid &&
      enteredaddressIsValid &&
      enteredmobileIsValid &&
      enteredEmailCodeIsValid;

    if (!formIsValid) {
      return;
    }

    props.onConfirm({
      name: enteredName,
      address: enteredaddress,
      mobile: enteredmobile,
      email: enteredEmail,
      status: 'new',
    });
  };

  return (
    <div>
      { !props?.auth?.state?.isAuthenticated && (
        <div>
          Please sign in to checkout.
          <button className={classes.submit} onClick={ () => props.auth.signIn() }>Sign In</button>
        </div>
      )}
      { props?.auth?.state?.isAuthenticated && (
        <form className={classes.form} onSubmit={confirmHandler}>
          <div
            className={`${classes.control} ${
              formInputsValidity.name ? "" : classes.invalid
            }`}
          >
            <label htmlFor="name">Your Name</label>
            <input type="text" id="name" ref={nameInputRef} defaultValue={props?.auth?.state?.displayName}/>
            {!formInputsValidity.name && <p>Please enter a valid name!</p>}
          </div>

          <div
            className={`${classes.control} ${
              formInputsValidity.email ? "" : classes.invalid
            }`}
          >
            <label htmlFor="email">Email</label>
            <input type="text" id="email" ref={emailInputRef} defaultValue={props?.auth?.state?.email} />
            {!formInputsValidity.email && (
              <p>Please enter a valid Email address!</p>
            )}
          </div>

          <div
            className={`${classes.control} ${
              formInputsValidity.mobile ? "" : classes.invalid
            }`}
          >
            <label htmlFor="mobile">Mobile</label>
            <input type="text" id="mobile" ref={mobileInputRef} defaultValue={props?.userInfo?.phoneNumber}/>
            {!formInputsValidity.mobile && <p>Please enter a valid mobile number!</p>}
          </div>

          <div
            className={`${classes.control} ${
              formInputsValidity.address ? "" : classes.invalid
            }`}
          >
            <label htmlFor="address">Delivery Address</label>
            <input type="text" id="address" ref={addressInputRef} defaultValue={props?.userInfo?.address?.address}/>
            {!formInputsValidity.address && <p>Please enter a valid address!</p>}
          </div>
          
          <div className={classes.actions}>
            <button type="button" onClick={props.onCancel}>Cancel</button>
            <button className={classes.submit}>Confirm</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Checkout;
