exports.run = async (commandName, client, message, args, db) => {
  let valueList = await db.get('Values');

  let Name = args[0]

  if(message.author.id == 349929215573098507) {

    if(!(Name)) {
      return message.reply('Required argument(s) missing')
    }

    if(valueList == undefined) {
      valueList = {}
    }
    
    valueList[Name] = undefined

    db.set('Values', valueList)

    message.delete()
  } else {
    return message.reply(`You don't have permission to do that.`)
  }
}