/*
commands/clearval.js
Purpose: Command to remove a value from value list
Written by Zolohyr
*/

exports.run = async (commandName, client, message, args, db) => {
  let valueList = await db.get('Values');

  let Name = args[0]

  if(message.author.id == 349929215573098507) {
    // checks if its me, edit this to be a role check in production

    if(!(Name)) {
      return message.reply('Required argument(s) missing')
    } // if arg is missing return

    if(valueList == undefined) {
      valueList = {}
    } // make valueList a dict if undefined
    
    valueList[Name] = undefined // remove value

    db.set('Values', valueList) // save in db

    message.delete() // delete original message
  } else {
    return message.reply(`You don't have permission to do that.`)
  }
}