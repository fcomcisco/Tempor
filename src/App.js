// Import the necessary modules
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

import Home from './components/Home';
import Create from './components/Create';
import Edit from './components/Edit';
import ShowEmployees from './components/ShowEmployees';
import ShowEmployers from './components/ShowEmployers';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import NavBarEmployees from './components/NavBarEmployees';
import NavBarEmployers from './components/NavBarEmployers';
import Postulates from './components/Postulates';
import Workers from './components/Workers';
import Chat from './components/Chat';

function App() {
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

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
  }, []);

  return (
    <div className="App">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
      <Router>
        {userType === 'employer' && <NavBarEmployers />}
        {userType === 'employee' && <NavBarEmployees />}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/create' element={<Create />} />
          <Route path='/edit/:id' element={<Edit />} />
          <Route path='/show-employees' element={<ShowEmployees />} />
          <Route path='/show-employers' element={<ShowEmployers />} />
          <Route path='/signin' element={<SignIn />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/profile/:userId' element={<Profile />} />
          <Route path='/postulates/:id' element={<Postulates />} />
          <Route path='/workers/:jobId' element={<Workers />} />
          <Route path='/chat' element={<Chat />} /> {/* Main chat route */}
        </Routes>
        <ToastContainer />
      </Router>
    </div>
  );
}

export default App;
