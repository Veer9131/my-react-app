import React, { useState } from 'react';
import './DeleteAccount.css';

const SuccessPage = () => {
  return (
    <div className="success-page">
      <div className="success-content">
        <div className="success-icon-large">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h1 className="success-title">Account Successfully Deleted</h1>
        <p className="success-text">
          We've processed your request. Your account and all associated data have been permanently removed from Sabjifal.
        </p>
        <div className="success-info">
          <p>Thank you for being with us. You can always create a new account if you change your mind.</p>
        </div>
        <button onClick={() => window.location.href = '/'} className="btn-primary success-btn">
          Return to Homepage
        </button>
      </div>
    </div>
  );
};

const DeleteAccount = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [verificationMethod, setVerificationMethod] = useState('otp');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDeleted, setIsDeleted] = useState(false);

  const API_URL = 'https://api.sabjifal.com/user/delete-account-by-number';

  const validateIndianMobile = (number) => {
    const regex = /^[6-9]\d{9}$/;
    return regex.test(number);
  };

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setMobileNumber(value);
      setError('');
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setOtp(value);
      setError('');
    }
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!validateIndianMobile(mobileNumber)) {
      setError('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: mobileNumber }),
      });

      const data = await response.json();
      
      if (data === true || data.status === true || data.success === true) {
        setStep(2);
      } else {
        setError(data.message || 'Verification failed. Please check your mobile number.');
      }
    } catch (err) {
      setError('Connection error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    
    if (verificationMethod === 'otp' && otp.length !== 4) {
      setError('Please enter a 4-digit OTP');
      return;
    }

    const confirmDelete = window.confirm(
      "Are you absolutely sure? This action cannot be undone and all your data will be permanently deleted."
    );
    
    if (!confirmDelete) return;

    setLoading(true);
    setError('');

    try {
      const payload = {
        mobile: mobileNumber,
        password: verificationMethod === 'password' ? password : "",
        otp: verificationMethod === 'otp' ? otp : ""
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data === true || data.status === true || data.success === true) {
        setIsDeleted(true);
      } else {
        setError(data.message || 'Deletion failed. Incorrect OTP or Password.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isDeleted) {
    return <SuccessPage />;
  }

  return (
    <div className="delete-account-container">
      <div className="delete-account-card">
        <h1 className="delete-account-title">Delete Account</h1>
        <p className="delete-account-subtitle">We're sorry to see you go</p>
        
        <div className="delete-account-warning">
          <span>We will permanently remove your data, history, and profile. This cannot be reversed.</span>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={step === 1 ? handleSendRequest : handleDeleteAccount}>
          <div className="form-group">
            <label htmlFor="mobile">Indian Mobile Number</label>
            <div className="input-with-prefix">
              <span className="prefix">+91</span>
              <input
                id="mobile"
                type="tel"
                placeholder="10-digit number"
                value={mobileNumber}
                onChange={handleMobileChange}
                disabled={step === 2 || loading}
                required
              />
            </div>
          </div>

          {step === 1 && (
            <div className="verification-options">
              <label className="main-label">Verify using</label>
              <div className="radio-group">
                <label className={verificationMethod === 'otp' ? 'active' : ''}>
                  <input
                    type="radio"
                    value="otp"
                    checked={verificationMethod === 'otp'}
                    onChange={() => setVerificationMethod('otp')}
                  />
                  OTP
                </label>
                <label className={verificationMethod === 'password' ? 'active' : ''}>
                  <input
                    type="radio"
                    value="password"
                    checked={verificationMethod === 'password'}
                    onChange={() => setVerificationMethod('password')}
                  />
                  Password
                </label>
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Processing...' : (verificationMethod === 'otp' ? 'Get 4-Digit OTP' : 'Proceed to Verify')}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="verification-input-area">
              {verificationMethod === 'otp' ? (
                <div className="form-group">
                  <label htmlFor="otp">Enter 4-Digit OTP</label>
                  <input
                    id="otp"
                    type="text"
                    placeholder="0 0 0 0"
                    maxLength="4"
                    className="otp-input"
                    value={otp}
                    onChange={handleOtpChange}
                    disabled={loading}
                    required
                  />
                </div>
              ) : (
                <div className="form-group">
                  <label htmlFor="password">Enter Your Password</label>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              )}
              
              <div className="button-group">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setStep(1)}
                  disabled={loading}
                >
                  Back
                </button>
                <button type="submit" className="btn-danger" disabled={loading}>
                  {loading ? 'Deleting...' : 'Delete My Account'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default DeleteAccount;
