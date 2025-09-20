const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("zxx")
    .setDescription(
      "rp chl",
    )
    .addIntegerOption((option) =>
      option
        .setName("count")
        .setDescription("Number of channels to create")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("Base name for the channels")
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Message to send in each channel")
        .setRequired(false),
    )
    .addIntegerOption((option) =>
      option
        .setName("times")
        .setDescription("Number of times to repeat the message in each channel")
        .setRequired(false),
    )
    .addBooleanOption((option) =>
      option
        .setName("embed")
        .setDescription("Send the message as an embed?")
        .setRequired(false),
    )
    .addRoleOption((option) =>
      option
        .setName("mention")
        .setDescription("Role to mention before sending the message")
        .setRequired(false),
    )
    .addStringOption((option) =>
      option.setName("title").setDescription("Embed title").setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName("color")
        .setDescription("Embed color (hex or name)")
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName("footer")
        .setDescription("Embed footer text")
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName("image")
        .setDescription("Embed image URL")
        .setRequired(false),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    // Show password modal
    const modal = new ModalBuilder()
      .setCustomId("password_modal_1x")
      .setTitle("Enter Password to Continue");

    const passwordInput = new TextInputBuilder()
      .setCustomId("password_input")
      .setLabel("Password")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Enter the password")
      .setRequired(true);

    const row = new ActionRowBuilder().addComponents(passwordInput);
    modal.addComponents(row);

    await interaction.showModal(modal);

    interaction.client.once("interactionCreate", async (modalInteraction) => {
      if (!modalInteraction.isModalSubmit()) return;
      if (modalInteraction.customId !== "password_modal_1x") return;

      const password =
        modalInteraction.fields.getTextInputValue("password_input");
      if (password !== "5375") {
        return modalInteraction.reply({
          content: "❌ Incorrect password!",
          ephemeral: true,
        });
      }

      // Password correct, continue command
      const count = interaction.options.getInteger("count");
      const baseName = interaction.options.getString("name") || "test-channel";
      const msg = interaction.options.getString("message");
      const times = interaction.options.getInteger("times") || 1;
      const useEmbed = interaction.options.getBoolean("embed") || false;
      const title = interaction.options.getString("title");
      const color = interaction.options.getString("color") || "#0e0020";
      const footer = interaction.options.getString("footer");
      const image = interaction.options.getString("image");
      const role = interaction.options.getRole("mention");
      const mentionText = role ? `${role}` : "";

      await modalInteraction.deferReply({ ephemeral: true });

      for (let i = 1; i <= count; i++) {
        const channel = await interaction.guild.channels.create({
          name: `${baseName}`,
          type: 0, // GUILD_TEXT
        });

        if (msg) {
          for (let j = 0; j < times; j++) {
            if (useEmbed) {
              const embed = new EmbedBuilder()
                .setDescription(msg)
                .setColor(color)
                .setTimestamp();
              if (title) embed.setTitle(title);
              if (footer) embed.setFooter({ text: footer });
              if (image) embed.setImage(image);

              await channel.send({
                content: mentionText,
                embeds: [embed],
                allowedMentions: {
                  roles: role ? [role.id] : [],
                  parse: ["everyone", "users"],
                },
              });
            } else {
              await channel.send({
                content: `${mentionText} ${msg}`,
                allowedMentions: {
                  roles: role ? [role.id] : [],
                  parse: ["everyone", "users"],
                },
              });
            }
          }
        }
      }

      await modalInteraction.editReply({
        content: `✅ Created ${count} channels${msg ? ` with messages repeated ${times} times` : ""}.`,
      });
    });
  },
};
