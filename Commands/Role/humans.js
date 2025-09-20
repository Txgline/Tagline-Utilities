const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

let roleAssignInProgress = {};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('humans')
    .setDescription('Assigns a role to all human (non-bot) members in the server.')
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('The role to assign to all human members')
        .setRequired(true)
    ),

  async execute(interaction) {
    const role = interaction.options.getRole('role');
    const guildId = interaction.guild.id;

    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return interaction.reply({ content: '❌ You need the **Manage Roles** permission.', ephemeral: true });
    }

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return interaction.reply({ content: '❌ I need the **Manage Roles** permission to do this.', ephemeral: true });
    }

    if (role.position >= interaction.guild.members.me.roles.highest.position) {
      return interaction.reply({ content: '❌ I can’t assign a role higher than or equal to my highest role.', ephemeral: true });
    }

    if (roleAssignInProgress[guildId]) {
      return interaction.reply({ content: '⚠️ A mass role assignment is already in progress. Please wait or cancel it.', ephemeral: true });
    }

    await interaction.deferReply();

    const members = await interaction.guild.members.fetch();
    const humans = members.filter(m => !m.user.bot && !m.roles.cache.has(role.id));

    if (humans.size === 0) {
      return interaction.editReply('✅ All human members already have that role.');
    }

    roleAssignInProgress[guildId] = true;
    let success = 0;
    let failed = 0;
    const batch = 5;
    const delay = ms => new Promise(res => setTimeout(res, ms));

    const allHumans = [...humans.values()];

    for (let i = 0; i < allHumans.length; i += batch) {
      const slice = allHumans.slice(i, i + batch);
      await Promise.all(slice.map(async member => {
        try {
          await member.roles.add(role);
          success++;
        } catch (err) {
          failed++;
        }
      }));

      // Optional delay between each batch
      await delay(3000);

      // Cancel check
      if (!roleAssignInProgress[guildId]) {
        return interaction.editReply(`⛔ Operation cancelled.\n✅ ${success} users processed before cancel.`);
      }
    }

    delete roleAssignInProgress[guildId];

    await interaction.editReply(`✅ Finished assigning role **${role.name}** to ${success} members.\n❌ Failed for ${failed} members.`);
  },

  // Expose cancel flag for other commands like /role-cancel
  cancel(guildId) {
    roleAssignInProgress[guildId] = false;
  }
};


/**
 * @INFO
 * Made BY PHV#3071
 * Discord Support Server: https://discord.gg/mtGUKAuRMT
 * YouTube: https://www.youtube.com/@phvdev04/videos
 * Don't steal credits or else instant copyright.
 */
