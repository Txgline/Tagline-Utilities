const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('any')
    .setDescription('Bulk deletes messages from the current channel')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Number of messages to delete')
        .setRequired(true)
    )
    .addUserOption(option =>
      option.setName('target')
        .setDescription('Only delete messages from this user (optional)')
        .setRequired(false)
    ),

  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');
    const target = interaction.options.getUser('target');

    // Permission checks
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
      const messages = await interaction.channel.messages.fetch({ limit: 100 });

      let filteredMessages;
      if (target) {
        filteredMessages = messages.filter(msg => msg.author.id === target.id).first(amount);
      } else {
        filteredMessages = messages.first(amount);
      }

      const deleted = await interaction.channel.bulkDelete(filteredMessages, true);

      await interaction.editReply({
        content: `🧹 Deleted **${deleted.size}** message(s) ${target ? `from <@${target.id}>` : ''}.`,
      });
    } catch (error) {
      console.error('Purge error:', error);
      return interaction.editReply({
        content: '❌ Failed to delete messages. I can’t delete messages older than 14 days.',
      });
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
