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
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const escapeRegex = (value = "") =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Extract budget from natural language.
 *
 * Examples:
 * "under 1000"
 * "below ₹2000"
 * "books under 500"
 * "upto 1500"
 */
const parseBudgetFromMessage = (message) => {
  const text = normalizeText(message);

  const budgetMatch = text.match(
    /(?:under|below|budget|max|max budget|upto|up to|less than)\s*(?:rs|inr|₹)?\s*(\d+(?:,\d+)?)/i
  );

  if (budgetMatch) {
    return Number(budgetMatch[1].replace(/,/g, ""));
  }

  return null;
};

/**
 * Extract the user's likely product intent.
 *
 * This is intentionally conservative.
 * We do NOT treat "book" as matching "ultrabook".
 */
const extractProductIntent = (message) => {
  const text = normalizeText(message);

  const intentWords = [
    "book",
    "books",
    "novel",
    "novels",
    "textbook",
    "textbooks",
    "laptop",
    "laptops",
    "mobile",
    "mobiles",
    "phone",
    "phones",
    "smartphone",
    "smartphones",
    "tablet",
    "tablets",
    "headphone",
    "headphones",
    "earphone",
    "earphones",
    "earbuds",
    "watch",
    "watches",
    "shoes",
    "shoe",
    "shirt",
    "shirts",
    "jeans",
    "furniture",
    "chair",
    "chairs",
    "sofa",
    "sofas",
    "camera",
    "cameras",
    "television",
    "tv",
    "monitor",
    "monitors",
    "keyboard",
    "keyboards",
    "mouse",
    "mice",
  ];

  const words = text.split(" ");

  return intentWords.find((intent) => {
    if (words.includes(intent)) {
      return true;
    }

    if (intent.endsWith("s") && words.includes(intent.slice(0, -1))) {
      return true;
    }

    return false;
  }) || null;
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
    return "I’m good, ready to help you shop. What are you looking for today?";
  }

  return null;
};

/**
 * Fallback recommendation.
 *
 * Important:
 * "book" must match a real word, not a substring.
 * Therefore "book" will NOT match "ultrabook".
 */
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
  const intent = extractProductIntent(message);
  const query = normalizeText(message);

  const scoredProducts = products
    .map((product) => {
      const productName = normalizeText(product.name);
      const description = normalizeText(product.description || "");
      const brand = normalizeText(product.brand || "");
      const category = normalizeText(product.category?.name || "");

      const productWords = new Set(
        `${productName} ${description} ${brand} ${category}`
          .split(" ")
          .filter(Boolean)
      );

      let score = 0;

      /**
       * Exact product intent matching.
       *
       * "book" matches:
       * "book"
       * "books"
       *
       * but NOT:
       * "ultrabook"
       */
      if (intent) {
        const singularIntent = intent.endsWith("s")
          ? intent.slice(0, -1)
          : intent;

        const pluralIntent = `${singularIntent}s`;

        if (
          productWords.has(singularIntent) ||
          productWords.has(pluralIntent)
        ) {
          score += 20;
        }

        /**
         * Category is especially important.
         */
        if (category === singularIntent || category === pluralIntent) {
          score += 30;
        }

        /**
         * Prevent obvious false positives.
         *
         * Example:
         * User asks "book"
         * Product = "Ultrabook Laptop"
         *
         * "book" appears inside "ultrabook", but that is NOT
         * considered a valid book match.
         */
        if (
          singularIntent === "book" &&
          (productName.includes("ultrabook") ||
            productName.includes("notebook") ||
            productName.includes("macbook"))
        ) {
          score -= 40;
        }
      }

      /**
       * Exact token matching instead of substring matching.
       */
      const tokens = query.split(" ").filter(Boolean);

      tokens.forEach((token) => {
        if (!token || token.length <= 2) return;

        if (productWords.has(token)) {
          score += 3;
        }
      });

      /**
       * Budget should be a strong filter.
       */
      if (budget !== null) {
        if (Number(product.price) <= budget) {
          score += 12;
        } else {
          score -= 15;
        }
      }

      /**
       * In-stock products get a small boost.
       */
      if (Number(product.stock) > 0) {
        score += 2;
      }

      return {
        product,
        score,
      };
    })
    .filter((item) => {
      /**
       * If user explicitly requested a product type,
       * don't return unrelated products just because
       * they are cheap or in stock.
       */
      if (intent) {
        return item.score >= 20;
      }

      return item.score > 0;
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        Number(a.product.price) - Number(b.product.price)
    );

  /**
   * If the user clearly asked for a product type but
   * there are no valid matches, do NOT show unrelated products.
   */
  if (intent && scoredProducts.length === 0) {
    return `I couldn't find a suitable ${intent} in the ShopHub catalog${
      budget !== null ? ` under ₹${budget}` : ""
    }.

Try another category, brand, or price range and I’ll help you find a better match.`;
  }

  const selected = scoredProducts
    .slice(0, 4)
    .map(({ product }) => product);

  if (selected.length === 0) {
    return `${generalHelp}

I couldn’t find a matching product in the catalog right now.`;
  }

  const productList = selected
    .map(
      (product) =>
        `• ${product.name} — ₹${product.price}${
          product.brand ? ` (${product.brand})` : ""
        }\n  Link: /products/${product._id}`
    )
    .join("\n");

  return `Here are a few relevant options from our catalog:

${productList}

${generalHelp}`;
};

/**
 * Build the AI prompt.
 */
const createGeminiPrompt = (message, products = []) => {
  const productContext = products
    .map(
      (product) => `
Product ID: ${product._id}
Product Link: /products/${product._id}
Name: ${product.name}
Brand: ${product.brand || ""}
Description: ${product.description || ""}
Price: ₹${product.price}
Discount Price: ₹${product.discountPrice || 0}
Category: ${product.category?.name || "General"}
Stock: ${product.stock}
Rating: ${product.averageRating || 0}/5
Reviews: ${product.numReviews || 0}
`
    )
    .join("\n");

  return `
You are ShopHub's AI shopping assistant.

Have a natural conversation with the user.

Your job is to help users discover products from the ShopHub catalog.

IMPORTANT PRODUCT MATCHING RULES:

1. The ShopHub catalog is the ONLY source of truth for products.

2. NEVER invent products, prices, stock, ratings, categories or specifications.

3. When the user asks for a specific product type, that product type must match the catalog semantically.

4. Exact word boundaries matter.

5. Do NOT treat one word as matching another word merely because it is contained inside it.

Example:
User asks for "book".

Valid:
- Book
- Books
- Novel
- Textbook

Invalid:
- Ultrabook
- Notebook
- MacBook

Do NOT recommend an Ultrabook when the user explicitly asks for a book.

6. If the user specifies a budget such as:
- under ₹1000
- below 1000
- upto 1500
- less than ₹2000

only recommend products whose actual catalog price is within that budget.

7. If no suitable product satisfies BOTH the requested product type and budget, say that no suitable product was found.

8. Do NOT relax the user's product type just to provide recommendations.

9. Do NOT recommend a different category merely because it is cheaper.

10. When recommending products, use ONLY products present in the catalog below.

11. When the user asks for a product link, use the exact Product Link belonging to that catalog product.

12. Do not automatically include links in every response.

13. Keep responses concise, helpful and conversational.

14. If the user is having normal conversation, respond naturally.

15. Do not repeatedly explain that you are an AI.

SHOPHUB PRODUCT CATALOG:

${productContext}

USER MESSAGE:

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
        error.message
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
  const prompt = createGeminiPrompt(message, products);

  const geminiReply = await tryGemini(prompt);

  if (geminiReply) {
    return geminiReply;
  }

  const openAIReply = await tryOpenAI(prompt);

  if (openAIReply) {
    return openAIReply;
  }

  return buildFallbackRecommendation(message, products);
};

module.exports = {
  generateAIResponse,
};