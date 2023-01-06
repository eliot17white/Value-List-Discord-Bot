/*
index.js
Purpose: Wake up the bot and define modules, setup command listeners
Written by Zolohyr
*/

const discord = require("discord.js")
const client = new discord.Client()
const express = require("express");
const app = express();
const fs = require("fs");
const DBClient = require("@replit/database");
const db = new DBClient();

let commandlist = [];
let modules = [];

const keepalive = require("./keepalive.js") // starts http

app.get('/', (request, response) => {
  response.sendStatus(200);
}) // get requests return 200 (OK)

fs.readdir('./commands/', async (err, files) => {
    if(err){
        return console.log('An error occured when checking the commands folder for commands to load: ' + err);
    }
  
    files.forEach(async (file) => {
        if(!file.endsWith('.js')) return;
      // iterate over command files and store in an areay
        let commandFile = require(`./commands/${file}`);
        commandlist.push({
            file: commandFile,
            name: file.split('.')[0]
        });
    });
});

fs.readdir('./modules/', async (err, files) => {
    if(err){
        return console.log('An error occured when checking the modules folder for modules to load: ' + err);
    }
    files.forEach(async (file) => {
        if(!file.endsWith('.js')) return;
      // iterate over modules and store in an array
        let mod = require(`./modules/${file}`);
        modules[file.split('.')[0]] = mod
    });
});

client.on("ready", async() => {
  console.log(`Bot started!\n---\n`
  + `> Bot Account: ${client.user.tag}\n`
  + `> Version: ${process.env.Version}`);
  // console.log when bot turns on
})

client.on('message', async (message) => {
  // command processor
    if(message.author.bot) return;
    if(!message.content.startsWith(process.env.prefix)) return;

  // check if message starts with prefix and author isnt a bot
  
    const args = message.content.slice(process.env.prefix.length).split(' '); // split args
    const commandName = args[0].toLowerCase(); // get command name
    args.shift(); // remove command name from args list
    const command = commandlist.findIndex((cmd) => cmd.name === commandName); // find command
    if(command == -1) return; // if not found, return

  // find command file
  
    
    commandlist[command].file.run(commandName, client, message, args, db, modules);
  // run command & pass arguments
});

client.login(process.env.TOKEN)
// login