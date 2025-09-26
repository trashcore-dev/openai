const users = JSON.parse(process.env.USERS || "[]"); // Same user storage as above

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, newPassword, code } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(404).json({ error: "Email not registered" });

  if (user.resetCode != code) return res.status(400).json({ error: "Invalid verification code" });

  user.password = newPassword;
  delete user.resetCode;

  // Save updated users to DB or persistent storage
  res.status(200).json({ message: "Password reset successfully" });
}
