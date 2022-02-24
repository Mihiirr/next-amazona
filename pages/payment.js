import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { Store } from "../utils/Store";
import Cookies from "js-cookie";

// Components.
import Layout from "../Components/Layout";
import OrderTracking from "../Components/OrderTracking";

// Styles.
import Styles from "../styles/Payment.module.css";

function Payment() {
  const [paymentMethod, setPaymentMethod] = useState("");
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    cart: { shippingAddress },
  } = state;

  useEffect(() => {
    if (!shippingAddress.address) {
      router.push("/shipping");
    } else {
      setPaymentMethod(Cookies.get("paymentMethod") || "");
    }
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      alert("Payment method is require!!!");
    } else {
      await dispatch({ type: "SAVE_PAYMENT_METHOD", payload: paymentMethod });
      await Cookies.set("paymentMethod", paymentMethod);
      router.push("/placeorder");
    }
  };

  const backButtonHandler = () => {
    router.push("/shipping");
  };
  return (
    <Layout>
      <div className={Styles.paymentPage}>
        <OrderTracking />
        <div className={Styles.paymentMethodContainer}>
          <p className={Styles.paymentPageTitle}>Payment</p>

          <form onSubmit={submitHandler}>
            <div className={Styles.paymentPageRadioButtonContainer}>
              <div>
                <input
                  type="radio"
                  id="paypal"
                  name="paymentMethod"
                  value="Paypal"
                  checked={paymentMethod === "Paypal"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className={Styles.paymentPageradioButtons}
                />
                <label htmlFor="paypal" className={Styles.paymentPageradioLables}>
                  PayPal
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="stripe"
                  name="paymentMethod"
                  value="Stripe"
                  checked={paymentMethod === "Stripe"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className={Styles.paymentPageradioButtons}
                />
                <label htmlFor="stripe" className={Styles.paymentPageradioLables}>
                  Stripe
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="cash"
                  name="paymentMethod"
                  value="Cash"
                  checked={paymentMethod === "Cash"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className={Styles.paymentPageradioButtons}
                />
                <label htmlFor="cash" className={Styles.paymentPageradioLables}>
                  Cash
                </label>
              </div>
              <br />
            </div>

            <button className={Styles.paymentPageContinueButton} type="submit">
              CONTINUE
            </button>
          </form>
          <button
            className={Styles.paymentPageBackButton}
            onClick={backButtonHandler}
          >
            BACK
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default Payment;
