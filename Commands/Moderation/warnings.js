const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const warnsPath = path.join(__dirname, '../../Data/warns.json');

function loadWarns() {
  if (!fs.existsSync(warnsPath)) return {};
  return JSON.parse(fs.readFileSync(warnsPath, 'utf8'));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('Shows all warnings for a user.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to view warnings for')
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
      return interaction.reply({ content: `✅ ${user.tag} has no warnings in this server.`, ephemeral: true });
    }

    const userWarnings = warns[guildId][user.id];
    const warningList = userWarnings
      .map((warn, index) =>
        `**${index + 1}.** Reason: \`${warn.reason}\`\n👮 Moderator: <@${warn.moderator}> • 🕒 <t:${Math.floor(new Date(warn.date).getTime() / 1000)}:R>`
      )
      .join('\n\n');

    await interaction.reply({
      embeds: [
        {
          title: `⚠️ Warnings for ${user.tag}`,
          description: warningList,
          color: 0xFFCC00,
          footer: {
            text: `Total Warnings: ${userWarnings.length}`
          }
        }
      ]
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
