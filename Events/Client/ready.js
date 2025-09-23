const { ActivityType, Events } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`[Discord] Logged in as ${client.user.tag}`);

    client.user.setPresence({
      activities: [
        {
          name: "Tagline Club | dsc.gg/txgclub",
          type: ActivityType.Watching, // ✅ Updated for v14
          url: "https://www.twitch.tv/txgline", // Must be a valid Twitch/YouTube link
        },
      ],
      status: "dnd",
    });
  },
};
