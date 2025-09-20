const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const warnsPath = path.join(__dirname, '../../Data/warns.json');

function loadWarns() {
  if (!fs.existsSync(warnsPath)) return {};
  return JSON.parse(fs.readFileSync(warnsPath, 'utf8'));
}

function saveWarns(data) {
  fs.writeFileSync(warnsPath, JSON.stringify(data, null, 2));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clearwarns')
    .setDescription('Clear all warnings for a user.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to clear warnings for')
        .setRequired(true)
    ),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return interaction.reply({
        content: '❌ You do not have permission to use this command. (`Moderate Members` required)',
        ephemeral: true
      });
    }

    const user = interaction.options.getUser('user');
    const warns = loadWarns();
    const guildId = interaction.guild.id;

    if (!warns[guildId] || !warns[guildId][user.id] || warns[guildId][user.id].length === 0) {
      return interaction.reply({ content: `✅ ${user.tag} has no warnings to clear.`, ephemeral: true });
    }

    delete warns[guildId][user.id];
    saveWarns(warns);

    await interaction.reply({
      content: `✅ Cleared all warnings for ${user.tag}.`
    });
  }
};


/**
 * @INFO
 * Made BY PHV#3071
 * Discord Support Server: https://discord.gg/mtGUKAuRMT
 * YouTube: https://www.youtube.com/@phvdev04/videos
 * Don't steal credits or else instant copyright.
 */
