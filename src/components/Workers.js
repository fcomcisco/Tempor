import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { getFunctions, httpsCallable } from 'firebase/functions';

const Workers = () => {
  const [workers, setWorkers] = useState([]);
  const { jobId } = useParams(); 
  const db = getFirestore();

  useEffect(() => {
    const fetchWorkers = async () => {
      const jobRef = doc(db, 'Jobs', jobId);
      const jobDoc = await getDoc(jobRef);

      if (jobDoc.exists()) {
        const workerIds = jobDoc.data().workers || [];
        const workerData = await Promise.all(workerIds.map(async (workerId) => {
          const workerRef = doc(db, 'users', workerId);
          const workerDoc = await getDoc(workerRef);
          if (workerDoc.exists()) {
            const data = workerDoc.data();
            const storage = getStorage();
            const profilePicUrl = await getDownloadURL(ref(storage, `profile_pics/${workerId}`)).catch(() => "No Profile Pic");
            return { ...data, profilePicUrl, id: workerId };
          }
          return null;
        }));
        setWorkers(workerData.filter(Boolean)); 
      }
    };

    if (jobId) {
      fetchWorkers();
    }
  }, [jobId, db]);

  const sendEmails = () => {
    const functions = getFunctions();
    const sendEmail = httpsCallable(functions, 'sendEmail');
    const workerEmails = workers.map(worker => worker.email);

    sendEmail({ emails: workerEmails })
      .then(response => {
        console.log('Emails sent successfully', response);
      })
      .catch(error => {
        console.error('Error sending emails', error);
      });
  };

  return (
    <div className='container'>
      <div className='row'>
        <div className='col'>
          <h2>Workers for Job: {jobId}</h2>
          <button className="btn btn-primary" onClick={sendEmails}>Enviar correo masivo</button>
          <WorkerTable workers={workers} />
        </div>
      </div>
    </div>
  );
};

const WorkerTable = ({ workers }) => (
  <table className='table table-dark table-hover'>
    <thead>
      <tr>
        <th>Foto de Perfil</th>
        <th>Nombre</th>
        <th>Correo</th>
      </tr>
    </thead>
    <tbody>
      {workers.map(worker => (
        <tr key={worker.id}>
          <td>
            <img src={worker.profilePicUrl} alt="Profile" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
          </td>
          <td>{worker.name}</td>
          <td>{worker.email}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default Workers;
