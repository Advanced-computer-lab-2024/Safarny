import React, { useState } from "react";
import styles from "./AdminAddGovernor.module.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

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
    <div className={styles.container}>
      <Header />
      <div className={styles.content}>
        <h2 className={styles.title}>Add a New Governor</h2>
        {message && <p className={styles.message}>{message}</p>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>
            Username:
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </label>

          <label className={styles.label}>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </label>

          <label className={styles.label}>
            Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </label>

          <button type="submit" className={styles.button}>Add Governor</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default AdminAddGovernor;
