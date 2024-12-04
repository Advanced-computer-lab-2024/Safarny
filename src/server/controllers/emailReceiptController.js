const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const generateReceiptHTML = (bookingDetails) => {
  const { 
    bookingId, 
    touristName, 
    itemName, 
    price, 
    currency,
    bookingDate,
    type,
    pointsEarned
  } = bookingDetails;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333;">Booking Confirmation Receipt</h2>
      <p>Dear ${touristName},</p>
      <p>Thank you for your booking! Here are your booking details:</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Booking Reference:</strong> ${bookingId}</p>
        <p><strong>Type:</strong> ${type}</p>
        <p><strong>${type} Name:</strong> ${itemName}</p>
        <p><strong>Booking Date:</strong> ${new Date(bookingDate).toLocaleDateString()}</p>
        <p><strong>Amount Paid:</strong> ${price} ${currency}</p>
        <p><strong>Loyalty Points Earned:</strong> ${pointsEarned}</p>
      </div>
      
      <p>We hope you enjoy your experience!</p>
      <p>Best regards,<br>Your Tourism App Team</p>
    </div>
  `;
};

const sendReceiptEmail = async (bookingDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: bookingDetails.touristEmail,
    subject: `Booking Confirmation - ${bookingDetails.itemName}`,
    html: generateReceiptHTML(bookingDetails)
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Receipt email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending receipt email:', error);
    return false;
  }
};

module.exports = { sendReceiptEmail }; 