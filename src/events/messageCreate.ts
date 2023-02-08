import { ChannelType, Message, EmbedBuilder } from "discord.js";
import {
  checkBotPermissions,
  checkPermissions,
  getGuildOption,
  sendTimedMessage,
  getThemeColor,
} from "../functions";
import { BotEvent } from "../types";
import mongoose from "mongoose";


const event: BotEvent = {
  enable: true,
  name: "messageCreate",
  execute: async (message: Message) => {
    if (!message.member || message.member.user.bot) return;
    if (!message.guild) return;
    let prefix = process.env.PREFIX;
    if (mongoose.connection.readyState === 1) {
      let guildPrefix = await getGuildOption(message.guild, "prefix");
      if (guildPrefix) prefix = guildPrefix;
    }
          // check bot mention
    const mention = new RegExp(`^<@!?${message.guild.members.me?.id}>( |)$`);
      if (message.content.match(mention)) {
    const embed= new EmbedBuilder()
        .setColor(getThemeColor('mainColor'))
        .setDescription(`Hey My Prefix is: \`${prefix}\``)
            return message.reply({ embeds: [embed]})
    }

    if (!message.content.startsWith(prefix)) return;
    if (message.channel.type !== ChannelType.GuildText) return;

    let args = message.content.substring(prefix.length).split(" ");
    let command = message.client.commands.get(args[0]);

    if (!command) {
      let commandFromAlias = message.client.commands.find((command) =>
        command.aliases.includes(args[0])
      );
      if (commandFromAlias) command = commandFromAlias;
      else return;
    }

    let cooldown = message.client.cooldowns.get(
      `${command.name}-${message.member.user.username}`
    );
    let neededPermissions = checkPermissions(
      message.member,
      command.permissions
    );
    if (neededPermissions !== null)
      return sendTimedMessage(
        `❌ | **Ops! I need these permissions: ${neededPermissions.join(", ")} To be able to execute the command**`,
        message.channel,
        5000
      );

    let neededBotPermissions = checkBotPermissions(message, command.botPermissions)
    if(neededBotPermissions !== null){
      return message.reply({content: `❌ | **Ops! I need these permissions: ${neededBotPermissions?.join(", ")} To be able to execute the command**`});;
    }

    if (command.cooldown && cooldown) {
      if (Date.now() < cooldown) {
        sendTimedMessage(
          `You have to wait ${Math.floor(
            Math.abs(Date.now() - cooldown) / 1000
          )} second(s) to use this command again.`,
          message.channel,
          5000
        );
        return;
      }
      message.client.cooldowns.set(
        `${command.name}-${message.member.user.username}`,
        Date.now() + command.cooldown * 1000
      );
      setTimeout(() => {
        message.client.cooldowns.delete(
          `${command?.name}-${message.member?.user.username}`
        );
      }, command.cooldown * 1000);
    } else if (command.cooldown && !cooldown) {
      message.client.cooldowns.set(
        `${command.name}-${message.member.user.username}`,
        Date.now() + command.cooldown * 1000
      );
    }

    try {
      command.execute(message, args);
    } catch(e){
      console.log(e)
      return message.reply({ embeds: [
        new EmbedBuilder()
        .setColor(getThemeColor('mainColor'))
        .setTimestamp()
        .setDescription(`❌ | **Error Al Ejecutar El Comando`)
      ]});
    }
  },
};

export default event;
