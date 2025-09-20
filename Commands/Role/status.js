const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const intervalStore = new Map(); // Store the interval tasks if running

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Check the current role assignment status or roles of a user.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to check role assignments for')
        .setRequired(false)),

  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user; // Check for a specified user or the command user
    const member = await interaction.guild.members.fetch(user.id);

    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return interaction.reply({ content: '❌ You need the **Manage Roles** permission to use this command.', ephemeral: true });
    }

    // Check if there is a role assignment in progress
    if (intervalStore.has(interaction.guild.id)) {
      return interaction.reply({ content: '⚠️ There is a role assignment process currently in progress. Please wait until it completes.', ephemeral: true });
    }

    const roles = member.roles.cache.map(role => role.name).join(', ') || 'No roles assigned.';

    await interaction.reply({
      content: `🔍 **Role Status for ${user.tag}:**\nRoles: ${roles}`,
      ephemeral: true,
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
