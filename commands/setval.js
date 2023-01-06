/*
commands/setval.js
Purpose: Command to set the value or an item
Written by Zolohyr
*/

exports.run = async (commandName, client, message, args, db) => {
  let valueList = await db.get('Values');
  let mp = await db.get('Brulee')
  // get values and market price

  let Name = args[0] // required, name of item
  let Price = args[1] // required, price
  let Currency = args[2] // required, currency. either 'b' or 'c'
  let Flag = args[3] // optional flag index

  if(message.author.id == 349929215573098507 || message.author.id == 906894880310194236) {
    // change to role check in production

    if(Name == 'mp') { // setting market price
      db.set('Brulee', Price)
      
      let overtime = await db.get('brulee')
      if(!overtime) { overtime = {} }
      overtime[Math.floor(Date.now()/1000)] = Price
        
      db.set('brulee', overtime)

      message.delete()

      // set value over time with timestamp and delete message

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

    // make sure all args are valid
    
    valueList[Name.toLowerCase()] = {
      'Price': Price,
      'Currency': Currency,
      'Flag': Flag
    } // set value

    db.set('Values', valueList)

    // set in db

    let overtime = await db.get(Name.toLowerCase())
    if(!overtime) { overtime = {} }
    overtime[Math.floor(Date.now()/1000)] = Currency == 'b' && Price * mp || Price // set timestamp in dict to price in CASH as brulees can change over time

    db.set(Name.toLowerCase(), overtime)
    // save
    

    message.delete()
  } else {
    return message.reply(`You don't have permission to do that.`)
  }
}