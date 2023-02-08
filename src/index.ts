import { Client, GatewayIntentBits, Collection, PresenceUpdateStatus, Partials,} from "discord.js";
import CG from './config';
import { getType } from "./functions";
const { Guilds, MessageContent, GuildMessages, GuildMembers, GuildVoiceStates } = GatewayIntentBits
const client = new Client({
    presence:{ 
        activities: [
            {
                name: CG.PRESENCE.text,
                type: getType(CG.PRESENCE.type),
            }
        ],
        status: PresenceUpdateStatus.Online,
    },
    intents:[
        Guilds,
        MessageContent,
        GuildMessages,
        GuildMembers,
        GuildVoiceStates
    ],
    partials: [Partials.User, Partials.Message, Partials.Reaction],
    allowedMentions: { repliedUser: false}
})
import { Command, SlashCommand } from "./types";
import { config } from "dotenv";
import { readdirSync } from "fs";
import { join } from "path";
config()

client.slashCommands = new Collection<string, SlashCommand>()
client.commands = new Collection<string, Command>()
client.cooldowns = new Collection<string, number>()

const handlersDir = join(__dirname, "./handlers")
readdirSync(handlersDir).forEach(handler => {
    require(`${handlersDir}/${handler}`)(client)
})

client.login(process.env.TOKEN)
/*
╔═════════════════════════════════════════════════════╗
║    || - ||   Developed by NoBody#9666   || - ||     ║
║    ----------| discord.gg/FMbXwGPJGm |---------     ║
╚═════════════════════════════════════════════════════╝
*/