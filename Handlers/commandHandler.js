require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = async (client) => {
  const commands = [];

  const folderMap = {
    Avatar: 'avatar',
    Purge: 'purge',
    Role: 'role',
    Afk: 'afk',
    Note: 'note',
    Covid: 'covid',
    Lockdown: 'lockdown',
    Slowmode: 'slowmode',
    Tag: 'tag'
   
  };

  const basePath = path.join(__dirname, '../Commands');
  const folders = fs.readdirSync(basePath);

  for (const folder of folders) {
    const folderPath = path.join(basePath, folder);
    const stat = fs.statSync(folderPath);
    if (!stat.isDirectory()) continue;

    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

   
    if (folderMap[folder]) {
      const mainCommandName = folderMap[folder];
      const mainCommand = new SlashCommandBuilder()
        .setName(mainCommandName)
        .setDescription(`Main command group for ${mainCommandName}`);

      for (const file of commandFiles) {
        const filePath = path.join(folderPath, file);
        const subCommand = require(filePath);
        const subData = subCommand.data;

        if (!subData?.name || !subData?.description) {
          console.warn(`[CommandHandler] Invalid subcommand in ${file}`);
          continue;
        }

        mainCommand.addSubcommand(sub => {
          sub.setName(subData.name).setDescription(subData.description);

          
          if (subData.options?.length) {
            for (const option of subData.options) {
              switch (option.type) {
                case 3: 
                  sub.addStringOption(opt => {
                    let builder = opt
                      .setName(option.name)
                      .setDescription(option.description)
                      .setRequired(option.required || false);

                    if (option.choices) builder = builder.addChoices(...option.choices);
                    if (option.autocomplete) builder = builder.setAutocomplete(true);
                    return builder;
                  });
                  break;

                case 4: 
                  sub.addIntegerOption(opt => {
                    let builder = opt
                      .setName(option.name)
                      .setDescription(option.description)
                      .setRequired(option.required || false);

                    if (option.min_value != null) builder = builder.setMinValue(option.min_value);
                    if (option.max_value != null) builder = builder.setMaxValue(option.max_value);
                    if (option.choices) builder = builder.addChoices(...option.choices);
                    return builder;
                  });
                  break;

                case 5: 
                  sub.addBooleanOption(opt =>
                    opt.setName(option.name)
                      .setDescription(option.description)
                      .setRequired(option.required || false)
                  );
                  break;

                case 6: 
                  sub.addUserOption(opt =>
                    opt.setName(option.name)
                      .setDescription(option.description)
                      .setRequired(option.required || false)
                  );
                  break;

                case 7:
                  sub.addChannelOption(opt => {
                    let builder = opt
                      .setName(option.name)
                      .setDescription(option.description)
                      .setRequired(option.required || false);
                    if (option.channel_types) builder = builder.addChannelTypes(...option.channel_types);
                    return builder;
                  });
                  break;

                case 8: 
                  sub.addRoleOption(opt =>
                    opt.setName(option.name)
                      .setDescription(option.description)
                      .setRequired(option.required || false)
                  );
                  break;

                case 9: 
                  sub.addMentionableOption(opt =>
                    opt.setName(option.name)
                      .setDescription(option.description)
                      .setRequired(option.required || false)
                  );
                  break;

                case 10: 
                  sub.addNumberOption(opt => {
                    let builder = opt
                      .setName(option.name)
                      .setDescription(option.description)
                      .setRequired(option.required || false);

                    if (option.min_value != null) builder = builder.setMinValue(option.min_value);
                    if (option.max_value != null) builder = builder.setMaxValue(option.max_value);
                    if (option.choices) builder = builder.addChoices(...option.choices);
                    return builder;
                  });
                  break;

                case 11: 
                  sub.addAttachmentOption(opt =>
                    opt.setName(option.name)
                      .setDescription(option.description)
                      .setRequired(option.required || false)
                  );
                  break;

                default:
                  console.warn(`[CommandHandler] Unsupported option type '${option.type}' in ${file}`);
              }
            }
          }

          return sub;
        });

        client.commands.set(`${mainCommandName}-${subData.name}`, subCommand);
      }

      commands.push(mainCommand.toJSON());
    }

    
    else {
      for (const file of commandFiles) {
        const filePath = path.join(folderPath, file);
        const command = require(filePath);

        if (!command?.data || typeof command.data.toJSON !== 'function') {
          console.warn(`[CommandHandler] Invalid command in ${file}`);
          continue;
        }

        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
      }
    }
  }

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  try {
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('[Commands] All slash commands registered.');
  } catch (error) {
    console.error(error);
  }
};
