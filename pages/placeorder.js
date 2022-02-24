import React, { useEffect, useContext } from "react";
import { Store } from "../utils/Store";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import NextLink from "next/link";
import Image from "next/image";
import axios from "axios";

import { getError } from "../utils/error";

// Components.
import Layout from "../Components/Layout";
import OrderTracking from "../Components/OrderTracking";

// Styles.
import Styles from "../styles/Placeorder.module.css";
import CartScreenStyles from "../styles/CartScreen.module.css";

function Placeorder() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems, paymentMethod, shippingAddress },
    userInfo,
  } = state;
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.456 => 123.46
  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  const taxPrice = round2(itemsPrice * 0.15);
  const shippingPrice = itemsPrice > 200 ? 0 : 15;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  useEffect(() => {
    if (!paymentMethod) {
      router.push("/payment");
    }
    if (cartItems.length === 0) {
      router.push("/cart");
    }
  }, []);

  const placeOrderHandler = async () => {
    try {
      const { data } = await axios.post(
        "/api/orders",
        {
          orderItems: cartItems,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({ type: "CART_CLEAR" });
      dispatch({ type: "PLACE_ORDER_ON" });
      Cookies.remove("cartItems");
      router.push(`order/${data._id}`);
    } catch (err) {
      alert(getError(err));
    }
  };

  return (
    <Layout>
      <div className={Styles.placeOrderPage}>
        <OrderTracking />
        <p className={Styles.placeOrderPageTitle}>Place Order</p>
        <div className={Styles.placeOrderMainContainer}>
          <div>
            <div
              className={
                Styles.placeOrderPageShippingAddressAndPaymentMethodContainer
              }
            >
              <p>Shipping Address</p>
              <p>{shippingAddress.address}</p>
            </div>
            <div
              className={
                Styles.placeOrderPageShippingAddressAndPaymentMethodContainer
              }
            >
              <p>Payment Method</p>
              <p>{paymentMethod}</p>
            </div>

            <div className={Styles.placeOrderPageOrderItemsContainer}>
              <p>Order Items</p>

              <table className={CartScreenStyles.shoppingCartTable}>
                <tbody>
                  <tr className={CartScreenStyles.shoppingCartTableRow}>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                  {cartItems.map((item) => (
                    <tr
                      className={CartScreenStyles.shoppingCartTableRow}
                      key={item._id}
                    >
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
                      <td>{item.quantity}</td>
                      <td>${item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={Styles.placeOrderPageOrderSummaryContainer}>
            <div className={Styles.placeOrderPageOrderSummaryTitleContainer}>
              <p>Order Summary</p>
            </div>
            <div className={Styles.OrderSummaryItemsAndPrice}>
              <p>Items:</p>
              <p>${itemsPrice}</p>
            </div>
            <div className={Styles.OrderSummaryItemsAndPrice}>
              <p>Tax:</p>
              <p>${taxPrice}</p>
            </div>
            <div className={Styles.OrderSummaryItemsAndPrice}>
              <p>Shipping:</p>
              <p>${shippingPrice}</p>
            </div>
            <div className={Styles.OrderSummaryItemsAndPrice}>
              <p>
                <strong>Total:</strong>
              </p>
              <p>
                <strong>${totalPrice}</strong>
              </p>
            </div>
            <button
              className={Styles.OrderSummaryPlaceOrderButton}
              onClick={placeOrderHandler}
            >
              <strong>PLACE ORDER</strong>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Placeorder;
