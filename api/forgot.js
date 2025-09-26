import nodemailer from "nodemailer";

const users = JSON.parse(process.env.USERS || "[]"); // Example: store users in a JSON or DB

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(404).json({ error: "Email not registered" });

  // Generate 6-digit verification code
  const code = Math.floor(100000 + Math.random() * 900000);
  user.resetCode = code; // Save code temporarily (in DB or memory)
  // Note: In production, store securely & expire after few minutes

  // Send email
  const transporter = nodemailer.createTransport({
    service: "gmail", // or your email service
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Trashcore Password Reset Code",
      text: `Your verification code is: ${code}`
    });
    res.status(200).json({ message: "Verification code sent", reset: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send email" });
  }
}
