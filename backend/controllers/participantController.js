const Participant = require("../models/Participant");
const Event = require("../models/Event");
const Notification = require("../models/Notification");
const generateParticipantId = require("../utils/generateParticipantId");
const QRCode = require("qrcode");
const sendEmail = require("../utils/sendEmail");
const cloudinary = require("../config/cloudinary");

exports.registerParticipant = async (req, res) => {
  try {
    const { name, email, phone, eventId } = req.body;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.status !== "APPROVED") {
      return res.status(400).json({ message: "Event not available" });
    }

    const participantId = await generateParticipantId(
      eventId,
      event.participantIdPrefix
    );

    const qrData = `upi://pay?pa=${event.upiId}&pn=SHC EVENT&am=${event.amount}`;
    const qrImage = await QRCode.toDataURL(qrData);

    const participant = await Participant.create({
      participantId,
      name,
      email,
      phone,
      eventId,
    });

    // Notify Event Creator
    if (event.createdBy) {
      await Notification.create({
        userId: event.createdBy,
        title: "New Registration",
        message: `${name} registered for ${event.title}. Verification required.`,
      });
    }

    try {
      await sendEmail({
        to: email,
        subject: "Registration Confirmation & Payment QR",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <div style="background-color: #007bff; padding: 20px; text-align: center; color: white;">
              <h2 style="margin: 0; font-size: 24px;">Registration Successful!</h2>
            </div>
            <div style="padding: 24px; background-color: #ffffff;">
              <p style="font-size: 16px; color: #333;">Hello <b>${name}</b>,</p>
              <p style="font-size: 16px; color: #333;">Thank you for registering for <b>${event.title}</b>.</p>
              <div style="background-color: #f4f6f8; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <p style="margin: 0; font-size: 14px; color: #666;">Your Participant ID:</p>
                <p style="margin: 5px 0 0; font-size: 22px; font-weight: bold; color: #007bff; letter-spacing: 1px;">${participantId}</p>
              </div>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 25px 0;" />
              <h3 style="text-align: center; color: #333; margin-top: 0;">Complete Your Payment</h3>
              <p style="text-align: center; font-size: 15px; color: #555;">Please scan the QR code below to pay <b>₹${event.amount}</b>.</p>
              <div style="text-align: center; margin: 20px 0;">
                <img src="cid:qrcode" alt="Payment QR Code" style="width: 220px; height: 220px; border: 4px solid #f4f6f8; border-radius: 12px;" />
              </div>
              <p style="text-align: center; font-size: 14px; color: #777; margin-bottom: 0;">UPI ID: <b>${event.upiId}</b></p>
            </div>
            <div style="background-color: #f4f6f8; padding: 15px; text-align: center; border-top: 1px solid #eee;">
              <p style="margin: 0; font-size: 13px; color: #888;">If you have any questions, please contact the event organizers.</p>
            </div>
          </div>
        `,
        attachments: [
          {
            filename: "qrcode.png",
            path: qrImage,
            cid: "qrcode",
          },
        ],
      });
    } catch (emailError) {
      console.error("SMTP Error: Failed to send email.", emailError.message);
    }

    res.json({
      message: "Registered Successfully",
      participantId,
      _id: participant._id,
      qrImage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadPaymentProof = async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id);
    if (!participant) return res.status(404).json({ message: "Participant not found" });

    let file = req.file || (req.files && req.files.length > 0 ? req.files[0] : null);

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(file.path);
    participant.paymentScreenshot = result.secure_url;
    participant.paymentStatus = "PENDING";
    await participant.save();

    res.json({ message: "Uploaded to Cloud", url: result.secure_url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id);
    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }
    if (!participant.paymentScreenshot) {
      return res.status(400).json({ message: "No payment proof uploaded" });
    }

    participant.paymentStatus = req.body.status;
    participant.verifiedBy = req.user._id;
    await participant.save();

    res.json({ message: "Payment Verified Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPendingVerifications = async (req, res) => {
  try {
    const participants = await Participant.find({ paymentStatus: "PENDING" }).populate("eventId", "title amount");
    res.json(participants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};