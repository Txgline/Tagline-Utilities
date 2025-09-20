const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const tagsPath = path.join(__dirname, '../../Data/tags.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('raw')
    .setDescription('Get the raw content of a tag for copying or editing.')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('The name of the tag.')
        .setRequired(true)
    ),

  async execute(interaction) {
    const name = interaction.options.getString('name').toLowerCase();

    try {
      if (!fs.existsSync(tagsPath)) {
        return interaction.reply({
          content: '❌ No tags have been created yet.',
          ephemeral: true
        });
      }

      const dbRaw = fs.readFileSync(tagsPath, 'utf8') || '{}';
      const db = JSON.parse(dbRaw);
      const guildTags = db[interaction.guild.id];

      if (!guildTags || !guildTags[name]) {
        return interaction.reply({
          content: `❌ Tag \`${name}\` not found in this server.`,
          ephemeral: true
        });
      }

      const tagContent = guildTags[name].content;

      await interaction.reply({
        content: `📝 **Raw content of \`${name}\`:**\n\`\`\`\n${tagContent}\n\`\`\``,
        ephemeral: true
      });
    } catch (err) {
      console.error('❌ Error fetching raw tag:', err);
      await interaction.reply({
        content: '❌ Failed to fetch the raw tag. Please try again later.',
        ephemeral: true
      });
    }
  }
};


/**
 * @INFO
 * Made BY PHV#3071
 * Discord Support Server: https://discord.gg/mtGUKAuRMT
 * YouTube: https://www.youtube.com/@phvdev04/videos
 * Don't steal credits or else instant copyright.
 */
