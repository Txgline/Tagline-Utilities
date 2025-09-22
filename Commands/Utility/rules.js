const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rules')
    .setDescription('Displays the server rules')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    try {
      const embed2 = new EmbedBuilder()
      .setImage('https://cdn.discordapp.com/attachments/1033478595596795995/1033506882163323022/rules.gif?ex=68d2760a&is=68d1248a&hm=24a635a78efcb28025dd0815035a8372df3e419589b0b5e03d5dde61846463a1')
        .setColor('#4b0082')
        const embed1 = new EmbedBuilder()
        .setDescription(`
● Show respect to other users and use common sense. If something isn’t listed here, it doesn’t mean it’s allowed.
● No offensive content, adult material, or NSFW imagery in any channel. If people might not want to see it, don’t post it. 
● No advertising or self-promotion without permission. This includes Discord invites, YouTube/Twitch links, or any content you’re promoting.
● Spamming, text walls, and posting multiple large images at once is not allowed. 
● Swearing is allowed in moderation, but not targeted at others or in a disrespectful way. 
● GIFs or emojis meant to provoke epilepsy or other serious reactions are prohibited. 
● Do not threaten or share anyone’s personal information. 
● Avoid controversial topics like politics or religion.
● Voice Chat Rules – No inappropriate sounds, loud/high-pitch noises, or excessive background noise. Don’t switch channels excessively.
● Game Rules – No duping, leaderboard-boosting, or scamming other players.
● All members must follow and agree to [Discord's TOS](https://discord.com/terms) and [Discord Community Guidelines](https://discord.com/guidelines).
        `)
        .setColor('#4b0082')
        .setFooter({ text: "Tagline's Utilities" })
        .setTimestamp();

      await interaction.reply({ embeds: [embed1, embed2], ephemeral: false });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ Failed to send the rules.', ephemeral: true });
    }
  },
};
