/*
commands/valuelist.js
Purpose: Command to check the entire value list
Written by Zolohyr
*/

const { MessageEmbed, Util: { splitMessage } } = require('discord.js');

exports.run = async (commandName, client, message, args, db, modules) => {
  let util = modules['util']
  let makeString = util.makeString
  
  valueList = await db.get('Values');
  flags = await db.get('Flags');
  mp = await db.get('Brulee');

  // variables

  let final = ''
  
  for (const [name, info] of Object.entries(valueList)) {
    final += makeString(util.parseString(name).display, info, flags)
  } // for every item, add to final with one-line string of info (ex: Brulee - 1 Brulee ($10M) [Fluctuating])

  let parts = splitMessage(final, {
    char: ']'
  }) // split message into 6000 character bytes so as not to exceed the limit. splits by ] (end of flag) so it doesn't cut off a value

  parts.forEach(section => {
    let embed = new MessageEmbed()
      .setTitle(`Value List\n\nThe full value list is not recommended. Use ${process.env.prefix}value [item] instead.`)
      .setFooter(process.env.Version, client.user.displayAvatarURL())
      .setTimestamp()
      .setDescription(section)
    message.channel.send({ embed: embed})
  }) // create and send an embed for each part
}