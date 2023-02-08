import chalk from "chalk"
import {
    Guild, 
    GuildMember, 
    PermissionFlagsBits, 
    PermissionResolvable,
    TextChannel, 
 } from "discord.js"
import GuildDB from "./schemas/Guild"
import { GuildOption } from "./types"
import mongoose from "mongoose";
import config from "./config";
import { ActivityType } from 'discord.js';

type colorType = "mainColor" | "secColor" | "errorColor"
const themeColors = {
    mainColor: config.mainColor,   
    secColor: config.secColor,
    errorColor: config.errorColor
};

export const getThemeColor = (color: colorType) => Number(`0x${themeColors[color].substring(1)}`)

export const color = (color: colorType, message: any) => {
    return chalk.hex(themeColors[color])(message)
}

export const checkPermissions = (member: GuildMember, permissions: PermissionResolvable[]) => {
    let neededPermissions: PermissionResolvable[] = []
    permissions.forEach(permission => {
        if (!member.permissions.has(permission)) neededPermissions.push(permission)
    })
    if (neededPermissions.length === 0) return null
    return neededPermissions.map(p => {
        if (typeof p === "string") return `\`${p.split(/(?=[A-Z])/).join(" ")}\``
        else return Object.keys(PermissionFlagsBits).find(k => Object(PermissionFlagsBits)[k] === p)?.split(/(?=[A-Z])/).join(" ")
    })
}

export const checkBotPermissions = (message: any , permissions: PermissionResolvable[]) => {
    if(!message.channel?.permissionsFor(message.guild?.members.me).has('SendMessages')) return;
    let neededPermissions: PermissionResolvable[] = []
    permissions.forEach(permission => {
        if (!message.guild?.members.me?.permissions.has(permissions)) neededPermissions.push(permission)
    })
    if (neededPermissions.length === 0) return null;
    return neededPermissions.map(p => {
        if (typeof p === "string") return `\`${p.split(/(?=[A-Z])/).join(" ")}\``
        else return Object.keys(PermissionFlagsBits).find(k => Object(PermissionFlagsBits)[k] === p)?.split(/(?=[A-Z])/).join(" ")
    })
    
}

export const sendTimedMessage = (message: string, channel: TextChannel, duration: number) => {
    channel.send(message)
        .then(m => setTimeout(async () => (await channel.messages.fetch(m)).delete(), duration))
    return
}

export const getGuildOption = async (guild: Guild, option: GuildOption) => {
    if (mongoose.connection.readyState === 0) throw new Error("[❌] Database not connected.")
    let foundGuild = await GuildDB.findOne({ guildID: guild.id })
    if (!foundGuild) return null;
    return foundGuild.options[option]
}

export const setGuildOption = async (guild: Guild, option: GuildOption, value: any) => {
    if (mongoose.connection.readyState === 0) throw new Error("[❌] Database not connected.")
    let foundGuild = await GuildDB.findOne({ guildID: guild.id })
    if (!foundGuild) return null;
    foundGuild.options[option] = value
    foundGuild.save()
}

export const getType = (type: ActivityType | String) => {
    switch (type) {
      case "COMPETING":
        return ActivityType.Competing;

      case "LISTENING":
        return ActivityType.Listening;

      case "PLAYING":
        return ActivityType.Playing;

      case "WATCHING":
        return ActivityType.Watching;

      case "STREAMING":
        return ActivityType.Streaming;
    }
  };