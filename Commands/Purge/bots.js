const {
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bots')
    .setDescription('Deletes messages sent by bots in this channel.')
    .addIntegerOption(option =>
      option
        .setName('amount')
        .setDescription('Number of recent messages to check')
        .setRequired(true)
    ),

  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');

    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return interaction.reply({
        content: '❌ You need the **Manage Messages** permission to use this command.',
        ephemeral: true,
      });
    }

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return interaction.reply({
        content: '❌ I don’t have permission to manage messages in this channel.',
        ephemeral: true,
      });
    }

    await interaction.deferReply({ ephemeral: true });

    try {
      const messages = await interaction.channel.messages.fetch({ limit: amount });
      const botMessages = messages.filter(msg => msg.author.bot);

      if (botMessages.size === 0) {
        return interaction.editReply(`⚠️ No bot messages found in the last ${amount} messages.`);
      }

      const deleted = await interaction.channel.bulkDelete(botMessages, true);

      return interaction.editReply(`🧹 Deleted **${deleted.size}** bot message(s) from the last ${amount} messages.`);
    } catch (error) {
      console.error('purge-bots error:', error);
      return interaction.editReply('❌ Something went wrong while trying to delete bot messages.');
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
