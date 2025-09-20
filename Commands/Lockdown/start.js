const {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits
} = require('discord.js');
const fs = require('fs');
const path = require('path');

const lockdownPath = path.join(__dirname, '../../Data/lockdown.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('start')
    .setDescription('Start lockdown in selected channels.'),

  async execute(interaction) {
    // ✅ Permission check
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({
        content: '❌ You need **Administrator** permissions to use this command.',
        ephemeral: true
      });
    }

    // ✅ Defer reply early to avoid timeout
    await interaction.deferReply({ ephemeral: true });

    // Load lockdown config
    if (!fs.existsSync(lockdownPath)) {
      return interaction.editReply({
        content: '❌ Lockdown data not found. Please use `/lockdown set` first.'
      });
    }

    const db = JSON.parse(fs.readFileSync(lockdownPath, 'utf8'));
    const channelIds = db[interaction.guild.id];

    if (!channelIds || channelIds.length === 0) {
      return interaction.editReply({
        content: '⚠️ Please select the channels to put under lockdown by using `/lockdown set`.'
      });
    }

    const everyoneRole = interaction.guild.roles.everyone;
    let successCount = 0;
    let failCount = 0;

    for (const channelId of channelIds) {
      const channel = interaction.guild.channels.cache.get(channelId);
      if (!channel || channel.type !== ChannelType.GuildText) {
        failCount++;
        continue;
      }

      try {
        await channel.permissionOverwrites.edit(everyoneRole, {
          SendMessages: false
        });

        await channel.send('🚨 **Server Under Lockdown due to some Technical reasons, Please be patient.**');
        successCount++;
      } catch (error) {
        console.error(`Failed to lockdown channel ${channel?.name || channelId}:`, error);
        failCount++;
      }
    }

    await interaction.editReply({
      content: `✅ Lockdown started in ${successCount} channel(s).\n${failCount > 0 ? `⚠️ Failed in ${failCount} channel(s).` : ''}`
    });
  }
};


/**
 * @INFO
 * Made BY PHV#3071
 * Discord Support Server: https://discord.gg/mtGUKAuRMT
 * YouTube: https://www.youtube.com/@phvdev04/videos
 * Don't steal credits or else instant copyright.
 */
