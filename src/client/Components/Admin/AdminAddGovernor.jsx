import React, { useState } from "react";

const AdminAddGovernor = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure required fields are provided
    if (!formData.username || !formData.email || !formData.password) {
      setMessage("Username, email, and password are required");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/admin/add-governor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage("Tourism Governor added successfully");
        // Reset the form after successful submission
        setFormData({
          username: "",
          email: "",
          password: "",
        });
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred while adding the governor");
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

        <button type="submit">Add Governor</button>
      </form>
    </div>
  );
};

export default AdminAddGovernor;
