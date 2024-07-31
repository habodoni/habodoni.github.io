import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import './App.css';
import TypingTest from './components/TypingTest';
import LoginSignupModal from './components/LoginSignupModal';
import AccountSettings from './components/AccountSettings';
import { auth, db } from './firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

function App() {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFirstName(data.firstName || '');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    signOut(auth);
  };

  return (
    <Router>
      <div className="App">
        <img
          src={`${process.env.PUBLIC_URL}/logo.png`}
          alt="typeShi Logo"
          className="logo"
          onClick={() => window.location.reload()}
        />
        {user ? (
          <div className="user-info">
            <p>Welcome, {firstName}</p>
            <Link to="/settings" className="account-button">Account Settings</Link>
            <button className="account-button" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        ) : (
          <button className="sign-in-button" onClick={() => setShowModal(true)}>
            Sign In
          </button>
        )}
        {showModal && (
          <LoginSignupModal setUser={setUser} closeModal={() => setShowModal(false)} />
        )}
        <Routes>
          <Route path="/" element={<TypingTest user={user} />} />
          <Route path="/settings" element={user ? <AccountSettings user={user} /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
