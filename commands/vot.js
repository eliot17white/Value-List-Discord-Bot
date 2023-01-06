const { MessageEmbed } = require('discord.js');
const chart = require('chart.js')
const chartimg = require('chart.js-image')

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function nFormatter(number){
  var letters = ["", "k", "M", "B", "T", "Qa", "Q"]
  
    var tier = Math.log10(Math.abs(number)) / 3 | 0;

    if(tier == 0) return number;

    var suffix = letters[tier];
    var scale = Math.pow(10, tier * 3);
    var scaled = number / scale;

    return scaled.toFixed(2).replace(/[.,]00$/, "") + suffix;
}

function makeString(name, info) {
  let n = capitalizeFirstLetter(name)
  let p = info.Currency == 'b' && info.Price || `$${nFormatter(info.Price)}`
  let c = info.Currency == 'b' && (info.Price == 1 && 'Brulee' || 'Brulees') || 'Cash'
  let mv = info.Currency == 'b' && `($${nFormatter(mp * info.Price)})` || ``
  let f = info.Flag && `[${flags[info.Flag] && flags[info.Flag] || `err`}]` || ``

  return `\n${n} - ${p} ${c} ${mv} ${f}`
}

exports.run = async (commandName, client, message, args, db) => {
  valueList = await db.get('Values');
  flags = await db.get('Flags');
  mp = await db.get('Brulee');
  
  let name = args[0]

  if(!(name)) {
    return message.reply(`You must a value to look up!`)
  }

  let itemName
  let info
  
  for (const [n, inf] of Object.entries(valueList)) {
    if(n.startsWith(name.toLowerCase())) {
      if(name == 'volt' && n == 'volt4x4') { continue }
      itemName = n
      info = inf
    }
   }
  
  if(info == undefined) {
    return message.reply(`Unable to find ${name}`)
  }

  let overtime = await db.get(itemName)
  let labels = []
  let dataset = []

  if(!overtime || Object.keys(overtime).length < 2) {
    return message.reply(`This item's price has never changed, unable to graph`)
  }

  for (const [unix, price] of Object.entries(overtime)) {
    var date = new Date(unix * 1000);
    var label = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    labels.push(label)
    dataset.push(price)
  }

  const data = {
    labels: labels,
    datasets: [{
      label: `${capitalizeFirstLetter(itemName)} Price ($)`,
      data: dataset,
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  }

  const config = chartimg().chart({
    "type": "line",
    "data": data
  })
    .backgroundColor('white')
    .width(500)
    .height(300)

  let file = config.toURL();


  message.channel.send({
    content: `Here is the graph for ${capitalizeFirstLetter(itemName)} price over time:`,
    files: [{
      attachment: file,
      name: 'file.png'
    }]
  })
}