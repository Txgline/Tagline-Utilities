const { Events, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const slowmodePath = path.join(__dirname, '../../Data/slowmode.json');
if (!fs.existsSync(slowmodePath)) fs.writeFileSync(slowmodePath, JSON.stringify({}));

// In-memory tracker for last message timestamps
const lastMessageTimestamps = new Map();

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return;
    if (!message.guild) return;

    const db = JSON.parse(fs.readFileSync(slowmodePath, 'utf8'));
    const guildData = db[message.guild.id];
    if (!guildData) return;

    const userData = guildData[message.author.id];
    if (!userData) return;

    const duration = userData[message.channel.id];
    if (!duration) return;

    const key = `${message.guild.id}-${message.channel.id}-${message.author.id}`;
    const now = Date.now();
    const lastTime = lastMessageTimestamps.get(key) || 0;

    if (now - lastTime < duration * 1000) {
      try {
        await message.delete();
        // Optional: warn the user
        await message.channel.send({
          content: `<@${message.author.id}> you're in slowmode! Please wait ${duration} seconds between messages.`,
          allowedMentions: { users: [message.author.id] }
        }).then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000)); // auto-delete warn
      } catch (err) {
        console.error('Failed to delete message or warn user:', err);
      }
    } else {
      lastMessageTimestamps.set(key, now);
    }
  }
};
