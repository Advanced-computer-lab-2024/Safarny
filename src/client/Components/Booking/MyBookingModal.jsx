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
import styles from "./MyBookingModal.module.css";
import axios from "axios";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe (put this outside your component)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY); // Replace with your Stripe publishable key

export default function MyBookingModal({
                                           cartItems,
                                           onClose,
                                           currency,
                                           userId,
                                           desiredQuantities,
                                           bookingType,
                                           bookingId,
                                       }) {
    const steps = ["Delivery", "Confirmation", "Payment", "Finish"];
    const [deliveryAddress, setDeliveryAddress] = useState({});
    const [paymentMethod, setPaymentMethod] = useState("credit_card");
    const [open, setOpen] = useState(true);
    const [promoCode, setPromoCode] = useState(""); // State for promo code
    const [totalPrice, setTotalPrice] = useState("");
    const [activeStep, setActiveStep] = useState(0);
    const [promoSuccessMessage, setPromoSuccessMessage] = useState("");
    const [error, setError] = useState("");
    const [bookingDate, setBookingDate] = useState("");
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

    const handleApplyPromoCode = async (enteredPromoCode) => {
        try {
            // Fetch all available promo codes from the backend
            const promoCodesResponse = await axios.get(`/promocodes/promocodes`);
            const availablePromoCodes = Array.isArray(promoCodesResponse.data) ? promoCodesResponse.data : [];

            console.log("Available promo codes:", availablePromoCodes);
            console.log("Entered promo code:", enteredPromoCode);
            // Find the promo code object that matches the entered promo code
            const promoCodeObject = availablePromoCodes.find(
                (promo) => promo.code === enteredPromoCode
            );

            if (promoCodeObject) {
                const promoDetailsResponse = await axios.get(`/promocodes/promocodes/${promoCodeObject._id}`);
                const promoDetails = promoDetailsResponse.data;

                console.log(promoDetails);
                console.log(promoDetails.discountPercentage);
                if (!promoDetails || !promoDetails.discountPercentage) {
                    alert("Unable to retrieve promo code details.");
                    setError("Unable to retrieve promo code details.");
                    return;
                }

                // Calculate the discounted price
                const discountPercentage = promoDetails.discountPercentage;
                const discountedPrice = totalPrice - (totalPrice * discountPercentage) / 100;

                setTotalPrice(discountedPrice); // Update the total price with the discounted value
                alert(`Promo code applied successfully. You have saved: ${discountPercentage}%`);
                setError(""); // Clear any error messages

                try {
                    await axios.delete(`/promocodes/promocodes/${promoCodeObject._id}`);
                    console.log("Promo code deleted successfully.");
                } catch (deleteError) {
                    console.error("Error deleting the promo code:", deleteError.message);
                    alert("The promo code could not be deleted after use.");
                }
            } else {
                alert("Promo code not found.");
                setError("Promo code not found.");
            }
        } catch (err) {
            console.error("Error during promo code application:", err.message);
            alert("An error occurred while applying the promo code.");
            setError("An error occurred while applying the promo code.");
        }
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
            <DialogContent className={styles.modalContent} style={{ maxWidth: '900px', width: '100%' }}>                <Stepper activeStep={activeStep} alternativeLabel>
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
                            promoCode={promoCode}
                            setPromoCode={setPromoCode}
                            handleApplyPromoCode={handleApplyPromoCode}
                            bookingDate={bookingDate} // Pass bookingDate
                            setBookingDate={setBookingDate} // Pass setBookingDate
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
                            selectedAddress={deliveryAddress.address} // Pass selectedAddress
                            selectedPaymentMethod={paymentMethod}
                            bookingType={bookingType} // Pass bookingType
                            bookingId={bookingId}
                            bookingDate={bookingDate}
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
                            {activeStep === steps.length - 1 ? "Exit" : "Next"}
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
                              promoCode,
                              setPromoCode,
                              handleApplyPromoCode,
                              bookingDate, // Add bookingDate prop
                              setBookingDate, // Add setBookingDate prop
                          }) {
    return (
        <div>
            <Typography variant="h6" gutterBottom>
                Order Summary
            </Typography>
            <List>
                {/*{cartItems.map((item, index) => (*/}
                {/*    <ListItem key={index}>*/}
                {/*        <ListItemText*/}
                {/*            primary={item.name}*/}
                {/*            secondary={`Quantity: ${desiredQuantities[index]}`}*/}
                {/*        />*/}
                {/*        <Typography variant="body2">*/}
                {/*            {currency} {item.price}*/}
                {/*        </Typography>*/}
                {/*    </ListItem>*/}
                {/*))}*/}
            </List>
            <Typography variant="h6" gutterBottom>
                Total: {currency} {totalPrice}
            </Typography>
            <div>
                <label className={styles.bookdate}>Booking Date:</label>
                <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                />
            </div>
            <div>
                <TextField
                    label="Promo Code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    fullWidth
                />
                <Button
                    variant="contained"
                    onClick={() => handleApplyPromoCode(promoCode.trim())} // Pass promo code as a parameter
                    disabled={!promoCode.trim()}
                    className={styles.buttonContainer}
                >
                    Apply
                </Button>            </div>
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
                        bookingDate, // Add bookingDate prop
                        setBookingDate, // Add setBookingDate prop
                        selectedAddress, // Add selectedAddress prop
                        selectedPaymentMethod, // Add selectedPaymentMethod prop
                        bookingType=bookingType, // Pass bookingType
                        bookingId,

                    }) {
    const [errorMessage, setErrorMessage] = useState("");

    const handleConfirm = async () => {
        console.log("User ID:", userId); // Log the userId
        const bookingData = { tourist: userId, bookingDate };
        if (!selectedAddress || !selectedPaymentMethod) {
            alert("Please select both an address and a payment method.");
            return;
        }
        try {
            var response = null;
            if (bookingType === "itinerary" || bookingType === "activity") {
                bookingData[bookingType] = bookingId;
                console.log("Booking created:", bookingData);

                response = await axios.post(
                    "http://localhost:3000/tourist/bookings",
                    bookingData
                );
            } else if (bookingType === "historicalPlace") {
                bookingData.historicalPlace = bookingId;
                console.log("Booking created:", bookingData);

                response = await axios.post(
                    "http://localhost:3000/tourist/bookings/historicalPlace",
                    bookingData
                );
            }

            // After successful booking, send receipt email
            if (response && response.data) {
                try {
                    const emailData = {
                        bookingId: response.data._id,
                        touristName: response.data.tourist.username,
                        touristEmail: response.data.tourist.email,
                        itemName: response.data[bookingType]?.name || response.data[bookingType]?.location,
                        price: response.data[bookingType]?.price,
                        currency: response.data[bookingType]?.currency || 'EGP',
                        bookingDate: bookingData.bookingDate,
                        type: bookingType.charAt(0).toUpperCase() + bookingType.slice(1),
                        pointsEarned: response.data.pointsEarned || 0
                    };

                    await axios.post('http://localhost:3000/tourist/bookings/send-receipt', emailData);
                    console.log('Receipt email sent successfully');
                } catch (error) {
                    console.error('Error sending receipt email:', error);
                    // Don't throw error here as booking was successful
                }
            }

            console.log("Booking created:", response.data);
            onRequestClose();
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage(error.response.data.message);
            } else {
                console.error("Error creating booking:", error);
            }
        }
    };

    const handleMyOrdersClick = () => {
        navigate("/MyOrders", { state: { userId } });
    };

    return (
        <div>
            <ThumbUp className={styles.finishIcon} />
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
                <Button variant="contained" onClick={handleConfirm}>
                    Submit Order
                </Button>
            )}
        </div>
    );
}
