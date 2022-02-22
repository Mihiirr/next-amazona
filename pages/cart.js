import React, { useContext } from "react";
import { useRouter } from "next/router";
import { Store } from "../utils/Store";
import NextLink from "next/link";
import Image from "next/image";
import axios from "axios";
import Cookies from "js-cookie";

// Components.
import Layout from "../Components/Layout";

// Styles.
import Styles from "../styles/CartScreen.module.css";

function CartScreen() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...item, quantity } });
  };

  const removeItemHandler = (item) => {
    dispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };

  const checkoutHandler = () => {
    if (Cookies.get("paymentMethod")) {
      router.push("/placeorder");
    } else if (Cookies.get("shippingAddress")) {
      router.push("/payment");
    } else {
      router.push("/shipping");
    }
  };
  return (
    <Layout>
      <div className={Styles.cartScreen}>
        {cartItems.length === 0 ? (
          <>
            <p className={Styles.shoppingCartTitle}>
              Shopping Cart is Empty!!!
            </p>
            <NextLink href="/">Go To Shopping</NextLink>
          </>
        ) : (
          <>
            <p className={Styles.shoppingCartTitle}>Shopping Cart</p>
            <div className={Styles.shoppingCartItemAndSubtotalContainer}>
              <table className={Styles.shoppingCartTable}>
                <tr className={Styles.shoppingCartTableRow}>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
                {cartItems.map((item) => (
                  <tr className={Styles.shoppingCartTableRow} key={item._id}>
                    <td>
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={50}
                        height={50}
                      ></Image>
                    </td>
                    <td>
                      <NextLink href={`/product/${item.slug}`}>
                        {item.name}
                      </NextLink>
                    </td>
                    <td>
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          updateCartHandler(item, e.target.value)
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>${item.price}</td>
                    <td>
                      <button
                        className={Styles.shoppingCartTableButton}
                        onClick={() => removeItemHandler(item)}
                      >
                        Remove Item
                      </button>
                    </td>
                  </tr>
                ))}
              </table>
              <div className={Styles.shoppingCartSubtotalContainer}>
                <p className={Styles.shoppingCartSubtotalTitle}>
                  Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{" "}
                  items) :
                </p>
                <h2>
                  ${cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                </h2>
                <button
                  className={Styles.shoppingCartSubtotalButton}
                  onClick={checkoutHandler}
                >
                  Check Out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default CartScreen;
