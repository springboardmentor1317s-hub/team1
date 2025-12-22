const PDFDocument = require("pdfkit");
const Registration = require("../models/Registration");

exports.downloadCertificate = async (req, res) => {
  try {
    const { registrationId } = req.params;

    // 1️⃣ Find registration and populate user + event
    const registration = await Registration.findById(registrationId)
      .populate("user", "name")
      .populate("event", "title");

    if (!registration) {
      return res.status(404).json({ error: "Registration not found" });
    }

    // 2️⃣ Only approved registrations get certificate
    if (registration.registrationStatus !== "approved") {
      return res
        .status(403)
        .json({ error: "Certificate not available for this registration" });
    }

    const studentName = registration.user?.name;
    const eventName = registration.event?.title;

    if (!studentName || !eventName) {
      return res
        .status(404)
        .json({ error: "Student or Event not found" });
    }

    // 3️⃣ Create PDF
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=certificate-${registrationId}.pdf`
    );

    doc.pipe(res);

    doc.fontSize(26).text("Certificate of Participation", { align: "center" });
    doc.moveDown(2);

    doc.fontSize(14).text("This is to certify that", { align: "center" });
    doc.moveDown(1);

    doc.fontSize(20).text(studentName, { align: "center", underline: true });
    doc.moveDown(1);

    doc
      .fontSize(14)
      .text("has successfully participated in the event", {
        align: "center",
      });
    doc.moveDown(1);

    doc.fontSize(18).text(eventName, { align: "center", underline: true });
    doc.moveDown(3);

    doc
      .fontSize(10)
      .text(`Registration ID: ${registrationId}`, { align: "center" });

    doc.moveDown(2);
    doc.text("CampusEventHub", { align: "right" });

    doc.end();
  } catch (error) {
    console.error("CERTIFICATE ERROR:", error); // 🔴 IMPORTANT
    res.status(500).json({ error: "Failed to generate certificate" });
  }
};

