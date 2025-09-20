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
    .setName('delwarn')
    .setDescription('Delete a specific warning from a user.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to delete the warning from')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('index')
        .setDescription('Warning number to delete (starting from 1)')
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
    const index = interaction.options.getInteger('index') - 1;
    const guildId = interaction.guild.id;

    const warns = loadWarns();

    if (!warns[guildId] || !warns[guildId][user.id] || warns[guildId][user.id].length === 0) {
      return interaction.reply({ content: `❌ ${user.tag} has no warnings.`, ephemeral: true });
    }

    if (index < 0 || index >= warns[guildId][user.id].length) {
      return interaction.reply({ content: `❌ Invalid warning number.`, ephemeral: true });
    }

    const removed = warns[guildId][user.id].splice(index, 1);
    if (warns[guildId][user.id].length === 0) {
      delete warns[guildId][user.id];
    }

    saveWarns(warns);

    await interaction.reply({
      content: `✅ Deleted warning #${index + 1} from ${user.tag}.\nReason was: \`${removed[0]}\``
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
