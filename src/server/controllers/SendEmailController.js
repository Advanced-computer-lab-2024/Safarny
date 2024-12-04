require('dotenv').config();

const mailjet = require('node-mailjet').apiConnect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);

const sendActivityArchivedEmail = (req, res) => {
    const { email, name } = req.body;
    console.log(email, name);
    const request = mailjet
        .post("send", { 'version': 'v3.1' })
        .request({
            "Messages": [
                {
                    "From": {
                        "Email": "sadassemaildezznuts@gmail.com",
                        "Name": "Your Ass"
                    },
                    "To": [
                        {
                            "Email": email,
                            "Name": "Valued Guest"
                        }
                    ],
                    "Subject": "Activity Archived",
                    "TextPart": `Dear Valued Guest, the activity ${name} has been archived.`,
                    "HTMLPart": `<h3>Dear Valued Guest, the activity ${name} has been archived.</h3>`
                }
            ]
        });

    request
        .then((result) => {
            console.log(result.body);
            res.status(200).send(result.body);
        })
        .catch((err) => {
            console.log(err.statusCode);
            res.status(err.statusCode).send({ error: err.message });
        });
};

const sendItineraryArchivedEmail = (req, res) => {
    const { email, name } = req.body;

    const request = mailjet
        .post("send", { 'version': 'v3.1' })
        .request({
            "Messages": [
                {
                    "From": {
                        "Email": "sadassemaildezznuts@gmail.com",
                        "Name": "Your Ass"
                    },
                    "To": [
                        {
                            "Email": email,
                            "Name": "Your Ass"
                        }
                    ],
                    "Subject": "Your Itinerary",
                    "TextPart": `Dear Valued Guest, the itenerary ${name} has been archived.`,
                    "HTMLPart": `<h3>Dear Valued Guest, the itenerary ${name} has been archived.</h3>`
                }
            ]
        });

    request
        .then((result) => {
            console.log(result.body);
            res.status(200).send(result.body);
        })
        .catch((err) => {
            console.log(err.statusCode);
            res.status(err.statusCode).send({ error: err.message });
        });
};

const sendTouristReminderEmail = (req, res) => {
    const { email, name, eventName, eventDate } = req.body;

    const request = mailjet
        .post("send", { 'version': 'v3.1' })
        .request({
            "Messages": [
                {
                    "From": {
                        "Email": "sadassemaildezznuts@gmail.com",
                        "Name": "Your Ass"
                    },
                    "To": [
                        {
                            "Email": email,
                            "Name": name
                        }
                    ],
                    "Subject": "Upcoming Event Reminder",
                    "TextPart": `Dear ${name}, this is a reminder for your upcoming event: ${eventName} on ${eventDate}.`,
                    "HTMLPart": `<h3>Dear ${name},</h3><p>This is a reminder for your upcoming event: <strong>${eventName}</strong> on <strong>${eventDate}</strong>.</p>`
                }
            ]
        });

    request
        .then((result) => {
            console.log(result.body);
            res.status(200).send(result.body);
        })
        .catch((err) => {
            console.log(err.statusCode);
            res.status(err.statusCode).send({ error: err.message });
        });
};

const sendEmail = (req, res) => {
    const { to, subject, body } = req.body;

    const request = mailjet
        .post("send", { 'version': 'v3.1' })
        .request({
            "Messages": [
                {
                    "From": {
                        "Email": "sadassemaildezznuts@gmail.com",
                        "Name": "Your Ass"
                    },
                    "To": [
                        {
                            "Email": to,
                            "Name": "Valued Guest"
                        }
                    ],
                    "Subject": subject,
                    "TextPart": body,
                    "HTMLPart": `<h3>${body}</h3>`
                }
            ]
        });

    request
        .then((result) => {
            console.log(result.body);
            res.status(200).send(result.body);
        })
        .catch((err) => {
            console.log(err.statusCode);
            res.status(err.statusCode).send({ error: err.message });
        });
};

const sendReceiptEmail = async (bookingDetails) => {
  const {
    bookingId,
    touristName,
    touristEmail,
    itemName,
    price,
    currency,
    bookingDate,
    type,
    pointsEarned
  } = bookingDetails;

  const htmlContent = `
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

  const request = mailjet
    .post("send", { 'version': 'v3.1' })
    .request({
      "Messages": [
        {
          "From": {
            "Email": "sadassemaildezznuts@gmail.com",
            "Name": "Your Tourism App"
          },
          "To": [
            {
              "Email": touristEmail,
              "Name": touristName
            }
          ],
          "Subject": `Booking Confirmation - ${itemName}`,
          "TextPart": `Booking confirmation for ${itemName}`,
          "HTMLPart": htmlContent
        }
      ]
    });

  try {
    const result = await request;
    console.log('Receipt email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending receipt email:', error);
    throw error;
  }
};

module.exports = { sendActivityArchivedEmail, sendItineraryArchivedEmail, sendTouristReminderEmail, sendEmail, sendReceiptEmail };