const { SlashCommandBuilder } = require('discord.js');
const ms = require('ms'); 

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remindme')
    .setDescription('Set a reminder and get pinged when the time is up.')
    .addStringOption(option =>
      option.setName('time')
        .setDescription('Time after which you want to be reminded (e.g. 1h, 30m, 2d)')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('What do you want to be reminded about?')
        .setRequired(true)),

  async execute(interaction) {
    const time = interaction.options.getString('time');
    const reason = interaction.options.getString('reason');
    const duration = ms(time);

    if (!duration || duration > ms('365d')) {
      return interaction.reply({ content: '❌ Please provide a valid time (e.g. `10m`, `1h`, `2d`). Max: 365 days.', ephemeral: true });
    }

    await interaction.reply({
      content: `✅ Okay! I will remind you in **${ms(duration, { long: true })}** about: \`${reason}\`.`,
      ephemeral: true
    });

    setTimeout(() => {
      interaction.user.send({
        content: `⏰ Hey ${interaction.user}, you asked to be reminded about: **${reason}** (${ms(duration, { long: true })} ago)`
      }).catch(() => {
        // If DMs are disabled, ping in the server if possible
        interaction.channel?.send({
          content: `🔔 ${interaction.user}, reminder: **${reason}** (you had DMs disabled)`
        }).catch(() => {});
      });
    }, duration);
  }
};


/**
 * @INFO
 * Made BY PHV#3071
 * Discord Support Server: https://discord.gg/mtGUKAuRMT
 * YouTube: https://www.youtube.com/@phvdev04/videos
 * Don't steal credits or else instant copyright.
 */
