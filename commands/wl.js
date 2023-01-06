const { MessageEmbed } = require('discord.js');

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
  let c = info.Currency == 'b' && (info.Price == 1 && 'Brulee' || 'Brulees') || 'Cash'
  let mv = info.Currency == 'b' && `($${nFormatter(mp * info.Price)})` || ``
  let f = info.Flag && `[${flags[info.Flag.toLowerCase()] && flags[info.Flag.toLowerCase()] || `err`}]` || ``

  return `\n${n} - ${p} ${c} ${mv} ${f}`
}

let titles = {
  true: 'This trade is a win. You gain',
  false: 'This trade is a loss. You lose'
}

exports.run = async (commandName, client, message, args, db) => {
  valueList = await db.get('Values');
  flags = await db.get('Flags');
  mp = await db.get('Brulee');
  
  let o = args[0];
  let i = args[1];

  if(!(o || i)) {
    return message.reply(`You must provide both sides of the trade!`)
  }

  o = o.split(','); i = i.split(',')
  let ototal = 0; let itotal = 0
  let ostring = ''; let istring = ''

  o.forEach(input => {
    let bef = ostring
    for (const [name, info] of Object.entries(valueList)) {
      if(name.startsWith(input.toLowerCase())) {
        if(input == 'volt' && name == 'volt4x4') { continue }
          ostring += makeString(name, info)
          let bprice = info.Currency == 'b' && info.Price || info.Price / mp
          ototal += Number(bprice)
      }
    }

    if(bef == ostring) {
      ostring += `\nUnable to find ${input}`
    }
  })

  i.forEach(input => {
    let bef = istring
    for (const [name, info] of Object.entries(valueList)) {
      if(name.startsWith(input.toLowerCase())) {
        if(input == 'volt' && name == 'volt4x4' || input == 'volt' && name == 'volt_wing') { continue }
        istring += makeString(name, info)
        let bprice = info.Currency == 'b' && info.Price || info.Price / mp
        itotal += Number(bprice)
      }
    }

    if(bef == istring) {
      istring += `\nUnable to find ${input}`
    }
  })

  let win = itotal >= ototal
  let amnt = win && itotal - ototal || ototal - itotal

  ototal = ototal.toFixed(3).replace(/[.,]00$/, "")
  itotal = itotal.toFixed(3).replace(/[.,]00$/, "")
  
  let title = `${titles[win]} ${amnt.toFixed(3).replace(/[.,]00$/, "")} ${amnt == 1 && 'Brulee' || 'Brulees'} of value ($${nFormatter(amnt * mp)}).`

  let embed = new MessageEmbed()
    .setTitle(win && `Win (+${amnt.toFixed(3).replace(/[.,]00$/, "")} Brulees)` || `Loss (-${amnt.toFixed(3).replace(/[.,]00$/, "")} Brulees)`)
    .setFooter(process.env.Version, client.user.displayAvatarURL())
    .setTimestamp()
    .addFields(
      { name: `Outgoing`, value: ostring, inline: true },
      { name: `Total`, value: `${ototal} Brulees ($${nFormatter(mp * ototal)})`, inline: true },

      { name: `\u200b`, value: `\u200b` },

      { name: `Incoming`, value: istring, inline: true},
      { name: `Total`, value: `${itotal} Brulees ($${nFormatter(mp * itotal)})`, inline: true },

      { name: `\u200b`, value: `\u200b` },

      
      { name: `Result`, value: title }
    )

  message.channel.send({ embed: embed })
}