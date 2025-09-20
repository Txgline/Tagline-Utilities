const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bots')
    .setDescription('Adds or removes a role from all bots in the server.')
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('The role to add/remove from all bots')
        .setRequired(true)
    )
    .addBooleanOption(option =>
      option.setName('remove')
        .setDescription('Remove the role instead of adding it')
        .setRequired(false)
    ),

  async execute(interaction) {
    const role = interaction.options.getRole('role');
    const remove = interaction.options.getBoolean('remove') || false;

    // Permissions check
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return interaction.reply({
        content: '❌ You need the **Manage Roles** permission to use this command.',
        ephemeral: true
      });
    }

    // Bot permissions check
    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return interaction.reply({
        content: '❌ I need the **Manage Roles** permission to manage roles.',
        ephemeral: true
      });
    }

    // Role position check
    const botHighestRole = interaction.guild.members.me.roles.highest;
    if (role.position >= botHighestRole.position) {
      return interaction.reply({
        content: '❌ I cannot manage a role that is higher than or equal to my highest role.',
        ephemeral: true
      });
    }

    await interaction.deferReply();

    const members = await interaction.guild.members.fetch();
    const bots = members.filter(m => m.user.bot);

    let processed = 0;
    for (const [, bot] of bots) {
      try {
        if (remove) {
          if (bot.roles.cache.has(role.id)) {
            await bot.roles.remove(role);
            processed++;
          }
        } else {
          if (!bot.roles.cache.has(role.id)) {
            await bot.roles.add(role);
            processed++;
          }
        }
      } catch (err) {
        console.warn(`⚠️ Could not modify role for ${bot.user.tag}:`, err.message);
      }
    }

    const action = remove ? 'removed from' : 'added to';
    await interaction.editReply(`✅ Role **${role.name}** has been ${action} **${processed}** bots.`);
  }
};


/**
 * @INFO
 * Made BY PHV#3071
 * Discord Support Server: https://discord.gg/mtGUKAuRMT
 * YouTube: https://www.youtube.com/@phvdev04/videos
 * Don't steal credits or else instant copyright.
 */
