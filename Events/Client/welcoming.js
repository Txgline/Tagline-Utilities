const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "guildMemberAdd",
  async execute(member) {
    const welcomeChannelId = "1303626641653628949";

    if (!welcomeChannelId || welcomeChannelId.trim() === "") {
      console.log("Welcome system is not configured. Skipping welcome event.");
      return;
    }

    const channel = member.guild.channels.cache.get(welcomeChannelId);

    if (!channel) {
      console.error(`Channel with ID ${welcomeChannelId} does not exist.`);
      return;
    }

    try {
      // Public welcome message in server channel
      await channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0x7100d5)
            .setTitle("<:sunglass:1180181149797072896> Tagline Club [TC]!")
            .setDescription(
              `→ <:kool:1300228217243832423> Welcome, ${member} to Tagline Club [TC] \nWe're excited to have you here and hope you enjoy your time with us.\n\n` +
                `→ <:begger:1280208774908612774> Please review the rules in <#1113354226115018775> to help us keep the community safe, respectful, and enjoyable for everyone.\n\n` +
                `→ <:pijamafrog:1126508357914742864> Want to learn about our roles?\nVisit <#1113354226115018776> for a quick overview of what each role means and how they work.\n\n` +
                `→ <:coolsmile:1280053756163129364> Introduce yourself in <#1113354226597384207> — we'd love to get to know you!`,
            )
            .setImage("https://i.imgur.com/xUirQtU.jpeg")
            .setFooter({
              text: "Tagline Club – Where fun meets community 💬",
              iconURL: "https://i.imgur.com/0PqOKSA.png",
            })
            .setTimestamp(),
        ],
      });

      // Private DM to the user
      await member
        .send({
          embeds: [
            new EmbedBuilder()
              .setColor(0x7100d5)
              .setTitle(
                "<:sunglass:1180181149797072896> Welcome to Tagline Club [TC]!",
              )
              .setDescription(
                `Hi ${member}!\n\n` +
                  `→ <:kool:1300228217243832423> We’re happy to have you here! Here’s a quick guide to get started:\n\n` +
                  `→ <:begger:1280208774908612774> **Read the Rules:**\nCheck out <#1113354226115018775> to keep the community safe and enjoyable for everyone.\n\n` +
                  `→ <:pijamafrog:1126508357914742864> **Explore the Roles:**\nVisit <#1113354226115018776> to learn what each role does and find one that fits you!\n\n` +
                  `→ <:coolsmile:1280053756163129364> **Say Hello:**\nDrop a friendly message in <#1113354226597384207> and meet new people!`,
              )
              .setImage("https://i.imgur.com/xUirQtU.jpeg")
              .setFooter({
                text: "Welcome - Tagline's Utilities",
                iconURL: "https://i.imgur.com/0PqOKSA.png",
              })
              .setTimestamp(),
          ],
        })
        .catch(() => {
          console.log(
            `Could not send DM to ${member.user.tag}. They may have DMs disabled.`,
          );
        });
    } catch (error) {
      console.error("Error sending welcome message:", error);
    }
  },
};
