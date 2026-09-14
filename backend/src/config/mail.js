const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_LOGIN,
    pass: process.env.SMTP_PASSWORD,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

const verifyMailConnection = async () => {
  try {
    console.log("📧 Checking SMTP connection...");

    await transporter.verify();

    console.log("✅ SMTP Connected");
  } catch (error) {
    console.error("❌ SMTP Connection Failed");
    console.error("Code:", error.code);
    console.error("Command:", error.command);
    console.error("Message:", error.message);
  }
};

module.exports = {
  transporter,
  verifyMailConnection,
};