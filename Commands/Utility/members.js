const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('members')
    .setDescription('Lists members with the specified role (paginated).')
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('The role to get members of')
        .setRequired(true)
    )
    .setDMPermission(false),

  async execute(interaction) {
    const role = interaction.options.getRole('role');

    if (!interaction.guild.roles.cache.has(role.id)) {
      return interaction.reply({ content: '❌ That role is not from this server.', ephemeral: true });
    }

    await interaction.deferReply(); // Public reply now

    await interaction.guild.members.fetch(); // Cache all members
    const members = role.members.map(m => m.user.tag);
    if (!members.length) {
      return interaction.editReply({ content: `❌ No members found with the role ${role.name}.` });
    }

    const chunkSize = 90;
    const pages = [];

    for (let i = 0; i < members.length; i += chunkSize) {
      const chunk = members.slice(i, i + chunkSize);
      const embed = new EmbedBuilder()
        .setTitle(`👥 Members with Role: ${role.name}`)
        .setDescription(chunk.join('\n'))
        .setFooter({ text: `Page ${pages.length + 1} of ${Math.ceil(members.length / chunkSize)} • Total: ${members.length}` })
        .setColor(role.color || 'Random');
      pages.push(embed);
    }

    let currentPage = 0;

    const prevButton = new ButtonBuilder()
      .setCustomId('prev_page')
      .setLabel('⬅️ Previous')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true);

    const nextButton = new ButtonBuilder()
      .setCustomId('next_page')
      .setLabel('Next ➡️')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(pages.length === 1);

    const row = new ActionRowBuilder().addComponents(prevButton, nextButton);

    const message = await interaction.editReply({
      embeds: [pages[currentPage]],
      components: [row],
      fetchReply: true,
    });

    const collector = message.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60_000, // 1 minute
    });

    collector.on('collect', async i => {
      if (i.user.id !== interaction.user.id)
        return i.reply({ content: '❌ These buttons are not for you.', ephemeral: true });

      if (i.customId === 'prev_page' && currentPage > 0) currentPage--;
      else if (i.customId === 'next_page' && currentPage < pages.length - 1) currentPage++;

      prevButton.setDisabled(currentPage === 0);
      nextButton.setDisabled(currentPage === pages.length - 1);

      const updatedRow = new ActionRowBuilder().addComponents(prevButton, nextButton);
      await i.update({ embeds: [pages[currentPage]], components: [updatedRow] });
    });

    collector.on('end', async () => {
      const disabledRow = new ActionRowBuilder().addComponents(
        prevButton.setDisabled(true),
        nextButton.setDisabled(true)
      );
      await message.edit({ components: [disabledRow] }).catch(() => null);
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
