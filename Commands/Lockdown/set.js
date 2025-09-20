const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ChannelType
} = require('discord.js');
const fs = require('fs');
const path = require('path');
const lockdownPath = path.join(__dirname, '../../Data/lockdown.json');

if (!fs.existsSync(lockdownPath)) fs.writeFileSync(lockdownPath, JSON.stringify({}));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set')
    .setDescription('Select channels to use for lockdown mode.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const channels = interaction.guild.channels.cache
      .filter(c => c.type === ChannelType.GuildText && c.viewable)
      .map(c => ({
        label: c.name.slice(0, 25), // Discord requires label ≤ 25 chars
        value: c.id
      }))
      .slice(0, 25); // Max 25 options

    if (channels.length === 0) {
      return interaction.reply({
        content: '❌ No text channels found in this server.',
        ephemeral: true
      });
    }

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('lockdown_channels')
      .setPlaceholder('Select channels to lock down')
      .setMinValues(1)
      .setMaxValues(channels.length)
      .addOptions(channels);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    await interaction.reply({
      content: 'Please select the channels you want to use for lockdown:',
      components: [row],
      ephemeral: true
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
