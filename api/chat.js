// api/chat.js
import OpenAI from "openai";
import nodemailer from "nodemailer";

// Configure your email transport (use a real SMTP service)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // e.g., smtp.gmail.com
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { type, message, email, code } = req.body;

  try {
    if (type === "ai") {
      // AI Chat
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }],
        max_tokens: 200
      });
      const reply = completion.choices[0].message.content;
      return res.status(200).json({ reply });
    }

    else if (type === "sendVerification") {
      // Generate 6-digit code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Send email
      await transporter.sendMail({
        from: `"Trashcore Devs" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Password Reset Verification Code",
        text: `Your verification code is: ${verificationCode}`
      });

      // Store the code temporarily (for demo: in memory)
      // For production, store in DB linked to the email
      res.status(200).json({ success: true, code: verificationCode });
    }

    else {
      return res.status(400).json({ error: "Invalid request type" });
    }

  } catch (err) {
    console.error("Error in chat/email handler:", err);
    res.status(500).json({ reply: "Internal server error." });
  }
}
