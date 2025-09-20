const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('user')
    .setDescription("Get the user's global avatar")
    .addUserOption(opt =>
      opt.setName('user')
        .setDescription('Select a user')
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('user');

    if (!user) {
      return interaction.reply({ content: '❌ User not found.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle(`${user.tag}'s Global Avatar`)
      .setImage(user.displayAvatarURL({ extension: 'png', size: 1024 }))
      .setColor('Aqua');

    return interaction.reply({ embeds: [embed] });
  }
};

/**
 * @INFO
 * Made BY PHV#3071
 * Discord Support Server: https://discord.gg/mtGUKAuRMT
 * YouTube: https://www.youtube.com/@phvdev04/videos
 * Don't steal credits or else instant copyright.
 */
