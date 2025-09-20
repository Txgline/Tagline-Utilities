const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

let roleToggleInProgress = {};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('in')
    .setDescription('Toggles a role for all members within a specific role.')
    .addRoleOption(option =>
      option.setName('source')
        .setDescription('The role whose members will be affected')
        .setRequired(true))
    .addRoleOption(option =>
      option.setName('target')
        .setDescription('The role to toggle for members in the source role')
        .setRequired(true)),

  async execute(interaction) {
    const source = interaction.options.getRole('source');
    const target = interaction.options.getRole('target');
    const guildId = interaction.guild.id;

    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return interaction.reply({ content: '❌ You need the **Manage Roles** permission.', ephemeral: true });
    }

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return interaction.reply({ content: '❌ I need the **Manage Roles** permission to do this.', ephemeral: true });
    }

    if (target.position >= interaction.guild.members.me.roles.highest.position) {
      return interaction.reply({ content: '❌ I can’t manage a role higher than or equal to my highest role.', ephemeral: true });
    }

    if (roleToggleInProgress[guildId]) {
      return interaction.reply({ content: '⚠️ A role toggle operation is already in progress.', ephemeral: true });
    }

    await interaction.deferReply();
    roleToggleInProgress[guildId] = true;

    const members = await interaction.guild.members.fetch();
    const affectedMembers = members.filter(member => member.roles.cache.has(source.id));

    if (affectedMembers.size === 0) {
      roleToggleInProgress[guildId] = false;
      return interaction.editReply(`❌ No members found with the role **${source.name}**.`);
    }

    let added = 0, removed = 0, failed = 0;
    const delay = ms => new Promise(res => setTimeout(res, ms));
    const batch = 5;
    const all = [...affectedMembers.values()];

    for (let i = 0; i < all.length; i += batch) {
      const chunk = all.slice(i, i + batch);
      await Promise.all(chunk.map(async member => {
        try {
          if (member.roles.cache.has(target.id)) {
            await member.roles.remove(target);
            removed++;
          } else {
            await member.roles.add(target);
            added++;
          }
        } catch {
          failed++;
        }
      }));

      await delay(3000);
      if (!roleToggleInProgress[guildId]) {
        return interaction.editReply(`⛔ Operation cancelled.\n✅ Toggled roles for ${added + removed} members.`);
      }
    }

    roleToggleInProgress[guildId] = false;

    await interaction.editReply(`✅ Finished toggling role **${target.name}** for members with **${source.name}**.\n➕ Added: ${added}\n➖ Removed: ${removed}\n❌ Failed: ${failed}`);
  },

  cancel(guildId) {
    roleToggleInProgress[guildId] = false;
  }
};


/**
 * @INFO
 * Made BY PHV#3071
 * Discord Support Server: https://discord.gg/mtGUKAuRMT
 * YouTube: https://www.youtube.com/@phvdev04/videos
 * Don't steal credits or else instant copyright.
 */
