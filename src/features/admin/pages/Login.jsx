import { useState, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { axiosMain } from '../../../api/axios';
import ParticlesBg from '../../../shared/components/ParticlesBg';
import modyStoreLogo from '../../../assets/diva-store-logo.png'
import { Helmet } from 'react-helmet-async';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const MemoizedParticlesBg = useMemo(() => <ParticlesBg />, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axiosMain.post('/auth/login', { email: email, password: password });
      login(response.data.accessToken);
    } catch (err) {
      setError('اسم المستخدم او الرقم السري غير صحيح!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-screen h-screen'>
      <Helmet>
        <title>Diva Store - Dashboard Login</title>
        <meta name="description" content="Diva Store - Dashboard" />
        <meta name="keywords" content="Diva Store - Dashboard" />

        {/* Open Graph for social sharing */}
        <meta property="og:title" content="Diva Store - Dashboard" />
        <meta property="og:description" content="Diva Store - Dashboard" />
        <meta property="og:image" content="https://i.ibb.co/cK3y2NMt/diva-store-logo.png" />
        <meta property="og:url" content={`https://divastore.com/admin`} />
        <meta property="og:type" content="product" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Diva Store - Dashboard" />
        <meta name="twitter:description" content="Diva Store - Dashboard" />
        <meta name="twitter:image" content="https://i.ibb.co/cK3y2NMt/diva-store-logo.png" />
      </Helmet>

      <div className="absolute top-0 left-0 z-100 w-full h-full flex items-center justify-center">
        <div className="w-5/6 md:w-1/2 lg:w-1/3 bg-[#ffffffb0] text-gray-700 py-14 p-8 rounded-xl shadow-md text-gray-800 flex flex-col items-center justify-center gap-8">
          <div>
            <img src={modyStoreLogo} alt="Diva Store" className='w-24 block mx-auto' />
            <h2 className='text-2xl text-center mx-auto font-bold'>تسجيل الدخول</h2>
          </div>
          <form onSubmit={handleSubmit} className='w-full flex flex-col gap-8'>
            <div className='flex flex-col flex-grow'>
              <input
                type="text"
                id='user-email'
                name='user-email'
                className='custom-input-field w-full'
                placeholder='اسم المستخدم'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className='flex flex-col flex-grow'>
              <input
                type="Password"
                id='password'
                name='user-password'
                className='custom-input-field w-full'
                placeholder='كلمة السر'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className='text-red-400'>{error}</div>}
            <button type="submit" name='login-btn' className='w-full bg-indigo-500 text-white py-2 px-4 rounded-lg duration-500 hover:bg-indigo-600' disabled={loading}>
              {loading ? 'جار التسجيل...' : 'تسجيل'}
            </button>
          </form>
        </div>
      </div>


      {MemoizedParticlesBg}
    </div>
  );
};

export default Login;
