import React from 'react';
import { Container, Button, Card, Row, Col } from 'react-bootstrap';

const Home = () => {
  return (
    <Container fluid style={{ backgroundColor: '#080d11' }}>
      <header>
        <div
          className="page-header min-vh-100 d-flex justify-content-center align-items-center"
          style={{
            backgroundImage: `url(https://static.vecteezy.com/system/resources/previews/002/776/724/original/banner-city-landscape-of-silhouettes-vector.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <span className="mask bg-gradient-dark opacity-5"></span>
          <div className="container text-center">
            <div className="row justify-content-center">
              <div className="col-lg-6 col-md-8">
                <h1 className="text-white mb-4" style={{ fontSize: '3rem', letterSpacing: '2px' }}>
                  Bienvenido a Tempor
                </h1>
                <p className="text-white opacity-8 lead">Encuentra trabajos esporádicos aquí</p>
                <div className="buttons">
                  <Button href="/signin" variant="light" className="mt-4 mr-2">
                    Ingresar
                  </Button>
                  <Button href="/signup" variant="light" className="mt-4 ml-2">
                    Registrarse
                  </Button>
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
        <Button href="/signup" variant="light" className="m-2">
          Únete Ahora
        </Button>
      </div>
    </Container>
  );
};

export default Home;
