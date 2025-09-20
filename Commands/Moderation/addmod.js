const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addmod')
    .setDescription('Assigns basic moderator permissions to a role.')
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('Select the role to grant moderator permissions to')
        .setRequired(true)
    ),

  async execute(interaction) {
    const role = interaction.options.getRole('role');

    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({
        content: '❌ You need **Administrator** permission to use this command.',
        ephemeral: true
      });
    }

   
    const modPermissions = [
      PermissionFlagsBits.KickMembers,
      PermissionFlagsBits.ManageMessages,
      PermissionFlagsBits.ManageChannels,
      PermissionFlagsBits.ModerateMembers,
      PermissionFlagsBits.ManageThreads,
    ];

    try {
      await role.setPermissions(modPermissions);

      return interaction.reply({
        content: `✅ Successfully assigned **moderator permissions** to the role **${role.name}**.`,
        ephemeral: false
      });
    } catch (error) {
      console.error(error);
      return interaction.reply({
        content: '❌ Failed to assign permissions. Make sure my role is above the role you are modifying.',
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
