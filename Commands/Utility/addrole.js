const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addrole')
    .setDescription('Create a new role in the server')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('Name of the role')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('color')
        .setDescription('Color of the role (e.g., Blue, Red, or HEX like #00FF00)')
        .setRequired(true)
    )
    .addBooleanOption(option =>
      option.setName('hoist')
        .setDescription('Display this role separately from others?')
        .setRequired(true)
    ),

  async execute(interaction) {
    // Check user permission
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return interaction.reply({
        content: '❌ You need the **Manage Roles** permission to use this command.',
        ephemeral: true
      });
    }

    const name = interaction.options.getString('name');
    const color = interaction.options.getString('color');
    const hoist = interaction.options.getBoolean('hoist');

    try {
      const role = await interaction.guild.roles.create({
        name,
        color,
        hoist,
        reason: `Role created by ${interaction.user.tag}`
      });

      await interaction.reply({
        content: `✅ Role **${role.name}** created successfully with color \`${color}\` and hoist set to \`${hoist}\`.`,
        ephemeral: true
      });
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: '❌ Failed to create the role. Make sure the color is valid and I have permission to manage roles.',
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
