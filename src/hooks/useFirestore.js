import { getDoc, updateDoc, doc } from "firebase/firestore";
import { db } from '../firebaseConfig/firebase';

export const useFirestore = () => {
  const getProductById = async (id) => {
    const product = await getDoc(doc(db, "products", id));
    return product.exists() ? product.data() : null;
  };

  const updateProduct = async (id, data) => {
    const product = doc(db, "products", id);
    await updateDoc(product, data);
  };

  return { getProductById, updateProduct };
};
