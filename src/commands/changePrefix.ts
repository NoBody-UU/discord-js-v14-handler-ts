import { EmbedBuilder } from "discord.js";
import { getThemeColor, setGuildOption } from "../functions";
import { Command } from "../types";

const command: Command = {
  enable: true,
  name: "changePrefix",
  execute: (message, args) => {
    let prefix = args[1];
    if (!prefix) return message.channel.send("No prefix provided");
    if (!message.guild) return;
    setGuildOption(message.guild, "prefix", prefix);
    message.channel.send({
      embeds: [
        new EmbedBuilder()
        .setColor(getThemeColor('mainColor'))
        .setTitle('Prefix Successfully Changed!')
        .setDescription(`**New Prefix: **\`${prefix}\``)
      ]
    });
  },
  permissions: ["Administrator"],
  botPermissions: ['EmbedLinks'],
  aliases: [],
};

export default command;
