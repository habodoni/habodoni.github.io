import React, { useState } from 'react';
import './LoginSignupModal.css';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { setDoc, doc } from 'firebase/firestore';

const LoginSignupModal = ({ setUser, closeModal }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setUser(userCredential.user);
            closeModal();
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                firstName,
                lastName,
                createdAt: new Date(),
            });
            setUser(user);
            closeModal();
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="modal-backdrop" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{isLogin ? 'Login' : 'Signup'}</h2>
                <form onSubmit={isLogin ? handleLogin : handleSignup}>
                    {!isLogin && (
                        <>
                            <input
                                type="text"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </>
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">{isLogin ? 'Login' : 'Signup'}</button>
                    {error && <p className="error">{error}</p>}
                </form>
                <button onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? 'Switch to Signup' : 'Switch to Login'}
                </button>
            </div>
        </div>
    );
};

export default LoginSignupModal;
