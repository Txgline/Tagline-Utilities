const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const intervalStore = new Map(); // To allow cancellation or prevent overlap

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removeall')
    .setDescription('Removes a role from all members of the server.')
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('The role to remove')
        .setRequired(true)),

  async execute(interaction) {
    const role = interaction.options.getRole('role');

    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return interaction.reply({ content: '❌ You need the **Manage Roles** permission.', ephemeral: true });
    }

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return interaction.reply({ content: '❌ I need the **Manage Roles** permission to do that.', ephemeral: true });
    }

    if (role.position >= interaction.guild.members.me.roles.highest.position) {
      return interaction.reply({ content: '❌ That role is higher than my highest role, I can’t remove it.', ephemeral: true });
    }

    const membersWithRole = role.members;
    if (!membersWithRole.size) {
      return interaction.reply({ content: `❌ No one in the server currently has the **${role.name}** role.`, ephemeral: true });
    }

    await interaction.reply({
      content: `⚙️ Removing **${role.name}** from ${membersWithRole.size} members... This may take a while.`,
      ephemeral: false,
    });

    const members = [...membersWithRole.values()];
    let index = 0;
    const batchSize = 5; // Number of members to process per interval
    const delay = 3000; // Interval in milliseconds (3 seconds)

    const interval = setInterval(async () => {
      const batch = members.slice(index, index + batchSize);
      index += batchSize;

      for (const member of batch) {
        try {
          await member.roles.remove(role);
        } catch (err) {
          console.warn(`Failed to remove role from ${member.user.tag}:`, err.message);
        }
      }

      if (index >= members.length) {
        clearInterval(interval);
        intervalStore.delete(interaction.guild.id);
        await interaction.followUp(`✅ Finished removing **${role.name}** from all applicable members.`);
      }
    }, delay);

    intervalStore.set(interaction.guild.id, interval);
  }
};


/**
 * @INFO
 * Made BY PHV#3071
 * Discord Support Server: https://discord.gg/mtGUKAuRMT
 * YouTube: https://www.youtube.com/@phvdev04/videos
 * Don't steal credits or else instant copyright.
 */
