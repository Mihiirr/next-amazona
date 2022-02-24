import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { Store } from "../utils/Store";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";

// Components.
import Layout from "../Components/Layout";
import OrderTracking from "../Components/OrderTracking";

// Styles.
import Styles from "../styles/Shipping.module.css";
import LoginStyles from "../styles/Login.module.css";

function Shipping() {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;
  const { location } = shippingAddress;

  useEffect(() => {
    if (!userInfo) {
      router.push("/login?redirect=/shipping");
    }
    setValue("fullName", shippingAddress.fullName);
    setValue("address", shippingAddress.address);
    setValue("city", shippingAddress.city);
    setValue("postalCode", shippingAddress.postalCode);
    setValue("country", shippingAddress.country);
  }, []);

  const submitHandler = async ({
    fullName,
    address,
    city,
    postalCode,
    country,
  }) => {
    await dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: { fullName, address, city, postalCode, country, location },
    });
    await Cookies.set(
      "shippingAddress",
      JSON.stringify({
        fullName,
        address,
        city,
        postalCode,
        country,
        location,
      })
    );
    await router.push("/payment");
  };

  const chooseLocationHandler = () => {
    const fullName = getValues("fullName");
    const address = getValues("address");
    const city = getValues("city");
    const postalCode = getValues("postalCode");
    const country = getValues("country");
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: { fullName, address, city, postalCode, country },
    });
    Cookies.set("shippingAddress", {
      fullName,
      address,
      city,
      postalCode,
      country,
      location,
    });
    router.push("/map");
  };
  return (
    <Layout>
      <>
        <div className={Styles.shippingPage}>
          <OrderTracking />
          <div className={Styles.shippingAddressContainer}>
            <p className={Styles.shippingPageTitle}>Shipping Address</p>
            <form onSubmit={handleSubmit(submitHandler)}>
              <div className={LoginStyles.loginInputContainer}>
                <p>Full Name</p>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  defaultValue=""
                  placeholder="Full Name"
                  {...register("fullName", {
                    required: "This field is required",
                  })}
                  className={LoginStyles.loginInputs}
                />

                <p>Address</p>
                <input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Address"
                  {...register("address", {
                    required: "This field is required",
                  })}
                  className={LoginStyles.loginInputs}
                />

                <p>City</p>
                <input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="City"
                  {...register("city", {
                    required: "This field is required",
                  })}
                  className={LoginStyles.loginInputs}
                />

                <p>Postal Code</p>
                <input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  placeholder="Postal Code"
                  {...register("postalCode", {
                    required: "This field is required",
                  })}
                  className={LoginStyles.loginInputs}
                />
                <br />

                <p>Country</p>
                <input
                  id="country"
                  name="country"
                  type="text"
                  {...register("country", {
                    required: true,
                  })}
                  placeholder="Country Name"
                  className={LoginStyles.loginInputs}
                />
                <button className={LoginStyles.LoginButton} type="submit">
                  CONTINUE
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    </Layout>
  );
}

export default Shipping;
