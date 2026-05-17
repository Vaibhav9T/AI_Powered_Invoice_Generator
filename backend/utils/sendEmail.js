import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (userEmail, token) => {
  // Use explicit SMTP settings instead of just 'service: gmail'
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for port 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD
    }
  });

  // Find your verificationUrl line and replace it with this:
const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000/api';
const verificationUrl = `${backendUrl}/auth/verify/${token}`;

  const mailOptions = {
    from: `"Ainvoy Support" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: 'Welcome to Ainvoy! Please verify your email',
    html: `
      <h2>Welcome to Ainvoy!</h2>
      <p>Click the link below to verify your account and start generating intelligent invoices.</p>
      <a href="${verificationUrl}" style="padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px;">Verify My Account</a>
    `
  };

  // Add a console.log here to force it to tell you if it succeeded or failed!
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully: " + info.response);
  } catch (error) {
    console.error("❌ Nodemailer failed to send email:", error);
    throw error; // Throw it back to the authController so the user knows it failed
  }
};