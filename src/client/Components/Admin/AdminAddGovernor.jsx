import React, { useState } from "react";
import styles from "./AdminAddGovernor.module.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import SideBar from "../SideBar/SideBar";
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminAddGovernor = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'danger'

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
      setMessageType("danger");
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
        setMessageType("success");
        setFormData({
          username: "",
          email: "",
          password: "",
        });
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.message}`);
        setMessageType("danger");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred while adding the governor");
      setMessageType("danger");
    }
  };

  return (
    <div className={styles.pageContainer} style={{ width: '100vw', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <div className={styles.contentWrapper}>
        <SideBar />
        
        <Container fluid className={`${styles.mainContent} flex-grow-1 py-5`}>
          <Row className="justify-content-center">
            <Col xs={12} md={8} lg={6}>
              <Card className={`${styles.formCard} shadow`}>
                <Card.Body className="p-4">
                  <h2 className={`${styles.title} text-center mb-4`}>
                    Add Tourism Governor
                  </h2>
                  
                  {message && (
                    <Alert variant={messageType} className="mb-4">
                      {message}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-4">
                      <Form.Label className={styles.label}>Username</Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Enter username"
                        className={styles.input}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className={styles.label}>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                        className={styles.input}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className={styles.label}>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        className={styles.input}
                        required
                      />
                    </Form.Group>

                    <div className="d-grid gap-2">
                      <Button 
                        type="submit" 
                        className={`${styles.submitButton} mt-3`}
                        size="lg"
                      >
                        Add Governor
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <Footer />
    </div>
  );
};

export default AdminAddGovernor;
