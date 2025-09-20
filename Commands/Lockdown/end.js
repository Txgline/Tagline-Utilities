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
    .setName('end')
    .setDescription('End lockdown and restore permissions.'),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({
        content: '❌ You need **Administrator** permissions to use this command.',
        ephemeral: true
      });
    }

    await interaction.deferReply({ ephemeral: true });

    if (!fs.existsSync(lockdownPath)) {
      return interaction.editReply({
        content: '❌ Lockdown data not found. Please use `/lockdown set` first.'
      });
    }

    const db = JSON.parse(fs.readFileSync(lockdownPath, 'utf8'));
    const channelIds = db[interaction.guild.id];

    if (!channelIds || channelIds.length === 0) {
      return interaction.editReply({
        content: '⚠️ No channels are currently locked down.'
      });
    }

    const everyoneRole = interaction.guild.roles.everyone;
    let successCount = 0;
    let failCount = 0;
    let deletedMessages = 0;

    for (const channelId of channelIds) {
      const channel = interaction.guild.channels.cache.get(channelId);
      if (!channel || channel.type !== ChannelType.GuildText) {
        failCount++;
        continue;
      }

      try {
        await channel.permissionOverwrites.edit(everyoneRole, {
          SendMessages: null
        });

        const messages = await channel.messages.fetch({ limit: 10 });
        const lockdownMsg = messages.find(msg =>
          msg.author.id === interaction.client.user.id &&
          msg.content.includes('Server Under Lockdown')
        );

        if (lockdownMsg) {
          await lockdownMsg.delete();
          deletedMessages++;
        }

        successCount++;
      } catch (error) {
        console.error(`Failed to unlock or clean channel ${channel?.name || channelId}:`, error);
        failCount++;
      }
    }

    // 🔧 Do NOT delete db[interaction.guild.id] — preserve config

    await interaction.editReply({
      content: `✅ Lockdown ended in ${successCount} channel(s).\n🗑️ Deleted ${deletedMessages} lockdown message(s).\n${failCount > 0 ? `⚠️ Failed in ${failCount} channel(s).` : ''}`
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
