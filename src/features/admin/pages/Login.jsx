import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import axios from '../../../api/axios';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.get('/auth/login', { email: email, password: password });
      login(response.data);
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-screen h-screen grid grid-cols-1 md:grid-cols-2'>
      <div className="h-screen bg-indigo-500 text-white  flex items-center justify-center">
        <h1>ModyStore</h1>
      </div>
      <div className="h-screen bg-white text-gray-800 flex items-center justify-center">
        <div className="w-2/3">
          <h2 className='text-center mx-auto mb-8 font-bold'>تسجيل الدخول</h2>
          <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
            <div className='flex flex-col'>
              <label htmlFor='user-email' className='custom-label-field'>البريد الإلكتروني</label>
              <input
                type="text"
                id='user-email'
                className='custom-input-field'
                placeholder='أدخل البريد الإلكتروني...'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className='flex flex-col'>
              <label htmlFor='password' className='custom-label-field'>كلمه السر</label>
              <input
                type="Password"
                id='password'
                className='custom-input-field'
                placeholder='أدخل كلمه السر...'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className='text-red-400'>{error}</div>}
            <button type="submit" className='w-full bg-indigo-500 text-white py-2 px-4 rounded-xl duration-500 hover:bg-indigo-600' disabled={loading}>
              {loading ? 'جار التسجيل...' : 'تسجيل'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
