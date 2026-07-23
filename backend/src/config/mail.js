const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
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