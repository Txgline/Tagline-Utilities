const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rolename')
    .setDescription('Change the name of a specified role.')
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('The role you want to rename')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('new_name')
        .setDescription('The new name for the role')
        .setRequired(true))
    .setDMPermission(false),

  async execute(interaction) {
    const role = interaction.options.getRole('role');
    const newName = interaction.options.getString('new_name');

    // Permission check
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return interaction.reply({ content: '❌ You do not have permission to manage roles.', ephemeral: true });
    }

    // Bot permission check
    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return interaction.reply({ content: '❌ I do not have permission to manage roles.', ephemeral: true });
    }

    // Role position check
    const botHighest = interaction.guild.members.me.roles.highest.position;
    const rolePosition = role.position;

    if (rolePosition >= botHighest) {
      return interaction.reply({ content: '❌ I cannot rename that role because it is higher or equal to my highest role.', ephemeral: true });
    }

    try {
      const oldName = role.name;
      await role.setName(newName);

      await interaction.reply({
        content: `✅ Renamed role **${oldName}** to **${newName}** successfully.`
      });
    } catch (err) {
      console.error(err);
      interaction.reply({ content: '❌ Failed to rename the role. Make sure I have the correct permissions.', ephemeral: true });
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
