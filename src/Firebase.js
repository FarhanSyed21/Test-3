import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCrHf6mBaugVBBp3iRU03PWKO624o9NFQQ",
  authDomain: "api-calls-70500.firebaseapp.com",
  databaseURL: "https://api-calls-70500-default-rtdb.firebaseio.com",
  projectId: "api-calls-70500",
  storageBucket: "api-calls-70500.appspot.com",
  messagingSenderId: "56079485259",
  appId: "1:56079485259:web:8b0c423cc5ff5b3e4b40ce"
};

export const addProductToDatabase = (productData) => {
  const productRef = ref(database, "products");

  push(productRef, productData)
    .then((newProductRef) => {
      console.log("Product added successfully with key:", newProductRef.key);
    })
    .catch((error) => {
      console.error("Error adding product:", error);
    });
};

export const listenForProductChanges = (setProductList) => {
  const productRef = ref(database, "products");

  onValue(productRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const products = Object.values(data);
      setProductList(products);
    }
  });
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
export default app;
