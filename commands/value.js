/*
commands/value.js
Purpose: Command to check the value of any item
Written by Zolohyr
*/

const { MessageEmbed } = require('discord.js');

exports.run = async (commandName, client, message, args, db, modules) => {
  const util = modules['util']
  let nFormatter = util.nFormatter
  
  valueList = await db.get('Values');
  flags = await db.get('Flags');
  mp = await db.get('Brulee');
  
  let name = args.join('') // join args in case user used spaces

  if(!(name)) {
    return message.reply(`You must a value to look up!`)
  }


  
  let parsed = await util.parseInput(valueList, name) // parse input, returns info and name if found
  
  if(parsed == undefined) {
    return message.reply(`Unable to find ${name}`)
  }

  let itemName = parsed.display
  let info = parsed.info

  let c = info.Currency == 'b' && (info.Price == 1 && 'Brulee' || 'Brulees') || 'Cash' // sets currency text
  let mv = info.Currency == 'b' && `($${nFormatter(mp * info.Price)})` || `` // if currency is brulee, add cash value in parentheses using Market Price
  let p = info.Currency == 'b' && info.Price || `$${nFormatter(info.Price)}` // Sets price

  let embed = new MessageEmbed()
    .setTitle(`${itemName} Value`)
    .setFooter(process.env.Version, client.user.displayAvatarURL())
    .setTimestamp()
    .addFields(
      { name: `Value`, value: `${itemName} is worth ${p} ${c} ${mv}`, inline: true },
    )
  
  if(info.Flag) {
    embed.addField(`Flag`, `This item is tagged with ${flags[info.Flag.toLowerCase()]}`)
  }

  // make embed and send to channel

  message.channel.send({ embed: embed })
}