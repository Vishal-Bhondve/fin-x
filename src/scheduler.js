/**
 * Tweet Scheduler
 * Schedules automated tweet posting using node-cron
 */

import cron from "node-cron";
import { postTweet } from "./twitter.js";
import { getRandomTweet } from "./tweets.js";

/**
 * Schedule configuration for Asia/Kolkata timezone
 * 8 tweets per day optimized for maximum engagement
 */
const SCHEDULE = [
  {
    time: "0 7 * * *",
    label: "07:00 AM",
    theme: "Morning Mindset/Market Opener",
  },
  { time: "0 8 * * *", label: "08:00 AM", theme: "Core Investing Tip" },
  { time: "0 9 * * *", label: "09:00 AM", theme: "High-Engagement Window" },
  {
    time: "0 10 * * *",
    label: "10:00 AM",
    theme: "Thread Starter/Deep Insight",
  },
  { time: "0 13 * * *", label: "01:00 PM", theme: "Lunch-break Hit" },
  { time: "0 15 * * *", label: "03:00 PM", theme: "Afternoon Refresh" },
  { time: "30 17 * * *", label: "05:30 PM", theme: "Post-work Motivation" },
  { time: "0 19 * * *", label: "07:00 PM", theme: "Evening Closer" },
];

const TIMEZONE = "Asia/Kolkata";

/**
 * Get random delay between 1-5 minutes in milliseconds
 * @returns {number} Random delay in ms
 */
function getRandomDelay() {
  const minDelay = 1 * 60 * 1000; // 1 minute
  const maxDelay = 5 * 60 * 1000; // 5 minutes
  return Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
}

/**
 * Post a tweet with random delay
 * @param {string} theme - The theme for the tweet
 */
async function scheduledTweetPost(theme) {
  const delay = getRandomDelay();
  const delayMinutes = Math.round(delay / 1000 / 60);

  console.log(
    `[INFO] Cron job triggered for theme: "${theme}". Waiting ${delayMinutes} minute(s) before posting...`,
  );

  setTimeout(async () => {
    try {
      const tweetText = await getRandomTweet(theme);
      await postTweet(tweetText);
    } catch (error) {
      console.error("[ERROR] Scheduled tweet failed:", error.message);
    }
  }, delay);
}

/**
 * Initialize and start all cron jobs
 */
export function startScheduler() {
  console.log("\n[INFO] ═══════════════════════════════════════════════════");
  console.log("[INFO] Starting Tweet Scheduler");
  console.log("[INFO] ═══════════════════════════════════════════════════");
  console.log(`[INFO] Timezone: ${TIMEZONE}`);
  console.log("[INFO] Posting Schedule:");

  SCHEDULE.forEach(({ time, label, theme }) => {
    console.log(`[INFO]   • ${label} (${time}) - ${theme}`);

    // Schedule the cron job
    cron.schedule(time, () => scheduledTweetPost(theme), {
      scheduled: true,
      timezone: TIMEZONE,
    });
  });

  console.log("[INFO] Random delay: 1-5 minutes before each post");
  console.log("[INFO] ═══════════════════════════════════════════════════");
  console.log("[SUCCESS] Scheduler started successfully!\n");
}
