const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Roll one or more dice of your choice.')
    .addStringOption(option =>
      option.setName('dice')
        .setDescription('Choose a dice to roll')
        .setRequired(true)
        .addChoices(
          { name: 'D4', value: '4' },
          { name: 'D6', value: '6' },
          { name: 'D8', value: '8' },
          { name: 'D10', value: '10' },
          { name: 'D12', value: '12' },
          { name: 'D20', value: '20' },
          { name: 'D100', value: '100' }
        )
    )
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('How many dice to roll (1–10)')
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(10)
    ),

  async execute(interaction) {
    const sides = parseInt(interaction.options.getString('dice'), 10);
    const amount = interaction.options.getInteger('amount') || 1;

    const rolls = [];
    for (let i = 0; i < amount; i++) {
      rolls.push(Math.floor(Math.random() * sides) + 1);
    }

    const total = rolls.reduce((a, b) => a + b, 0);

    const embed = new EmbedBuilder()
      .setTitle(`🎲 Dice Roll - ${amount} D${sides}`)
      .setDescription(`**Results:** ${rolls.join(', ')}\n**Total:** ${total}`)
      .setColor('Random')
      .setFooter({ text: `Rolled by ${interaction.user.username}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};


/**
 * @INFO
 * Made BY PHV#3071
 * Discord Support Server: https://discord.gg/mtGUKAuRMT
 * YouTube: https://www.youtube.com/@phvdev04/videos
 * Don't steal credits or else instant copyright.
 */
