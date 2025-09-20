const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('emotes')
    .setDescription('Shows the list of all emojis in this server.')
    .setDMPermission(false),

  async execute(interaction) {
    const emojis = interaction.guild.emojis.cache;
    const staticEmojis = emojis.filter(e => !e.animated);
    const animatedEmojis = emojis.filter(e => e.animated);

    if (emojis.size === 0) {
      return interaction.reply({ content: '❌ This server has no emojis.', ephemeral: true });
    }

    const staticEmbed = new EmbedBuilder()
      .setTitle('🧷 Static Emojis')
      .setDescription(staticEmojis.map(e => `${e} \`:${e.name}:\``).join(' ') || 'None')
      .setColor('Blurple');

    const animatedEmbed = new EmbedBuilder()
      .setTitle('🎞 Animated Emojis')
      .setDescription(animatedEmojis.map(e => `${e} \`:${e.name}:\``).join(' ') || 'None')
      .setColor('Blurple');

    await interaction.reply({
      embeds: [staticEmbed, animatedEmbed],
      ephemeral: false
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
