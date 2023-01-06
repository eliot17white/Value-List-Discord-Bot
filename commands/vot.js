/*
commands/vot.js
Purpose: Command to graph the value over time of any item
Written by Zolohyr
*/

const chartimg = require('chart.js-image')

exports.run = async (commandName, client, message, args, db, modules) => {
  let util = modules['util']
  let capitalizeFirstLetter = util.capitalizeFirstLetter
  let parseInput = util.parseInput
  
  valueList = await db.get('Values');
  flags = await db.get('Flags');
  mp = await db.get('Brulee');
  
  let name = args.join('')
  
  if(!(name)) {
    return message.reply(`You must a value to look up!`)
  }

  // define needed functions, db values, checks required args
  
  let parsed = await parseInput(valueList, name)
  
  if(parsed == undefined) {
    return message.reply(`Unable to find ${name}`)
  } // if item is not found, return
  

  let itemName = parsed.name
  let display = parsed.display

  let overtime = await db.get(itemName) // get vot db slot
  let labels = []
  let dataset = []

  if(!overtime || Object.keys(overtime).length < 2) {
    return message.reply(`This item's price has never changed, unable to graph`) // if 0 or 1 points of data, can't graph. return
  }

  for (const [unix, price] of Object.entries(overtime)) {
    var date = new Date(unix * 1000);
    var label = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    // create date in YYYY-MM-DD format for international use
    labels.push(label)
    dataset.push(price)
    // push label and price into respective arrays
  }

  const data = {
    labels: labels,
    datasets: [{
      label: `${capitalizeFirstLetter(display)} Price ($)`,
      data: dataset,
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }] // data object for chart
  }

  const config = chartimg().chart({
    "type": "line",
    "data": data
  })
    .backgroundColor('white')
    .width(500)
    .height(300)

  // create chart itself, get url

  let file = config.toURL();


  message.channel.send({
    content: `Here is the graph for ${capitalizeFirstLetter(display)} price over time:`,
    files: [{
      attachment: file,
      name: 'file.png'
    }]
  }) // send to channel
}