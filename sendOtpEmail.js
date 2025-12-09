const transporter = require("./mailer");

const sendOtpEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: `"Campus EventHub" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Your OTP for Campus EventHub",
    html: `
      <h2>Campus EventHub Verification</h2>
      <p>Your OTP is:</p>
      <h1 style="letter-spacing:4px;">${otp}</h1>
      <p>This OTP is valid for 10 minutes.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOtpEmail };
