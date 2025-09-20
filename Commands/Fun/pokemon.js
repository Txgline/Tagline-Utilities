const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const https = require('https');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pokemon')
    .setDescription('Provides detailed information about a specified Pokémon.')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('The name of the Pokémon')
        .setRequired(true)
    ),

  async execute(interaction) {
    const pokemonName = interaction.options.getString('name').toLowerCase();
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;

    try {
      const pokemonData = await fetchJson(apiUrl);
      const speciesData = await fetchJson(pokemonData.species.url);

      const descriptionEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en');
      const description = descriptionEntry ? descriptionEntry.flavor_text.replace(/\f/g, ' ') : 'No description available.';

      const types = pokemonData.types.map(typeInfo => typeInfo.type.name).join(', ');
      const abilities = pokemonData.abilities.map(abilityInfo => abilityInfo.ability.name).join(', ');
      const stats = pokemonData.stats.map(statInfo => `${statInfo.stat.name}: ${statInfo.base_stat}`).join('\n');
      const spriteUrl = pokemonData.sprites.front_default;

      const embed = new EmbedBuilder()
        .setTitle(`#${pokemonData.id} - ${capitalize(pokemonData.name)}`)
        .setDescription(description)
        .setThumbnail(spriteUrl)
        .addFields(
          { name: 'Type(s)', value: types, inline: true },
          { name: 'Abilities', value: abilities, inline: true },
          { name: 'Base Stats', value: stats, inline: false }
        )
        .setColor(0xff0000);

      await interaction.reply({ embeds: [embed] });

    } catch (error) {
      console.error('Error fetching Pokémon data:', error);
      await interaction.reply({ content: `❌ Pokémon "${pokemonName}" not found or an error occurred.`, ephemeral: true });
    }
  }
};

// Helper to fetch JSON using https
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';

      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }

      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

// Capitalize function
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


/**
 * @INFO
 * Made BY PHV#3071
 * Discord Support Server: https://discord.gg/mtGUKAuRMT
 * YouTube: https://www.youtube.com/@phvdev04/videos
 * Don't steal credits or else instant copyright.
 */
