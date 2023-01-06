const { MessageEmbed, Util: { splitMessage } } = require('discord.js');

function capitalizeFirstLetter(string) {
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
  let c = info.Currency == 'b' && (info.Price == 1 && 'B' || 'B') || 'Cash'
  let mv = info.Currency == 'b' && `($${nFormatter(mp * info.Price)})` || ``
  let f = info.Flag && `[${flags[info.Flag] && flags[info.Flag] || `err`}]` || ``

  return `\n${n} - ${p} ${c} ${mv} ${f}`
}

exports.run = async (commandName, client, message, args, db) => {
  valueList = await db.get('Values');
  flags = await db.get('Flags');
  mp = await db.get('Brulee');

  let final = ''

  for (const [name, info] of Object.entries(valueList)) {
    final += makeString(name, info)
  }

  let embedd = new MessageEmbed()
      .setTitle(`Value List\n\nThe full value list is not recommended. Use ${process.env.prefix}value [item] instead.`)
      .setFooter(process.env.Version, client.user.displayAvatarURL())
      .setTimestamp()
      .setDescription(final)

  let parts = splitMessage(final, {
    char: ']'
  })

  parts.forEach(section => {
    let embed = new MessageEmbed()
      .setTitle(`Value List\n\nThe full value list is not recommended. Use ${process.env.prefix}value [item] instead.`)
      .setFooter(process.env.Version, client.user.displayAvatarURL())
      .setTimestamp()
      .setDescription(section)
    message.channel.send({ embed: embed})
  })


   // message.channel.send({ embed: embed })
}