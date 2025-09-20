const {
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('endswith')
    .setDescription('Deletes messages ending with specific text in the last N messages.')
    .addStringOption(option =>
      option.setName('text')
        .setDescription('The text messages should end with')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Number of recent messages to check')
        .setRequired(true)
    ),

  async execute(interaction) {
    const text = interaction.options.getString('text').toLowerCase();
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

      const filtered = messages.filter(msg =>
        msg.content?.toLowerCase().endsWith(text)
      );

      if (filtered.size === 0) {
        return interaction.editReply(`⚠️ No messages ending with \`${text}\` found in the last ${amount} messages.`);
      }

      const deleted = await interaction.channel.bulkDelete(filtered, true);

      return interaction.editReply(`🧹 Deleted **${deleted.size}** message(s) that end with \`${text}\`.`);
    } catch (error) {
      console.error('purge-endswith error:', error);
      return interaction.editReply('❌ An error occurred while deleting messages.');
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
