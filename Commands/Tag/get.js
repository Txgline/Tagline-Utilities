const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const tagsPath = path.join(__dirname, '../../Data/tags.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('get')
    .setDescription('Retrieve a tag by name and category.')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('The name of the tag.')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('category')
        .setDescription('The category of the tag.')
        .setRequired(true)
    ),

  async execute(interaction) {
    const name = interaction.options.getString('name').toLowerCase();
    const category = interaction.options.getString('category').toLowerCase();

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

      const tag = guildTags[name];

      if (!tag) {
        return interaction.reply({
          content: `❌ Tag \`${name}\` not found.`,
          ephemeral: true
        });
      }

      if (tag.category.toLowerCase() !== category) {
        return interaction.reply({
          content: `❌ Tag \`${name}\` does not exist under category \`${category}\`.`,
          ephemeral: true
        });
      }

      await interaction.reply(tag.content);
    } catch (err) {
      console.error('❌ Error retrieving tag:', err);
      await interaction.reply({
        content: '❌ Failed to retrieve the tag. Please try again.',
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
