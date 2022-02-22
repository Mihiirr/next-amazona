import React, { useContext } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import axios from "axios";
import { Store } from "../../utils/Store";
import Product from "../../models/Product";
import db from "../../utils/db";

// Styles.
import styles from "../../styles/ProductScreen.module.css";

//Component.
import Layout from "../../Components/Layout";

function ProductScreen(props) {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { product } = props;
  if (!product) {
    return <h1>Product Not Found!!!</h1>;
  }

  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    await dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
    await router.push("/cart");
  };

  return (
    <Layout title={`${product.name} - Amazona`}>
      <div className={styles.ProductScreen}>
        <a href="/" className={styles.backtoproductLink}>
          <strong>back to products</strong>
        </a>
        <div className={styles.ProductScreenBody}>
          {/* Product Image */}
          <Image
            // loader={myLoader}
            src={product.image}
            alt="Picture of the author"
            width={500}
            height={500}
          />

          {/* Product Details */}
          <div className={styles.productScreenDetails}>
            <p>{product.name}</p>
            <p>Category: {product.category}</p>
            <p>Brand: {product.brand}</p>
            <p>Rating: {product.rating}</p>
            <p>Description: {product.description}</p>
          </div>

          {/* Add to Cart Container */}
          <div className={styles.AddtocartContainer}>
            <table className={styles.AddtocartContainerTable}>
              <tr>
                <th>Price</th>
                <th>${product.price}</th>
              </tr>
              <tr>
                <th>Status</th>
                <th>
                  {product.countInStock > 0 ? "In stock" : "Out of stock"}
                </th>
              </tr>
            </table>

            {/* Add-To-Cart Button */}
            <button
              className={styles.AddtocartButton}
              onClick={addToCartHandler}
            >
              ADD TO CART
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ProductScreen;

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }, "-reviews").lean();
  await db.disconnect();
  return {
    props: {
      product: db.convertDocToObj(product),
    },
  };
}
