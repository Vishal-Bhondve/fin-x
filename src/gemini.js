/**
 * Gemini AI Integration
 * Generates sober, anti-hype wealth building and investing tweets using Google Gemini API
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize Gemini AI
let genAI = null;
if (GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
}

/**
 * Generate a wealth building/investing tweet using Gemini
 * @param {string} theme - Specific theme or focus for the tweet
 * @returns {Promise<string>} Generated tweet text
 */
export async function generateTechTweet(theme = "") {
  if (!GEMINI_API_KEY || !genAI) {
    throw new Error(
      "GEMINI_API_KEY not found in environment variables. Please add it to your .env file.",
    );
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const themePrompt = theme
      ? `\nCURRENT SLOT THEME: "${theme}"\nPlease ensure the tweet reflects this specific theme while staying within the niche.`
      : "";

    const prompt = `Generate a single engaging tweet about long-term wealth building and investing.${themePrompt}

NICHE FOCUS: "Sober, anti-hype, long-term wealth building & investing education"
KEY TOPICS:
- Heavy on Crypto (specifically BTC/ETH maxi lean)
- Personal finance basics (saving, budgeting, passive income)
- Risk-aware mindset & psychological aspects of investing
- Escaping the rat race through discipline + compounding
- Anti-hype, no "get-rich-quick" schemes, focus on long-term growth

Content Requirements:
- Tone: Sober, educational, disciplined, and slightly contrarian to mainstream "hype"
- Maximum 280 characters (Twitter limit)
- Should be engaging, relatable, and provide value/wisdom
- Should feel natural, conversational, and thought-provoking
- Can include relevant hashtags (1-2 max)
- Make it original and shareable

Return ONLY the tweet text, nothing else. No explanations, no quotes, just the tweet content.`;

    console.log(
      `[INFO] Generating tweet for theme: "${theme || "General"}" using Gemini AI...`,
    );

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let tweetText = response.text().trim();

    // Clean up the response (remove quotes if wrapped, remove extra whitespace)
    tweetText = tweetText.replace(/^["']|["']$/g, "").trim();

    // Ensure it's within Twitter's 280 character limit
    if (tweetText.length > 280) {
      tweetText = tweetText.substring(0, 277) + "...";
    }

    console.log("[SUCCESS] Tweet generated successfully!");
    return tweetText;
  } catch (error) {
    console.error(
      "[ERROR] Failed to generate tweet with Gemini:",
      error.message,
    );
    throw error;
  }
}

/**
 * Generate multiple wealth building/investing tweets at once (for caching/pre-generating)
 * @param {number} count - Number of tweets to generate
 * @returns {Promise<string[]>} Array of generated tweets
 */
export async function generateMultipleTechTweets(count = 5) {
  if (!GEMINI_API_KEY || !genAI) {
    throw new Error(
      "GEMINI_API_KEY not found in environment variables. Please add it to your .env file.",
    );
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Generate ${count} engaging tweets about long-term wealth building and investing.

NICHE FOCUS: "Sober, anti-hype, long-term wealth building & investing education"
KEY TOPICS (use a mix across the tweets):
- Heavy on Crypto (specifically BTC/ETH maxi lean)
- Personal finance basics (saving, budgeting, passive income)
- Risk-aware mindset & psychological aspects of investing
- Escaping the rat race through discipline + compounding
- Anti-hype, no "get-rich-quick" schemes, focus on long-term growth

Requirements for each tweet:
- Tone: Sober, educational, disciplined, and slightly contrarian to mainstream "hype"
- Maximum 280 characters (Twitter limit)
- Should be engaging, relatable, and provide value/wisdom
- Should feel natural, conversational, and thought-provoking
- Can include relevant hashtags (1-2 max per tweet)
- Make each tweet unique, original, and shareable

Return each tweet on a new line. Number them 1-${count}. No explanations, no quotes around tweets, just the tweet content, one per line.`;

    console.log(`[INFO] Generating ${count} tweets using Gemini AI...`);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    // Parse the tweets (split by newlines and clean up)
    let tweets = text
      .split("\n")
      .map((line) => {
        // Remove numbering (1., 2., etc.)
        return line.replace(/^\d+[\.\)]\s*/, "").trim();
      })
      .filter((line) => line.length > 0 && line.length <= 280);

    // Clean up quotes
    tweets = tweets.map((tweet) => tweet.replace(/^["']|["']$/g, "").trim());

    console.log(`[SUCCESS] Generated ${tweets.length} tweets successfully!`);
    return tweets;
  } catch (error) {
    console.error(
      "[ERROR] Failed to generate tweets with Gemini:",
      error.message,
    );
    throw error;
  }
}
