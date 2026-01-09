import React, { useState } from 'react';
import { auth, db } from '../services/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const SetupAdmin = () => {
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const makeMeAdmin = async () => {
    if (!auth.currentUser) {
      setStatus('You must be logged in first! Please go to Login page.');
      return;
    }
    try {
      setStatus('Updating role...');
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        role: 'admin',
        approved: true
      });
      setStatus('Success! You are now an Admin. Redirecting...');
      // Force reload to refresh auth context or just navigate
      // Context might not auto-update role immediately if it doesn't listen to doc changes,
      // but usually we rely on page refresh or context reload.
      // Let's reload to be safe.
      setTimeout(() => {
        window.location.href = '/admin';
      }, 1000);
    } catch (error) {
      console.error(error);
      setStatus('Error: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Admin Setup Tool</h1>
        <div className="mb-6 text-center">
          <p className="text-gray-600 mb-2">Current User:</p>
          <p className="font-mono bg-gray-100 p-2 rounded">
            {auth.currentUser ? auth.currentUser.email : 'Not logged in'}
          </p>
        </div>
        
        <button 
          onClick={makeMeAdmin}
          disabled={!auth.currentUser}
          className={`w-full py-2 px-4 rounded font-bold text-white transition-colors
            ${auth.currentUser 
              ? 'bg-indigo-600 hover:bg-indigo-700' 
              : 'bg-gray-400 cursor-not-allowed'}`}
        >
          Promote to Admin
        </button>
        
        {status && (
          <div className={`mt-4 text-center p-2 rounded ${status.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {status}
          </div>
        )}
        
        <div className="mt-6 text-center">
          <button onClick={() => navigate('/login')} className="text-indigo-600 hover:underline">
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetupAdmin;
