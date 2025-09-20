const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const tagsPath = path.join(__dirname, '../../Data/tags.json');

if (!fs.existsSync(tagsPath)) {
  console.log('✅ tags.json not found, creating...');
  fs.writeFileSync(tagsPath, JSON.stringify({}));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('create')
    .setDescription('Create a custom tag.')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('The name of the tag.')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('content')
        .setDescription('The content of the tag.')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('category')
        .setDescription('The category of the tag (optional).')
        .setRequired(false)
    ),

  async execute(interaction) {
    console.log('🔧 Tag create command executed.');

    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      console.log('⚠️ User lacks Manage Messages permission.');
      return interaction.reply({
        content: '❌ You need **Manage Messages** permission to create tags.',
        ephemeral: true
      });
    }

    const name = interaction.options.getString('name').toLowerCase();
    const content = interaction.options.getString('content');
    const category = interaction.options.getString('category') || 'uncategorized';

    console.log(`📦 Trying to create tag: ${name} under category: ${category}`);

    try {
      const dbRaw = fs.readFileSync(tagsPath, 'utf8') || '{}';
      const db = JSON.parse(dbRaw);

      if (!db[interaction.guild.id]) db[interaction.guild.id] = {};

      if (db[interaction.guild.id][name]) {
        console.log('⚠️ Tag already exists.');
        return interaction.reply({
          content: `⚠️ A tag with the name \`${name}\` already exists.`,
          ephemeral: true
        });
      }

      db[interaction.guild.id][name] = {
        content,
        category
      };

      fs.writeFileSync(tagsPath, JSON.stringify(db, null, 2));

      console.log(`✅ Tag ${name} saved successfully.`);
      await interaction.reply({
        content: `✅ Tag \`${name}\` created successfully in category \`${category}\`!`,
        ephemeral: true
      });
    } catch (err) {
      console.error('❌ Error saving tag:', err);
      await interaction.reply({
        content: '❌ Failed to save the tag. Please try again.',
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
