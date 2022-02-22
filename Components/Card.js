import React, { useContext } from "react";
import Image from "next/image";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Store } from "../utils/Store";
import axios from "axios";

// Styles.
import styles from "../styles/Card.module.css";

function Card(props) {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);

  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x._id === props.id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${props.id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...props.product, quantity },
    });
    router.push("/cart");
  };
  return (
    <div className={styles.Card}>
      <NextLink href={`/product/${props.slug}`}>
        <Image
          // loader={myLoader}
          src={props.image}
          alt="Picture of the author"
          width={500}
          height={500}
          className={styles.image}
        />
      </NextLink>
      <div className={styles.cardBottom}>
        <h4>{props.name}</h4>
        <div className={styles.addtocartContainer}>
          <h4>${props.price}</h4>
          <button
            href="/cart"
            className={styles.CardAddtocartButton}
            onClick={addToCartHandler}
          >
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;
