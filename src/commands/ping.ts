import { EmbedBuilder } from "discord.js";
import { getThemeColor } from "../functions";
import { Command } from "../types";

const command: Command = {
  enable: true,
  name: "ping",
  execute: async(message, args) => {
    const ping = message.client.ws.ping;
    let state;
    if(ping > 500) state = "🔴";
    else if(ping > 200) state = "🟡";
    else state = "🟢";
    
    message.reply({ embeds: [
      new EmbedBuilder()
      .setColor(getThemeColor('mainColor'))
      // .setTitle("🏓 | Pong!")
      .setTimestamp()
      .addFields(
        { name: "🏓 | Pong!", value: `\`\`\`yml\n${state} | ${ping}ms\`\`\``},
      )
    ]});
  },
  permissions: ["ViewChannel",'SendMessages'],
  botPermissions: ['EmbedLinks'],
  aliases: [],
};

export default command;
