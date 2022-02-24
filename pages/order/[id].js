import React, { useEffect, useContext, useReducer } from "react";
import { Store } from "../../utils/Store";
import { useRouter } from "next/router";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import NextLink from "next/link";
import Image from "next/image";
import axios from "axios";

// Components.
import Layout from "../../Components/Layout";
import OrderTracking from "../../Components/OrderTracking";

// Styles.
import Styles from "../../styles/Placeorder.module.css";
import CartScreenStyles from "../../styles/CartScreen.module.css";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "PAY_REQUEST":
      return { ...state, loadingPay: true };
    case "PAY_SUCCESS":
      return { ...state, loadingPay: false, successPay: true };
    case "PAY_FAIL":
      return { ...state, loadingPay: false, errorPay: action.payload };
    case "PAY_RESET":
      return { ...state, loadingPay: false, successPay: false, errorPay: "" };
    case "DELIVER_REQUEST":
      return { ...state, loadingDeliver: true };
    case "DELIVER_SUCCESS":
      return { ...state, loadingDeliver: false, successDeliver: true };
    case "DELIVER_FAIL":
      return { ...state, loadingDeliver: false, errorDeliver: action.payload };
    case "DELIVER_RESET":
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
        errorDeliver: "",
      };
    default:
      state;
  }
}

function Order({ params }) {
  const orderId = params.id;
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [
    { loading, order, successPay, loadingDeliver, successDeliver },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: "",
  });
  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;

  useEffect(() => {
    if (!userInfo) {
      return router.push("/login");
    }

    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        });
        await dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err });
      }
    };

    if (
      !order._id ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: "PAY_RESET" });
      }
      if (successDeliver) {
        dispatch({ type: "DELIVER_RESET" });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get("/api/keys/paypal", {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      loadPaypalScript();
    }
  }, [order, successPay, successDeliver]);

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }
  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: "PAY_REQUEST" });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: "PAY_SUCCESS", payload: data });
        alert("Order is paid");
      } catch (err) {
        dispatch({ type: "PAY_FAIL", payload: err });
        alert(err);
      }
    });
  }

  function onError(err) {
    alert(err);
  }

  return (
    <Layout>
      <div className={Styles.placeOrderPage}>
        {/* <OrderTracking /> */}
        <p className={Styles.placeOrderPageTitle}>Order {orderId}</p>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className={Styles.placeOrderMainContainer}>
            <div>
              <div
                className={
                  Styles.placeOrderPageShippingAddressAndPaymentMethodContainer
                }
              >
                <p>Shipping Address</p>

                <p>
                  {shippingAddress.fullName}
                  {", "}
                  {shippingAddress.address}, {shippingAddress.city},{" "}
                  {shippingAddress.postalCode}
                  <br />
                  <strong>Status:</strong>{" "}
                  {isDelivered
                    ? `delivered at ${deliveredAt}`
                    : "not delivered"}
                </p>
              </div>
              <div
                className={
                  Styles.placeOrderPageShippingAddressAndPaymentMethodContainer
                }
              >
                <p>Payment Method</p>
                <p>
                  {paymentMethod} <br />
                  <strong>Status:</strong>{" "}
                  {isPaid ? `paid at ${paidAt}` : "not paid"}
                </p>
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
                    {orderItems.map((item) => (
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

            <div className={Styles.OrderDetailPageOrderSummaryContainer}>
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

              {!isPaid && (
                <div style={{ marginTop: 10 }}>
                  {isPending ? (
                    <p>Loading</p>
                  ) : (
                    <div>
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  return { props: { params } };
}

export default Order;
