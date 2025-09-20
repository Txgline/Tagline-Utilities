const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roles')
    .setDescription('Displays all roles in the server with pagination if needed.')
    .setDMPermission(false),

  async execute(interaction) {
    const roles = interaction.guild.roles.cache
      .filter(role => role.name !== '@everyone')
      .sort((a, b) => b.position - a.position)
      .map(role => role.toString());

    if (roles.length === 0) {
      return interaction.reply({ content: '❌ No roles found in this server.', ephemeral: true });
    }

    const chunkSize = 50; // max we can safely show per embed page
    const pages = Math.ceil(roles.length / chunkSize);
    const embeds = [];

    for (let i = 0; i < pages; i++) {
      const current = roles.slice(i * chunkSize, (i + 1) * chunkSize);
      const embed = new EmbedBuilder()
        .setTitle(`📜 Server Roles (Page ${i + 1}/${pages})`)
        .setDescription(current.join('\n'))
        .setColor('Random')
        .setFooter({ text: `Total Roles: ${roles.length}` });

      embeds.push(embed);
    }

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('roles_prev')
        .setLabel('⬅️ Previous')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true),
      new ButtonBuilder()
        .setCustomId('roles_next')
        .setLabel('➡️ Next')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(pages <= 1)
    );

    const reply = await interaction.reply({
      embeds: [embeds[0]],
      components: [row],
      fetchReply: true
    });

    // Pagination Collector
    let currentPage = 0;
    const collector = reply.createMessageComponentCollector({ time: 120000 });

    collector.on('collect', async i => {
      if (i.user.id !== interaction.user.id) {
        return i.reply({ content: '❌ Only the command user can navigate pages.', ephemeral: true });
      }

      if (i.customId === 'roles_prev') currentPage--;
      if (i.customId === 'roles_next') currentPage++;

      await i.update({
        embeds: [embeds[currentPage]],
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId('roles_prev')
              .setLabel('⬅️ Previous')
              .setStyle(ButtonStyle.Secondary)
              .setDisabled(currentPage === 0),
            new ButtonBuilder()
              .setCustomId('roles_next')
              .setLabel('➡️ Next')
              .setStyle(ButtonStyle.Secondary)
              .setDisabled(currentPage === pages - 1)
          )
        ]
      });
    });

    collector.on('end', async () => {
      try {
        await reply.edit({ components: [] });
      } catch (e) {
        // Message might already be deleted
      }
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
