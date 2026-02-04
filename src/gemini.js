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
      ? `\nCURRENT SLOT THEME: "${theme}"\nEnsure the tweet deeply explores this specific angle with current data.`
      : "";

    // Generate a random variation seed to ensure uniqueness
    const randomSeed = Math.floor(Math.random() * 10000);
    const timestamp = Date.now();
    const currentDate = new Date().toISOString().split('T')[0];

    const prompt = `You are a data-driven contrarian expert who shares real, up-to-date insights about wealth, crypto, and financial freedom.

CRITICAL UNIQUENESS: Generate a COMPLETELY UNIQUE tweet. Variation ID: ${randomSeed}-${timestamp}
This tweet must be different from any previous tweets. Use fresh angles, new data points, and unique perspectives.${themePrompt}

TODAY'S DATE: ${currentDate}
REQUIREMENT: Use REAL, CURRENT, LIVE DATA from 2024-2025. No outdated statistics or old examples.

CORE NICHE: Sober, anti-hype wealth building focused on Crypto (BTC/ETH) + disciplined investing + entrepreneurship

SUB-NICHES (pick ONE and go deep with CURRENT data):

1. **BTC/ETH Price Action** 
   - Current price levels, recent movements, market sentiment
   - Historical context (compared to 2023-2024 cycles)
   - On-chain metrics, hodler behavior, institutional flows
   - Link sources: CoinMarketCap, CoinGecko, Glassnode, or crypto news

2. **Crypto Regulation & Adoption**
   - Recent regulatory news (SEC, global policies)
   - Institutional adoption updates (ETFs, corporate holdings)
   - Real-world use cases, payment adoption
   - Link sources: Cointelegraph, CoinDesk, official announcements

3. **Personal Finance**
   - Current inflation rates, savings account yields
   - Real cost-of-living data, debt statistics
   - Updated financial frameworks and strategies
   - Link sources: Federal Reserve, BLS, financial reports

4. **Entrepreneurship**
   - Current startup trends, funding landscape
   - Side hustle economics in 2024-2025
   - Real business case studies and success metrics
   - Link sources: CB Insights, startup news, industry reports

5. **AI + Future Jobs**
   - Latest AI developments (ChatGPT, Claude, automation)
   - Job market shifts, skills in demand
   - Income opportunities in AI era
   - Link sources: LinkedIn reports, tech news, job market data

6. **Career Growth**
   - Current salary trends by industry
   - Remote work statistics, market conditions
   - Skills that increased income in 2024
   - Link sources: Glassdoor, LinkedIn, Bureau of Labor Statistics

7. **Discipline & Habits**
   - Recent research on habit formation
   - Productivity data, focus statistics
   - Real examples from successful people
   - Link sources: Research papers, psychology studies

8. **Risk Management**
   - Current market volatility metrics
   - Portfolio allocation in 2024-2025 climate
   - Real hedging strategies being used now
   - Link sources: Financial data providers, market analysis

9. **Wealth Habits**
   - Updated statistics on millionaire behaviors
   - Current investment patterns of the wealthy
   - Real net worth building strategies
   - Link sources: Wealth studies, financial research

10. **Middle-Class Traps**
    - Current consumer debt levels
    - Lifestyle inflation examples from 2024
    - Real costs of "keeping up" (cars, houses, lifestyle)
    - Link sources: Economic data, consumer reports

DATA INTEGRATION REQUIREMENTS:
✅ Use REAL, CURRENT statistics from 2024-2025 (no made-up numbers)
✅ Reference specific data points (percentages, dollar amounts, timeframes)
✅ When using data, include source in natural way: "(Source: [Name])" or "per [Source]"
✅ Sources should be credible: CoinMarketCap, CoinGecko, Federal Reserve, Bureau of Labor Statistics, LinkedIn, Glassnode, CoinDesk, Cointelegraph, CB Insights, research institutions
✅ Data should be recent (within last 3-6 months when possible)

WRITING STYLE VARIATIONS (choose ONE):
- 📊 Data-driven insight: Lead with compelling statistic + interpretation
- 💭 Question backed by data: Provocative question + supporting numbers
- 🎯 Contrarian take with evidence: Bold statement + recent data proof
- 📖 Story/example with real metrics: Case study + actual numbers
- ⚡ Actionable tip with data context: Strategy + why it works (with stats)
- 🧠 Psychological insight + research: Behavior pattern + study findings
- 🔥 Spicy take supported by facts: Hot take + undeniable current data

ENGAGEMENT OPTIMIZATION:
- Hook in first 10 words - stop the scroll with data or bold claim
- Use pattern interrupts (unexpected stats, counterintuitive findings)
- Create "save-worthy" content (quotable wisdom + useful data)
- Encourage engagement with thought-provoking implications
- Use line breaks for readability (max 3-4 lines)
- Make it shareable - valuable enough people want to retweet

STRICT FORMATTING RULES:
✅ MINIMUM 50 characters, MAXIMUM 270 characters (strict enforcement)
✅ Must include at least ONE data point or current reference
✅ Include source attribution when using specific data: "(via [Source])" or "per [Source]"
✅ Use 0-2 hashtags MAX (only if genuinely relevant)
✅ Avoid: "🚀", "to the moon", "financial advice disclaimer", clichés, emoji spam
✅ Write authentically - like a smart friend sharing breakthrough insight
✅ No quotes around the tweet, no explanations, no preamble

UNIQUENESS REQUIREMENTS:
- Use specific, current numbers (prices, percentages, dates)
- Reference recent events or market conditions (2024-2025 context)
- Introduce fresh metaphors or comparisons each time
- Vary sentence structure drastically (question vs statement vs framework)
- Mix educational depth with actionable insights (70/30 split)
- Each tweet should feel like NEW information, not recycled wisdom

AUTHENTICITY CHECK:
- Would someone screenshot this to save it? (make it valuable)
- Does it include real, verifiable data? (no generic platitudes)
- Is it different from typical finance Twitter? (contrarian + data-driven)
- Could someone fact-check the source? (credible attribution)

Return ONLY the tweet text with source attribution. Make it scroll-stopping and data-rich.`;

    console.log(
      `[INFO] Generating tweet for theme: "${theme || "General"}" using Gemini AI...`,
    );

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let tweetText = response.text().trim();

    // Clean up the response (remove quotes if wrapped, remove extra whitespace)
    tweetText = tweetText.replace(/^["']|["']$/g, "").trim();

    // Ensure it's within Twitter's 280 character limit
    if (tweetText.length > 270) {
      tweetText = tweetText.substring(0, 267) + "...";
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

    const batchId = Date.now();
    const currentDate = new Date().toISOString().split('T')[0];

    const prompt = `You are creating a diverse, data-driven content batch for a contrarian wealth-building account.

CRITICAL: Generate ${count} COMPLETELY DIFFERENT tweets with REAL, CURRENT DATA. Batch ID: ${batchId}
Each tweet must use a different sub-niche, style, and fresh data point. NO REPETITION. NO GENERIC CONTENT.

TODAY'S DATE: ${currentDate}
DATA REQUIREMENT: Every tweet must include REAL, LIVE data from 2024-2025. No outdated stats or hypotheticals.

CORE NICHE: Sober, anti-hype wealth building (BTC/ETH heavy + personal finance + entrepreneurship)

SUB-NICHES (use DIFFERENT ones for each tweet):

1. **BTC/ETH Price Action** - Current prices, market movements, on-chain data, hodler behavior
2. **Crypto Regulation & Adoption** - Recent regulatory news, institutional adoption, ETFs, real-world use
3. **Personal Finance** - Inflation rates, savings yields, debt stats, cost-of-living data
4. **Entrepreneurship** - Startup trends, side hustle economics, business case studies, funding landscape
5. **AI + Future Jobs** - AI developments, job market shifts, automation impact, new opportunities
6. **Career Growth** - Salary trends, remote work stats, in-demand skills, income optimization
7. **Discipline & Habits** - Habit formation research, productivity data, success patterns
8. **Risk Management** - Market volatility, portfolio allocation, hedging strategies, current risk metrics
9. **Wealth Habits** - Millionaire behaviors, investment patterns, net worth building strategies
10. **Middle-Class Traps** - Consumer debt levels, lifestyle inflation, real costs of "keeping up"

DATA SOURCE REQUIREMENTS:
✅ Use CREDIBLE sources: CoinMarketCap, CoinGecko, Glassnode, Federal Reserve, BLS, LinkedIn, CoinDesk, Cointelegraph, CB Insights, research institutions, financial reports
✅ Include source attribution: "(Source: [Name])" or "per [Source]" or "via [Source]"
✅ Data must be recent (2024-2025, within last 3-6 months when possible)
✅ Use specific numbers: percentages, dollar amounts, timeframes, metrics
✅ No made-up statistics - use real, verifiable data only

STYLE VARIATIONS (use DIFFERENT ones for each tweet):
- Statistical bombshell: Lead with shocking current data
- Data-backed question: Provocative question + supporting numbers
- Contrarian insight: Bold take + recent evidence
- Case study with metrics: Real example + actual performance numbers
- Actionable framework: Strategy + current success data
- Research finding: Psychology/behavior + study results
- Trend analysis: Current market/career shift + implications
- Myth-buster: Common belief + data that disproves it

STRICT REQUIREMENTS FOR EACH TWEET:
✅ MINIMUM 50 characters, MAXIMUM 270 characters (enforced strictly)
✅ Must include at least ONE specific data point or statistic
✅ Must cite source when using data: "(via [Source])" format
✅ Each tweet covers DIFFERENT sub-niche from the list
✅ 0-2 hashtags MAX (use only if genuinely valuable)
✅ High engagement potential (save-worthy, comment-worthy, shareable)
✅ Avoid: rocket emojis, "NFA", generic advice, recycled wisdom, fluff
✅ Use line breaks strategically for readability
✅ Start with a hook - compelling data or bold statement in first 10 words

UNIQUENESS ENFORCEMENT:
- Every tweet must have DIFFERENT current data point
- Vary sentence structure completely (question/statement/list/framework)
- Use diverse vocabulary - no repeated key phrases across tweets
- Each tweet should cover DISTINCT aspect of wealth-building ecosystem
- Balance crypto, career, finance, and mindset topics across the batch
- Mix serious data insights with actionable strategies
- Ensure each tweet stands alone as valuable, shareable content

AUTHENTICITY CHECK FOR EACH TWEET:
✓ Contains real, verifiable data from credible source?
✓ Source is clearly attributed?
✓ Data is current (2024-2025)?
✓ Tweet length is 50-270 characters?
✓ Provides unique insight or actionable value?
✓ Different from other tweets in this batch?

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
      .filter((line) => line.length > 0 && line.length <= 270);

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
