const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Removes a role from a user.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to remove the role from')
        .setRequired(true))
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('The role to remove')
        .setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getMember('user');
    const role = interaction.options.getRole('role');

    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return interaction.reply({ content: '❌ You need the **Manage Roles** permission.', ephemeral: true });
    }

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return interaction.reply({ content: '❌ I need the **Manage Roles** permission to remove roles.', ephemeral: true });
    }

    if (role.position >= interaction.guild.members.me.roles.highest.position) {
      return interaction.reply({ content: '❌ That role is higher than my highest role, I can’t remove it.', ephemeral: true });
    }

    if (!user.roles.cache.has(role.id)) {
      return interaction.reply({ content: `❌ <@${user.id}> does not have the **${role.name}** role.`, ephemeral: true });
    }

    try {
      await user.roles.remove(role);
      await interaction.reply({ content: `✅ Removed role **${role.name}** from <@${user.id}>.` });
    } catch (error) {
      console.error('Error removing role:', error);
      await interaction.reply({ content: '❌ Failed to remove the role. Do I have the correct permissions?', ephemeral: true });
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
