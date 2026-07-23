const createEmailLayout = ({
  title,
  heading,
  message,
  buttonText,
  buttonLink,
  footerMessage = "If you did not request this, you can safely ignore this email.",
}) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
</head>

<body style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 5px 20px rgba(0,0,0,.08);">

<tr>
<td
style="background:#2563eb;padding:30px;text-align:center;color:white;">
<h1 style="margin:0;">ShopHub</h1>
<p style="margin-top:10px;">Multi Vendor E-Commerce Platform</p>
</td>
</tr>

<tr>
<td style="padding:40px;">

<h2>${heading}</h2>

<p
style="font-size:16px;color:#555;line-height:1.8;">
${message}
</p>

<div style="text-align:center;margin:40px 0;">

<a href="${buttonLink}"
style="
display:inline-block;
padding:15px 35px;
background:#2563eb;
color:white;
text-decoration:none;
border-radius:8px;
font-weight:bold;
">
${buttonText}
</a>

</div>

<p style="color:#888;font-size:14px;">
If the button doesn't work, copy and paste this URL into your browser:
</p>

<p style="word-break:break-all;">
${buttonLink}
</p>

<hr>

<p
style="color:#666;font-size:14px;">
${footerMessage}
</p>

<p
style="margin-top:30px;">
Thanks,<br>
<b>ShopHub Team</b>
</p>

</td>
</tr>

<tr>

<td
style="
background:#f3f4f6;
padding:20px;
text-align:center;
font-size:13px;
color:#777;
">

© ${new Date().getFullYear()} ShopHub.
All Rights Reserved.

</td>

</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
};

const forgotPasswordTemplate = (resetLink) => {
  return createEmailLayout({
    title: "Reset Password",
    heading: "Reset Your Password",
    message:
      "We received a request to reset your password. This link is valid for only 10 minutes.",
    buttonText: "Reset Password",
    buttonLink: resetLink,
  });
};
const verifyEmailTemplate = (verifyLink) => {
  return createEmailLayout({
    title: "Verify Email",

    heading: "Verify Your Email Address",

    message:
      "Welcome to ShopHub. Please verify your email address before logging in.",

    buttonText: "Verify Email",

    buttonLink: verifyLink,

    footerMessage: "This verification link expires in 24 hours.",
  });
};
module.exports = {
  forgotPasswordTemplate,
  verifyEmailTemplate,
};