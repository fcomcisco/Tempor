import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { Button, Form, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faCity, faBirthdayCake, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const calculateAge = (birthdate) => {
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [userType, setUserType] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
    }
  };

  const register = async (e) => {
    e.preventDefault();

    if (!profilePic) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'La foto de perfil es obligatoria',
      });
      return;
    }

    const auth = getAuth();
    const db = getFirestore();
    const storage = getStorage();
    let userCredential;

    try {
      userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const storageRef = ref(storage, 'profile_pics/' + user.uid);
      await uploadBytes(storageRef, profilePic);
      await setDoc(doc(db, 'users', user.uid), {
        name,
        age: calculateAge(age),
        city,
        userType,
        email,
      });

      // Clear form fields
      setEmail('');
      setPassword('');
      setName('');
      setAge('');
      setCity('');
      setUserType('');
      setProfilePic(null);

      Swal.fire({
        icon: 'success',
        title: 'El registro fue exitoso',
      }).then(() => {
        navigate('/');
      });

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Algo salió mal',
      });

      if (userCredential) {
        const user = userCredential.user;
        user.delete();
      }

      setEmail('');
      setPassword('');
    }
  };

  return (
    <Form onSubmit={register} className="m-4">
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formBasicName">
          <Form.Label><FontAwesomeIcon icon={faUser} /> Nombre y Apellido</Form.Label>
          <Form.Control type="text" placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} required />
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formBasicAge">
          <Form.Label><FontAwesomeIcon icon={faBirthdayCake} /> Fecha de Nacimiento</Form.Label>
          <Form.Control type="date" placeholder="Fecha de Nacimiento" value={age} onChange={e => setAge(e.target.value)} required />
        </Form.Group>
        <Form.Group as={Col} controlId="formBasicCity">
          <Form.Label><FontAwesomeIcon icon={faCity} /> Ciudad</Form.Label>
          <Form.Control type="text" placeholder="Ciudad" value={city} onChange={e => setCity(e.target.value)} required />
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formBasicEmail">
          <Form.Label><FontAwesomeIcon icon={faEnvelope} /> Correo Electrónico</Form.Label>
          <Form.Control type="email" placeholder="Correo Electrónico" value={email} onChange={e => setEmail(e.target.value)} required />
        </Form.Group>
        <Form.Group as={Col} controlId="formBasicPassword">
          <Form.Label><FontAwesomeIcon icon={faLock} /> Contraseña</Form.Label>
          <Form.Control type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col}>
          <Form.Label><FontAwesomeIcon icon={faUserTie} /> Tipo de Usuario</Form.Label>
          <Form.Check type="radio" label="Empleador" name="userType" value="employer" onChange={e => setUserType(e.target.value)} required />
          <Form.Check type="radio" label="Trabajador" name="userType" value="employee" onChange={e => setUserType(e.target.value)} required />
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col}>
          <Form.Label>Foto de Perfil</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} required />
        </Form.Group>
      </Row>
      <Button variant="primary" type="submit">
        Registrarse
      </Button>
    </Form>
  );
};

export default SignUp;
