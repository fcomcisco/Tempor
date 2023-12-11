import { useState, useCallback } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase';

export const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const fetchJobs = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Jobs'));
      const jobsData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setJobs(jobsData);
    } catch (error) {
      console.error("Error al obtener trabajos: ", error);
    }
  }, []);

  const deleteJob = useCallback(async (id) => {
    try {
      await deleteDoc(doc(db, 'Jobs', id));
      setRefresh(prev => !prev);
    } catch (error) {
      console.error("Error al eliminar trabajo: ", error);
    }
  }, []);

  return { jobs, refresh, fetchJobs, deleteJob };
};
