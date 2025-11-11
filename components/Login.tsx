import React, { useState, FormEvent } from 'react';
import { auth, firestore } from '../services/firebase';
import { signInAnonymously } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const AVATAR_COLORS = [
    'bg-rose-400', 'bg-sky-400', 'bg-teal-400', 'bg-amber-400', 
    'bg-violet-400', 'bg-lime-400', 'bg-pink-400'
];

const Login: React.FC = () => {
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Please enter your name.');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const userCredential = await signInAnonymously(auth);
            const userId = userCredential.user.uid;
            
            // Create user profile in Firestore
            const userRef = doc(firestore, 'users', userId);
            await setDoc(userRef, {
                name: name.trim(),
                role: 'user', // All new users start as 'user'
                avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
            });
            // onAuthStateChanged in App.tsx will handle the rest
        } catch (err) {
            console.error("Login failed:", err);
            setError("Failed to join the calendar. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white rounded-lg shadow-2xl p-8 text-center">
                <h1 className="text-3xl font-bold text-indigo-600 mb-2">Welcome!</h1>
                <p className="text-gray-500 mb-6">Join your family calendar.</p>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="name" className="sr-only">Your Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {isLoading ? 'Joining...' : 'Join Calendar'}
                    </button>
                    {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default Login;
