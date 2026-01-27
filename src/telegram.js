/**
 * Telegram Notification Service
 * Sends notifications when tweets are posted
 */

import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const ACCOUNT_NAME = process.env.ACCOUNT_NAME || "Twitter Bot";

/**
 * Send a notification to Telegram
 * @param {string} message - Message to send
 * @returns {Promise<boolean>} Success status
 */
export async function sendTelegramNotification(message) {
  // Skip if Telegram is not configured
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log("[INFO] Telegram notifications not configured (skipping)");
    return false;
  }

  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: "HTML",
    });

    console.log("[SUCCESS] Telegram notification sent!");
    return true;
  } catch (error) {
    console.error(
      "[ERROR] Failed to send Telegram notification:",
      error.message
    );
    return false;
  }
}

/**
 * Send tweet posted notification
 * @param {string} tweetText - The tweet content
 * @param {string} tweetId - The tweet ID
 */
export async function notifyTweetPosted(tweetText, tweetId) {
  const timestamp = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const tweetUrl = tweetId
    ? `https://twitter.com/i/web/status/${tweetId}`
    : "N/A";

  const message = `
🐦 <b>Tweet Posted Successfully!</b>
📱 <b>On Account:</b> ${ACCOUNT_NAME}

📝 <b>Content:</b>
${tweetText}

🔗 <b>Link:</b> ${tweetUrl}

⏰ <b>Time:</b> ${timestamp}

✅ <b>Status:</b> Live on X
  `.trim();

  await sendTelegramNotification(message);
}

/**
 * Send error notification
 * @param {string} errorMessage - Error details
 */
export async function notifyError(errorMessage) {
  const timestamp = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const message = `
❌ <b>Tweet Posting Failed</b>
📱 <b>Account:</b> ${ACCOUNT_NAME}

⚠️ <b>Error:</b>
${errorMessage}

⏰ <b>Time:</b> ${timestamp}

💡 <b>Action:</b> Check bot logs for details
  `.trim();

  await sendTelegramNotification(message);
}

/**
 * Send bot started notification
 */
export async function notifyBotStarted() {
  const timestamp = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const message = `
 <b>X Automation Bot Started</b>
 <b>Account:</b> ${ACCOUNT_NAME}

 <b>Status:</b> Running
 <b>Started at:</b> ${timestamp}
 <b>Auth:</b> OAuth 1.0a

 <b>Schedule:</b>
• 08:00 AM
• 10:30 AM
• 12:00 PM
• 02:30 PM
• 04:00 PM
• 06:30 PM
• 08:00 PM
• 09:30 PM

🔔 You'll receive notifications for each tweet posted!
  `.trim();

  await sendTelegramNotification(message);
}
