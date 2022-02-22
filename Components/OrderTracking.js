import React, { useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import { Store } from "../utils/Store";

// Icons.
import { AiFillCheckCircle } from "react-icons/ai";

// Styles.
import Styles from "../styles/OrderTracking.module.css";

function OrderTracking() {
  const { state } = useContext(Store);
  const [UserInfo, setUserInfo] = useState([]);
  const [ShippingAddressCookie, setShippingAddressCookie] = useState([]);
  const [PaymentMethodCookie, setPaymentMethodCookie] = useState([]);

  useEffect(() => {
    setUserInfo(Cookies.get("userInfo"));
    setShippingAddressCookie(Cookies.get("shippingAddress"));
    setPaymentMethodCookie(Cookies.get("paymentMethod"));
  }, []);
  return (
    <div className={Styles.orderTrackingContainer}>
      <div className={Styles.CheckButtonContainer}>
        {!UserInfo ? (
          <div>
            <div className={Styles.CheckButtons}>1</div>
            <div>Login</div>
          </div>
        ) : (
          <div>
            <AiFillCheckCircle size={30} className={Styles.CheckedIcon} />
            <div>
              <strong>Login</strong>
            </div>
          </div>
        )}
      </div>
      {/* <div className={Styles.orderTrackingLineConnector}></div> */}
      <div className={Styles.CheckButtonContainer}>
        {ShippingAddressCookie ? (
          <div>
            <AiFillCheckCircle size={30} className={Styles.CheckedIcon} />
            <div>
              <strong>Shipping Address</strong>
            </div>
          </div>
        ) : (
          <div>
            <div className={Styles.CheckButtons}>2</div>
            <div>Shipping Address</div>
          </div>
        )}
      </div>
      {/* <div className={Styles.orderTrackingLineConnector}></div> */}
      <div className={Styles.CheckButtonContainer}>
        {PaymentMethodCookie ? (
          <div>
            <AiFillCheckCircle size={30} className={Styles.CheckedIcon} />
            <div>
              <strong>Payment Method</strong>
            </div>
          </div>
        ) : (
          <div>
            <div className={Styles.CheckButtons}>3</div>
            <div>Payment Method</div>
          </div>
        )}
      </div>
      {/* <div className={Styles.orderTrackingLineConnector}></div> */}
      <div className={Styles.CheckButtonContainer}>
      {state.placeOrderCheck ? (
          <div>
            <AiFillCheckCircle size={30} className={Styles.CheckedIcon} />
            <div>
              <strong>Place Order</strong>
            </div>
          </div>
        ) : (
          <div>
            <div className={Styles.CheckButtons}>4</div>
            <div>Place Order</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderTracking;
