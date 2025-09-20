const { SlashCommandBuilder, ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('Send a fully customizable announcement with dynamic fields')
    // REQUIRED options
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The channel to send the announcement in')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    )
    .addStringOption(option =>
      option.setName('description')
        .setDescription('Description of the embed')
        .setRequired(true)
    )
    // OPTIONAL options
    .addStringOption(option => option.setName('title').setDescription('Title of the embed').setRequired(false))
    .addStringOption(option => option.setName('color').setDescription('Color of the embed (hex, name, decimal)').setRequired(false))
    .addStringOption(option => option.setName('footer').setDescription('Footer text').setRequired(false))
    .addStringOption(option => option.setName('image').setDescription('Image URL').setRequired(false))
    .addStringOption(option => option.setName('thumbnail').setDescription('Thumbnail URL').setRequired(false))
    .addStringOption(option => option.setName('author').setDescription('Author name').setRequired(false))
    .addStringOption(option => option.setName('fields').setDescription('Add multiple fields separated by | (name:value)').setRequired(false))
    .addRoleOption(option => option.setName('mention').setDescription('Role to mention').setRequired(false))
    .addStringOption(option => option.setName('button_label').setDescription('Button label').setRequired(false))
    .addStringOption(option => option.setName('button_url').setDescription('Button URL').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    try {
      const channel = interaction.options.getChannel('channel');
      const description = interaction.options.getString('description');
      const title = interaction.options.getString('title');
      const color = interaction.options.getString('color') || '#0e0020';
      const footer = interaction.options.getString('footer');
      const image = interaction.options.getString('image');
      const thumbnail = interaction.options.getString('thumbnail');
      const author = interaction.options.getString('author');
      const fieldsInput = interaction.options.getString('fields'); // dynamic fields
      const role = interaction.options.getRole('mention');
      const buttonLabel = interaction.options.getString('button_label');
      const buttonUrl = interaction.options.getString('button_url');

      if (!description || description.trim() === '') {
        return interaction.reply({ content: '❌ Description cannot be empty.', ephemeral: true });
      }

      const embed = new EmbedBuilder()
        .setDescription(description)
        .setColor(color)
        .setTimestamp();

      if (title) embed.setTitle(title);
      if (footer) embed.setFooter({ text: footer });
      if (image) embed.setImage(image);
      if (thumbnail) embed.setThumbnail(thumbnail);
      if (author) embed.setAuthor({ name: author });

      // Dynamic fields
      if (fieldsInput) {
        const fields = fieldsInput.split('|'); // split by '|'
        for (const f of fields) {
          const [name, value] = f.split(':');
          if (name && value) embed.addFields({ name: name.trim(), value: value.trim(), inline: true });
        }
      }

      let row;
      if (buttonLabel && buttonUrl) {
        row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel(buttonLabel)
            .setStyle(ButtonStyle.Link)
            .setURL(buttonUrl)
        );
      }

      const content = role ? `${role}` : null;

      await channel.send({ content, embeds: [embed], components: row ? [row] : [] });
      await interaction.reply({ content: `✅ Announcement sent in ${channel}`, ephemeral: true });

    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ Failed to send the announcement.', ephemeral: true });
    }
  }
};
