import React from 'react';
import SideBar from '../SideBar/SideBar';
import DataTable from '../Grids/GridCol';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { Container, Row, Col, Card } from 'react-bootstrap';
import styles from './TourGuideAdmin.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const TouristsAdmin = () => {
  return (
    <div className={styles.pageContainer} style={{ width: '100vw', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <div className={styles.contentWrapper}>
        <SideBar />
        
        <Container fluid className={styles.mainContent}>
          <Row className="mb-4">
            <Col>
              <Card className={styles.headerCard}>
                <Card.Body>
                  <h2 className={styles.pageTitle}>Tourist Management</h2>
                  <p className={styles.pageDescription}>
                    Manage and oversee all tourist information and registrations
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col>
              <Card className={styles.contentCard}>
                <Card.Body>
                  <div className={styles.tableWrapper}>
                    <DataTable />
                  </div>
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

export default TouristsAdmin;
