import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../hooks/useAuth';
import { useUser } from '../hooks/useUser';
import { getFirestore, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, deleteObject, uploadBytes } from 'firebase/storage';
import { getAuth, deleteUser } from 'firebase/auth';

function Profile() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [userType, setUserType] = useState('');
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [curriculumUrl, setCurriculumUrl] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const { currentUser, loading } = useAuth();
  const { getUserProfile, setUserProfile } = useUser();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (currentUser) {
        const userData = await getUserProfile(currentUser.uid);
        const db = getFirestore();
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (userData) {
          setName(userData.name || '');
          setAge(userData.age || '');
          setCity(userData.city || '');
        }

        if (docSnap.exists()) {
          setUserType(docSnap.data().userType || '');
        }

        const storage = getStorage();
        const profilePicRef = ref(storage, 'profile_pics/' + currentUser.uid);
        try {
          const profileUrl = await getDownloadURL(profilePicRef);
          setProfilePicUrl(profileUrl);
        } catch (error) {
          console.error("Error getting profile pic URL: ", error);
        }

        const curriculumRef = ref(storage, 'curriculum/' + currentUser.uid);
        try {
          const curriculumUrl = await getDownloadURL(curriculumRef);
          setCurriculumUrl(curriculumUrl);
        } catch (error) {
          console.error("Error getting curriculum URL: ", error);
        }
      }
    };

    if (!loading) {
      fetchUserProfile();
    }
  }, [currentUser, loading, getUserProfile]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userProfile = {
      name,
      age,
      city,
      userType
    };
    await setUserProfile(currentUser.uid, userProfile);
    setIsEdit(false);
  };

  const handleDeleteEverything = async () => {
    const db = getFirestore();
    const userDoc = doc(db, 'users', currentUser.uid);
    await deleteDoc(userDoc);

    const storage = getStorage();
    const profilePicRef = ref(storage, 'profile_pics/' + currentUser.uid);
    await deleteObject(profilePicRef);

    const curriculumRef = ref(storage, 'curriculum/' + currentUser.uid);
    await deleteObject(curriculumRef);

    const auth = getAuth();
    await deleteUser(auth.currentUser);
  };

  const handleEdit = () => {
    setIsEdit(true);
  };

  const handleCurriculumUpload = async (e) => {
    const storage = getStorage();
    const curriculumFile = e.target.files[0];

    const curriculumRef = ref(storage, `curriculum/${currentUser.uid}/${curriculumFile.name}`);

    await uploadBytes(curriculumRef, curriculumFile);

    try {
      const updatedCurriculumUrl = await getDownloadURL(curriculumRef);
      setCurriculumUrl(updatedCurriculumUrl);
    } catch (error) {
      console.error("Error getting updated curriculum URL: ", error);
    }
  };

  if (loading) {
    return <Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner>;
  }

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={8}>
          <Card>
            <Card.Body>
              <Card.Title><h1>Perfil de usuario</h1></Card.Title>
              <Row>
                <Col md={4}>
                  {profilePicUrl && <img src={profilePicUrl} alt="Perfil" className="img-fluid rounded-circle" />}
                </Col>
                <Col md={8}>
                  {isEdit ? (
                    <Form onSubmit={handleSubmit}>
                      <Form.Group controlId="formBasicName">
                        <Form.Label>Nombre:</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Nombre"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </Form.Group>
                      <Form.Group controlId="formBasicAge">
                        <Form.Label>Edad:</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Edad"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          required
                        />
                      </Form.Group>
                      <Form.Group controlId="formBasicCity">
                        <Form.Label>Ciudad:</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Ciudad"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          required
                        />
                      </Form.Group>
                      <Button type="submit">Guardar Cambios</Button>
                    </Form>
                  ) : (
                    <div>
                      <p>Nombre: {name}</p>
                      <p>Edad: {age}</p>
                      <p>Ciudad: {city}</p>
                      <p>Tipo de Usuario: {userType}</p>
                      <p>Curriculum: {curriculumUrl ? <a href={curriculumUrl} target="_blank" rel="noopener noreferrer">Ver curriculum</a> : 'Sin cargar'}</p>
                      <input type="file" accept=".pdf" onChange={handleCurriculumUpload} />
                      <Button onClick={handleEdit}>
                        <FontAwesomeIcon icon={faEdit} /> Editar
                      </Button>
                      <Button variant="danger" onClick={handleDeleteEverything}>
                        <FontAwesomeIcon icon={faTrashAlt} /> Borrar todo
                      </Button>
                    </div>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;
