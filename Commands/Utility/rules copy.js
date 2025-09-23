const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('faq')
    .setDescription('Displays the server faq')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    try {
      const embed2 = new EmbedBuilder()
        .setImage('https://cdn.discordapp.com/attachments/1033478595596795995/1033506695944609822/frequently_asked_questions.gif?ex=68d3c75d&is=68d275dd&hm=cbb3fc787b5da4362a53c6609567f33e3b0f1433f14d7445d9086e13ee9561d0')
        .setColor('#2e184b');

      const embed1 = new EmbedBuilder()
      .setTitle('Can I have Robux?')
        .setDescription(`**Begging or asking members of the server for Robux is not allowed on our server**. We sometime host giveaways where we give thousands of Robux at <#1420067867575189634>, and we have a  where we host events, which we reward thousands of Robux too! We even do game nights where we also give away a lot of Robux.`)
        .setColor('#2e184b')
        .setFooter({ text: "Tagline's Utilities" })
        .setTimestamp();

        const embed3 = new EmbedBuilder()
      .setTitle('How do I get the Influencer role/Content Creator role?')
        .setDescription(`Roblox developers must have a game with at least 100 concurrent players and 1M+ visits. They must also play a big role in the game's development. (no community contributors)\n
Content Creators must have at least 500 subscribers on YouTube/ 1000 followers on TikTok, 100 views per YouTube video or 1000 views per TikTok video, a video uploaded in the last 30 days, and their content must follow the rules.\n
If you think you meet one of the requirements above, please create a support ticket at <#1417860530991005729>`)
        .setColor('#2e184b')
        .setFooter({ text: "Tagline's Utilities" })
        .setTimestamp();

        const embed4 = new EmbedBuilder()
      .setTitle('How do I get roles?')
        .setDescription(`You can head over to ⁠<#1417860530596479092> to give yourself roles depending on your interests and what you'd like to be pinged for.`)
        .setColor('#2e184b')
        .setFooter({ text: "Tagline's Utilities" })
        .setTimestamp();

         const embed5 = new EmbedBuilder()
      .setTitle('How do I get/remove the "__ Donated" role?')
        .setDescription(`If you have more than <:rb:1206541048063459348>10K Robux donated in "PLS DONATE Z" or "Earn and Donate", you can get roles that showcase a milestone you've reached for donating. (10k, 100k, 1M, and 10M)\n
To get your role, all you need to do is send a picture of your ratio ingame in <#1420074205088710718> and one of the <@&1417860529761943602> will give you the role.`)
        .setColor('#2e184b')
        .setFooter({ text: "Tagline's Utilities" })
        .setTimestamp();

        const embed6 = new EmbedBuilder()
      .setTitle('How do I become a moderator?')
        .setDescription(`We occasionally open moderator applications for those who wish to be a moderator. These are always announced in the <#1303626224983212123> channel and results typically come in within 1-2 weeks.`)
        .setColor('#2e184b')
        .setFooter({ text: "Tagline's Utilities" })
        .setTimestamp();

        const embed7 = new EmbedBuilder()
      .setTitle('What do I get from boosting the server?')
      .addFields(
        {
          name: "Discord",
          value: "● change their server nickname.\n● use external emojis & stickers.\n● access an exclusive channel.",
          inline: false
        },
        {
          name: "In-Game",
          value: "● <:rb:1206541048063459348>100K Fake Robux in **PLS DONATE Z*.*\n● Booster Hammer in both games.\n● Chat Tag in both games.",
          inline: false
        }
      )
        .setColor('#2e184b')
        .setFooter({ text: "Tagline's Utilities" })
        .setTimestamp();

        const embed8 = new EmbedBuilder()
      .setTitle('Can I talk to Tagline?')
      .setDescription('We will not put you in contact with Tagline, unless you have a serious business inquiry. Do not attempt to get in contact with him if you are asking for free Robux, have a game idea or want to report a bug/exploit.')
        .setColor('#2e184b')
        .setFooter({ text: "Tagline's Utilities" })
        .setTimestamp();

        const embed9 = new EmbedBuilder()
      .setTitle('What should I do if I think someone broke the rules?')
      .setDescription('You can ping an online moderator or open a ticket through <#1417860530991005729> to speak with a staff member. For in-game reports, please make a post in <#1417860531263508535>.')
        .setColor('#2e184b')
        .setFooter({ text: "Tagline's Utilities" })
        .setTimestamp();

        const embed10 = new EmbedBuilder()
      .setTitle('What should I do if I find bugs in-Game?')
      .setDescription("report it in <#1417860531263508534> specify the bug you're reporting, how to trigger it and a picture or video showing off the bug.")
        .setColor('#2e184b')
        .setFooter({ text: "Tagline's Utilities" })
        .setTimestamp();

      await interaction.channel.send({ embeds: [embed2, embed1, embed3, embed4, embed5, embed6, embed7. embed8, embed9. embed10] });
await interaction.reply({ content: '✅ Faq sent!', ephemeral: true });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ Failed to send the Faq.', ephemeral: true });
    }
  },
};
