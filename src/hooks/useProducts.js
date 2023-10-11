import { useState, useCallback } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products: ", error);
    }
  }, []);

  const deleteProduct = useCallback(async (id) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      setRefresh(prev => !prev);
    } catch (error) {
      console.error("Error deleting product: ", error);
    }
  }, []);

  return { products, refresh, fetchProducts, deleteProduct };
};
