const { ActivityType } = require("discord.js");

module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.log(`[Discord] Logged in as ${client.user.tag}`);

    client.user.setPresence({
      activities: [
        {
          name: "Tagline Club | dsc.gg/txgclub",
          type: ActivityType.Streaming, // ✅ Updated for v14
          url: "https://www.twitch.tv/txgline", // Must be a valid Twitch/YouTube link
        },
      ],
      status: "dnd",
    });
  },
};
