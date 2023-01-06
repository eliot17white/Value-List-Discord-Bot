const { MessageEmbed } = require('discord.js');

/*function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function nFormatter(number){
  var letters = ["", "k", "M", "B", "T", "Qa", "Q"]
  
    var tier = Math.log10(Math.abs(number)) / 3 | 0;

    if(tier == 0) return number;

    var suffix = letters[tier];
    var scale = Math.pow(10, tier * 3);
    var scaled = number / scale;

    return scaled.toFixed(2).replace(/[.,]00$/, "") + suffix;
}

function makeString(name, info) {
  let n = capitalizeFirstLetter(name)
  let p = info.Currency == 'b' && info.Price || `$${nFormatter(info.Price)}`
  let c = info.Currency == 'b' && (info.Price == 1 && 'Brulee' || 'Brulees') || 'Cash'
  let mv = info.Currency == 'b' && `($${nFormatter(mp * info.Price)})` || ``
  let f = info.Flag && `[${flags[info.Flag] && flags[info.Flag] || `err`}]` || ``

  return `\n${n} - ${p} ${c} ${mv} ${f}`
}*/



exports.run = async (commandName, client, message, args, db, modules) => {
  const util = modules['util']
  let nFormatter = util.nFormatter
  let capitalizeFirstLetter = util.capitalizeFirstLetter
  
  valueList = await db.get('Values');
  flags = await db.get('Flags');
  mp = await db.get('Brulee');
  
  let name = args.join('')

  if(!(name)) {
    return message.reply(`You must a value to look up!`)
  }


  
  let info = await util.parseInput(valueList, name)
  
  if(info == undefined) {
    return message.reply(`Unable to find ${name}`)
  }

  let itemName = info.display
  info = info.info

  let c = info.Currency == 'b' && (info.Price == 1 && 'Brulee' || 'Brulees') || 'Cash'
  let mv = info.Currency == 'b' && `($${nFormatter(mp * info.Price)})` || ``
  let p = info.Currency == 'b' && info.Price || `$${nFormatter(info.Price)}`

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

  message.channel.send({ embed: embed })
}