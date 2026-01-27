/**
 * X (Twitter) Automation Bot
 * OAuth 1.0a ONLY - No OAuth 2.0, No Browser Auth, No Token Refresh
 */

import express from "express";
import dotenv from "dotenv";
import { verifyCredentials } from "./twitter.js";
import { startScheduler } from "./scheduler.js";
import { notifyBotStarted } from "./telegram.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

/**
 * Health check endpoint
 */
app.get("/health", (req, res) => {
  res.json({
    status: "running",
    timestamp: new Date().toISOString(),
    auth: "OAuth 1.0a",
    uptime: process.uptime(),
  });
});

/**
 * Initialize and start the bot
 */
async function startBot() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║        X (Twitter) Automation Bot v1.0                ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  // Verify environment variables
  console.log("[INFO] Checking environment variables...");
  const requiredEnvVars = [
    "API_KEY",
    "API_SECRET",
    "ACCESS_TOKEN",
    "ACCESS_TOKEN_SECRET",
    "GEMINI_API_KEY",
  ];
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    console.error("[ERROR] Missing required environment variables:");
    missingVars.forEach((varName) => console.error(`[ERROR]   • ${varName}`));
    console.error("[ERROR] Please check your .env file");
    process.exit(1);
  }

  console.log("[SUCCESS] All environment variables found\n");

  // Display authentication info
  console.log("[INFO] ═══════════════════════════════════════════════════");
  console.log("[INFO] Authentication Type: OAuth 1.0a");
  console.log("[INFO] ═══════════════════════════════════════════════════");
  console.log("[INFO] Using permanent access tokens");
  console.log(
    "[INFO] No token refresh logic (OAuth 1.0a tokens are permanent)"
  );
  console.log("[INFO] ═══════════════════════════════════════════════════\n");

  // Verify Twitter credentials
  console.log("[INFO] Verifying Twitter credentials...");
  const isValid = await verifyCredentials();

  if (!isValid) {
    console.error("[ERROR] Failed to verify Twitter credentials");
    console.error("[ERROR] Please check your API keys and tokens in .env file");
    process.exit(1);
  }

  console.log("");

  // Start the scheduler
  startScheduler();

  // Start Express server
  app.listen(PORT, () => {
    console.log("[INFO] ═══════════════════════════════════════════════════");
    console.log(`[INFO] Express server running on port ${PORT}`);
    console.log(`[INFO] Health check: http://localhost:${PORT}/health`);
    console.log("[INFO] ═══════════════════════════════════════════════════");
    console.log("[SUCCESS] Bot is now running 24/7!");
    console.log("[INFO] Press Ctrl+C to stop\n");

    // Send Telegram notification that bot started
    notifyBotStarted();
  });
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n[INFO] Shutting down bot...");
  console.log("[INFO] Goodbye! 👋");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n[INFO] Shutting down bot...");
  console.log("[INFO] Goodbye! 👋");
  process.exit(0);
});

// Start the bot
startBot().catch((error) => {
  console.error("[ERROR] Fatal error:", error.message);
  process.exit(1);
});
