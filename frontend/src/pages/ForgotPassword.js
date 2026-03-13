import React from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    return (
        <div className="auth-container">
            <div className="auth-box">
                <div className="lock-icon">🔒</div>
                <h2>Trouble logging in?</h2>
                <p className="tagline">Enter your email and we'll send you a link to get back into your account.</p>
                <form className="auth-form">
                    <div className="input-group"><input type="email" placeholder="Email" required /></div>
                    <button className="btn-primary">Send Login Link</button>
                </form>
                <div className="divider"><span>OR</span></div>
                <Link to="/register" className="create-account-link">Create New Account</Link>
            </div>
            <div className="auth-box secondary">
                <Link to="/login" className="back-link">Back to Login</Link>
            </div>
        </div>
    );
};

export default ForgotPassword;