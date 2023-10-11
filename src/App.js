import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { Navbar, Container, Nav, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './components/Home';
import Create from './components/Create';
import Edit from './components/Edit';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Profile from './components/Profile';

function App() {
  return (
    <div className="App">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
      <Router>
        <NavigationBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/create' element={<Create />} />
          <Route path='/edit/:id' element={<Edit />} />
          <Route path='/signin' element={<SignIn />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/profile' element={<Profile />} />
        </Routes>
      </Router>
    </div>
  );
}

const NavigationBar = () => {
  const [user, setUser] = useState(null);
  const auth = getAuth();
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, [auth]);

  const logout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  return (
    <Navbar style={{ backgroundColor: 'black', color: 'white' }} expand='lg'>
      <Container>
        <Navbar.Brand href='/' style={{ color: 'white' }}>
          <i className="fas fa-hourglass-half mr-2"></i>
          Tempor
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='me-auto'>
            {user && <Nav.Link href='/' style={{ color: 'white' }}>Trabajos</Nav.Link>}
            {user && <Nav.Link href='/create' style={{ color: 'white' }}>Crear</Nav.Link>}
            {!user ? (
              <>
                <Nav.Link href='/signin' style={{ color: 'white' }}>Ingresar</Nav.Link>
                <Nav.Link href='/signup' style={{ color: 'white' }}>Registrate</Nav.Link>
              </>
            ) : (
              <Dropdown>
                <Dropdown.Toggle variant='success' id='dropdown-basic' style={{ color: 'white' }}>
                  {user.email}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>{user.displayName}</Dropdown.Item>
                  <Dropdown.Item href="/profile">Ir a Perfil</Dropdown.Item>
                  <Dropdown.Item onClick={logout}>Salir de la cuenta</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );  
};

export default App;
