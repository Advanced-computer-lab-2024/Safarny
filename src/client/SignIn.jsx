import axios from 'axios';
import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Payload to send
    const userData = { 
      email, 
      password };

    try {
      // Post the form data to the backend
      const response = await axios.post('http://localhost:3000/login', userData);

      if (response.status === 200) {
        setSuccess(true);
        setError('');
        if(response.data.type==="tourist"){
          navigate('/products'); 
        }
        else if(response.data.type==="seller"){
          navigate('/Seller'); 
        }
        else if(response.data.type==="admin"){
          navigate('/Admin'); 
        }
      }
    } catch (err) {
      
      if (err.response) {
        setError(err.response.data.message); // Error message from backend (email/password incorrect)
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      setSuccess(false);
    }
  };

  return (
    <div className="signin-form">
      <h2>Sign In</h2>

      {success && <p className="success-message">Sign in successful!</p>}
      {error && <p className="error-message">{error}</p>}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Sign In
        </Button>
      </Form>
    </div>
  );
};

export default SignIn;
