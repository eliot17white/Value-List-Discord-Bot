exports.run = async (commandName, client, message, args, db) => {
  let valueList = await db.get('Values');
  let mv = await db.get('Brulee')

  let Name = args[0]
  let Price = args[1]
  let Currency = args[2]
  let Flag = args[3]

  if(message.author.id == 349929215573098507 || message.author.id == 906894880310194236) {

    if(Name == 'mv') {
      db.set('Brulee', Price)
      
      let overtime = await db.get('mp')
      if(!overtime) { overtime = {} }
      overtime[Math.floor(Date.now()/1000)] = Price
        
      db.set('mp', overtime)

      return
    }

    if(!(Name || Price || Currency)) {
      return message.reply('Required argument(s) missing')
    }

    if(!(Currency == 'b' || Currency == 'c')) {
      return message.reply('Invalid currency type.')
    }

    if(valueList == undefined) {
      valueList = {}
    }
    
    valueList[Name.toLowerCase()] = {
      'Price': Price,
      'Currency': Currency,
      'Flag': Flag
    }

    db.set('Values', valueList)

    let overtime = await db.get(Name.toLowerCase())
    if(!overtime) { overtime = {} }
    overtime[Math.floor(Date.now()/1000)] = Currency == 'b' && Price * mv || Price
      
    db.set(Name.toLowerCase(), overtime)

    //message.channel.send('Done.')
    message.delete()
  } else {
    return message.reply(`You don't have permission to do that.`)
  }
}