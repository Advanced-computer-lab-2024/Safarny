import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import styles from './CreateHistoricalTags.module.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const CreateHistoricalTags = () => {
  const [tagName, setTagName] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/toursimgovernor/historical-tags', { name: tagName });
      setMessage('Historical tag created successfully!');
      setMessageType('success');
      setTagName('');
    } catch (error) {
      console.error('Error creating historical tag:', error);
      setMessage('Failed to create historical tag.');
      setMessageType('danger');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Header />
      <Container fluid className={styles.mainContent}>
        <Row className="justify-content-center align-items-center w-100">
          <Col xs={11} md={10} lg={9} xxl={8}>
            <Card className={styles.formCard}>
              <Card.Body className="p-5">
                <div className={styles.cardHeader}>
                  <h1 className={styles.title}>Create Historical Tag</h1>
                  <p className={styles.subtitle}>Add a new historical tag to the system</p>
                </div>

                {message && (
                  <Alert 
                    variant={messageType}
                    className={`${styles.alert} mb-4`}
                    dismissible
                    onClose={() => setMessage('')}
                  >
                    {message}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit} className={styles.form}>
                  <Form.Group className="mb-4">
                    <Form.Label className={styles.label}>
                      Historical Tag Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={tagName}
                      onChange={(e) => setTagName(e.target.value)}
                      placeholder="Enter historical tag name"
                      className={styles.input}
                      required
                      size="lg"
                    />
                  </Form.Group>

                  <div className="d-grid mt-5">
                    <Button 
                      type="submit" 
                      className={styles.submitButton}
                      size="lg"
                    >
                      Create Tag
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default CreateHistoricalTags;



// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const CreateHistoricalTags = () => {
//   const [tagName, setTagName] = useState(''); // For the entered tag name
//   const [message, setMessage] = useState(''); // For success/error messages
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:3000/toursimgovernor/historical-tags', { name: tagName }); // Update the endpoint accordingly
//       setMessage('Historical tag created successfully!'); // Success message
//       setTagName(''); // Clear input field
//       navigate('/'); // Navigate back to the Admin page or another relevant page
//     } catch (error) {
//       console.error('Error creating historical tag:', error);
//       setMessage('Failed to create historical tag.'); // Error message
//     }
//   };

//   return (
//     <div>
//       <h1>Create Historical Tag</h1>
//       <form onSubmit={handleSubmit}>
//         <label htmlFor="tag-input">Enter a historical tag:</label>
//         <input
//           id="tag-input"
//           type="text"
//           value={tagName}
//           onChange={(e) => setTagName(e.target.value)}
//           required
//         />
//         <button type="submit">Create Historical Tag</button>
//       </form>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default CreateHistoricalTags;

