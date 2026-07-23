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
    console.log("✅ SMTP Server Connected Successfully");
  } catch (error) {
    console.error("❌ SMTP Connection Failed");
    console.error(error.message);
  }
};

module.exports = {
  transporter,
  verifyMailConnection,
};