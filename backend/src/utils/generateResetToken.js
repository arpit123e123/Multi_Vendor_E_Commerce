const crypto = require("crypto");

const generateResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  return {
    resetToken,
    hashedToken,
    expiresAt,
  };
};

module.exports = generateResetToken;