require('dotenv').config();


const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");

const fs = require('fs');
const path = require('path');
const keepalive = require('./keepa;')
const { Events } = require('discord.js');

client.commands = new Collection();

['commandHandler', 'eventHandler'].forEach(handler =>
  require(`./Handlers/${handler}`)(client)
);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions, // 👈 needed for reaction roles
    GatewayIntentBits.GuildMembers,          // 👈 needed to add roles
    GatewayIntentBits.MessageContent,        // optional, if you use message content
  ],
  partials: [
    Partials.Message, // 👈 needed because reactions can come on uncached messages
    Partials.Channel,
    Partials.Reaction,
  ],
});

module.exports = client;


client.on('messageReactionAdd', async (reaction, user) => {
  if (user.bot) return;

  if (reaction.partial) await reaction.fetch(); // Fetch if the reaction is partial

  const { message, emoji } = reaction;
  const guild = message.guild;
  const member = await guild.members.fetch(user.id);

  if (emoji.name === '📢') await member.roles.add('1417860529724198994');
  if (emoji.name === '🎲') await member.roles.add('1417860529724198995');
  if (emoji.name === '🥀') await member.roles.add('1417860529724198993');
  if (emoji.name === '🤣') await member.roles.add('1420095235337228310');
  if (emoji.name === '🛠️') await member.roles.add('1420095492179628193');
  if (emoji.name === '🎉') await member.roles.add('1417860529724198992');
});
/*
client.on('messageReactionRemove', async (reaction, user) => {
  if (user.bot) return;

  if (reaction.partial) await reaction.fetch();

  const { message, emoji } = reaction;
  const guild = message.guild;
  const member = await guild.members.fetch(user.id);

  if (emoji.name === '📢') await member.roles.remove('1417860529724198994');
  if (emoji.name === '🎲') await member.roles.remove('1417860529724198995');
  if (emoji.name === '🥀') await member.roles.remove('1417860529724198993');
  if (emoji.name === '🤣') await member.roles.remove('1420095235337228310');
  if (emoji.name === '🛠️') await member.roles.remove('1420095492179628193');
  if (emoji.name === '🎉') await member.roles.remove('1417860529724198992');
});
*/

client.roleAssignmentIntervals = new Map();

client.login(process.env.TOKEN);
