## Safarny

### Project Title
Safarny

### Motivation

The Safarny project aims to revolutionize the travel planning experience by offering a comprehensive, user-friendly platform where users can seamlessly plan, book, and manage their travel itineraries. This project addresses the common challenges faced by travelers, such as finding reliable information, booking multiple services, and keeping track of travel plans, all within a single application. By integrating various services like accommodation, transportation, activities, and historical places, Safarny simplifies the travel planning process, making it accessible and efficient for users. The motivation behind this project is to enhance the travel experience, reduce planning stress, and provide a one-stop solution for all travel-related needs.

### Build Status
![Node.js CI](https://github.com/Advanced-computer-lab-2024/Safarny/actions/workflows/node.js.yml/badge.svg)
### Code Style
CommonJs

### Screenshots
Provide screenshots or a video demonstrating how the system looks and works.

![act.png](https://github.com/Advanced-computer-lab-2024/Safarny/blob/main/src/client/Assets/Img/act.png)
![Home.png](https://github.com/Advanced-computer-lab-2024/Safarny/blob/main/src/client/Assets/Img/Home.png)
![Iti2.png](https://github.com/Advanced-computer-lab-2024/Safarny/blob/main/src/client/Assets/Img/Iti2.png)
![pref.png](https://github.com/Advanced-computer-lab-2024/Safarny/blob/main/src/client/Assets/Img/pref.png)



### Tech/Framework Used
- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Bootstrap](https://getbootstrap.com/)
- [Ant Design](https://ant.design/)
- [Leaflet](https://leafletjs.com/)
- [Stripe](https://stripe.com/)
- [Firebase](https://firebase.google.com/)
- [Axios](https://axios-http.com/)
- [Mailjet](https://www.mailjet.com/)
- [Vite](https://vitejs.dev/)


### Features

- Seamless travel planning and management
- Integration of accommodation, transportation, activities, and historical places
- User-friendly interface for booking multiple services
- Efficient itinerary tracking and management
- Comprehensive user profiles for tourists, tour guides, sellers, and advertisers
- Admin and tourism governor functionalities for overseeing operations
- Advanced search and filter options for activities, itineraries, and historical places
- Notification and email services for updates and reminders
- Authentication and security features for user accounts
- Seamless Product Purchasing for convience
- Promo code management for discounts and offers
  
### Code Examples
Here are some code examples that illustrate how to use the project:

#### Example 1: Promo Code Controller
This example demonstrates CRUD operations for promo codes in the server.
```javascript
const PromoCode = require("../models/PromoCode.js");
const axios = require("axios");

const createPromoCode = async (req, res) => {
  try {
    const { discountPercentage, activated, createdBy, code, expiryDate } = req.body;
    const newPromoCode = new PromoCode({ discountPercentage, activated, createdBy, code, expiryDate });
    const savedPromoCode = await newPromoCode.save();
    res.status(201).json({ message: "Promo code created successfully", promoCode: savedPromoCode });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPromoCodeById = async (req, res) => {
  try {
    const promoCodeId = req.params.id;
    const promoCode = await PromoCode.findById(promoCodeId);
    if (!promoCode) return res.status(404).json({ message: "Promo code not found" });
    res.status(200).json(promoCode);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updatePromoCode = async (req, res) => {
  try {
    const promoCodeId = req.params.id.trim();
    const { discountPercentage, activated, code, expiryDate } = req.body;
    const updatedPromoCode = await PromoCode.findByIdAndUpdate(
      promoCodeId, { discountPercentage, activated, code, expiryDate }, { new: true, runValidators: true });
    if (!updatedPromoCode) return res.status(404).json({ message: "Promo code not found" });
    res.status(200).json({ message: "Promo code updated successfully", promoCode: updatedPromoCode });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllPromoCodes = async (req, res) => {
  try {
    const promoCodes = await PromoCode.find();
    res.status(200).json(promoCodes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createPromoCode, getPromoCodeById, updatePromoCode, getAllPromoCodes };
```

#### Example 2: Profile Component
This example demonstrates how to fetch and display user profile information.
```javascript
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [message, setMessage] = useState('');
  const [audioRef, setAudioRef] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/user/${userId}`);
        setUserInfo(response.data);

        // Fetch promo codes
        const promoResponse = await fetch('/promocodes/promocodes');
        if (!promoResponse.ok) throw new Error("Failed to fetch promo codes");
        const promoCodes = await promoResponse.json();
        const randomPromoCode = promoCodes[Math.floor(Math.random() * promoCodes.length)];

        // Send notification
        await axios.post('/notification/create', {
          title: 'Promo Code',
          userId,
          message: `You have received a promo code: ${randomPromoCode.code}`
        });

        // Send email
        await axios.post('/email/send-email', {
          to: response.data.email,
          subject: 'Your Promo Code',
          text: `Congratulations! You have received a promo code: ${randomPromoCode.code}`
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();

    return () => {
      if (audioRef) {
        audioRef.pause();
        setAudioRef(null);
      }
    };
  }, [userId, audioRef]);

  const handleCashInPoints = async () => {
    try {
      if (userInfo.loyaltyPoints === 0) {
        setMessage("You do not have any loyalty points!");
        return;
      }

      const response = await fetch(import.meta.env.VITE_EXCHANGE_API_URL);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const exchangeRate = data.conversion_rates[userInfo.walletcurrency];
      const pointsInWallet = userInfo.loyaltyPoints * 0.01 * exchangeRate;

      if (isNaN(pointsInWallet)) throw new Error("Invalid points calculation");

      await axios.put(`/tourist/${userId}`, {
        wallet: userInfo.wallet + pointsInWallet,
        loyaltyPoints: 0
      });

      setUserInfo((prevState) => ({
        ...prevState,
        wallet: prevState.wallet + pointsInWallet,
        loyaltyPoints: 0
      }));

      setMessage("Points redeemed!");
    } catch (error) {
      console.error("Error cashing in points:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Profile</h1>
      <p>{message}</p>
      <button onClick={handleCashInPoints}>Cash in Points</button>
    </div>
  );
};

export default Profile;
```

### Installation
To install and set up the project, follow these steps:
1. Clone the repository:
```
git clone https://github.com/Advanced-computer-lab-2024/Safarny.git
cd Safarny
```
2. Install dependencies and run the development server:
```
npm i
npm run dev
```

### API References
List all the API routes used in the project with a brief description of each.

- `/admin`: Admin related operations
- `/advertiser`: Advertiser related operations
- `/guest`: Guest related operations
- `/tourist`: Tourist related operations
- `/tourguide`: Tour guide related operations
- `/seller`: Seller related operations
- `/toursimgovernor`: Tourism governor related operations
- `/activities`: Activities related operations
- `/transport`: Transport related operations
- `/itineraries`: Itineraries related operations
- `/preferences`: Preferences related operations
- `/wishlist`: Wish list related operations
- `/categories`: Activity categories related operations
- `/historicalplaces`: Historical places related operations
- `/email`: Email related operations
- `/notification`: Notification related operations
- `/api/auth`: Authentication related operations
- `/promocodes`: Promo code related operations

### Tests
Postman

### How to Use
To use the Safarny project, follow these steps:

1. **Run the Development Server**
   - Make sure you have the necessary dependencies installed (see Installation section).
   - Start the development server using the following command:
     ```
     npm run dev
     ```

2. **Access the Application**
   - Open your browser and navigate to the local server URL, typically:
     ```
     http://localhost:3000
     ```

3. **Explore the Features**
   - Use the navigation menu to explore different features of the application.
   - For example, you can view activities, manage wishlists, and more.

4. **API Endpoints**
   - Utilize the API endpoints listed in the API References section to interact with the backend services.
   - Here is an example of how to fetch activities:
     ```javascript
     fetch('/activities')
       .then(response => response.json())
       .then(data => console.log(data))
       .catch(error => console.error('Error:', error));
     ```

5. **User Interactions**
   - Different user roles (admin, advertiser, tourist, etc.) have unique functionalities.
   - Ensure you are logged in with the appropriate role to access specific features.

6. **Modify and Extend**
   - Feel free to modify the codebase to suit your needs.
   - Refer to the code examples provided in the README for guidance on how to extend functionalities.


### Contribute
We welcome contributions to the Safarny project! Here's how you can help:

1. **Fork the Repository**
   - Click on the "Fork" button at the top right corner of this page to create a copy of this repository in your GitHub account.

2. **Clone Your Fork**
   - Clone your forked repository to your local machine:
     ```
     git clone https://github.com/YOUR_USERNAME/Safarny.git
     cd Safarny
     ```

3. **Create a Branch**
   - Create a new branch for your feature or bug fix:
     ```
     git checkout -b feature-or-bugfix-name
     ```

4. **Make Changes**
   - Make your changes in the codebase using your preferred code editor.

5. **Commit Your Changes**
   - Commit your changes with a descriptive commit message:
     ```
     git add .
     git commit -m "Description of changes"
     ```

6. **Push to GitHub**
   - Push your changes to your forked repository:
     ```
     git push origin feature-or-bugfix-name
     ```

7. **Create a Pull Request**
   - Go to the original repository and create a pull request from your forked repository.
   - Provide a clear description of what you have done and why your changes should be merged.

### Credits
We would like to thank the following people and resources:

- **Project Contributors**
  - [tareksherif64](https://github.com/tareksherif64) - Tarek Sherif
  - [seif495](https://github.com/seif495) - Seifeldin Moheb
  - [youssef20031](https://github.com/youssef20031) - Youssef Maged
  - [NirvanaKhaled](https://github.com/NirvanaKhaled) - Nirvana Khaled
  - [1Oomar](https://github.com/1Oomar) - Omar Elshazly
  - [Odyjo](https://github.com/Odyjo) - Ahmed Sameh
  - [Elbasha3omarr](https://github.com/Elbasha3omarr) - Omar Walid
  - [AhmedV100](https://github.com/AhmedV100) - Ahmed Mohamed
  - [MrKaiba](https://github.com/MrKaiba) - Mohamed Youssef
  - [MostafaVT](https://github.com/MostafaVT) - Mostafa Ahmed

- **External Libraries and Frameworks**
  - [React](https://reactjs.org/)
  - [Express](https://expressjs.com/)
  - [MongoDB](https://www.mongodb.com/)
  - [Mongoose](https://mongoosejs.com/)
  - [Bootstrap](https://getbootstrap.com/)
  - [Ant Design](https://ant.design/)
  - [Leaflet](https://leafletjs.com/)
  - [Stripe](https://stripe.com/)
  - [Firebase](https://firebase.google.com/)
  - [Axios](https://axios-http.com/)
  - [Mailjet](https://www.mailjet.com/)
  - [Vite](https://vitejs.dev/)

- **Additional Acknowledgements**
  - Special thanks to all the online resources and tutorials that helped us build this project.

### License
The project is licensed under the GNU General Public License v3.0.
