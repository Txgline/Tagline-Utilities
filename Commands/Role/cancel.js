const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cancel')
    .setDescription('Cancels the ongoing role assignment process (if any).'),

  async execute(interaction, client) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return interaction.reply({
        content: '❌ You need the **Manage Roles** permission to use this command.',
        ephemeral: true,
      });
    }

    const intervalId = client.roleAssignmentIntervals.get(interaction.guild.id);

    if (!intervalId) {
      return interaction.reply({
        content: '⚠️ No ongoing role assignment found in this server.',
        ephemeral: true,
      });
    }

    clearInterval(intervalId);
    client.roleAssignmentIntervals.delete(interaction.guild.id);

    return interaction.reply('✅ The role assignment process has been **cancelled**.');
  }
};


/**
 * @INFO
 * Made BY PHV#3071
 * Discord Support Server: https://discord.gg/mtGUKAuRMT
 * YouTube: https://www.youtube.com/@phvdev04/videos
 * Don't steal credits or else instant copyright.
 */
