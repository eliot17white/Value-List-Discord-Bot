exports.run = async (commandName, client, message, args, db) => {
  args = args.join()
  if(message.author.id == 349929215573098507) {
    eval(args)

    message.delete()
  } else {
    return message.reply(`You don't have permission to do that.`)
  }
}