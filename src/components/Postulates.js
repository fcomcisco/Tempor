import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoc, doc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { db } from '../firebaseConfig/firebase';

const Postulates = () => {
  const { id } = useParams();
  const [postulatedUsers, setPostulatedUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostulatedUsers = async () => {
        const jobRef = doc(db, 'Jobs', id);
        const jobDoc = await getDoc(jobRef);
        if (jobDoc.exists()) {
            const interestedUsers = jobDoc.data().interestedUsers;
            const userDataArray = await Promise.all(
                interestedUsers.map(async userId => {
                    const userRef = doc(db, 'users', userId);
                    const userDoc = await getDoc(userRef);
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        const storage = getStorage();
                        const profilePicUrl = await getDownloadURL(ref(storage, `profile_pics/${userId}`))
                            .catch(() => "Profile picture not available");
                        
                        let cvUrl = null;
                        try {
                            cvUrl = await getDownloadURL(ref(storage, `curriculum/${userId}`));
                        } catch (error) {
                            console.error(`CV not found for user: ${userId}`);
                        }
                        return { ...data, profilePicUrl, cvUrl, id: userId };
                    }
                    return null;
                })
            );
            setPostulatedUsers(userDataArray.filter(user => user));
        } else {
            console.log('No such job!');
        }
    };
    fetchPostulatedUsers();
}, [id]);

  const handleDecline = async (userId) => {
    setPostulatedUsers(currentUsers => currentUsers.filter(user => user.id !== userId));
    const jobRef = doc(db, 'Jobs', id);
    await updateDoc(jobRef, {
      interestedUsers: arrayRemove(userId)
    });
  };

  const handleAccept = async (userId) => {
    const jobRef = doc(db, 'Jobs', id);
    await updateDoc(jobRef, {
      interestedUsers: arrayRemove(userId),
      workers: arrayUnion(userId)
    });
  };

  const handleViewProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className='container'>
      <div className='row'>
        <div className='col'>
          <h2>Postulantes para el trabajo: {id}</h2>
          {postulatedUsers.length > 0 ? (
            <PostulatedTable
              postulatedUsers={postulatedUsers}
              onDecline={handleDecline}
              onAccept={handleAccept}
              onViewProfile={handleViewProfile}
            />
          ) : (
            <p>Aun no tienes candidatos para este trabajo.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const PostulatedTable = ({ postulatedUsers, onDecline, onAccept, onViewProfile }) => (
  <table className='table table-dark table-hover'>
    <thead>
      <tr>
        <th>Foto de Perfil</th>
        <th>Nombre</th>
        <th>Edad</th>
        <th>Ciudad</th>
        <th>Curriculum</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {postulatedUsers.map(user => (
        <tr key={user.id}>
          <td>
            <img src={user.profilePicUrl} alt="Profile" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
          </td>
          <td>{user.name}</td>
          <td>{user.age}</td>
          <td>{user.city}</td>
          <td>
            {user.cvUrl ? <a href={user.cvUrl} target="_blank" rel="noopener noreferrer">Ver CV</a> : "Sin CV"}
          </td>
          <td>
            <button className="btn btn-primary" onClick={() => onViewProfile(user.id)}>See Profile</button>
            <button className="btn btn-success" onClick={() => onAccept(user.id)}>Accept</button>
            <button className="btn btn-danger" onClick={() => onDecline(user.id)}>Decline</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default Postulates;
