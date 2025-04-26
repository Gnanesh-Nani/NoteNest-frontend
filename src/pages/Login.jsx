import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true

    try {
      // Send login request to backend
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });

      // Save the JWT token in localStorage
      localStorage.setItem('token', res.data.token);

      // Show success toast
      toast.success('Login successful!', {
        position: "top-center",
        autoClose: 2000,
      });

      // Redirect after a short delay
      setTimeout(() => {
        navigate('/dashboard'); // Assuming you have a dashboard route
      }, 2500);
    } catch (error) {
      console.error(error);
      // Show error toast
      toast.error('Login failed! Check email or password.', {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-80 animate-fade-in transform transition duration-300 hover:scale-105"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300 disabled:opacity-50"
          disabled={loading} // Disable the button while loading
        >
          {loading ? 'Logging in...' : 'Login'} {/* Show loading text */}
        </button>
        <p className="text-center mt-4">
          Don't have an account?{' '}
          <button onClick={() => navigate('/signup')} className="text-blue-500 hover:text-blue-700">Sign up</button>
        </p>
      </form>

      {/* Toast container for success/error messages */}
      <ToastContainer />
    </div>
  );
};

export default Login;