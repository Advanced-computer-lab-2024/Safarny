import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Typography,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Box,
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem,
} from "@mui/material";
import {
  LocalShipping,
  VerifiedUser,
  CreditCard,
  ThumbUp,
} from "@mui/icons-material";
import styles from "./CheckoutModal.module.css";
import axios from "axios";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe (put this outside your component)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY); // Replace with your Stripe publishable key

export default function CheckoutModal({
  cartItems,
  totalPrice,
  onClose,
  currency,
  userId,
  desiredQuantities,
  handleClearCart,
}) {
  const steps = ["Delivery", "Confirmation", "Payment", "Finish"];
  const [deliveryAddress, setDeliveryAddress] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [open, setOpen] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [stepValidation, setStepValidation] = useState([
    false,
    true,
    true,
    true,
  ]);
  const [clickedSumit, setClickedSumit] = useState(false);

  const handleValidationChange = (stepIndex, isValid) => {
    setStepValidation((prev) => {
      const newValidation = [...prev];
      newValidation[stepIndex] = isValid;
      return newValidation;
    });
  };

  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose();
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const getStepIcon = (step) => {
    const icons = [LocalShipping, VerifiedUser, CreditCard, ThumbUp];
    const Icon = icons[step];
    return (
      <div
        className={`${styles.stepIcon} ${activeStep >= step ? styles.stepIconActive : ""
          }`}
      >
        <Icon />
      </div>
    );
  };

  // Update these handlers in the respective steps
  const handleDeliveryChange = (field, value) => {
    setDeliveryAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handlePaymentChange = (method) => {
    setPaymentMethod(method);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Checkout</DialogTitle>
      <DialogContent className={styles.modalContent}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel StepIconComponent={() => getStepIcon(index)}>
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <div className={styles.formGroup}>
          {activeStep === 0 && (
            <DeliveryStep
              onValidationChange={handleValidationChange}
              handleDeliveryChange={handleDeliveryChange}
              userId={userId}
              deliveryAddress={deliveryAddress}
              setDeliveryAddress={setDeliveryAddress}
            />
          )}
          {activeStep === 1 && (
            <ConfirmationStep
              cartItems={cartItems}
              totalPrice={totalPrice}
              currency={currency}
              desiredQuantities={desiredQuantities}
            />
          )}
          {activeStep === 2 && (
            <PaymentStep
              onValidationChange={handleValidationChange}
              userId={userId}
              handlePaymentChange={handlePaymentChange}
            />
          )}
          {activeStep === 3 && (
            <FinishStep
              cartItems={cartItems}
              deliveryAddress={deliveryAddress}
              paymentMethod={paymentMethod}
              totalPrice={totalPrice}
              currency={currency}
              userId={userId}
              onSuccess={handleClose}
              desiredQuantities={desiredQuantities}
              clickedSumit={clickedSumit}
              setClickedSumit={setClickedSumit}
              handleClearCart={handleClearCart}
            />
          )}
        </div>
        <div className={styles.buttonContainer}>
          <Button onClick={handleClose}>Close</Button>
          <div className={styles.navigationButtons}>
            <Button onClick={handleBack} disabled={activeStep === 0}>
              Back
            </Button>
            <Button
              onClick={
                activeStep === steps.length - 1 ? handleClose : handleNext
              }
              variant="contained"
              disabled={!stepValidation[activeStep]}
            >
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DeliveryStep({ 
  onValidationChange, 
 handleDeliveryChange, 
  userId,
  deliveryAddress,
  setDeliveryAddress 
}) {
  const [userAddresses, setUserAddresses] = useState([]);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState("");

  // Fetch user addresses when component mounts
  useEffect(() => {
    fetchAddresses();
  }, [userId]);

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/tourist/${userId}`);
      setUserAddresses(response.data.addresses || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  useEffect(() => {
    const isValid = Object.values(deliveryAddress).every(
      (value) => value.trim() !== ""
    );
    onValidationChange(0, isValid);
  }, [deliveryAddress, onValidationChange]);

  const handleAddressSelect = (selectedAddress) => {
    const newDeliveryAddress = {
      address: selectedAddress,
      city: "",
      postcode: "",
    };
    setDeliveryAddress(newDeliveryAddress);
    Object.entries(newDeliveryAddress).forEach(([key, value]) => {
      handleDeliveryChange(key, value);
    });
  };

  const handleSaveNewAddress = async () => {
    if (!newAddress.trim()) {
      alert("Please enter an address");
      return;
    }

    try {
      // Get current user data
      const response = await axios.get(`http://localhost:3000/tourist/${userId}`);
      const currentAddresses = response.data.addresses || [];
      
      // Update user profile with new address
      await axios.put(`http://localhost:3000/tourist/${userId}`, {
        addresses: [...currentAddresses, newAddress]
      });

      // Refresh addresses list
      await fetchAddresses();
      
      // Select the newly added address
      handleAddressSelect(newAddress);
      
      // Clear form and return to address selection
      setNewAddress("");
      setShowNewAddressForm(false);

    } catch (error) {
      console.error('Error saving new address:', error);
      alert('Failed to save new address');
    }
  };

  return (
    <div className={styles.formGroup}>
      {!showNewAddressForm ? (
        <>
          <FormControl fullWidth className={styles.formGroup}>
            <FormLabel>Select Saved Address</FormLabel>
            <Select
              value={deliveryAddress.address}
              onChange={(e) => handleAddressSelect(e.target.value)}
              displayEmpty
              fullWidth
            >
              <MenuItem value="">
                <em>Select an address</em>
              </MenuItem>
              {userAddresses.map((address, index) => (
                <MenuItem key={index} value={address}>
                  {address}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            onClick={() => setShowNewAddressForm(true)}
            fullWidth
            className={styles.formGroup}
          >
            Add New Address
          </Button>
        </>
      ) : (
        <>
          <TextField
            label="New Delivery Address"
            variant="outlined"
            fullWidth
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            className={styles.formGroup}
          />
          <div className={styles.buttonContainer}>
            <Button
              variant="contained"
              onClick={handleSaveNewAddress}
              fullWidth
              className={styles.formGroup}
            >
              Save Address
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setShowNewAddressForm(false);
                setNewAddress("");
              }}
              fullWidth
              className={styles.formGroup}
            >
              Cancel
            </Button>
          </div>
        </>
      )}
      {deliveryAddress.address && (
        <>
          <TextField
            label="City"
            variant="outlined"
            fullWidth
            value={deliveryAddress.city}
            onChange={(e) => {
              const newDeliveryAddress = { ...deliveryAddress, city: e.target.value };
              setDeliveryAddress(newDeliveryAddress);
              handleDeliveryChange("city", e.target.value);
            }}
            className={styles.formGroup}
          />
          <TextField
            label="Postcode"
            variant="outlined"
            fullWidth
            value={deliveryAddress.postcode}
            onChange={(e) => {
              const newDeliveryAddress = { ...deliveryAddress, postcode: e.target.value };
              setDeliveryAddress(newDeliveryAddress);
              handleDeliveryChange("postcode", e.target.value);
            }}
            className={styles.formGroup}
          />
        </>
      )}
    </div>
  );
}

function ConfirmationStep({
  cartItems,
  totalPrice,
  currency,
  desiredQuantities,
}) {
  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>
      <List>
        {cartItems.map((item) => (
          <ListItem key={item._id} className={styles.summaryItem}>
            {item.details} - {desiredQuantities[item._id] || 1} x {item.price}{" "}
            {item.currency}
          </ListItem>
        ))}
        <ListItem className={`${styles.summaryItem} ${styles.totalPrice}`}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1">
            {totalPrice} {currency}
          </Typography>
        </ListItem>
      </List>
    </div>
  );
}

function PaymentStep({ onValidationChange, userId, handlePaymentChange }) {
  const [formValues, setFormValues] = useState({
    paymentMethod: "credit_card",
  });

  const handleInputChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    handlePaymentChange(formValues.paymentMethod);
  };

  return (
    <form noValidate autoComplete="off" className={styles.formGroup}>
      <FormControl component="fieldset" className={styles.formGroup}>
        <FormLabel component="legend">Payment Method</FormLabel>
        <RadioGroup
          value={formValues.paymentMethod}
          onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
          className={styles.paymentOptions}
        >
          <FormControlLabel
            value="credit_card"
            control={<Radio />}
            label="Credit Card"
          />
          <FormControlLabel
            value="cash_on_delivery"
            control={<Radio />}
            label="Cash on Delivery"
          />
          <FormControlLabel 
            value="wallet" 
            control={<Radio />} 
            label="Wallet" 
          />
        </RadioGroup>
      </FormControl>

      {formValues.paymentMethod === "credit_card" && (
        <Elements stripe={stripePromise}>
          <CreditCardForm onValidationChange={onValidationChange} />
        </Elements>
      )}

      {formValues.paymentMethod === "wallet" && (
        <Box fontStyle="italic" fontSize={14}>
          Wallet payment will be deducted from your account balance.
        </Box>
      )}
    </form>
  );
}

function CreditCardForm({ onValidationChange }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);

  useEffect(() => {
    // Update validation state whenever the card element changes
    if (elements) {
      const card = elements.getElement(CardElement);
      card.on('change', (event) => {
        onValidationChange(2, event.complete);
        setError(event.error ? event.error.message : null);
      });
    }
  }, [elements, onValidationChange]);

  return (
    <div className={styles.creditCardForm}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
      />
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
}

function FinishStep({
  cartItems,
  deliveryAddress,
  paymentMethod,
  totalPrice,
  currency,
  userId,
  onSuccess,
  desiredQuantities,
  clickedSumit,
  setClickedSumit,
  handleClearCart,
}) {
  const [errorMessage, setErrorMessage] = useState("");

  const handleOrderSubmit = async () => {
    setClickedSumit(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/tourist/order/checkout",
        {
          userId,
          items: cartItems.map((item) => ({
            productId: item._id,
            name: item.details,
            quantity: desiredQuantities[item._id] || 1,
            price: item.price,
            currency: item.currency,
          })),
          deliveryAddress,
          paymentMethod,
          totalAmount: totalPrice,
          currency,
        }
      );

      console.log("Order saved successfully:", response.data);

      await handleClearCart();

      if (onSuccess) onSuccess();
    } catch (error) {
      if (
        error.response?.status === 400 &&
        error.response?.data === "Insufficient funds" &&
        paymentMethod === "wallet"
      ) {
        setErrorMessage("Insufficient funds for this order.");
      } else {
        console.error(
          "Error saving order:",
          error.response?.data || error.message
        );
      }
    }
  };

  const handleMyOrdersClick = () => {
    navigate("/MyOrders", { state: { userId } });
  };

  return (
    <div>
      <ThumbUp className={styles.finishIcon} />
      <Typography>Thank you for your order!</Typography>
      {clickedSumit && (
        <Typography variant="subtitle1">
          Your order has been placed successfully. Check your Orders !
        </Typography>
      )}
      {clickedSumit && (
        <Button variant="contained" onClick={handleMyOrdersClick}>
          My Orders
        </Button>
      )}

      {errorMessage && (
        <Typography variant="body1" color="error">
          {errorMessage}
        </Typography>
      )}
      {!clickedSumit && (
        <Button variant="contained" onClick={handleOrderSubmit}>
          Submit Order
        </Button>
      )}
    </div>
  );
}
