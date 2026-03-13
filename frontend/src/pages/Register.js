import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../logo.svg';

const Register = () => {
    const [formData, setFormData] = useState({ email: '', fullName: '', username: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setError("Passwords do not match!");
        }
        // كود الربط مع الباك إند
        try {
            const res = await fetch('http://127.0.0.1:8000/api/v1/users/register/', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            });
            if (res.ok) navigate('/login');
            else setError("Registration failed. Try a different username.");
        } catch (err) { setError("Server error."); }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <div className="logo-wrapper"><img src={logo} className="auth-logo" alt="logo" /></div>
                <h2 className="tagline">Sign up to see professional services.</h2>
                <form className="auth-form" onSubmit={handleRegister}>
                    <div className="input-group"><input type="text" placeholder="Email or Phone" onChange={e => setFormData({...formData, email: e.target.value})} required /></div>
                    <div className="input-group"><input type="text" placeholder="Full Name" onChange={e => setFormData({...formData, fullName: e.target.value})} required /></div>
                    <div className="input-group"><input type="text" placeholder="Username" onChange={e => setFormData({...formData, username: e.target.value})} required /></div>
                    <div className="input-group"><input type="password" placeholder="Password" onChange={e => setFormData({...formData, password: e.target.value})} required /></div>
                    <div className="input-group"><input type="password" placeholder="Confirm Password" onChange={e => setFormData({...formData, confirmPassword: e.target.value})} required /></div>
                    <button type="submit" className="btn-primary">Sign Up</button>
                </form>
                {error && <div className="error-message">{error}</div>}
            </div>
            <div className="auth-box secondary">
                <p>Have an account? <Link to="/login" className="signup-link">Log in</Link></p>
            </div>
        </div>
    );
};

export default Register;