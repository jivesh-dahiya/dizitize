const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Brevo SMTP setup
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: "a075a5001@smtp-brevo.com",
    pass: process.env.SMTP_KEY   // ⚠️ Put new key here
  }
});

// Test route (optional but useful)
app.get("/", (req, res) => {
  res.send("Dizitise backend is running 🚀");
});

// Contact form API
app.post("/contact", async (req, res) => {
  const { name, phone, email, message } = req.body;

  if (!name || !phone || !email || !message) {
    return res.status(400).json({
      success: false,
      msg: "All fields are required"
    });
  }

  try {
    await transporter.sendMail({
      from: `"Dizitise Institute" <a075a5001@smtp-brevo.com>`,
      to: "brainivo.enquire@gmail.com", // put YOUR email here where you want leads
      subject: "🚀 New Contact Form Submission - Dizitise",
      html: `
        <h2>New Lead Received</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
        <hr/>
        <small>Sent from Dizitise Contact Form</small>
      `
    });

    res.json({ success: true });

  } catch (error) {
    console.error("Mail Error:", error);
    res.status(500).json({
      success: false,
      msg: "Failed to send message"
    });
  }
});

// Start server
app.listen(3001, () => {
  console.log("🚀 Backend running at http://localhost:3001");
});
