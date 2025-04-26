// src/pages/Signup.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post('http://localhost:5000/api/auth/signup', { email, password });
      
      toast.success('Signup successful! Redirecting to login...', {
        position: "top-center",
        autoClose: 2000,
      });

      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Signup failed!', {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSignup} className="bg-white p-8 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
          Signup
        </button>
        <p className="text-center mt-4">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-blue-500 hover:text-blue-700">Login</button>
        </p>
      </form>

      {/* Toast container */}
      <ToastContainer />
    </div>
  );
};

export default Signup;
