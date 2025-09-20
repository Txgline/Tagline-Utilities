const {
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('after')
    .setDescription('Deletes messages after a specific message (ID or link)')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Message ID or link to start after')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Number of messages to delete after that message (max 100)')
        .setRequired(true)
    ),

  async execute(interaction) {
    const input = interaction.options.getString('message');
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
      // Parse message ID from possible link
      const messageIdMatch = input.match(/\d{17,}/);
      if (!messageIdMatch) {
        return interaction.editReply('❌ Invalid message ID or link.');
      }

      const messageId = messageIdMatch[0];

      const targetMessage = await interaction.channel.messages.fetch(messageId).catch(() => null);
      if (!targetMessage) {
        return interaction.editReply('❌ Could not find a message with that ID in this channel.');
      }

      const messages = await interaction.channel.messages.fetch({ limit: 100 });
      const afterMessages = messages
        .filter(msg => msg.createdTimestamp > targetMessage.createdTimestamp)
        .first(amount);

      if (afterMessages.length === 0) {
        return interaction.editReply('❌ No messages found after the provided message.');
      }

      const deleted = await interaction.channel.bulkDelete(afterMessages, true);

      await interaction.editReply(`🧹 Deleted **${deleted.size}** message(s) after [this message](${targetMessage.url}).`);

    } catch (error) {
      console.error('purge-after error:', error);
      return interaction.editReply('❌ Something went wrong while trying to delete messages.');
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
