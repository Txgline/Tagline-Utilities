const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType
} = require('discord.js');
const fs = require('fs');
const path = require('path');

const slowmodePath = path.join(__dirname, '../../Data/slowmode.json');
if (!fs.existsSync(slowmodePath)) fs.writeFileSync(slowmodePath, JSON.stringify({}));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('user')
    .setDescription('Enable or disable per-user slowmode in a channel.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to apply slowmode to.')
        .setRequired(true)
    )
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The channel to apply slowmode in.')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('duration')
        .setDescription('Duration in seconds (0 to disable).')
        .setRequired(true)
    ),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({
        content: '❌ You need **Administrator** permissions to use this command.',
        ephemeral: true
      });
    }

    const user = interaction.options.getUser('user');
    const channel = interaction.options.getChannel('channel');
    const duration = interaction.options.getInteger('duration');

    const db = JSON.parse(fs.readFileSync(slowmodePath, 'utf8'));

    if (!db[interaction.guild.id]) db[interaction.guild.id] = {};
    if (!db[interaction.guild.id][user.id]) db[interaction.guild.id][user.id] = {};

    if (duration === 0) {
      // Remove slowmode for this user in this channel
      delete db[interaction.guild.id][user.id][channel.id];

      // Clean up empty objects
      if (Object.keys(db[interaction.guild.id][user.id]).length === 0) {
        delete db[interaction.guild.id][user.id];
      }
      if (Object.keys(db[interaction.guild.id]).length === 0) {
        delete db[interaction.guild.id];
      }
    } else {
      db[interaction.guild.id][user.id][channel.id] = duration;
    }

    fs.writeFileSync(slowmodePath, JSON.stringify(db, null, 2));

    await interaction.reply({
      content: duration === 0
        ? `✅ Disabled slowmode for <@${user.id}> in <#${channel.id}>.`
        : `✅ Set slowmode for <@${user.id}> in <#${channel.id}> to **${duration} seconds.**`,
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
