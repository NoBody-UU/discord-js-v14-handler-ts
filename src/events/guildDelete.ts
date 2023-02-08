import { Guild, EmbedBuilder,WebhookClient } from "discord.js";
import { getThemeColor } from "../functions";
import GuildModel from "../schemas/Guild";
import { BotEvent } from "../types";

const event: BotEvent = {
  enable: true,
  name: "guildDelete",
  execute: (guild: Guild) => {
  const joinLeaveWebhookUrl = process.env.joinLeaveWebhook
    if(!joinLeaveWebhookUrl)return
  const joinLeaveWebhook = new WebhookClient({
      url: joinLeaveWebhookUrl
    })
  const embed = new EmbedBuilder()
    .setTitle("Guild Left")
    .setThumbnail(guild.iconURL())
    .setColor(getThemeColor('secColor'))
    .addFields(
      {
        name: "Guild Name",
        value: guild.name || "NA",
        inline: false,
      },
      {
        name: "ID",
        value: guild.id,
        inline: false,
      },
      {
        name: "OwnerId",
        value: `[\`${guild.ownerId}\`]`,
        inline: false,
      },
      {
        name: "Members",
        value: `\`\`\`yaml\n${guild.memberCount}\`\`\``,
        inline: false,
      }
    )
  joinLeaveWebhook.send({
    username: "Leave Server",
    embeds: [embed],
  });
}
}

export default event;