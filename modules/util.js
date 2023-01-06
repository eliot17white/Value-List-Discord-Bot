const { MessageEmbed } = require('discord.js');

function capitalizeFirstLetter(string) {
  let reconstructed = ''
  let words = string.split(' ')
  words.forEach(word => {
    reconstructed += word.charAt(0).toUpperCase() + word.slice(1) + ' '
  })
  return reconstructed.slice(0, -1)
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

function makeString(name, info, flags) {
  let n = capitalizeFirstLetter(name)
  let p = info.Currency == 'b' && info.Price || `$${nFormatter(info.Price)}`
  let c = info.Currency == 'b' && (info.Price == 1 && 'Brulee' || 'Brulees') || 'Cash'
  let mv = info.Currency == 'b' && `($${nFormatter(mp * info.Price)})` || ``
  let f = info.Flag && `[${flags[info.Flag] && flags[info.Flag] || `err`}]` || ``

  return `\n${n} - ${p} ${c} ${mv} ${f}`
}

function parseString(string) {
  return {
    compute: string.replace(/_/g, "").toLowerCase(),
    display: capitalizeFirstLetter(string.replace(/_/g, ' '))
  }
}

function parseInput(valueList, input) {
  let send = {}
  for (const [name, info] of Object.entries(valueList)) {
    let parsedInput = parseString(input).compute
    let parsedName = parseString(name)

    if(parsedName.compute == parsedInput) {
     send = {
       name: parsedName.compute,
       display: parsedName.display,
       info: info
     }

      return send
    }
    
  }

  for (const [name, info] of Object.entries(valueList)) {
    let parsedInput = parseString(input).compute
    let parsedName = parseString(name)

    if(parsedName.compute.startsWith(parsedInput)) {
     send = {
       name: parsedName.compute,
       display: parsedName.display,
       info: info
     }

      return send
    }
    
  }

  return
}

module.exports = {
  capitalizeFirstLetter: capitalizeFirstLetter,
  nFormatter: nFormatter,
  parseInput: parseInput,
  makeString: makeString
}