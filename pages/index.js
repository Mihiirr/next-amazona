import React from "react";

// Styles.
import styles from "../styles/Home.module.css";

// Components
import Card from "../Components/Card";
import Layout from "../Components/Layout";
import db from "../utils/db";

// Models.
import Product from "../models/Product";

export default function Home(props) {
  const { products } = props;
  return (
    <Layout title="Amazona">
      {/* Body */}
      <div className={styles.body}>
        <h1>Products</h1>
        <div className={styles.cardContainer}>
          {products.map((product) => (
            <div key={product._id}>
              <Card
                product={product}
                id={product._id}
                image={product.image}
                name={product.name}
                price={product.price}
                slug={product.slug}
              />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find({}).lean();
  await db.disconnect();
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}
