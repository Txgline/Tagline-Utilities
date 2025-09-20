const { Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

const tagsPath = path.join(__dirname, '../../Data/tags.json');
if (!fs.existsSync(tagsPath)) fs.writeFileSync(tagsPath, JSON.stringify({}));

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return;
    if (!message.guild) return;

    const prefix = '!tag ';
    if (!message.content.toLowerCase().startsWith(prefix)) return;

    const tagName = message.content.slice(prefix.length).trim().toLowerCase();
    if (!tagName) return;

    const db = JSON.parse(fs.readFileSync(tagsPath, 'utf8'));
    const guildTags = db[message.guild.id];

    if (!guildTags || !guildTags[tagName]) {
      return message.reply(`❌ Tag \`${tagName}\` not found.`);
    }

    await message.channel.send(guildTags[tagName]);
  }
};
