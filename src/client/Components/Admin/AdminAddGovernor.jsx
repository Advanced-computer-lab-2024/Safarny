import React, { useState } from "react";
import Footer from "/src/client/Components/Footer/Footer";
import Header from "/src/client/Components/Header/Header";
import styles from "./AdminAddGovernor.module.css";

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
        setMessage("Tourism Governor added successfully");
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
      <Header />
      <div className={styles.container}>
        <h2 className={styles.heading}>Add a New Governor</h2>
        {message && <p className={styles.message}>{message}</p>}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <button type="submit" className={styles.button}>Add Governor</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default AdminAddGovernor;
