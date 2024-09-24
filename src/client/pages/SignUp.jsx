import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [nationality, setNationality] = useState('');
  const [employed, setEmployed] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const type = "tourist";

  const navigate = useNavigate(); // Initialize useNavigate outside the function

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const userData = {
      username,
      email,
      password,
      mobile,
      nationality,
      employed,
      type
    };

    try {
      // Post the form data to the backend
      const response = await axios.post('http://localhost:3000/signup', userData);

      if (response.status === 201) {
        setSuccess(true);
        setError('');
        navigate('/signin');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
      setSuccess(false);
    }
  };

  return (
    <div className="signup-form">
      <h2>Sign Up</h2>

      {success && <p className="success-message">Sign up successful!</p>}
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

        <Form.Group controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
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

        <Form.Group controlId="mobile">
          <Form.Label>Mobile</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="nationality">
          <Form.Label>Nationality</Form.Label>
          <Form.Select
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            required
          >
            <option value="">Select Country of Origin</option>
            <option value="Egypt">Egypt</option>
            <option value="Saudi Arabia">Saudi Arabia</option>
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="employed">
          <Form.Label>Employment Status</Form.Label>
          <Form.Select
            value={employed}
            onChange={(e) => setEmployed(e.target.value)}
            required
          >
            <option value="">Select employment status</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </Form.Select>
        </Form.Group>

        <Button variant="primary" type="submit">
          Sign Up
        </Button>
      </Form>
    </div>
  );
};

export default SignUp;
