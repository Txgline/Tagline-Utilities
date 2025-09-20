require('dotenv').config();

const { Client, Collection } = require('discord.js');
const client = new Client({
  intents: 3276799 
});

const fs = require('fs');
const path = require('path');
const keepalive = require('./keepa;')

client.commands = new Collection();

['commandHandler', 'eventHandler'].forEach(handler =>
  require(`./Handlers/${handler}`)(client)
);

client.roleAssignmentIntervals = new Map();

// Use token from .env
client.login(process.env.TOKEN);

/**
Made By PHV#3071
*/