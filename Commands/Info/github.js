const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('github')
    .setDescription('Shows details of a GitHub profile or repository')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('Enter GitHub username or repo (e.g., Txgline)')
        .setRequired(true))
    .setDMPermission(false),

  async execute(interaction) {
    const input = interaction.options.getString('query');
    await interaction.deferReply();

    let url = '';
    let isRepo = false;

    // Check if it's a repo input
    if (input.includes('/')) {
      url = `https://api.github.com/repos/${input}`;
      isRepo = true;
    } else {
      url = `https://api.github.com/users/${input}`;
    }

    try {
      const res = await fetch(url);
      if (!res.ok) {
        return interaction.editReply({ content: '❌ GitHub user or repo not found.' });
      }

      const data = await res.json();

      if (isRepo) {
        const embed = new EmbedBuilder()
          .setTitle(`${data.full_name}`)
          .setURL(data.html_url)
          .setDescription(data.description || 'No description provided.')
          .addFields(
            { name: '⭐ Stars', value: `${data.stargazers_count}`, inline: true },
            { name: '🍴 Forks', value: `${data.forks_count}`, inline: true },
            { name: '🐛 Open Issues', value: `${data.open_issues_count}`, inline: true },
            { name: '📝 Language', value: data.language || 'N/A', inline: true },
            { name: '📅 Created On', value: new Date(data.created_at).toLocaleDateString(), inline: true },
            { name: '🔄 Last Updated', value: new Date(data.updated_at).toLocaleDateString(), inline: true }
          )
          .setFooter({ text: `Owner: ${data.owner.login}` })
          .setThumbnail(data.owner.avatar_url)
          .setColor(0x24292e);

        return interaction.editReply({ embeds: [embed] });
      } else {
        const embed = new EmbedBuilder()
          .setTitle(`${data.login}'s GitHub`)
          .setURL(data.html_url)
          .setDescription(data.bio || 'No bio provided.')
          .setThumbnail(data.avatar_url)
          .addFields(
            { name: '👥 Followers', value: `${data.followers}`, inline: true },
            { name: '👤 Following', value: `${data.following}`, inline: true },
            { name: '📁 Public Repos', value: `${data.public_repos}`, inline: true },
            { name: '🏢 Organization', value: data.company || 'N/A', inline: true },
            { name: '📍 Location', value: data.location || 'N/A', inline: true },
            { name: '🔗 Blog/Website', value: data.blog || 'N/A', inline: false }
          )
          .setColor(0x2da44e)
          .setFooter({ text: `GitHub ID: ${data.id}` });

        return interaction.editReply({ embeds: [embed] });
      }

    } catch (err) {
      console.error(err);
      return interaction.editReply({ content: '❌ An error occurred while fetching GitHub data.' });
    }
  }
};


/**
 * @INFO
 * Made BY PHV#3071
 * Discord Support Server: https://discord.gg/mtGUKAuRMT
 * YouTube: https://www.youtube.com/@phvdev04/videos
 * Don't steal credits or else instant copyright.
 */
