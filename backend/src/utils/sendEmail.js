const { transporter } = require("../config/mail");

const sendEmail = async ({ to, subject, html, text = "" }) => {
  try {
    const info = await transporter.sendMail({
      from: {
        name: process.env.MAIL_FROM_NAME,
        address: process.env.MAIL_FROM,
      },
      to,
      subject,
      text,
      html,
    });

    console.log(`✅ Email sent successfully to ${to}`);
    console.log(`📧 Message ID: ${info.messageId}`);

    return info;
  } catch (error) {
    console.error("❌ Email Error:", error);

    throw new Error("Failed to send email");
  }
};

module.exports = sendEmail;
