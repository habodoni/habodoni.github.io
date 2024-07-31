import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import './AccountSettings.css';

const AccountSettings = ({ user }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    console.log("User Data:", data); // Debug log
                    setFirstName(data.firstName || '');
                    setLastName(data.lastName || '');
                }
            }
        };
        fetchUserData();
    }, [user]);

    const handleSave = async () => {
        if (user) {
            const docRef = doc(db, 'users', user.uid);
            try {
                console.log("Saving Data:", { firstName, lastName }); // Debug log
                await updateDoc(docRef, {
                    firstName,
                    lastName,
                });
                setSuccessMessage('Profile updated successfully');
                setTimeout(() => {
                    setSuccessMessage('');
                    navigate('/');
                }, 3000); // Redirect after 2 seconds
            } catch (error) {
                console.error("Error updating document: ", error); // Debug log
                setSuccessMessage('Error updating profile');
            }
        }
    };

    return (
        <div className="account-settings-container">
            <h2>Account Settings</h2>
            <div className="account-settings-form">
                <label>
                    First Name:
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </label>
                <label>
                    Last Name:
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </label>
                <button onClick={handleSave}>Save</button>
                {successMessage && <p className="success-message">{successMessage}</p>}
            </div>
        </div>
    );
};

export default AccountSettings;
