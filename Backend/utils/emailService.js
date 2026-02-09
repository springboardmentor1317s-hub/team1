const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  const missingVars = [];
  if (!process.env.EMAIL_HOST) missingVars.push('EMAIL_HOST');
  if (!process.env.EMAIL_USER) missingVars.push('EMAIL_USER');
  if (!process.env.EMAIL_PASS) missingVars.push('EMAIL_PASS');

  if (missingVars.length > 0) {
    console.warn('⚠️ Email configuration incomplete. Missing:', missingVars.join(', '));
    console.warn('⚠️ Email notifications will be disabled.');
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/** 
 * Send signup OTP email 
 */
exports.sendSignupOtpEmail = async (email, otp) => {
  try {
    const transporter = createTransporter();
    if (!transporter) return { success: false, message: 'Email service not configured' };

    const mailOptions = {
      from: `"CampusEventHub" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🔑 Your OTP for CampusEventHub Signup',
      text: `Your OTP for signup is: ${otp}. It is valid for 15 minutes.`,
      html: `<p>Your OTP for signup is: <strong>${otp}</strong></p>
             <p>It is valid for 15 minutes.</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('OTP email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return { success: false, error: error.message };
  }
};

/** 
 * Send ticket approval email 
 */
exports.sendTicketApprovalEmail = async (user, event, registration) => {
  try {
    const transporter = createTransporter();
    if (!transporter) return { success: false, message: 'Email service not configured' };

    const ticketDownloadLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/student-dashboard`;

    const mailOptions = {
      from: `"CampusEventHub" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `🎉 Your Registration for "${event.title}" has been Approved!`,
      text: `Hi ${user.name}, your registration for ${event.title} is approved. Download your ticket here: ${ticketDownloadLink}`,
      html: `<p>Hi ${user.name}, your registration for <strong>${event.title}</strong> is approved.</p>
             <p><a href="${ticketDownloadLink}">Download your ticket</a></p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending ticket approval email:', error);
    return { success: false, error: error.message };
  }
};

/** 
 * Send registration rejection email 
 */
exports.sendRejectionEmail = async (user, event, reason = '') => {
  try {
    const transporter = createTransporter();
    if (!transporter) return { success: false, message: 'Email service not configured' };

    const mailOptions = {
      from: `"CampusEventHub" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Registration Update for "${event.title}"`,
      text: `Hi ${user.name}, your registration for ${event.title} was not approved.${reason ? ' Reason: ' + reason : ''}`,
      html: `<p>Hi ${user.name},</p>
             <p>Your registration for <strong>${event.title}</strong> was not approved.</p>
             ${reason ? `<p>Reason: ${reason}</p>` : ''}`,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending rejection email:', error);
    return { success: false, error: error.message };
  }
};

/** 
 * Send password reset email 
 */
exports.sendPasswordResetEmail = async (user, resetLink) => {
  try {
    const transporter = createTransporter();
    if (!transporter) return { success: false, message: 'Email service not configured' };

    const mailOptions = {
      from: `"CampusEventHub" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: '🔐 Password Reset Request - CampusEventHub',
      text: `Hi ${user.name}, reset your password using this link: ${resetLink} (valid 15 minutes)`,
      html: `<p>Hi ${user.name},</p>
             <p>Click <a href="${resetLink}">here</a> to reset your password. This link is valid for 15 minutes.</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};
