import {
  SlashCommandBuilder,
  ChannelType,
  TextChannel,
  EmbedBuilder,
} from "discord.js";
import { getThemeColor } from "../functions";
import { SlashCommand } from "../types";

const command: SlashCommand = {
  enable: true,
  command: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Shows the bot's ping"),
  execute: (interaction) => {
    const ping = interaction.client.ws.ping;
    let state;
    if(ping > 500) state = "🔴";
    else if(ping > 200) state = "🟡";
    else state = "🟢";
    
    interaction.reply({ embeds: [
      new EmbedBuilder()
      .setColor(getThemeColor('mainColor'))
      .setTimestamp()
      .addFields(
        { name: "🏓 | Pong!", value: `\`\`\`yml\n${state} | ${ping}ms\`\`\``},
      )
    ]});
  },
  cooldown: 10,
  botPermissions: ['SendMessages', 'EmbedLinks'],
};

export default command;
