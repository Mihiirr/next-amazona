import React, { useContext } from "react";
import { Store } from "../utils/Store";
import Styles from "../styles/Header.module.css";

function Header(props) {
  const { state } = useContext(Store);
  const { cart, userInfo } = state;
  return (
    <div className={Styles.Header}>
      <a href="/" className={Styles.AmazonaLink}>
        Amazona
      </a>

      <div className={Styles.HeaderLinks}>
        {cart.cartItems.length > 0 ? (
          <>
            <a href="/cart">Cart</a>
            <div className={Styles.cartCount}>{cart.cartItems.length}</div>
          </>
        ) : (
          <a href="/cart">Cart</a>
        )}
        {userInfo ? (
          <div className={Styles.usernameDropdown} onClick={props.dropDownHandler}>
            <p>{userInfo.name}</p>
          </div>
        ) : (
          <a href="/login">Login</a>
        )}
      </div>
    </div>
  );
}

export default Header;
