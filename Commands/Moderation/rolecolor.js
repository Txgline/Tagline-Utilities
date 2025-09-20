const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

const predefinedColors = {
  Red: '#ff0000',
  Blue: '#3498db',
  Green: '#2ecc71',
  Yellow: '#f1c40f',
  Purple: '#9b59b6',
  Orange: '#e67e22',
  Pink: '#ff69b4',
  Cyan: '#00ffff',
  White: '#ffffff',
  Black: '#000000'
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rolecolor')
    .setDescription('Change the color of a selected role.')
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('The role you want to change color of')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('color')
        .setDescription('Choose a color')
        .setRequired(true)
        .addChoices(
          ...Object.entries(predefinedColors).map(([name, hex]) => ({ name, value: hex }))
        ))
    .setDMPermission(false),

  async execute(interaction) {
    const role = interaction.options.getRole('role');
    const selectedColor = interaction.options.getString('color');

    // Permission checks
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return interaction.reply({ content: '❌ You need the **Manage Roles** permission to use this command.', ephemeral: true });
    }

    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return interaction.reply({ content: '❌ I do not have permission to manage roles!', ephemeral: true });
    }

    if (role.position >= interaction.guild.members.me.roles.highest.position) {
      return interaction.reply({ content: '❌ I cannot edit this role because it is higher than or equal to my highest role.', ephemeral: true });
    }

    try {
      await role.setColor(selectedColor, `Changed by ${interaction.user.tag}`);
      await interaction.reply({ content: `✅ The color of the role **${role.name}** has been changed to **${selectedColor}**.` });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ Failed to change the role color. Please check permissions or role hierarchy.', ephemeral: true });
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
