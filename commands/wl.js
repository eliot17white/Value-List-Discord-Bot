/*
commands/wl.js
Purpose: Command to check any trade for w/l
Written by Zolohyr
*/

const { MessageEmbed } = require('discord.js');

let titles = {
  true: 'This trade is a win. You gain',
  false: 'This trade is a loss. You lose'
}

exports.run = async (commandName, client, message, args, db, modules) => {
  let util = modules['util']
  let nFormatter = util.nFormatter
  let makeString = util.makeString
  let parseInput = util.parseInput

  // define module and needed functions
  
  valueList = await db.get('Values');
  flags = await db.get('Flags');
  mp = await db.get('Brulee');

  // get db values
  
  let o = args[0];
  let i = args[1];

  // comma-separated lists for each direction: outgoing and incoming

  if(!(o || i)) {
    return message.reply(`You must provide both sides of the trade!`)
  }

  o = o.split(','); i = i.split(',')
  let ototal = 0; let itotal = 0
  let ostring = ''; let istring = ''

  // create totals and strings for each incoming and outgoing
  
  o.forEach( input => {
    let received =  parseInput(valueList, input) // get item
    if(received) {
      ostring += makeString(received.display, received.info, flags)
      let bprice = received.info.Currency == 'b' && received.info.Price || received.info.Price / mp
      ototal += Number(bprice)
      // add to final string, get price in BRULEES and add to total
    } else {
      ostring += `\nUnable to find ${input}` // if invalid, add to string with warning
    }
  })

  i.forEach( input => {
    let received = parseInput(valueList, input) // get item
    if(received != undefined) {
      istring += makeString(received.display, received.info, flags)
      let bprice = received.info.Currency == 'b' && received.info.Price || received.info.Price / mp
      itotal += Number(bprice)
      // add to final string, get price in BRULEES and add to total
    } else {
      istring += `\nUnable to find ${input}` // if invalid, add to string with warning
    }
  })
  

  let win = itotal >= ototal // true if win or even, false if loss
  let amnt = win && itotal - ototal || ototal - itotal // get value of difference

  ototal = ototal.toFixed(3).replace(/[.,]00$/, "")
  itotal = itotal.toFixed(3).replace(/[.,]00$/, "")
  amnt = amnt.toFixed(3).replace(/[.,]00$/, "")

  // round to 3 decimal places bc of javascript math limitations making numbers like 3.0000000000000000004
  
  let result = `${titles[win]} ${amnt} ${amnt == 1 && 'Brulee' || 'Brulees'} of value ($${nFormatter(amnt * mp)}).` // get result [ex: This trade is a win. You gain 1.000 Brulee of value ($10M).]

  let embed = new MessageEmbed()
    .setTitle(win && `Win (+${amnt} Brulees)` || `Loss (-${amnt} Brulees)`) // set title [ex: Win (+1.000 Brulees)]
    .setFooter(process.env.Version, client.user.displayAvatarURL())
    .setTimestamp()
    .addFields(
      { name: `Outgoing`, value: ostring, inline: true },
      { name: `Total`, value: `${ototal} Brulees ($${nFormatter(mp * ototal)})`, inline: true },

      { name: `\u200b`, value: `\u200b` },

      { name: `Incoming`, value: istring, inline: true},
      { name: `Total`, value: `${itotal} Brulees ($${nFormatter(mp * itotal)})`, inline: true },

      { name: `\u200b`, value: `\u200b` },

      
      { name: `Result`, value: result }
    )

  message.channel.send({ embed: embed })

  // format embed and send
}