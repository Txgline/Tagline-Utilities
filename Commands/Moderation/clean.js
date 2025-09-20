const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clean')
    .setDescription("Deletes Tagline's Utilities messages in this channel (includes embeds, buttons, etc.)")
    .addIntegerOption(option =>
      option.setName('count')
        .setDescription('Number of messages to scan and delete')
        .setRequired(true)
    ),

  async execute(interaction) {
    const amount = interaction.options.getInteger('count');

    // Check if user has ManageMessages
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return interaction.reply({
        content: "❌ You need the **Manage Messages** permission to use this command.",
        ephemeral: true
      });
    }

    // Check if bot has ManageMessages
    const botMember = interaction.guild.members.me;
    if (!botMember.permissionsIn(interaction.channel).has(PermissionFlagsBits.ManageMessages)) {
      return interaction.reply({
        content: "❌ I need the **Manage Messages** permission to clean my messages.",
        ephemeral: true
      });
    }

    await interaction.deferReply({ ephemeral: true });

    try {
      const botId = interaction.client.user.id;

      const messages = await interaction.channel.messages.fetch({ limit: 100 });
      const messagesToDelete = messages
        .filter(msg =>
          msg.author.id === botId &&
          (msg.embeds.length > 0 || msg.components.length > 0 || msg.content)
        )
        .first(amount);

      if (messagesToDelete.length === 0) {
        return interaction.editReply("❌ Couldn't find any messages from me (Tagline's Utilities) to delete.");
      }

      await interaction.channel.bulkDelete(messagesToDelete, true);

      await interaction.editReply(`✅ Deleted ${messagesToDelete.length} messages from Tagline's Utilities (including buttons, embeds, etc).`);
    } catch (error) {
      console.error('Clean command error:', error);
      await interaction.editReply("❌ Failed to delete messages. I may not have permission to manage messages in this channel.");
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
