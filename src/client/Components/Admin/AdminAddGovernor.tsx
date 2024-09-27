import React, { useState } from 'react';

const AddGovernor = () => {
  // State to hold form data
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    nationality: '',
    mobile: '',
    employed: ''
  });

  // State to show success or error message
  const [message, setMessage] = useState('');

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/admin/add-governor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`Success: ${data.message}`);
        // Clear form after successful submission
        setFormData({
          username: '',
          email: '',
          password: '',
          nationality: '',
          mobile: '',
          employed: ''
        });
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while adding the governor');
    }
  };

  return (
    <div>
      <h2>Add a New Governor</h2>
      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </label>
        <br />

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <br />

        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        <br />

        <label>
          Nationality:
          <input
            type="text"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            required
          />
        </label>
        <br />

        <label>
          Mobile:
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
          />
        </label>
        <br />

        <label>
          Employed:
          <input
            type="text"
            name="employed"
            value={formData.employed}
            onChange={handleChange}
            required
          />
        </label>
        <br />

        <button type="submit">Add Governor</button>
      </form>
    </div>
  );
};

export default AddGovernor;
