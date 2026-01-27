/**
 * Test Script for Gemini Integration
 * Run this to verify Gemini API is working correctly
 *
 * Usage: node test-gemini.js
 */

import dotenv from "dotenv";
import { generateTechTweet, generateMultipleTechTweets } from "./src/gemini.js";

dotenv.config();

async function testGemini() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║         Testing Gemini AI Integration                 ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  // Check if API key is set
  if (!process.env.GEMINI_API_KEY) {
    console.error("[ERROR] GEMINI_API_KEY not found in .env file");
    console.error("[ERROR] Please add your Gemini API key to .env file:");
    console.error("[ERROR]   GEMINI_API_KEY=your_api_key_here\n");
    process.exit(1);
  }

  console.log("[INFO] ✓ GEMINI_API_KEY found in environment\n");

  // Test 1: Generate a single tweet
  console.log("═".repeat(60));
  console.log("TEST 1: Generating a single tweet...");
  console.log("═".repeat(60));

  try {
    const tweet = await generateTechTweet();
    console.log("\n[SUCCESS] Tweet generated successfully!\n");
    console.log("Generated Tweet:");
    console.log("-".repeat(60));
    console.log(tweet);
    console.log("-".repeat(60));
    console.log(`Character count: ${tweet.length}/280\n`);
  } catch (error) {
    console.error("[ERROR] Failed to generate tweet:", error.message);
    console.error("\n[INFO] Please check:");
    console.error("  1. Your GEMINI_API_KEY is correct");
    console.error("  2. You have internet connection");
    console.error("  3. Your API key has proper permissions\n");
    process.exit(1);
  }

  // Test 2: Generate multiple tweets
  console.log("\n═".repeat(60));
  console.log("TEST 2: Generating multiple tweets (3 tweets)...");
  console.log("═".repeat(60));

  try {
    const tweets = await generateMultipleTechTweets(3);
    console.log(
      `\n[SUCCESS] Generated ${tweets.length} tweets successfully!\n`
    );

    tweets.forEach((tweet, index) => {
      console.log(`Tweet ${index + 1}:`);
      console.log("-".repeat(60));
      console.log(tweet);
      console.log(`Character count: ${tweet.length}/280`);
      console.log("-".repeat(60));
      console.log();
    });
  } catch (error) {
    console.error("[ERROR] Failed to generate multiple tweets:", error.message);
    process.exit(1);
  }

  console.log("═".repeat(60));
  console.log("[SUCCESS] All tests passed! ✓");
  console.log("[INFO] Gemini integration is working correctly!");
  console.log("[INFO] You can now run 'npm start' to start the bot\n");
  console.log("═".repeat(60));
  console.log();
}

// Run the test
testGemini().catch((error) => {
  console.error("[ERROR] Test failed:", error.message);
  process.exit(1);
});
