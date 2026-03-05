const PDFDocument = require("pdfkit");
const Participant = require("../models/Participant");
const fs = require("fs");

exports.generateCertificate = async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id).populate(
      "eventId",
    );

    if (!participant) return res.status(404).json({ message: "Participant not found" });

    if (participant.paymentStatus !== "APPROVED") {
      return res.status(400).json({ message: "Payment not approved" });
    }

    const doc = new PDFDocument();
    if (!fs.existsSync("certificates")) {
      fs.mkdirSync("certificates");
    }
    const filePath = `certificates/${participant.participantId}.pdf`;

    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(25).text("Certificate of Participation", {
      align: "center",
    });

    doc.moveDown();
    doc.fontSize(18).text(`This certifies that ${participant.name}`);
    doc.text(`has successfully participated in ${participant.eventId.title}`);

    doc.end();

    res.download(filePath);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
