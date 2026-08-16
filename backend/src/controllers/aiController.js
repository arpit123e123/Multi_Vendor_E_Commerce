const Product = require("../models/Product");
const {
  generateAIResponse,
} = require("../services/aiService");

const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (
      !message ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const products = await Product.find({
      isActive: true,
      status: "active",
      stock: { $gt: 0 },
    })
      .populate("category", "name")
      .select(
        "name description price discountPrice brand category stock averageRating numReviews",
      )
      .limit(100)
      .lean();

    console.log("AI PRODUCTS:", products.length);

    const reply = await generateAIResponse(
      message.trim(),
      products,
    );

    console.log("AI RESPONSE RECEIVED");

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("========== AI ERROR ==========");
    console.error(error);
    console.error("==============================");

    return res.status(500).json({
      success: false,
      message: error.message || "AI request failed",
    });
  }
};

module.exports = {
  chatWithAI,
};