import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { Navbar, Container, Nav, Dropdown } from 'react-bootstrap';
import { collection, query, where, onSnapshot, getFirestore, updateDoc, doc , getDocs} from 'firebase/firestore';
import { toast } from 'react-toastify';

const NavBarEmployers = () => {
  const [user, setUser] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
        const notificationsRef = collection(db, 'notifications');
        const q = query(notificationsRef, where('userId', '==', authUser.uid), where('read', '==', false));
        onSnapshot(q, (snapshot) => {
          setNotificationCount(snapshot.size);
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  const logout = async () => {
    await signOut(auth);
    window.location.href = '/';
  };

  const showNotifications = async () => {
    const notificationsRef = collection(db, 'notifications');
    const q = query(notificationsRef, where('userId', '==', user.uid), where('read', '==', false));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (docSnap) => {
      toast.info(docSnap.data().message);
      await updateDoc(doc(db, 'notifications', docSnap.id), {
        read: true
      });
    });
    setNotificationCount(0); // Reset the notification count
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
            <Nav.Link href='/show-employers' style={{ color: 'white' }}>
              Trabajos Empleadores
            </Nav.Link>
            <Nav.Link href='/create' style={{ color: 'white' }}>
              Crear
            </Nav.Link>
            {user && notificationCount > 0 && (
              <Nav.Link onClick={showNotifications} style={{ color: 'white' }}>
                You have {notificationCount} notifications
              </Nav.Link>
            )}
            {!user ? (
              <>
                <Nav.Link href='/signin' style={{ color: 'white' }}>
                  Ingresar
                </Nav.Link>
                <Nav.Link href='/signup' style={{ color: 'white' }}>
                  Regístrate
                </Nav.Link>
              </>
            ) : (
              <Dropdown>
                <Dropdown.Toggle variant='success' id='dropdown-basic' style={{ color: 'white' }}>
                  {user.email}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>{user.displayName}</Dropdown.Item>
                  <Dropdown.Item href={`/profile/${user.uid}`}>Ir a Perfil</Dropdown.Item>
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

export default NavBarEmployers;
