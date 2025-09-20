const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const numberEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Poll command with create and show options.')
    .addSubcommand(sub =>
      sub.setName('create')
        .setDescription('Create a new poll')
        .addStringOption(opt => opt.setName('question').setDescription('The poll question').setRequired(true))
        .addStringOption(opt => opt.setName('option1').setDescription('First option').setRequired(true))
        .addStringOption(opt => opt.setName('option2').setDescription('Second option').setRequired(true))
        .addStringOption(opt => opt.setName('option3').setDescription('Third option'))
        .addStringOption(opt => opt.setName('option4').setDescription('Fourth option'))
        .addStringOption(opt => opt.setName('option5').setDescription('Fifth option'))
        .addStringOption(opt => opt.setName('option6').setDescription('Sixth option'))
        .addStringOption(opt => opt.setName('option7').setDescription('Seventh option'))
        .addStringOption(opt => opt.setName('option8').setDescription('Eighth option'))
        .addStringOption(opt => opt.setName('option9').setDescription('Ninth option'))
        .addStringOption(opt => opt.setName('option10').setDescription('Tenth option'))
    )
    .addSubcommand(sub =>
      sub.setName('show')
        .setDescription('Show the result of a poll')
        .addStringOption(opt =>
          opt.setName('message_id')
            .setDescription('Message ID of the poll (optional)')
            .setRequired(false)
        )
    )
    .setDMPermission(false),

  async execute(interaction) {
    const { options, channel } = interaction;
    const subcommand = options.getSubcommand();

    if (subcommand === 'create') {
      const question = options.getString('question');
      const pollOptions = [];

      for (let i = 1; i <= 10; i++) {
        const option = options.getString(`option${i}`);
        if (option) pollOptions.push(option);
      }

      if (pollOptions.length < 2) {
        return interaction.reply({ content: '❌ You must provide at least 2 options.', ephemeral: true });
      }

      const description = pollOptions.map((opt, i) => `${numberEmojis[i]} ${opt}`).join('\n');

      const embed = new EmbedBuilder()
        .setTitle(`📊 ${question}`)
        .setDescription(description)
        .setColor('Random')
        .setFooter({ text: `Poll created by ${interaction.user.tag}` })
        .setTimestamp();

      const pollMsg = await channel.send({ embeds: [embed] });

      for (let i = 0; i < pollOptions.length; i++) {
        await pollMsg.react(numberEmojis[i]);
      }

      await interaction.reply({ content: `✅ Poll created successfully!\n🆔 Message ID: \`${pollMsg.id}\``, ephemeral: true });

    } else if (subcommand === 'show') {
      const messageId = options.getString('message_id');

      let pollMessage;
      try {
        if (messageId) {
          pollMessage = await channel.messages.fetch(messageId);
        } else {
          const messages = await channel.messages.fetch({ limit: 50 });
          pollMessage = messages.find(m => m.author.id === interaction.client.user.id && m.embeds.length > 0 && m.embeds[0].title?.startsWith('📊'));
        }
      } catch (err) {
        return interaction.reply({ content: '❌ Could not fetch the message. Make sure the message ID is valid and in this channel.', ephemeral: true });
      }

      if (!pollMessage || pollMessage.author.id !== interaction.client.user.id || !pollMessage.embeds.length || !pollMessage.embeds[0].title?.startsWith('📊')) {
        return interaction.reply({ content: '❌ No valid poll found.', ephemeral: true });
      }

      const embed = pollMessage.embeds[0];
      const reactions = pollMessage.reactions.cache.filter(r => numberEmojis.includes(r.emoji.name));

      const reactionData = [];

      for (const [emoji, reaction] of reactions) {
        const count = reaction.count - 1;
        reactionData.push({ emoji, count });
      }

      const sorted = reactionData.sort((a, b) => b.count - a.count);

      if (sorted.length === 0) {
        return interaction.reply({ content: '❌ No votes found on the selected poll.', ephemeral: true });
      }

      const resultEmbed = new EmbedBuilder()
        .setTitle('📊 Poll Results')
        .setDescription(sorted.map(r => `${r.emoji} - **${r.count} votes**`).join('\n'))
        .setColor('Blue')
        .setFooter({ text: `Results for: ${embed.title.replace('📊 ', '')}` });

      await interaction.reply({ embeds: [resultEmbed] });
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
