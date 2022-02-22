import React, { useContext, useEffect } from "react";
import { Store } from "../utils/Store";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import axios from "axios";
import { useForm } from "react-hook-form";

// Components.
import Layout from "../Components/Layout";

// Styles.
import Styles from "../styles/Login.module.css";

function register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
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

  const submitHandler = async ({ name, email, password, confirmPassword }) => {
    if (password !== confirmPassword) {
      alert("password didn't match!!!");
    }
    try {
      const { data } = await axios.post("/api/users/register", {
        name,
        email,
        password,
      });
      dispatch({ type: "USER_LOGIN", payload: data });
      Cookies.set("userInfo", data);
      router.push(redirect || "/");
    } catch (err) {
      alert(err.response.data ? err.response.data.message : err.message);
    }
  };
  return (
    <Layout>
      <div className={Styles.loginPage}>
        <p className={Styles.loginPageTitle}>Register</p>
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className={Styles.loginInputContainer}>
            <p>Name</p>
            <input
              className={Styles.loginInputs}
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              {...register("name", {
                required: "This field is required",
              })}
            />
            <p>Email</p>
            <input
              className={Styles.loginInputs}
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
            />
            <br />
            <p>password</p>
            <input
              className={Styles.loginInputs}
              id="password"
              name="password"
              type="password"
              {...register("password", {
                required: true,
              })}
              placeholder="Password"
            />
            <p>Confirm password</p>
            <input
              className={Styles.loginInputs}
              name="confirmPassword"
              type="password"
              id="confirmpassword"
              placeholder="Confirm Password"
              {...register("confirmpassword", {
                required: true,
              })}
            />
            <button className={Styles.LoginButton} type="submit">
              LOGIN
            </button>
            <p>
              Already have an account?{" "}
              <a
                href={`/login?redirect=${redirect || "/"}`}
                className={Styles.registerButon}
              >
                Login here
              </a>
            </p>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default register;
