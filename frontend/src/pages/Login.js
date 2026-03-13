import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../logo.svg';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/users/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access);
        navigate('/home'); // ينقلك لصفحة الهوم بعد النجاح
      } else {
        setError('Invalid username or password. Please try again.');
      }
    } catch (err) {
      setError('Connection failed. Please make sure Backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = () => {
    // توجيه لصفحة تسجيل دخول فيسبوك الرسمية للحصول على صلاحية التطبيق
    window.location.href = "https://www.facebook.com/v12.0/dialog/oauth?client_id=YOUR_FB_APP_ID&redirect_uri=" + window.location.origin + "/login&scope=email";
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="logo-wrapper">
          <img src={logo} alt="Proly Connect" className="auth-logo" />
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="input-group">
            <input type="text" placeholder="Username or Email" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="input-group">
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Log In'}
          </button>
        </form>

        <div className="divider"><span>OR</span></div>

        <button className="btn-facebook" onClick={handleFacebookLogin}>
           Continue with Facebook
        </button>

        {error && <div className="error-message">{error}</div>}

        <Link to="/forgot-password" hidden={false} className="forgot-link">Forgot password?</Link>
      </div>

      <div className="auth-box secondary">
        <p>Don't have an account? <Link to="/register" className="signup-link">Sign up</Link></p>
      </div>

      <div className="app-download">
        <p>Get the app.</p>
        <div className="store-badges">
          <a href="https://apps.apple.com/app/proly-connect/id123456" target="_blank" rel="noreferrer">
            <img src="https://static.cdninstagram.com/rsrc.php/v3/yz/r/c5Rp7Ym_f00.png" alt="App Store" />
          </a>
          <a href="https://play.google.com/store/apps/details?id=com.proly.connect" target="_blank" rel="noreferrer">
            <img src="https://static.cdninstagram.com/rsrc.php/v3/yz/r/E5D6vG9Hm2V.png" alt="Google Play" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;