import React, { useContext } from "react";
import { Store } from "../utils/Store";
import NextLink from "next/link"
import Styles from "../styles/Header.module.css";

function Header(props) {
  const { state } = useContext(Store);
  const { cart, userInfo } = state;
  return (
    <div className={Styles.Header}>
      <NextLink href="/" className={Styles.AmazonaLink}>
        Amazona
      </NextLink>

      <div className={Styles.HeaderLinks}>
        {cart.cartItems.length > 0 ? (
          <>
            <NextLink href="/cart">Cart</NextLink>
            <div className={Styles.cartCount}>{cart.cartItems.length}</div>
          </>
        ) : (
          <NextLink href="/cart">Cart</NextLink>
        )}
        {userInfo ? (
          <div className={Styles.usernameDropdown} onClick={props.dropDownHandler}>
            <p>{userInfo.name}</p>
          </div>
        ) : (
          <NextLink href="/login">Login</NextLink>
        )}
      </div>
    </div>
  );
}

export default Header;
