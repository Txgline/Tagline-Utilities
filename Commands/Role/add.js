const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add')
    .setDescription('Adds a role to a user.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to add the role to.')
        .setRequired(true)
    )
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('The role to assign.')
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getMember('user');
    const role = interaction.options.getRole('role');

    // Check permissions
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return interaction.reply({
        content: '❌ You need the **Manage Roles** permission to use this command.',
        ephemeral: true,
      });
    }

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return interaction.reply({
        content: '❌ I don’t have permission to manage roles.',
        ephemeral: true,
      });
    }

    if (!user || !role) {
      return interaction.reply({
        content: '❌ Invalid user or role specified.',
        ephemeral: true,
      });
    }

    if (interaction.guild.members.me.roles.highest.position <= role.position) {
      return interaction.reply({
        content: '❌ I cannot assign that role because it is higher than my highest role.',
        ephemeral: true,
      });
    }

    if (interaction.member.roles.highest.position <= role.position && interaction.user.id !== interaction.guild.ownerId) {
      return interaction.reply({
        content: '❌ You cannot assign a role higher or equal to your highest role.',
        ephemeral: true,
      });
    }

    if (user.roles.cache.has(role.id)) {
      return interaction.reply({
        content: `⚠️ ${user.user.tag} already has the ${role.name} role.`,
        ephemeral: true,
      });
    }

    try {
      await user.roles.add(role);
      return interaction.reply({
        content: `✅ Added **${role.name}** to **${user.user.tag}**.`,
        ephemeral: false,
      });
    } catch (err) {
      console.error('Role Add Error:', err);
      return interaction.reply({
        content: '❌ An error occurred while assigning the role.',
        ephemeral: true,
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
