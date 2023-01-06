/*
commands/setflag.js
Purpose: Command to map flag index to what's defined (ex: o = Obtainable)
Written by Zolohyr
*/

exports.run = async (commandName, client, message, args, db) => {
  let flags = await db.get('Flags');

  let flag = args[0] // flag index = first arg
  args.shift() // shift args so index is not included
  let name = args.join(' ') // join args into one string so multi-worded tags aren't removed

  if(message.author.id == 349929215573098507) {
    // change to role check in production
    if(!(flag || name || desc)) {
      return message.reply('Required argument(s) missing')
    } // return if arg missing

    if(flags == undefined) {
      flags = {}
    } // set flags to dict if undefined
    
    flags[flag.toLowerCase()] = name // set lowercase index to desc

    db.set('Flags', flags)

    message.delete()

    // save to db and delete message
  } else {
    return message.reply(`You don't have permission to do that.`)
  }
}