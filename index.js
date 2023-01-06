const discord = require("discord.js")
const fetch = require("node-fetch")
const client = new discord.Client()
let commandlist = [];
const express = require("express");
const app = express();
const fs = require("fs");
let commandList = [];
let modules = [];

const Client = require("@replit/database");
const db = new Client();


const keepalive = require("./keepalive.js")

app.get('/', (request, response) => {
  response.sendStatus(200);
})

fs.readdir('./commands/', async (err, files) => {
    if(err){
        return console.log(chalk.red('An error occured when checking the commands folder for commands to load: ' + err));
    }
    files.forEach(async (file) => {
        if(!file.endsWith('.js')) return;
        let commandFile = require(`./commands/${file}`);
        commandlist.push({
            file: commandFile,
            name: file.split('.')[0]
        });
    });
});

fs.readdir('./modules/', async (err, files) => {
    if(err){
        return console.log(chalk.red('An error occured when checking the modules folder for modules to load: ' + err));
    }
    files.forEach(async (file) => {
        if(!file.endsWith('.js')) return;
        let mod = require(`./modules/${file}`);
        modules[file.split('.')[0]] = mod
    });
});

client.on("ready", async() => {
  console.log(`Bot started!\n---\n`
  + `> Bot Account: ${client.user.tag}\n`
  + `> Version: ${process.env.Version}`);
})

client.on('message', async (message) => {
    if(message.author.bot) return;
    if(!message.content.startsWith(process.env.prefix)) return;
  
    const args = message.content.slice(process.env.prefix.length).split(' ');
    const commandName = args[0].toLowerCase();
    args.shift();
    const command = commandlist.findIndex((cmd) => cmd.name === commandName);
    if(command == -1) return;
  
    
    commandlist[command].file.run(commandName, client, message, args, db, modules);
});

client.login(process.env.TOKEN)