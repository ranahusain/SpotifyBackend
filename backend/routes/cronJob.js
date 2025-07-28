const cron = require("node-cron");
const User = require("../models/UsersModel");

// Runs every night at 2am
cron.schedule("* 2 * * *", async () => {
  try {
    console.log("⏰ Checking expired premium users...");

    const users = await User.find({ isPremium: true });

    const now = new Date();
    for (let user of users) {
      if (!user.premiumSince) continue;

      const diffInMs = now - new Date(user.premiumSince);
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

      if (diffInDays > 7) {
        user.isPremium = false;
        user.premiumSince = null;
        await user.save();
        console.log(`⚠️ Premium expired for user: ${user.email}`);
      }
    }

    console.log("✅ Expiration check done.");
  } catch (err) {
    console.error("❌ Cron job failed:", err);
  }
});
