const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addemote")
    .setDescription("Add an emoji to the server from an image URL or attachment.")
    .addStringOption(option =>
      option
        .setName("name")
        .setDescription("Name of the emoji")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("link")
        .setDescription("Direct link to the emoji image (PNG, JPG, or GIF)")
        .setRequired(false)
    )
    .addAttachmentOption(option =>
      option
        .setName("image")
        .setDescription("Upload an image to use as an emoji")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageEmojisAndStickers),

  async execute(interaction) {
    const name = interaction.options.getString("name");
    const url = interaction.options.getString("link");
    const attachment = interaction.options.getAttachment("image");

    // Prioritize URL if both are provided
    let imageUrl = url || (attachment && attachment.url);
    if (!imageUrl) {
      return interaction.reply({
        content: "❌ You must provide either a link or an image attachment.",
        ephemeral: true,
      });
    }

    try {
      const response = await axios.get(imageUrl, {
        responseType: "arraybuffer",
      });

      const contentType = response.headers["content-type"];
      const fileSize = parseInt(response.headers["content-length"]);

      if (!contentType.startsWith("image/")) {
        return interaction.reply({
          content: "❌ The file must be an image (PNG, JPG, or GIF).",
          ephemeral: true,
        });
      }

      if (fileSize > 256 * 1024) {
        return interaction.reply({
          content: "❌ Image is too large. Emoji size must be under 256KB.",
          ephemeral: true,
        });
      }

      const emoji = await interaction.guild.emojis.create({
        attachment: Buffer.from(response.data, "binary"),
        name: name,
      });

      const embed = new EmbedBuilder()
        .setTitle("✅ Emoji Added")
        .setColor("Green")
        .setDescription(`Emoji ${emoji} has been added with the name \`${emoji.name}\`.`)
        .setThumbnail(emoji.url)
        .setFooter({
          text: `Requested by ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        });

      await interaction.reply({ embeds: [embed] });

    } catch (err) {
      console.error("Emoji creation error:", err);
      return interaction.reply({
        content: "❌ Failed to create the emoji. Please make sure the image is valid and the server has free emoji slots.",
        ephemeral: true,
      });
    }
  },
};


/**
 * @INFO
 * Made BY PHV#3071
 * Discord Support Server: https://discord.gg/mtGUKAuRMT
 * YouTube: https://www.youtube.com/@phvdev04/videos
 * Don't steal credits or else instant copyright.
 */
