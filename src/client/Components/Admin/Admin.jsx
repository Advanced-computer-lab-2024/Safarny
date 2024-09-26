
import React from 'react';
import SideBar from '../SideBar'

const Admin = () => {
  return (
    <div style={{ display: 'flex' }}>
      <SideBar />
      <div style={{ marginLeft: '250px', padding: '20px' }}> {/* Adjust the margin */}
        admin
      </div>
    </div>
  );
};

export default Admin;
