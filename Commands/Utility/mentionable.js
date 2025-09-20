const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mentionable')
    .setDescription('Makes a role mentionable or unmentionable.')
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('The role you want to modify')
        .setRequired(true))
    .addBooleanOption(option =>
      option.setName('status')
        .setDescription('True to make it mentionable, false to disable mention')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageRoles)
    .setDMPermission(false),

  async execute(interaction) {
    const role = interaction.options.getRole('role');
    const status = interaction.options.getBoolean('status');

    if (role.managed) {
      return interaction.reply({ content: '❌ You cannot modify a managed role (like bot roles).', ephemeral: true });
    }

    try {
      await role.setMentionable(status, `Changed by ${interaction.user.tag}`);
      return interaction.reply({
        content: `✅ Role **${role.name}** is now ${status ? 'mentionable' : 'unmentionable'}.`
      });
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: '❌ Failed to update role. Make sure my role is higher than the target role.', ephemeral: true });
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
