const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');

// ✅ Models
const Registration = require('../models/Registration');

// ✅ Your existing auth middleware (UNCHANGED)
const { protect } = require('../middleware/authMiddleware');

// ==============================
// DOWNLOAD CERTIFICATE (PDF)
// ==============================
router.get('/:id', protect, async (req, res) => {
  try {
    const registrationId = req.params.id;

    // ✅ Find registration and populate CORRECT fields
    const registration = await Registration.findById(registrationId)
      .populate({
        path: 'user_id',
        select: 'name email'
      })
      .populate({
        path: 'event_id',
        select: 'title date'
      });

    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    // ✅ Only approved registrations
    if (registration.status !== 'approved') {
      return res.status(403).json({
        error: 'Certificate available only for approved registrations'
      });
    }

    // ✅ Ownership check (student can download only their certificate)
    if (registration.user_id._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'You are not allowed to download this certificate'
      });
    }

    // ==============================
    // CREATE PDF
    // ==============================
    const doc = new PDFDocument({ size: 'A4', margin: 40 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=certificate-${registrationId}.pdf`
    );

    doc.pipe(res);

    // ===== BORDER =====
    doc
      .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
      .lineWidth(3)
      .strokeColor('#1e3a8a')
      .stroke();

    // ===== TITLE =====
    doc
      .fontSize(30)
      .fillColor('#1e3a8a')
      .font('Times-Bold')
      .text('CERTIFICATE OF PARTICIPATION', {
        align: 'center',
        underline: true
      });

    doc.moveDown(2);

    // ===== BODY =====
    doc
      .fontSize(14)
      .fillColor('black')
      .font('Times-Roman')
      .text('This is to certify that', { align: 'center' });

    doc.moveDown(1);

    // ===== STUDENT NAME =====
    doc
      .fontSize(24)
      .font('Times-Bold')
      .text(registration.user_id.name.toUpperCase(), {
        align: 'center'
      });

    doc.moveDown(1);

    doc
      .fontSize(14)
      .font('Times-Roman')
      .text('has successfully participated in the', {
        align: 'center'
      });

    doc.moveDown(1);

    // ===== EVENT NAME =====
    doc
      .fontSize(20)
      .font('Times-Bold')
      .fillColor('#1e40af')
      .text(registration.event_id.title, {
        align: 'center'
      });

    doc.moveDown(3);

    // ===== FOOTER =====
    doc.fontSize(12).fillColor('black');

    doc.text(
      `Date: ${new Date().toLocaleDateString()}`,
      80,
      doc.page.height - 160
    );

    doc.text(
      'Authorized Signature',
      doc.page.width - 240,
      doc.page.height - 160
    );

    doc
      .moveTo(doc.page.width - 240, doc.page.height - 140)
      .lineTo(doc.page.width - 80, doc.page.height - 140)
      .stroke();

    doc.end();

  } catch (error) {
    console.error('CERTIFICATE ERROR:', error);
    res.status(500).json({ error: 'Failed to generate certificate' });
  }
});

module.exports = router;
