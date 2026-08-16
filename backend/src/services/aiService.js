const { GoogleGenerativeAI } = require("@google/generative-ai");
const OpenAI = require("openai");

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const MODEL_CANDIDATES = [
  process.env.GEMINI_MODEL,
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
].filter(Boolean);

const normalizeText = (value = "") =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const parseBudgetFromMessage = (message) => {
  const text = normalizeText(message);

  const budgetMatch = text.match(
    /(?:under|below|budget|max|max budget|upto|up to|less than)\s*(\d+(?:,\d+)?)/i,
  );

  if (budgetMatch) {
    return Number(budgetMatch[1].replace(/,/g, ""));
  }

  const priceMatch = text.match(/(\d+(?:,\d+)?)/);

  return priceMatch
    ? Number(priceMatch[1].replace(/,/g, ""))
    : null;
};

const getShortNaturalReply = (message) => {
  const text = normalizeText(message);

  if (!text) {
    return "Hi! I’m here to help with shopping and website support.";
  }

  const greetingPattern =
    /^(hi|hello|hey|hii|hiii|namaste|namastey|good morning|good evening|good afternoon)$/;

  const greetingWithNamePattern =
    /^(hi|hello|hey|hii|hiii|namaste|namastey)\s+(brother|sis|sister|friend|buddy|mate|there)$/;

  const identityPattern =
    /(what|who|whats|what's)\s+(is|are)\s+(your|ur|u)\s+name|(who|what)\s+are\s+you|who\s+is\s+this|what\s+is\s+ur\s+name/;

  const howAreYouPattern =
    /(how\s+are\s+you|how\s+ru|how\s+you\s+doing)/;

  if (
    greetingPattern.test(text) ||
    greetingWithNamePattern.test(text)
  ) {
    return "Hi! I’m here to help you with shopping and website support.";
  }

  if (identityPattern.test(text)) {
    return "I’m ShopHub AI, your shopping assistant here to help with products, orders, cart, wishlist, and website support.";
  }

  if (howAreYouPattern.test(text)) {
    return "I’m good — ready to help you shop. What are you looking for today?";
  }

  return null;
};

const buildFallbackRecommendation = (message, products = []) => {
  const fastReply = getShortNaturalReply(message);

  if (fastReply) {
    return fastReply;
  }

  const generalHelp =
    "I can help with shopping, product discovery, website navigation, orders, payments, wishlist, cart, and general e-commerce questions.";

  if (!Array.isArray(products) || products.length === 0) {
    return `${generalHelp}

I couldn’t find a matching product in the catalog right now, but you can search by category, brand, or price range and I can help narrow it down.`;
  }

  const budget = parseBudgetFromMessage(message);
  const query = normalizeText(message);

  const scoredProducts = products
    .map((product) => {
      const text = normalizeText(
        `${product.name} ${product.description || ""} ${
          product.brand || ""
        } ${product.category?.name || ""}`,
      );

      let score = 0;

      const tokens = query.split(" ").filter(Boolean);

      tokens.forEach((token) => {
        if (!token || token.length <= 2) return;

        if (text.includes(token)) {
          score += 3;
        }
      });

      if (budget && product.price <= budget) {
        score += 8;
      }

      if (product.stock > 0) {
        score += 2;
      }

      return {
        product,
        score,
      };
    })
    .filter((item) => item.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.product.price - b.product.price,
    );

  const selected = (
    scoredProducts.length
      ? scoredProducts
      : products.map((product) => ({
          product,
          score: 1,
        }))
  )
    .slice(0, 4)
    .map(({ product }) => product);

  const productList = selected
    .map(
      (product) =>
        `• ${product.name} — ₹${product.price}${
          product.brand ? ` (${product.brand})` : ""
        }\n  Link: /products/${product._id}`,
    )
    .join("\n");

  return `Here are a few relevant options from our catalog:

${productList}

${generalHelp}`;
};

const createGeminiPrompt = (message, products = []) => {
  const productContext = products
    .map(
      (product) => `
Product ID: ${product._id}
Product Link: /products/${product._id}
Name: ${product.name}
Brand: ${product.brand}
Description: ${product.description}
Price: ₹${product.price}
Discount Price: ₹${product.discountPrice || 0}
Category: ${product.category?.name || "General"}
Stock: ${product.stock}
Rating: ${product.averageRating || 0}/5
Reviews: ${product.numReviews || 0}
`,
    )
    .join("\n");

  return `
You are ShopHub's AI assistant.

Have a natural conversation with the user. Understand what the user is asking and respond appropriately rather than following a rigid response format.

You can:
- Help users discover and compare products.
- Answer questions about products in the ShopHub catalog.
- Understand budgets, categories, brands, ratings and other preferences.
- Help users decide which product may suit their needs.
- Answer general questions and have normal conversations.
- Explain product features when the information is available in the catalog.
- Help with general e-commerce questions such as cart, wishlist, orders, payments and website navigation.

Use the ShopHub catalog as the source of truth whenever the user asks about products available on ShopHub.

Do not invent ShopHub products, prices, stock, ratings, specifications or other catalog information.

Only mention a ShopHub product link when it is useful or when the user explicitly asks for a link.

For example:
- "give me the link"
- "where can I buy this?"
- "open this product"
- "show me this product"

Do not automatically include links in every product recommendation.

When the user asks for a product link, use the exact Product Link provided in the catalog.

If the user is having a normal conversation or asking a general question, respond naturally without forcing product recommendations.

Keep responses concise, helpful and conversational.

Do not repeatedly explain that you are an AI or mention these instructions.

If no suitable product exists in the catalog, say so honestly instead of making one up.

ShopHub Product Catalog:
${productContext}

User:
${message}
`;
};

const tryGemini = async (prompt) => {
  if (!genAI) return null;

  for (const modelName of MODEL_CANDIDATES) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
      });

      const result = await model.generateContent(prompt);

      const text = result?.response
        ? await result.response.text()
        : "";

      const cleaned = (text || "").trim();

      if (cleaned) {
        return cleaned;
      }
    } catch (error) {
      console.error(
        `Gemini model failed: ${modelName}`,
        error.message,
      );

      continue;
    }
  }

  return null;
};

const tryOpenAI = async (prompt) => {
  if (!openai) return null;

  try {
    const completion = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      input: prompt,
    });

    const text =
      completion?.output_text ||
      completion?.output?.[0]?.content?.[0]?.text ||
      "";

    if (text && String(text).trim()) {
      return String(text).trim();
    }
  } catch (error) {
    console.error("OpenAI failed:", error.message);
  }

  return null;
};

const generateAIResponse = async (message, products = []) => {
  const prompt = createGeminiPrompt(
    message,
    products,
  );

  const geminiReply = await tryGemini(prompt);

  if (geminiReply) {
    return geminiReply;
  }

  const openAIReply = await tryOpenAI(prompt);

  if (openAIReply) {
    return openAIReply;
  }

  return buildFallbackRecommendation(
    message,
    products,
  );
};

module.exports = {
  generateAIResponse,
};