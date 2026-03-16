const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async ({ to, subject, html, attachments }) => {
  try {
    const info = await transporter.sendMail({
      from: `"SHC Event System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      attachments,
    });

    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Email error:", error.message);
    throw new Error("Email sending failed");
  }
};

module.exports = sendEmail;