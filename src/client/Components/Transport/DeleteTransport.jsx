import React from 'react';
import axios from 'axios';

const DeleteTransportButton = ({ transportId, advertiserId }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`/transport/transports/${transportId}`);
      alert('Transport deleted successfully');
    } catch (error) {
      console.error('Error deleting transport:', error);
      alert('Failed to delete transport');
    }
  };

  return <button onClick={handleDelete}>Delete Transport</button>;
};

export default DeleteTransportButton;
