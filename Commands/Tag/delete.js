const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const tagsPath = path.join(__dirname, '../../Data/tags.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('delete')
    .setDescription('Delete a tag by name.')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('The name of the tag to delete.')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages), // Only allow users with Manage Messages

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

      // Delete the tag
      delete guildTags[name];

      // If no tags left for the guild, remove the guild entry
      if (Object.keys(guildTags).length === 0) {
        delete db[interaction.guild.id];
      } else {
        db[interaction.guild.id] = guildTags;
      }

      fs.writeFileSync(tagsPath, JSON.stringify(db, null, 2));

      await interaction.reply(`✅ Tag \`${name}\` has been deleted.`);
    } catch (err) {
      console.error('❌ Error deleting tag:', err);
      await interaction.reply({
        content: '❌ Failed to delete the tag. Please try again later.',
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
