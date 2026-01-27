/**
 * Twitter Client Configuration
 * Uses OAuth 1.0a authentication ONLY
 */

import { TwitterApi } from "twitter-api-v2";
import dotenv from "dotenv";
import { notifyTweetPosted, notifyError } from "./telegram.js";

dotenv.config();

/**
 * Initialize Twitter client with OAuth 1.0a credentials
 * Uses permanent access tokens (no refresh logic needed)
 */
const client = new TwitterApi({
  appKey: process.env.API_KEY,
  appSecret: process.env.API_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessSecret: process.env.ACCESS_TOKEN_SECRET,
});

// Read-write client for posting tweets
const rwClient = client.readWrite;

/**
 * Post a tweet to Twitter
 * @param {string} text - Tweet content (max 280 characters)
 * @returns {Promise<Object>} Tweet response object
 */
export async function postTweet(text) {
  try {
    // Validate tweet length
    if (!text || text.trim().length === 0) {
      throw new Error("Tweet text cannot be empty");
    }

    if (text.length > 280) {
      throw new Error(
        `Tweet exceeds 280 characters (${text.length} characters)`,
      );
    }

    console.log("[INFO] Posting tweet:", text.substring(0, 50) + "...");

    // Post tweet using Twitter API v2
    const tweet = await rwClient.v2.tweet(text);

    console.log("[SUCCESS] Tweet posted successfully!");
    console.log("[INFO] Tweet ID:", tweet.data.id);

    // Send Telegram notification
    await notifyTweetPosted(text, tweet.data.id);

    return tweet;
  } catch (error) {
    console.error("[ERROR] Failed to post tweet:", error.message);

    // Log additional error details if available
    if (error.data) {
      console.error(
        "[ERROR] API Response:",
        JSON.stringify(error.data, null, 2),
      );
    }

    // Send error notification to Telegram
    await notifyError(error.message);

    // Don't crash the bot - just log the error
    return null;
  }
}

/**
 * Verify Twitter credentials
 * @returns {Promise<boolean>} True if credentials are valid
 */
export async function verifyCredentials() {
  try {
    const user = await rwClient.v2.me();
    console.log("[SUCCESS] Twitter credentials verified");
    console.log("[INFO] Authenticated as:", user.data.username);
    return true;
  } catch (error) {
    console.error("[ERROR] Failed to verify credentials:", error.message);
    return false;
  }
}

export default rwClient;
