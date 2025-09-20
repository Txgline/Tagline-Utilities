const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const tagsPath = path.join(__dirname, '../../Data/tags.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('categories')
    .setDescription('List all available tag categories.'),

  async execute(interaction) {
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

      if (!guildTags || Object.keys(guildTags).length === 0) {
        return interaction.reply({
          content: '❌ No tags found in this server.',
          ephemeral: true
        });
      }

      // Collect unique categories
      const categories = new Set();
      for (const tag of Object.values(guildTags)) {
        categories.add(tag.category || 'uncategorized');
      }

      const categoryList = Array.from(categories)
        .map(c => `• \`${c}\``)
        .join('\n');

      const embed = new EmbedBuilder()
        .setTitle('📂 Available Tag Categories')
        .setDescription(categoryList)
        .setFooter({ text: 'Use /tag [category name] [tag name] to show a tag' })
        .setColor('Blurple');

      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.error('❌ Error listing tag categories:', err);
      await interaction.reply({
        content: '❌ Failed to fetch tag categories. Please try again later.',
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
