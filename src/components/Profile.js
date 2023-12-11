import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../hooks/useAuth';
import { getFirestore, doc, getDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, deleteObject, uploadBytes } from 'firebase/storage';

function Profile() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [curriculumUrl, setCurriculumUrl] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const { currentUser, loading } = useAuth();
  const { userId } = useParams();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const db = getFirestore();
      const docRef = doc(db, 'users', userId || currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        setName(userData.name || '');
        setAge(userData.age || '');
        setCity(userData.city || '');
      }

      const storage = getStorage();
      const profilePicRef = ref(storage, 'profile_pics/' + (userId || currentUser.uid));
      try {
        const profileUrl = await getDownloadURL(profilePicRef);
        setProfilePicUrl(profileUrl);
      } catch {
        console.error("Error obteniendo foto de perfil");
      }

      const curriculumRef = ref(storage, 'curriculum/' + (userId || currentUser.uid));
      try {
        const curriculumUrl = await getDownloadURL(curriculumRef);
        setCurriculumUrl(curriculumUrl);
      } catch {
        console.error("Error obteniendo curriculum");
      }
    };

    if (!loading && currentUser) {
      fetchUserProfile();
    }
  }, [userId,currentUser, loading]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const db = getFirestore();
    const docRef = doc(db, 'users', currentUser.uid);
    const userData = { name, age, city };
    await setDoc(docRef, userData, { merge: true });
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
  };

  const handleEdit = () => {
    setIsEdit(true);
  };

  const handleCurriculumUpload = async (e) => {
    const storage = getStorage();
    const curriculumFile = e.target.files[0];
    if (!curriculumFile) return;

    const curriculumRef = ref(storage, `curriculum/${currentUser.uid}`);
    await uploadBytes(curriculumRef, curriculumFile);

    const updatedCurriculumUrl = await getDownloadURL(curriculumRef);
    setCurriculumUrl(updatedCurriculumUrl);
  };

  const isCurrentUserProfile = currentUser && userId === currentUser.uid;

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
                      <Button variant="primary" type="submit">
                        Guardar
                      </Button>
                    </Form>
                  ) : (
                    <div>
                      <p>Nombre: {name}</p>
                      <p>Edad: {age}</p>
                      <p>Ciudad: {city}</p>
                      {curriculumUrl && (
                        <div>
                          <a href={curriculumUrl} target="_blank" rel="noopener noreferrer">Ver Curriculum</a>
                        </div>
                      )}
                      {isCurrentUserProfile && (
                        <>
                          <input type="file" accept=".pdf" onChange={handleCurriculumUpload} />
                          <Button onClick={handleEdit}>
                            <FontAwesomeIcon icon={faEdit} /> Editar
                          </Button>
                          <Button variant="danger" onClick={handleDeleteEverything}>
                            <FontAwesomeIcon icon={faTrashAlt} /> Borrar todo
                          </Button>
                        </>
                      )}
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
