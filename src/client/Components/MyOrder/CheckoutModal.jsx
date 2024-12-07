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
} from "@mui/material";
import {
  LocalShipping,
  VerifiedUser,
  CreditCard,
  ThumbUp,
} from "@mui/icons-material";
import styles from "./CheckoutModal.module.css";
import axios from "axios";

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
        className={`${styles.stepIcon} ${
          activeStep >= step ? styles.stepIconActive : ""
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

function DeliveryStep({ onValidationChange, handleDeliveryChange }) {
  const [formValues, setFormValues] = useState({
    address: "",
    city: "",
    postcode: "",
  });

  useEffect(() => {
    const isValid = Object.values(formValues).every(
      (value) => value.trim() !== ""
    );
    onValidationChange(0, isValid);
  }, [formValues, onValidationChange]);

  const handleInputChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    handleDeliveryChange(field, value);
  };

  return (
    <form noValidate autoComplete="off" className={styles.formGroup}>
      <TextField
        id="address"
        label="Delivery Address"
        variant="outlined"
        fullWidth
        value={formValues.address}
        onChange={(e) => handleInputChange("address", e.target.value)}
        className={styles.formGroup}
      />
      <TextField
        id="city"
        label="City"
        variant="outlined"
        fullWidth
        value={formValues.city}
        onChange={(e) => handleInputChange("city", e.target.value)}
        className={styles.formGroup}
      />
      <TextField
        id="postcode"
        label="Postcode"
        variant="outlined"
        fullWidth
        value={formValues.postcode}
        onChange={(e) => handleInputChange("postcode", e.target.value)}
        className={styles.formGroup}
      />
    </form>
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

function PaymentStep({ onValidationChange, handlePaymentChange }) {
  const [formValues, setFormValues] = useState({
    paymentMethod: "credit_card",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  // Helper function to determine validity
  const validateForm = () => {
    return (
      formValues.paymentMethod === "cash_on_delivery" ||
      formValues.paymentMethod === "wallet" ||
      (formValues.paymentMethod === "credit_card" &&
        formValues.cardNumber.trim() !== "" &&
        formValues.expiry.trim() !== "" &&
        formValues.cvv.trim() !== "")
    );
  };

  // useEffect(() => {
  //   const isValid = validateForm();
  //   if (typeof onValidationChange === "function") {
  //     onValidationChange(2, isValid); // Avoid recursion by ensuring `onValidationChange` is not modifying state indirectly
  //   }
  // }, [formValues, onValidationChange]); // Ensure dependencies are accurate and minimal

  useEffect(() => {
    handlePaymentChange(formValues.paymentMethod);
  }, [formValues]);

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
          <FormControlLabel value="wallet" control={<Radio />} label="Wallet" />
        </RadioGroup>
      </FormControl>
      {formValues.paymentMethod === "credit_card" && (
        <>
          <TextField
            id="card-number"
            label="Card Number"
            variant="outlined"
            fullWidth
            value={formValues.cardNumber}
            onChange={(e) => handleInputChange("cardNumber", e.target.value)}
            className={styles.formGroup}
          />
          <div className={styles.formGroup}>
            <TextField
              id="expiry"
              label="Expiry Date"
              variant="outlined"
              placeholder="MM/YY"
              value={formValues.expiry}
              onChange={(e) => handleInputChange("expiry", e.target.value)}
            />
            <TextField
              id="cvv"
              label="CVV"
              variant="outlined"
              value={formValues.cvv}
              onChange={(e) => handleInputChange("cvv", e.target.value)}
            />
          </div>
        </>
      )}
      {formValues.paymentMethod === "wallet" && (
        <Box fontStyle="italic" fontSize={14}>
          Wallet payment will be deducted from your account balance.
        </Box>
      )}
    </form>
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
