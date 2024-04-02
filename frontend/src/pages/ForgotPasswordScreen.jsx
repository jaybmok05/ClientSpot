import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();


  const sendOtpHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/users/sendOtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }), // Send email in the request body
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok) {
        setOtpSent(true); // Set state to indicate OTP has been sent
        toast.success(data.message);
      } else {
        toast.error(data.message || 'Error sending OTP. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      toast.error('Error sending OTP. Please try again.');
    }
  };

  const updatePasswordHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/users/updatePassword', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, newPassword }), // Send email, OTP, and new password in the request body
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok) {
        navigate('/login');
        toast.success(data.message);
      } else {
        toast.error(data.message || 'Error updating password. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      toast.error('Error updating password. Please try again.');
    }
  };

  return (
    <div className="forgot-password-screen">
      <h2>Forgot Password</h2>
      <Form onSubmit={otpSent ? updatePasswordHandler : sendOtpHandler}>
        <Form.Group controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </Button>

        {otpSent && (
          <>
            <Form.Group controlId="otp">
              <Form.Label>OTP</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="newPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Updating Password...' : 'Update Password'}
            </Button>
          </>
        )}
      </Form>
    </div>
  );
};

export default ForgotPasswordScreen;
