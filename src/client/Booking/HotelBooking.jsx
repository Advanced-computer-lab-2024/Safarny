import React, { useState } from 'react';
import axios from 'axios';
import { Modal,Button } from '@mui/material';

const HotelBooking = () => {
    const [selectedOffer, setSelectedOffer] = useState(null); // State to hold the selected flight offer
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
    const fetchAccessToken = async () => {
        try {
          const params = new URLSearchParams();
          params.append('grant_type', 'client_credentials');
          params.append('client_id', 'nXo0wGO6OEafTR0cMHL7NXgRWyqcGME5'); // Replace with your actual client ID
          params.append('client_secret', 'ik5Ty4Hf7kJTIlQg'); // Replace with your actual client secret
    
          const response = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token', params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          });
    
          setAccessToken(response.data.access_token);
        } catch (error) {
          console.error('Error fetching access token:', error);
        }
      };
    

  return (
    <div>
      
    </div>
  )
}

export default HotelBooking
