const nodemailer = require("nodemailer");

console.log("📧 SMTP CONFIG CHECK");
console.log("SMTP_HOST:", process.env.SMTP_HOST);
console.log("SMTP_PORT:", process.env.SMTP_PORT);
console.log("SMTP_LOGIN:", process.env.SMTP_LOGIN ? "SET" : "MISSING");
console.log("SMTP_PASSWORD:", process.env.SMTP_PASSWORD ? "SET" : "MISSING");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_LOGIN,
    pass: process.env.SMTP_PASSWORD,
  },
});

const verifyMailConnection = async () => {
  try {
    await transporter.verify();
    console.log("✅ SMTP Connected");
  } catch (error) {
    console.error("❌ SMTP Connection Failed:", error.message);
  }
};

module.exports = {
  transporter,
  verifyMailConnection,
};