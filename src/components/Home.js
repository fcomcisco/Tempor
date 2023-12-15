import React, { useState, useEffect } from 'react';
import { Container, Button, Card, Row, Col } from 'react-bootstrap';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, addDoc, query, getDocs } from 'firebase/firestore';
import { ToastContainer } from 'react-toastify';

const Home = () => {
  const [userType, setUserType] = useState(null);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserType(userDoc.data().userType);
        }
      } else {
        setUserType(null);
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  const sendTestNotificationToAllUsers = async () => {
    const usersQuery = query(collection(db, 'users'));
    const querySnapshot = await getDocs(usersQuery);
    querySnapshot.forEach(async (docSnap) => {
      await addDoc(collection(db, 'notifications'), {
        userId: docSnap.id,
        message: 'Notificacion de prueba',
        read: false
      });
    });
  };

  return (
    <Container fluid style={{ backgroundColor: '#080d11' }}>
      <ToastContainer />
      <header>
        <div className="page-header min-vh-100 d-flex justify-content-center align-items-center"
          style={{
            backgroundImage: `url(https://static.vecteezy.com/system/resources/previews/002/776/724/original/banner-city-landscape-of-silhouettes-vector.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}>
          <span className="mask bg-gradient-dark opacity-5"></span>
          <div className="container text-center">
            <div className="row justify-content-center">
              <div className="col-lg-6 col-md-8">
                <h1 className="text-white mb-4" style={{ fontSize: '3rem', letterSpacing: '2px' }}>Bienvenido a Tempor</h1>
                <p className="text-white opacity-8 lead">Encuentra trabajos esporádicos aquí</p>
                <div className="buttons">
                  {userType === null && (
                    <>
                      <Button href="/signin" variant="light" className="mt-4 mr-2">Ingresar</Button>
                      <Button href="/signup" variant="light" className="mt-4 ml-2">Registrarse</Button>
                    </>
                  )}
                  {userType === 'employer' && (
                    <Button href="/show-employers" variant="light" className="mt-4 ml-2">Mis Trabajos</Button>
                  )}
                  {userType === 'employee' && (
                    <Button href="/show-employees" variant="light" className="mt-4 ml-2">Trabajos</Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <Row className="text-center mt-4 justify-content-center">
        <Col md={4}>
          <Card className="mb-4 mx-auto" style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>Flexibilidad</Card.Title>
              <Card.Text>Elige cuándo y dónde quieres trabajar.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4 mx-auto" style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>Variabilidad</Card.Title>
              <Card.Text>Elige entre una variedad de tipos de trabajos.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4 mx-auto" style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>Pago</Card.Title>
              <Card.Text>Recibe tu pago de manera rápida y fiable.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <div className="text-center bg-secondary text-white p-5">
        <h2>¡Empieza Hoy!</h2>
        <p>¿Por qué esperar? Encuentra tu trabajo perfecto ahora.</p>
        {userType === null && (
          <Button href="/signup" variant="light" className="m-2">Únete Ahora</Button>
        )}
        <Button onClick={sendTestNotificationToAllUsers} variant="primary">Enviar una notificacion de prueba</Button>
      </div>
    </Container>
  );
};

export default Home;
