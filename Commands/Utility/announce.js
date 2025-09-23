const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('Send a fully customizable announcement or plain text')
    // OPTIONAL options
    .addStringOption(option => option.setName('text').setDescription('Send plain text instead of an embed').setRequired(false))
    .addStringOption(option => option.setName('description').setDescription('Description of the embed').setRequired(false))
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
      const channel = interaction.channel; // always send in current channel
      const text = interaction.options.getString('text');
      const description = interaction.options.getString('description');
      const title = interaction.options.getString('title');
      const color = interaction.options.getString('color') || '#190e4e';
      const footer = interaction.options.getString('footer');
      const image = interaction.options.getString('image');
      const thumbnail = interaction.options.getString('thumbnail');
      const author = interaction.options.getString('author');
      const fieldsInput = interaction.options.getString('fields');
      const role = interaction.options.getRole('mention');
      const buttonLabel = interaction.options.getString('button_label');
      const buttonUrl = interaction.options.getString('button_url');

      // If plain text is provided, send it instead of an embed
      if (text && text.trim() !== '') {
        const content = role ? `${role} ${text}` : text;
        await channel.send({ content });
        return interaction.reply({ content: `✅ Text announcement sent in ${channel}`, ephemeral: true });
      }

      // Otherwise, send embed
      if (!description || description.trim() === '') {
        return interaction.reply({ content: '❌ Description cannot be empty for an embed.', ephemeral: true });
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

      if (fieldsInput) {
        const fields = fieldsInput.split('|');
        for (const f of fields) {
          const [name, value] = f.split(':');
          if (name && value) embed.addFields({ name: name.trim(), value: value.trim(), inline: true });
        }
      }

      let row;
      if (buttonLabel && buttonUrl) {
        row = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setLabel(buttonLabel).setStyle(ButtonStyle.Link).setURL(buttonUrl)
        );
      }

      const content = role ? `${role}` : null;
      await channel.send({ content, embeds: [embed], components: row ? [row] : [] });
      await interaction.reply({ content: `✅ Embed announcement sent in ${channel}`, ephemeral: true });

    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ Failed to send the announcement.', ephemeral: true });
    }
  }
};
