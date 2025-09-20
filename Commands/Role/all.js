const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('all')
    .setDescription('Assigns a role to all server members (with safety delay).')
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('The role to assign to all members')
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const role = interaction.options.getRole('role');

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
        content: '❌ I need the **Manage Roles** permission to assign roles.',
        ephemeral: true
      });
    }

    // Role position check
    const botHighestRole = interaction.guild.members.me.roles.highest;
    if (role.position >= botHighestRole.position) {
      return interaction.reply({
        content: '❌ I cannot assign a role that is higher than or equal to my highest role.',
        ephemeral: true
      });
    }

    // Reply initially
    await interaction.reply(`⏳ Fetching members...`);
    const members = await interaction.guild.members.fetch();
    const memberArray = [...members.values()].filter(m => !m.user.bot && !m.roles.cache.has(role.id));

    if (memberArray.length === 0) {
      return interaction.editReply('⚠️ Everyone already has that role.');
    }

    let index = 0;
    const batchSize = 5; // How many users to assign per tick
    const interval = 2000; // 2 seconds between batches

    const logMsg = await interaction.editReply(`🚀 Starting to assign **${role.name}** to ${memberArray.length} members...`);

    // Begin interval
    const intervalId = setInterval(async () => {
      if (index >= memberArray.length) {
        clearInterval(intervalId);
        client.roleAssignmentIntervals.delete(interaction.guild.id);
        return logMsg.edit({ content: `✅ Finished assigning **${role.name}** to all members.` });
      }

      for (let i = 0; i < batchSize && index < memberArray.length; i++, index++) {
        const member = memberArray[index];
        try {
          await member.roles.add(role);
        } catch (err) {
          console.warn(`❌ Failed to assign role to ${member.user.tag}:`, err.message);
        }
      }
    }, interval);

    // Store for cancellation
    client.roleAssignmentIntervals.set(interaction.guild.id, intervalId);
  }
};


/**
 * @INFO
 * Made BY PHV#3071
 * Discord Support Server: https://discord.gg/mtGUKAuRMT
 * YouTube: https://www.youtube.com/@phvdev04/videos
 * Don't steal credits or else instant copyright.
 */
