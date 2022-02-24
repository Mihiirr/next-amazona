import React, { useContext, useEffect } from "react";
import { Store } from "../utils/Store";
import { useRouter } from "next/router";
import NextLink from "next/link"
import Cookies from "js-cookie";
import axios from "axios";
import { useForm } from "react-hook-form";

// Components.
import Layout from "../Components/Layout";

// Styles.
import Styles from "../styles/Login.module.css";

function Login() {
  const {
    register,
    handleSubmit,
  } = useForm();
  const router = useRouter();
  const { redirect } = router.query; // login?redirect = /shipping
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  useEffect(() => {
    if (userInfo) {
      router.push("/");
    }
  }, []);

  const submitHandler = async ({ email, password }) => {
    try {
      const { data } = await axios.post("/api/users/login", {
        email,
        password,
      });
      await dispatch({ type: "USER_LOGIN", payload: data });
      await Cookies.set("userInfo", JSON.stringify(data));
      router.push(redirect || "/");
    } catch (err) {
      alert(err.response.data ? err.response.data.message : err.message);
    }
  };
  return (
    <Layout>
      <div className={Styles.loginPage}>
        <p className={Styles.loginPageTitle}>Login</p>
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className={Styles.loginInputContainer}>
            <p>Email</p>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "This field is required",
                pattern: {
                  value:
                    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                  message: "Please Enter a valid Email",
                },
              })}
              className={Styles.loginInputs}
            />
            <br />
            <p>password</p>
            <input
              id="password"
              name="password"
              type="password"
              {...register("password", {
                required: true,
              })}
              placeholder="Password"
              className={Styles.loginInputs}
            />
            <button className={Styles.LoginButton} type="submit">
              LOGIN
            </button>
            <p>
              Don't have an account?{" "}
              <NextLink
                href={`/register?redirect=${redirect || "/"}`}
                className={Styles.registerButon}
              >
                Register here
              </NextLink>
            </p>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default Login;
