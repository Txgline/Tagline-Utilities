const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('toggle')
    .setDescription('Toggles a role for a user.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to toggle the role for')
        .setRequired(true))
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('The role to toggle')
        .setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const role = interaction.options.getRole('role');
    const member = await interaction.guild.members.fetch(user.id);

    // Check for required permission
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return interaction.reply({ content: '❌ You need the **Manage Roles** permission to use this command.', ephemeral: true });
    }

    // Ensure the bot has higher role than the one it's trying to assign/remove
    if (interaction.guild.me.roles.highest.position <= role.position) {
      return interaction.reply({ content: '❌ I cannot manage roles higher or equal to my own role!', ephemeral: true });
    }

    try {
      // Toggle role
      if (member.roles.cache.has(role.id)) {
        await member.roles.remove(role);
        return interaction.reply({ content: `✅ Removed the **${role.name}** role from ${user.tag}.`, ephemeral: true });
      } else {
        await member.roles.add(role);
        return interaction.reply({ content: `✅ Added the **${role.name}** role to ${user.tag}.`, ephemeral: true });
      }
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: '❌ There was an error while trying to toggle the role.', ephemeral: true });
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
