import React, { useState, useContext } from "react";
import Head from "next/head";
import { Store } from "../utils/Store";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

//Styles.
import styles from "../styles/Home.module.css";

// Components.
import Header from "./Header";

function Layout(props) {
  const router = useRouter();
  const { dispatch } = useContext(Store);
  const [DropDown, setDropDown] = useState({ open: false });

  const dropDownHandler = () => {
    setDropDown({ open: !DropDown.open });
  };

  const logoutClickHandler = () => {
    setDropDown({ open: false });
    dispatch({ type: "USER_LOGOUT" });
    Cookies.remove("userInfo");
    Cookies.remove("cartItems");
    Cookies.remove("shippingAddress");
    Cookies.remove("paymentMethod");
    router.push("/");
  };
  return (
    <div>
      <Head>
        {/* <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        /> */}
        <title>{props.title}-working</title>
      </Head>

      {/* Header */}
      <Header dropDownHandler={dropDownHandler} />
      <div className={styles.Home}>{props.children}</div>

      {/* Footer */}
      <div className={styles.footerContainer}>
        <footer className={styles.footer}>
          <strong>All rights reserved by Amazona-working-version.</strong>
        </footer>
      </div>
      {DropDown.open && (
        <div className={styles.usernameDropdownContainer}>
          <div className={styles.usernameDropdownLinks}>Profile</div>
          <div className={styles.usernameDropdownLinks}>My Account</div>
          <div
            className={styles.usernameDropdownLinks}
            onClick={logoutClickHandler}
          >
            Logout
          </div>
        </div>
      )}
    </div>
  );
}

export default Layout;
