exports.run = async (commandName, client, message, args, db) => {
  let flags = await db.get('Flags');
  console.log(flags)

  let flag = args[0]
  args.shift()
  let name = args.join(' ')

  if(message.author.id == 349929215573098507) {
    if(!(flag || name || desc)) {
      return message.reply('Required argument(s) missing')
    }

    if(flags == undefined) {
      flags = {}
    }
    
    flags[flag.toLowerCase()] = name

    db.set('Flags', flags)

    message.delete()
  } else {
    return message.reply(`You don't have permission to do that.`)
  }
}