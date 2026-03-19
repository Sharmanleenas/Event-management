const Contact = require("../models/Contact");
const sendEmail = require("../utils/sendEmail");

// Submit Contact Form
exports.submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const contact = await Contact.create({
      name,
      email,
      message,
    });

    // Send Auto-Reply Email
    try {
      await sendEmail({
        to: email,
        subject: "Message Received - Sacred Heart College Events",
        html: `
          <div style="font-family: 'DM Sans', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e9ecef; border-radius: 12px;">
            <h2 style="color: #800020;">Hello ${name},</h2>
            <p style="font-size: 16px; color: #2c3e50;">Thank you for reaching out to us.</p>
            <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #d4af37; margin: 20px 0;">
              <p style="margin: 0; font-style: italic; color: #546e7a;">"Your query is received by our team, we will contact you soon."</p>
            </div>
            <p style="color: #90a4ae; font-size: 14px;">This is an automated response. Please do not reply to this email.</p>
            <hr style="border: 0; border-top: 1px solid #e9ecef; margin: 20px 0;" />
            <p style="text-align: center; color: #800020; font-weight: bold;">Sacred Heart College (Autonomous)</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Auto-reply Email Error:", emailError.message);
    }

    res.status(201).json({
      success: true,
      message: "Message received successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Messages (Admin only)
exports.getMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort("-createdAt");
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark as Read
exports.markAsRead = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: "READ" },
      { new: true }
    );
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reply to Contact
exports.replyToContact = async (req, res) => {
  try {
    const { replyMessage } = req.body;
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ success: false, message: "Inquiry not found" });
    }

    // Send Reply Email
    await sendEmail({
      to: contact.email,
      subject: `Reply to your inquiry - Sacred Heart College`,
      html: `
        <div style="font-family: 'DM Sans', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e9ecef; border-radius: 12px;">
          <h2 style="color: #800020;">Hello ${contact.name},</h2>
          <p style="font-size: 16px; color: #2c3e50;">Regarding your message:</p>
          <blockquote style="background: #f8f9fa; padding: 15px; border-left: 4px solid #ced4da; margin: 20px 0; color: #6c757d;">
            "${contact.message}"
          </blockquote>
          <p style="font-size: 16px; color: #2c3e50; line-height: 1.6;"><strong>Our Response:</strong></p>
          <div style="background: #fffdf5; padding: 20px; border: 1px solid #f9f1d0; border-radius: 8px; color: #4b3d2a; line-height: 1.6;">
            ${replyMessage}
          </div>
          <p style="margin-top: 30px; color: #90a4ae; font-size: 14px;">Regards,<br/>Sacred Heart College Events Team</p>
        </div>
      `,
    });

    contact.status = "REPLIED";
    await contact.save();

    res.status(200).json({ success: true, message: "Reply sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
